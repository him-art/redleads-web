import { NextResponse } from 'next/server';
import { onboardingAi } from '@/lib/ai';
import { createClient } from '@/lib/supabase/server';
import { guideRatelimit } from '@/lib/ratelimit';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { website_url, description, keywords } = body;

        // 1. Auth Check (Protect the API)
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1.5 Rate Limiting
        const { success } = await guideRatelimit.limit(user.id);
        if (!success) {
            return NextResponse.json(
                { error: 'You have reached your daily limit for generating custom strategies. Please try again tomorrow.' }, 
                { status: 429 }
            );
        }

        // 2. Validate inputs
        if (!website_url && !description) {
            return NextResponse.json({ error: 'No profile context provided' }, { status: 400 });
        }

        // 3. Construct Expert Prompt
        const prompt = `
            You are "RedLeads OS", an expert growth consultant built into the RedLeads dashboard. You are creating a hyper-personalized, gamified 14-day roadmap to help this specific SaaS founder get their first 100 users.
            
            USER CONTEXT:
            - Website: ${website_url || 'N/A'}
            - Description: ${description || 'N/A'}
            - Keywords they track: ${keywords ? keywords.join(', ') : 'N/A'}

            STRICT RULES:
            1. DO NOT tell the user to "log in" or "sign up". They are reading this inside the RedLeads dashboard.
            2. DO NOT mention any "content ideation tool" or tools that don't exist. RedLeads has ONLY three core features: The Command Center (live keyword feed), Power Search (deep semantic historical search), and AI Drafter (writing replies).
            3. BE SPECIFIC. In your content, you MUST recommend 3-5 exact subreddits (e.g., r/SaaS, r/Entrepreneur, etc.) that perfectly match their product description. DO NOT tell them to "go find subreddits", name the subreddits for them.
            4. Suggest exact search queries they should type into Power Search based on their product.
            
            PHASE RULES:
            - Days 1-4 (Phase 1): "Calibration & Authority" (Focus on configuring Keywords in settings, and manually building *Karma* safely by answering questions in their recommended subreddits without linking to their product).
            - Days 5-10 (Phase 2): "The 10-Minute Engine" (Instruct them to establish a *strict 10-minute daily routine* using the Command Center. Teach them how to *Soft Pitch* using the AI Drafter button on leads).
            - Days 11-14 (Phase 3): "Deep Hunting" (Focus on using *Power Search* on weekends to run deep semantic queries across the last 30 days to find high-intent leads that didn't trigger exact keywords).

            OUTPUT FORMAT:
            Return ONLY a valid JSON object with an array called "nodes". It must contain exactly 14 objects (one for each day). Ensure descriptions are short punchy hooks. Content should be formatted in Markdown.
            {
                "nodes": [
                    {
                        "id": "day-1",
                        "phase": 1,
                        "day_number": 1,
                        "title": "Actionable Title",
                        "description": "Very short hook.",
                        "content": "Full markdown string with '# Heading', '## Steps', and your personalized recommendations.",
                        "action_label": "Go to Settings",
                        "action_link": "?tab=settings",
                        "estimated_minutes": 15
                    },
                    ... (up to day 14)
                ]
            }
        `;

        // 4. Call AI
        const aiResponse = await onboardingAi.call({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.7
        });

        const result = JSON.parse(aiResponse.choices[0]?.message?.content || '{}');

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('[Generate Guide Error]:', error);
        return NextResponse.json(
            { error: 'Failed to generate guide.' }, 
            { status: 500 }
        );
    }
}
