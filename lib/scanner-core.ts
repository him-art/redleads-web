import { ai as AI } from '@/lib/ai';

export interface ScannerResult {
    leads: any[];
    query?: string;
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

    // A. STEP A: Let AI Generate a High-Precision Mega-Query
    try {
        const prompt = `
            Analyze this product context:
            ${siteContextString}
            
            Generate ONE extremely high-intent search query for site:reddit.com.
            The query MUST combine multiple intent signals using the OR operator.
            
            Format: "niche keywords" (recommend OR best OR alternative OR problem OR help OR "looking for")
            
            Requirements:
            - Capture pain points, recommendation requests, and competitor alternatives in this ONE query.
            - Target people with urgent needs or high buying intent.
            - Return ONLY the query string.
        `;

        const AIData = await AI.call({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
        });

        const content = AIData.choices?.[0]?.message?.content?.trim() || '';
        // Remove quotes if present
        searchQueries = [content.replace(/^["']|["']$/g, '')];
    } catch (e) {
        console.error('[ScannerLib] AI API Failed for search query generation:', e);
    }

    // FALLBACK: If AI failed to provide queries, generate smart manual ones
    if (searchQueries.length === 0) {
        console.warn('[ScannerLib] AI analysis failed, generating fallback keyword queries.');
        const baseKeywords = keywords?.slice(0, 3) || [normalizedUrl.split('.')[0]];
        searchQueries = [`"${baseKeywords.join(' ')}" (recommend OR best OR alternative)`];
    }

    let leads: any[] = [];
    const seenUrls = new Set<string>();

    // C. STEP B: PRIMARY SEARCH (Tavily AI Search)
    if (tavilyApiKey && searchQueries.length > 0) {
        try {
            const tavilyTimeRange = 
                timeRange === '24h' ? 'day' :
                timeRange === '7d' ? 'week' :
                timeRange === '30d' ? 'month' : undefined;

            const query = searchQueries[0];
            const fetchBody: any = {
                api_key: tavilyApiKey,
                query: query.includes('site:reddit.com') ? query : `site:reddit.com ${query}`,
                search_depth: "advanced",
                include_domains: ["reddit.com"],
                max_results: 40 // Increased for the single query to get better variety
            };

            if (tavilyTimeRange) fetchBody.time_range = tavilyTimeRange;

            console.log(`[ScannerLib] Executing Precision Scan: ${fetchBody.query}`);

            const res = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fetchBody)
            });
            
            if (res.ok) {
                const data = await res.json();
                const results = data.results || [];

                for (const item of results) {
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
                
                Task: Categorize these ${leads.length} Reddit leads as "Best Match", "Good Match", or "Low" based on their relevance to the product.
                
                **Strictness Guidelines:**
                - **Best Match**: The post is explicitly asking for a tool like yours, or complaining about a specific problem your product solves.
                - **Good Match**: The post is highly related to the industry or niche but not a direct buying signal (e.g., general discussion).
                - **Low**: The post is unrelated, a generic advertisement, or a different industry entirely.
                
                Leads to analyze:
                ${JSON.stringify(leads.map((l, i) => ({ id: i, title: l.title, subreddit: l.subreddit })))}
                
                Return a JSON object mapping the lead index to its category.
                Output format: { "categories": { "0": "Best Match", "1": "Good Match", ... } }
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
                            match_category: parsed.categories[i.toString()] || 'Good Match'
                        }));
                    } else {
                        throw new Error('AI response missing "categories" field');
                    }
                } catch (parseError) {
                    console.error('[ScannerLib] JSON Parse Failed for Categorization:', content);
                    leads = leads.map(l => ({ ...l, match_category: 'Good Match' }));
                }
            } else {
                throw new Error('AI returned empty content for categorization');
            }
        } catch (catError: any) {
            console.error('[ScannerLib] Categorization failed:', catError.message);
            // Default to Good Match if AI fails
            leads = leads.map(l => ({ ...l, match_category: 'Good Match' }));
        }
    } else if (leads.length > 0) {
        // Fallback if no description
        leads = leads.map(l => ({ ...l, match_category: 'Good Match' }));
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

    const result = { 
        leads,
        query: searchQueries[0]?.replace('site:reddit.com', '').trim() 
    };
    
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
