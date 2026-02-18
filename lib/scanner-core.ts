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

    const normalizedUrl = url.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '');

    console.log(`[ScannerLib] Analyzing site: ${url}`);

    let searchQuery = '';
    // B. STEP A: Let AI Generate Search Queries
    try {
        const prompt = `
            Analyze this product:
            URL: ${url}
            Description: ${description || 'Not provided'}
            Key Target Words: ${keywords?.join(', ') || 'Not provided'}
            Focus Subreddits: ${subreddits?.join(', ') || 'General Reddit'}
            
            Generate 1 ADVANCED and HIGH-INTENT search query for "site:reddit.com" that a professional lead hunter would use.
            The query MUST include the current year "2026" or "2025" to ensure results are RECENT.
            Combine intent signals like (recommend OR "best" OR "alternative to" OR "how to" OR "problem with").
            
            1. If focus subreddits are provided, target them using "site:reddit.com/r/subredditname".
            2. If no subreddits are provided, use "site:reddit.com".
            3. Use the Keywords to find people with PAIN POINTS. (e.g. if keyword is "linkedin reach", search for people complaining about low reach).
            4. EXCLUDE unrelated generic niches.
            
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
                    max_results: 40
                })
            });
            const tavilyData = await tavilyRes.json();
            
            if (tavilyData.results && tavilyData.results.length > 0) {
                leads = tavilyData.results
                    .filter((item: any) => item.url.includes('reddit.com/r/'))
                    .map((item: any) => ({
                        subreddit: extractSubreddit(item.url),
                        title: item.title,
                        url: item.url,
                        body_text: item.content
                    }));
            }
        } catch (tError) {
            console.error('[ScannerLib] Tavily Search failed.', tError);
        }
    }

    // D. STEP D: Categorize with AI (New Requirement)
    if (leads.length > 0 && description) {
        try {
            console.log(`[ScannerLib] Categorizing ${leads.length} leads with AI...`);
            const categorizationPrompt = `
                You are an expert Lead Qualifier.
                
                Product Description: "${description}"
                Target Keywords: "${keywords?.join(', ')}"
                
                Task: Categorize these ${leads.length} Reddit leads as "High", "Medium", or "Low" based on their relevance to the product.
                
                **Strictness Guidelines:**
                - **HIGH**: The post is explicitly asking for a tool like yours, or complaining about a specific problem your product solves.
                - **MEDIUM**: The post is related to the industry or niche but not a direct buying signal (e.g., general discussion).
                - **LOW**: The post is unrelated, a generic advertisement, or a different industry entirely (e.g., if product is LinkedIn tool and post is about a CRM).
                
                Leads to analyze:
                ${JSON.stringify(leads.map((l, i) => ({ id: i, title: l.title, subreddit: l.subreddit })))}
                
                Return a JSON object mapping the lead index to its category.
                Output format: { "categories": { "0": "High", "1": "Medium", ... } }
                ONLY return the JSON.
            `;

            const aiRes = await AI.call({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: categorizationPrompt }],
                response_format: { type: "json_object" },
                temperature: 0.1,
            });

            const content = aiRes.choices?.[0]?.message?.content;
            if (content) {
                const parsed = JSON.parse(content);
                if (parsed.categories) {
                    leads = leads.map((l, i) => ({
                        ...l,
                        match_category: parsed.categories[i.toString()] || 'Medium'
                    }));
                }
            }
        } catch (catError) {
            console.error('[ScannerLib] Categorization failed:', catError);
            // Default to Medium if AI fails
            leads = leads.map(l => ({ ...l, match_category: 'Medium' }));
        }
    } else if (leads.length > 0) {
        // Fallback if no description
        leads = leads.map(l => ({ ...l, match_category: 'Medium' }));
    }

    const result = { leads };
    
    return result;

    return result;
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
            subreddit: 'product', 
            title: 'What is the best way to handle lead generation on a budget?', 
            url: 'https://reddit.com/r/product' 
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
