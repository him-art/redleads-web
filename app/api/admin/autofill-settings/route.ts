
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { groq } from '@/lib/groq';
import { z } from 'zod';

const autofillSchema = z.object({
    url: z.string().url(),
    description: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = autofillSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid Input', details: result.error.format() }, { status: 400 });
        }

        const { url, description: userDescription } = result.data;

        const prompt = `
            Analyze this business:
            URL: ${url}
            Description (User Provided): ${userDescription || 'Not provided'}
            
            Based on this information, identify:
            1. The top 5 high-intent "Priority Keywords". These MUST be single words only (e.g. "inventory", "churn", "outreach").
            2. The top 5 most relevant Reddit subreddits where their target audience might ask for help or recommendations (e.g. "solopreneur", "SaaS").
            ${!userDescription ? '3. A very short (1 sentence) description of what the business does.' : ''}
            
            Return the result as a STRICT JSON object in this format:
            {
                "keywords": ["word1", "word2", "word3", "word4", "word5"],
                "subreddits": ["subreddit1", "subreddit2", "subreddit3", "subreddit4", "subreddit5"]${!userDescription ? ',\n                "description": "A 1-sentence description."' : ''}
            }
            
            ONLY return the JSON object, nothing else. Do not include r/ prefix in subreddit names. Keywords MUST be single words.
        `;

        const groqData = await groq.call({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            response_format: { type: "json_object" }
        });
        const content = groqData.choices?.[0]?.message?.content;
        
        if (!content) throw new Error('AI failed to generate suggestions');

        const suggestions = JSON.parse(content);
        return NextResponse.json(suggestions);

    } catch (error: any) {
        console.error('[Autofill API Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
