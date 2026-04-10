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
    timeRange?: '24h' | '7d' | '30d';
}


export async function performScan(url: string, options: ScannerOptions): Promise<ScannerResult> {
    const { tavilyApiKey, keywords, subreddits, description, timeRange } = options;

    const normalizedUrl = url.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '');

    console.log(`[ScannerLib] Analyzing site: ${url} with timeRange: ${timeRange}`);

    let searchQueries: string[] = [];
    const siteContextString = `URL: ${url}\nDescription: ${description || 'Not provided'}\nKeywords: ${keywords?.join(', ') || 'Not provided'}\nSubreddits: ${subreddits?.join(', ') || 'General Reddit'}`;

    // A. STEP A: Let AI Generate multiple Search Queries
    try {
        const prompt = `
            Analyze this product context:
            ${siteContextString}
            
            Generate EXACTLY 3 distinct and HIGH-INTENT search queries for "site:reddit.com".
            Each query should target a different angle:
            1. Problem/Pain Point: People complaining about the specific issue this product solves.
            2. Recommendations: People looking for the "best" or "top" tools in this niche.
            3. Comparisons/Competitors: People asking for alternatives to known competitors.

            Requirements:
            - Target people with high buying intent or urgent needs.
            - Use specific keywords like (recommend OR "best" OR "alternative to" OR "how to" OR "problem with").
            - Target specific subreddits if provided using site:reddit.com/r/subredditname.
            
            Return ONLY a JSON array of strings. 
            Example: ["query 1", "query 2", "query 3"]
        `;

        const AIData = await AI.call({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const content = AIData.choices?.[0]?.message?.content?.trim() || '[]';
        const parsed = JSON.parse(content);
        searchQueries = Array.isArray(parsed) ? parsed : (parsed.queries || []);
    } catch (e) {
        console.error('[ScannerLib] AI API Failed for search query generation:', e);
    }

    // FALLBACK: If AI failed to provide queries, generate smart manual ones
    if (searchQueries.length === 0) {
        console.warn('[ScannerLib] AI analysis failed, generating fallback keyword queries.');
        const baseKeywords = keywords?.slice(0, 3) || [normalizedUrl.split('.')[0]];
        searchQueries = baseKeywords.map(kw => `site:reddit.com "${kw}" (recommend OR best OR alternative)`);
    }

    let leads: any[] = [];
    const seenUrls = new Set<string>();

    // C. STEP B: PRIMARY SEARCH (Tavily AI Search)
    if (tavilyApiKey) {
        try {
            const tavilyTimeRange = 
                timeRange === '24h' ? 'day' :
                timeRange === '7d' ? 'week' :
                timeRange === '30d' ? 'month' : undefined;

            // Run searches in parallel (limited)
            const searchPromises = searchQueries.map(async (query) => {
                const fetchBody: any = {
                    api_key: tavilyApiKey,
                    query: query.includes('site:reddit.com') ? query : `site:reddit.com ${query}`,
                    search_depth: "advanced",
                    include_domains: ["reddit.com"],
                    max_results: 30 // 30 per query = ~90 results total
                };

                if (tavilyTimeRange) fetchBody.time_range = tavilyTimeRange;

                const res = await fetch('https://api.tavily.com/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fetchBody)
                });
                
                if (!res.ok) return [];
                const data = await res.json();
                return data.results || [];
            });

            const allResultsSets = await Promise.all(searchPromises);
            const flatResults = allResultsSets.flat();

            for (const item of flatResults) {
                if (!item.url.includes('reddit.com/r/')) continue;
                if (seenUrls.has(item.url)) continue;
                
                seenUrls.add(item.url);
                leads.push({
                    subreddit: extractSubreddit(item.url),
                    title: item.title,
                    url: item.url,
                    body_text: item.content,
                    post_created_at: item.published_date || null
                });
            }
            
            console.log(`[ScannerLib] Aggregate Tavily results: ${leads.length} unique leads found.`);
        } catch (tError) {
            console.error('[ScannerLib] Tavily Search failed:', tError);
        }
    }

    if (leads.length === 0) {
        console.warn('[ScannerLib] No real leads found, falling back to mock leads.');
        return { leads: getMockLeads(url), warning: 'No live matches found for these keywords. Showing representative leads instead.' };
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
                try {
                    const parsed = JSON.parse(content);
                    if (parsed.categories) {
                        leads = leads.map((l, i) => ({
                            ...l,
                            match_category: parsed.categories[i.toString()] || 'Medium'
                        }));
                    } else {
                        throw new Error('AI response missing "categories" field');
                    }
                } catch (parseError) {
                    console.error('[ScannerLib] JSON Parse Failed for Categorization:', content);
                    leads = leads.map(l => ({ ...l, match_category: 'Medium' }));
                }
            } else {
                throw new Error('AI returned empty content for categorization');
            }
        } catch (catError: any) {
            console.error('[ScannerLib] Categorization failed:', catError.message);
            // Default to Medium if AI fails
            leads = leads.map(l => ({ ...l, match_category: 'Medium' }));
        }
    } else if (leads.length > 0) {
        // Fallback if no description
        leads = leads.map(l => ({ ...l, match_category: 'Medium' }));
    }

    // E. FINAL FILTERING: Remove Low relevance and Old leads
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    leads = leads.filter(lead => {
        // 1. Relevance Check
        if (lead.match_category === 'Low') {
            console.log(`[ScannerLib] Dropping LOW relevance lead: ${lead.title}`);
            return false;
        }

        // 2. Freshness Check (Optional based on data availability)
        if (lead.post_created_at) {
            const postDate = new Date(lead.post_created_at).getTime();
            if (now - postDate > THIRTY_DAYS_MS) {
                console.log(`[ScannerLib] Dropping OLD lead (>30d): ${lead.title} (${lead.post_created_at})`);
                return false;
            }
        }

        return true;
    });

    const result = { leads };
    
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
