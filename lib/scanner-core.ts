import { ai as AI } from '@/lib/ai';

export interface ScannerResult {
    leads: any[];
    error?: string;
    warning?: string;
}

export interface ScannerOptions {
    AIApiKey?: string;
    tavilyApiKey?: string;
    keywords?: string[];
    subreddits?: string[];
    description?: string;
}

export async function performScan(url: string, options: ScannerOptions): Promise<ScannerResult> {
    const { tavilyApiKey, keywords, subreddits, description } = options;

    console.log(`[ScannerLib] Analyzing site: ${url}`);

    let searchQuery = '';
    // B. STEP A: Let AI Generate Search Queries
    try {
        const prompt = `
            Analyze this business:
            URL: ${url}
            Description: ${description || 'Not provided'}
            Key Target Words: ${keywords?.join(', ') || 'Not provided'}
            Focus Subreddits: ${subreddits?.join(', ') || 'General Reddit'}
            
            Generate 1 ADVANCED and HIGH-INTENT search query for "site:reddit.com" that a professional lead hunter would use.
            The query MUST include the current year "2026" or "2025" to ensure results are RECENT.
            Combine intent signals like (recommend OR "best" OR "alternative to" OR "how to" OR "problem with").
            If focus subreddits are provided, try to target them using "site:reddit.com/r/subredditname".
            
            Example: site:reddit.com/r/SaaS "outreach" (recommend OR "best" OR "tool") 2026
            
            ONLY return the query string, nothing else. No quotes, no intro text.
        `;

        const AIData = await AI.call({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
        });

        searchQuery = AIData.choices?.[0]?.message?.content?.trim();
    } catch (e) {
        console.error('[ScannerLib] AI API Failed', e);
    }

    if (!searchQuery) {
        console.warn('[ScannerLib] AI analysis failed, falling back to mock.');
        return { leads: getMockLeads(url), warning: 'AI Analysis Failed' };
    }

    let leads: any[] = [];

    // C. STEP B: PRIMARY SEARCH (Tavily AI Search)
    if (tavilyApiKey) {
        try {
            console.log(`[ScannerLib] Attempting Tavily Search for: ${searchQuery}`);
            const tavilyRes = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: tavilyApiKey,
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
            console.error('[ScannerLib] Tavily Search failed.', tError);
        }
    }

    // D. STEP C: FALLBACK SEARCH (Reddit Search Disabled - Pure RSS Only)
    if (leads.length === 0) {
        console.log(`[ScannerLib] FALLBACK: Reddit JSON Search is DISABLED. (Pure RSS Mode Active)`);
        // We do not use search.json per user requirements.
        // Future: could implement subreddit-specific RSS feed checking here.
    }

    // E. FINAL FALLBACK: Mock Data
    if (leads.length === 0) {
        leads = getMockLeads(url);
    }

    return { leads };
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
