import { NextResponse } from 'next/server';
import { ai } from '@/lib/ai';
import { createClient } from '@/lib/supabase/server';
import axios from 'axios';

/**
 * SSRF Protection: Block requests to internal/private IPs and cloud metadata
 */
function isUnsafeUrl(inputUrl: string): boolean {
    try {
        const normalized = inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`;
        const parsed = new URL(normalized);
        const hostname = parsed.hostname.toLowerCase();

        // Block cloud metadata endpoints
        if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') return true;

        // Block localhost and loopback
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0' || hostname === '::1') return true;

        // Block private IP ranges
        const parts = hostname.split('.').map(Number);
        if (parts.length === 4 && parts.every(n => !isNaN(n))) {
            if (parts[0] === 10) return true; // 10.x.x.x
            if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16-31.x.x
            if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.x.x
        }

        // Block non-HTTP protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) return true;

        return false;
    } catch {
        return true; // If URL parsing fails, block it
    }
}

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // SSRF Protection
        if (isUnsafeUrl(url)) {
            console.error('[Onboarding] Unsafe URL blocked:', url);
            return NextResponse.json({ error: 'This URL is not allowed for security reasons (private or local network).' }, { status: 400 });
        }

        let siteContext = '';
        let metaDescription = '';
        let title = '';

        // 1. Light scrape (Best Effort)
        try {
            const response = await axios.get(url.startsWith('http') ? url : `https://${url}`, {
                timeout: 5000, // Slightly increased timeout
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; RedLeadsBot/1.0; +http://redleads.app)'
                }
            });
            const html = response.data;
            
            // Simple regex extraction
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            title = titleMatch ? titleMatch[1] : '';

            const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
            metaDescription = metaMatch ? metaMatch[1] : '';
            
            siteContext = `Title: ${title}\nDescription: ${metaDescription}`;
        } catch (e) {
            console.log('[Onboarding] Scrape failed, relying on URL inference.', url);
            siteContext = `URL: ${url} (Site could not be scraped directly)`;
        }

        // 2. AI Analysis
        const prompt = `
            Analyze this product/service context to generate a precise profile for Reddit lead generation.
            
            Context from Site:
            ${siteContext}
            URL: ${url}

            Your goal is to be EXTREMELY SPECIFIC. 
            - If it's a LinkedIn tool, focus on LinkedIn keywords.
            - If it's a cold email tool, focus on outreach keywords.
            - AVOID GENERIC CATEGORIES like "CRM", "ERP", or "Marketing Software" unless the site explicitly says it is one of those.
            - Focus on the PRIMARY platform (e.g., LinkedIn, Reddit, Twitter, Email) and the PRIMARY problem solved (e.g., "reach", "engagement", "hiring").

            1. Generate a "Pitch Description" (max 2 sentences) that describes exactly what this tool does. 
               Bad: "It is a marketing tool."
               Good: "Meet Lea helps LinkedIn users triple their reach by finding high-impact posts to comment on via an AI-powered browser extension."

            2. Generate EXACTLY 6 "High-Intent Topic Keywords" for Reddit monitoring.
               
            Requirements for Keywords:
            - **STRICTLY 1-2 words maximum per keyword.**
            - **NO SENTENCES. NO QUESTIONS.**
            - **NO VERBS** at the start (e.g., do NOT use "find", "get", "increase", "boost").
            - Focus on the **platform name**, **specific niche**, **competitor name**, or **user pain point**.
            
            Examples for a LinkedIn tool:
            GOOD: "linkedin reach", "linkedin engagement", "taplio alternative", "linkedin growth", "social selling", "b2b outreach"
            BAD: "how to get views", "best linkedin tool", "social media marketing"
            
            Return JSON:
            {
                "description": "...",
                "keywords": ["...", "..."]
            }
        `;

        const aiResponse = await ai.call({
            model: "llama-3.3-70b-versatile",
            messages: [
                { 
                    role: "system", 
                    content: "You are a professional Lead Generation Expert. You specialize in identifying niche keywords that capture high-intent users looking for specific solutions." 
                },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1
        });

        if (!aiResponse || !aiResponse.choices?.length) {
            throw new Error('AI provider returned an empty response.');
        }

        const content = aiResponse.choices[0]?.message?.content;
        const result = JSON.parse(content || '{}');

        return NextResponse.json({
            description: result.description || metaDescription || 'A helpful tool for your workflow.',
            keywords: result.keywords || []
        });

    } catch (error: any) {
        console.error('[Onboarding API Error]', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to generate profile. Please check the URL and try again.' 
        }, { status: 500 });
    }
}
