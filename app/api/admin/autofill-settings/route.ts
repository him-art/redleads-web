
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ai } from '@/lib/ai';
import { z } from 'zod';

const autofillSchema = z.object({
    description: z.string().min(10, "Description must be at least 10 characters long"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = autofillSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid Input', details: result.error.format() }, { status: 400 });
        }

        const { description: userDescription } = result.data;

        const prompt = `
            Analyze this business description to generate tracking configuration:
            Business Description: ${userDescription}
            
            Based on this information, identify a mix of EXACTLY 15 high-intent keywords and phrases:
            1. Product/Service terms (e.g., "CRM software", "sales tools")
            2. Pain points (e.g., "low conversion rates", "manual data entry")
            3. Competitor indicators (e.g., brand names if relevant)
            4. Industry terms (e.g., "B2B SaaS", "go-to-market")

            Requirements for output:
            - Keywords/Phrases: Provide EXACTLY 15 relevant items total. Mixture of single words and multi-word phrases.
            - Subreddits: Provide EXACTLY 10 most relevant Reddit subreddits. Do not include r/ prefix.
            
            Return the result as a STRICT JSON object in this format:
            {
                "keywords": ["phrase or word 1", "phrase or word 2", ...],
                "subreddits": ["subreddit1", "subreddit2", ...]
            }
            
            ONLY return the JSON object, nothing else.
        `;

        const AIData = await ai.call({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            response_format: { type: "json_object" }
        });
        const content = AIData.choices?.[0]?.message?.content;
        
        if (!content) throw new Error('AI failed to generate suggestions');

        const suggestions = JSON.parse(content);
        return NextResponse.json(suggestions);

    } catch (error: any) {
        console.error('[Autofill API Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
