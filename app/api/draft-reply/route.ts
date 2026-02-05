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

        // 2. Validate Input
        if (!title || !productContext) {
            return NextResponse.json({ error: 'Missing context' }, { status: 400 });
        }

        // 3. Construct Prompt
        const prompt = `
            You are an expert Reddit growth marketer and copywriter.
            Your goal is to write authentic, helpful, and non-spammy replies to Reddit posts that subtly introduce a product.

            CONTEXT:
            - Subreddit: r/${subreddit}
            - Post Title: "${title}"
            - Post Snippet: "${content || 'N/A'}"
            - My Product: "${productContext}"

            INSTRUCTIONS:
            Generate 3 distinct reply variations:
            1. "The Helpful Expert": Pure value, advice-driven, mentions the product only as a "tool I use" or "tool I built to solve this".
            2. "The Direct Fix": Short, punchy, directly addressing the pain point and offering the solution.
            3. "The Curious Founder": Asking a clarifying question to build rapport, then suggesting the solution.

            RULES:
            - NO generic AI fluff ("Great post!", "I agree").
            - NO aggressive sales pitches.
            - Keep it conversational (lowercase start often works better).
            - Be concise.

            OUTPUT FORMAT:
            Return ONLY a JSON object with this structure:
            {
                "variations": [
                    { "type": "Helpful", "text": "..." },
                    { "type": "Direct", "text": "..." },
                    { "type": "Question", "text": "..." }
                ]
            }
        `;

        // 4. Call AI
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
