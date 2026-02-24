
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ai } from '@/lib/ai';
import { z } from 'zod';

const autofillSchema = z.object({
    description: z.string().min(10, "Description must be at least 10 characters long"),
    limit: z.number().min(1).max(20).optional().default(10),
});

export async function POST(req: Request) {
    try {
        // Auth Check — protect AI credits
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = autofillSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid Input', details: result.error.format() }, { status: 400 });
        }

        const { description: userDescription, limit: keywordLimit } = result.data;

        const prompt = `
            Analyze this product description to generate tracking configuration:
            product Description: ${userDescription}
            
            Based on this information, identify a mix of EXACTLY ${keywordLimit} high-intent keywords and phrases:
            1. Product/Service terms (e.g., "CRM software", "sales tools")
            2. Pain points (e.g., "low conversion rates", "manual data entry")
            3. Competitor indicators (e.g., brand names if relevant)
            4. Industry terms (e.g., "B2B SaaS", "go-to-market")
 
            Requirements for output:
            - Keywords/Phrases: Provide EXACTLY ${keywordLimit} relevant items total. 
            - **CRITICAL: Every suggested keyword MUST be a 2-word phrase** (e.g., "sales automation" instead of just "sales").
            - Avoid single words. Avoid phrases longer than 3 words.
            
            Return the result as a STRICT JSON object in this format:
            {
                "keywords": ["phrase or word 1", "phrase or word 2", ...]
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
