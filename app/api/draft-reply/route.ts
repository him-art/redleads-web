import { NextResponse } from 'next/server';
import { ai } from '@/lib/ai';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, subreddit, content, productContext } = body;

        // 1. Auth Check (Protect the API)
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 3. Get User Progress (To adjust AI Safe Levels)
        const { count: contactedCount } = await supabase
            .from('monitored_leads')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'contacted');

        const level = (contactedCount || 0) < 15 ? 1 : (contactedCount || 0) < 50 ? 2 : 3;

        // 4. Construct Expert Prompt
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

        // 5. Call AI
        const aiResponse = await ai.call({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.7
        });

        const result = JSON.parse(aiResponse.choices[0]?.message?.content || '{}');

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('[Draft Reply API]', error);
        return NextResponse.json({ error: 'Failed to generate drafts' }, { status: 500 });
    }
}
