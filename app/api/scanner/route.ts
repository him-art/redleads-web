import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { scannerSchema } from '@/lib/validation';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // 1. Input Validation (Zod)
        const validation = scannerSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }
        
        const { url, email, action } = validation.data;
        const GROQ_API_KEY = process.env.GROQ_API_KEY;

        // 2. Authorization Check (Supabase)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('[Scanner] Missing Supabase environment variables');
            return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        console.log(`[Scanner] Action: ${action} by user: ${user?.id || 'anonymous'}`);

        // --- Action: Initial Scan ---
        if (action === 'SCAN') {
            if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

            console.log(`[Scanner] Analyzing site: ${url}`);

            // A. Check for Groq API Key
            if (!GROQ_API_KEY) {
                console.warn('[Scanner] Missing GROQ_API_KEY. Using mock data for demo.');
                return NextResponse.json({ 
                    leads: getMockLeads(url),
                    warning: 'Running in demo mode (missing Groq API key)' 
                });
            }

            // B. STEP A: Let AI Generate Search Queries
            const prompt = `
                Analyze this website URL: ${url}
                
                Generate 1 ADVANCED and HIGH-INTENT search query for "site:reddit.com" that a professional lead hunter would use.
                The query MUST include the current year "2025" or "2024" to ensure results are RECENT.
                Use Boolean OR logic to combine multiple intent signals.
                
                Example: site:reddit.com "keyword" (recommend OR "best" OR "alternative to") 2025
                
                ONLY return the query string, nothing else. No quotes, no intro text.
            `;

            const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.1,
                })
            });

            const groqData = await groqResponse.json();
            const searchQuery = groqData.choices?.[0]?.message?.content?.trim();

            if (!searchQuery) throw new Error('AI analysis failed');

            let leads: any[] = [];
            const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

            // C. STEP B: PRIMARY SEARCH (Tavily AI Search)
            if (TAVILY_API_KEY) {
                try {
                    console.log(`[Scanner] Attempting Tavily Search for: ${searchQuery}`);
                    const tavilyRes = await fetch('https://api.tavily.com/search', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            api_key: TAVILY_API_KEY,
                            query: searchQuery.includes('site:reddit.com') ? searchQuery : `site:reddit.com ${searchQuery}`,
                            search_depth: "advanced",
                            include_domains: ["reddit.com"],
                            max_results: 21
                        })
                    });
                    const tavilyData = await tavilyRes.json();
                    
                    if (tavilyData.results && tavilyData.results.length > 0) {
                        leads = tavilyData.results
                            .filter((item: any) => item.url.includes('reddit.com/r/'))
                            .map((item: any) => ({
                                subreddit: extractSubreddit(item.url),
                                title: item.title,
                                url: item.url
                            }));
                    }
                } catch (tError) {
                    console.error('[Scanner] Tavily Search failed.', tError);
                }
            }

            // D. STEP C: FALLBACK SEARCH (Reddit Public API)
            if (leads.length === 0) {
                try {
                    console.log(`[Scanner] FALLBACK: Searching Reddit Public API`);
                    const simpleQuery = searchQuery.replace(/site:reddit\.com/gi, '').trim();
                    const redditResponse = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(simpleQuery)}&sort=relevance&t=year&limit=21`, {
                        headers: { 'User-Agent': 'RedLeadsScanner/1.0 (by /u/RedLeads)' }
                    });

                    const redditData = await redditResponse.json();
                    
                    if (redditData.data?.children && redditData.data.children.length > 0) {
                        leads = redditData.data.children
                            .filter((child: any) => child.data.subreddit)
                            .map((child: any) => ({
                                subreddit: child.data.subreddit,
                                title: child.data.title,
                                url: `https://reddit.com${child.data.permalink}`
                            }));
                    }
                } catch (rError) {
                    console.error('[Scanner] Reddit Fallback failed.', rError);
                }
            }

            // E. FINAL FALLBACK: Mock Data
            if (leads.length === 0) {
                leads = getMockLeads(url);
            }

            return NextResponse.json({ leads });
        }

        // --- Action: Save Email (Unlock) ---
        if (action === 'UNLOCK') {
            if (!email || !url) {
                return NextResponse.json({ error: 'Email and URL are required' }, { status: 400 });
            }

            console.log(`[Scanner] Capturing lead: ${email} for ${url}`);

            // Save to Firebase Firestore
            try {
                if (db) {
                    await addDoc(collection(db, 'free_scanner_leads'), {
                        email,
                        source_url: url,
                        captured_at: serverTimestamp(),
                        status: 'new',
                        user_id: user?.id || null
                    });
                } else {
                    console.warn('[Scanner] Firestore not initialized. Lead not saved to DB.');
                }
            } catch (fsError) {
                console.error('[Firebase Error]', fsError);
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('[Scanner API Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// --- Helpers ---
function getMockLeads(url: string) {
    return [
        { 
            subreddit: 'SaaS', 
            title: `How do I find customers for a tool like ${url.includes('redleads') ? 'this' : 'RedLeads'}?`,
            url: 'https://reddit.com/r/SaaS' 
        },
        { 
            subreddit: 'Entrepreneur', 
            title: 'Any tips for Reddit marketing that actually works in 2026?', 
            url: 'https://reddit.com/r/Entrepreneur' 
        },
        { 
            subreddit: 'marketing', 
            title: 'Is there an AI tool that scans subreddits for buying intent?', 
            url: 'https://reddit.com/r/marketing' 
        },
        { 
            subreddit: 'startup', 
            title: 'Need advice on finding my first 100 users via social selling...', 
            url: 'https://reddit.com/r/startup' 
        },
        { 
            subreddit: 'business', 
            title: 'What is the best way to handle lead generation on a budget?', 
            url: 'https://reddit.com/r/business' 
        }
    ];
}

function extractSubreddit(url: string) {
    try {
        const parts = url.split('/r/');
        if (parts.length > 1) {
            return parts[1].split('/')[0];
        }
        return 'Reddit';
    } catch {
        return 'Reddit';
    }
}
