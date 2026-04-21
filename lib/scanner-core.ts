import { ai as AI } from '@/lib/ai';

export interface ScannerResult {
    leads: any[];
    query?: string;
    suggestions?: string[];
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
                
                Generate a Natural Language search query for site:reddit.com that Tavily's AI can use to find your target audience.
                
                The query should be a descriptive request, like:
                "People on reddit looking for [problem solved] or asking for recommendations for [niche/product type]"
                
                Requirements:
                - Focus on semantic meaning, not just keywords.
                - Do NOT use Boolean operators (OR, AND).
                - Target the "Target Audience" persona.
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
                max_results: 60 // High sample size for AI filtering
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
        console.warn('[ScannerLib] No real leads found for keywords/description. Requesting suggestions.');
        let suggestions: string[] = [];
        try {
            const suggestionPrompt = `
                The user was searching for Reddit leads but found 0 results in their selected timeframe.
                
                Context:
                Description: "${description}"
                Keywords: "${keywords?.join(', ')}"
                
                Task: Provide exactly 3 very short, actionable tips on how they can broaden their search keywords to find more general leads in their space. 
                Keep each tip under 12 words. Focus on specific keyword replacements or broadening the niche.
                
                Return a JSON object with a 'suggestions' array of strings.
            `;
            const suggestionRes = await AI.call({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: suggestionPrompt }],
                response_format: { type: "json_object" },
                temperature: 0.3,
            });
            const content = suggestionRes.choices?.[0]?.message?.content;
            if (content) {
                const parsed = JSON.parse(content);
                if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
                    suggestions = parsed.suggestions.slice(0, 3);
                }
            }
        } catch (e) {
            console.error('[ScannerLib] Failed to generate suggestions:', e);
            suggestions = [
                "Try using fewer, more general keywords.",
                "Remove competitor names to expand the search.",
                "Focus on the core problem rather than the solution."
            ];
        }
        return { leads: [], suggestions };
    }


    // D. STEP D: Categorize with AI (New Requirement)
    if (leads.length > 0 && description) {
        try {
            console.log(`[ScannerLib] Categorizing ${leads.length} leads with AI...`);
            const categorizationPrompt = `
                You are an expert Lead Qualifier.
                
                Product Description: "${description}"
                Target Keywords: "${keywords?.join(', ')}"
                
                Task: Act as a "Chief Audience Officer". Review these ${leads.length} Reddit leads and qualify them against our Target Audience criteria.
                
                **Strictness Guidelines:**
                - **Best Match**: The user is currently experiencing the EXACT problem we solve, or is actively asking for a recommendation we fulfill. High intent.
                - **Good Match**: The user is in the correct audience/niche and talking about relevant topics, but maybe not ready to buy yet.
                - **Low**: Generic noise, ads, or the user is not actually in the target market.
                
                Leads to qualify:
                ${JSON.stringify(leads.map((l, i) => ({ id: i, title: l.title, subreddit: l.subreddit, snippet: l.body_text?.substring(0, 150) })))}
                
                Return a JSON object mapping the lead index to its category.
                Format: { "categories": { "0": "Best Match", "1": "Good Match", ... } }
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

    // E. FINAL FILTERING: Remove Low relevance and Old leads (Respect Timeframe)
    const timeframeMs = 
        timeRange === '24h' ? 24 * 60 * 60 * 1000 :
        timeRange === '7d' ? 7 * 24 * 60 * 60 * 1000 :
        30 * 24 * 60 * 60 * 1000;

    const now = Date.now();

    leads = leads.filter(lead => {
        // 1. Relevance Check
        if (lead.match_category === 'Low') {
            console.log(`[ScannerLib] Dropping LOW relevance lead: ${lead.title}`);
            return false;
        }

        // 2. Freshness Check (Enforce selected timeRange)
        if (lead.post_created_at) {
            const postDate = new Date(lead.post_created_at).getTime();
            if (now - postDate > timeframeMs) {
                console.log(`[ScannerLib] Dropping lead older than selected range: ${lead.title} (${lead.post_created_at})`);
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
