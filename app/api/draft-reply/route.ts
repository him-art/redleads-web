import { NextResponse } from 'next/server';
import { repliesAi } from '@/lib/ai';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            title, 
            subreddit, 
            content, 
            productContext,
            tone = 'Casual & Friendly',
            mentionStrategy = 'Subtle Side-note',
            customRules = ''
        } = body;

        // 1. Auth Check (Protect the API)
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch Profile for Subscription Tier and Generation Count
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier, reply_generation_count, last_reply_at, created_at, trial_ends_at')
            .eq('id', user.id)
            .single();

        const tier = profile?.subscription_tier; // 'growth', 'starter', 'lifetime', or null/trial
        let genCount = profile?.reply_generation_count || 0;
        const lastReplyAt = profile?.last_reply_at;

        // --- Trial Expiration Check (Free Only) ---
        const isPaid = tier === 'starter' || tier === 'growth' || tier === 'lifetime';
        if (!isPaid) {
            const trialEndsAt = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
            
            if (!trialEndsAt || trialEndsAt < new Date()) {
                return NextResponse.json({ 
                    error: 'Trial expired or not started', 
                    message: 'Your 7-day free trial has ended or not yet started. Please complete setup or upgrade to a paid plan.',
                    code: 'PAYWALL_REQUIRED'
                }, { status: 403 });
            }
        }

        // --- Reset Logic (Monthly for Scout & Pro) ---
        if (isPaid && lastReplyAt) {
            const lastDate = new Date(lastReplyAt);
            const now = new Date();
            // Reset if different month or different year
            if (lastDate.getMonth() !== now.getMonth() || lastDate.getFullYear() !== now.getFullYear()) {
                genCount = 0;
            }
        }

        // 3. Define Limits (Generations: 1 post = 1 generation = 3 variants)
        // Trial: 5 generations (Lifetime of trial)
        // Starter: 100 generations (Monthly)
        // Growth: 500 generations (Monthly)
        // Lifetime: Unlimited (effectively 9999)
        const limits: Record<string, number> = {
            'trial': 5,
            'starter': 100,
            'growth': 500,
            'lifetime': 500
        };

        const currentTierKey = tier || 'trial';
        const limit = limits[currentTierKey] || limits.trial;

        if (genCount >= limit) {
            return NextResponse.json({ 
                error: 'Limit reached', 
                message: `You have reached your monthly limit of ${limit} generated replies for the ${currentTierKey === 'trial' ? 'Trial' : currentTierKey.charAt(0).toUpperCase() + currentTierKey.slice(1)} plan.` 
            }, { status: 403 });
        }

        // 4. Get User Progress (To adjust AI Safe Levels)
        const { count: contactedCount } = await supabase
            .from('monitored_leads')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'contacted');

        const level = (contactedCount || 0) < 15 ? 1 : (contactedCount || 0) < 50 ? 2 : 3;

        // 5. Construct Expert Prompt
        const prompt = `
            You are an expert Reddit growth marketer and copywriter.
            Your goal is to write authentic, helpful, and non-spammy replies to Reddit posts that subtly introduce a product.

            USER PROGRESS: Level ${level} Expert (${contactedCount || 0} outreach attempts completed).
            ${level === 1 ? "SAFETY RULE: Focus on pure value, advice, and trust-building. NO aggressive links." : ""}
            ${level === 2 ? "SAFETY RULE: Can introduce the product as a specific solution, but keep it humble." : ""}
            ${level === 3 ? "SAFETY RULE: Expert level. Direct mentions and 'Show and Tell' allowed in high-context threads." : ""}

            CONTEXT:
            - Subreddit: r/${subreddit}
            - Post Title: "${title}"
            - Post Snippet: "${content || 'N/A'}"
            - My Product Context: "${productContext}"

            INSTRUCTIONS:
            Generate 3 variations using these PROVEN playbooks:
            1. "The Feedback Loop" (High Trust): Ask for beta testers or feedback. RELATE to the OP's pain first.
            2. "The Sidekick" (Helpful peer): "I had this problem too, so I built this [Product] to solve it." 
            3. "The Anti-Tool" (Lite solution): "Instead of using [Clunky Competitor], I just use [Product] for this."

            RULES:
            - TONE: ${tone}
            - PRODUCT PITCH LEVEL: ${mentionStrategy}
            ${customRules ? `- CUSTOM INSTRUCTIONS: ${customRules}` : ''}
            - NO generic AI fluff ("Great post!", "I agree").
            - NO aggressive sales pitches.
            - Keep it conversational (lowercase start often works better).
            - Be concise. Reddit users hate bots.

            OUTPUT FORMAT:
            Return ONLY a JSON object with this structure:
            {
                "variations": [
                    { "type": "Feedback Loop", "text": "..." },
                    { "type": "The Sidekick", "text": "..." },
                    { "type": "The Anti-Tool", "text": "..." }
                ]
            }
        `;

        // 6. Call AI (Using strategic singleton)
        const aiResponse = await repliesAi.call({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.7
        });

        const result = JSON.parse(aiResponse.choices[0]?.message?.content || '{}');

        // Atomic increment using RPC
        const { error: updateError } = await supabase.rpc('increment_reply_count', { 
            user_id_hex: user.id 
        });

        if (updateError) {
            console.error('[Draft Reply] Failed to increment reply count:', updateError);
        }

        return NextResponse.json({
            ...result,
            remaining: limit - (genCount + 1),
            total_limit: limit
        });

    } catch (error: any) {
        console.error('[Draft Reply Error]:', error);
        return NextResponse.json(
            { error: 'Failed to generate reply. Please try again later.' }, 
            { status: 500 }
        );
    }
}
