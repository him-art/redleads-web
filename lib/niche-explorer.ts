import { performScan } from './scanner-core';
import { ai as AI } from './ai';

export interface NicheResult {
    subreddits: Array<{
        name: string;
        relevance: number;
        reason: string;
    }>;
    painPoints: Array<{
        quote: string;
        context: string;
        url: string;
    }>;
    vibeKeywords: string[];
}

export async function exploreNiche(query: string): Promise<NicheResult> {
    console.log(`[NicheExplorer] Exploring niche: ${query}`);
    
    // 1. Get raw leads using existing scanner logic
    const scanResult = await performScan(query, {
        tavilyApiKey: process.env.TAVILY_API_KEY,
        description: `Market research for: ${query}. Focus on finding subreddits and pain points.`
    });

    const leads = scanResult.leads || [];

    // 2. Aggregate Subreddits
    const subredditMap: Record<string, { count: number; titles: string[] }> = {};
    leads.forEach(lead => {
        if (!subredditMap[lead.subreddit]) {
            subredditMap[lead.subreddit] = { count: 0, titles: [] };
        }
        subredditMap[lead.subreddit].count += 1;
        subredditMap[lead.subreddit].titles.push(lead.title);
    });

    const sortedSubreddits = Object.entries(subredditMap)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([name, data]) => ({
            name,
            relevance: Math.min(100, data.count * 20),
            reason: `Highly active discussions about ${query}`
        }));

    // 3. Extract Pain Points via AI
    let painPoints: any[] = [];
    let vibeKeywords: string[] = [];

    if (leads.length > 0) {
        try {
            const analysisPrompt = `
                Analyze these Reddit discussions about "${query}":
                ${JSON.stringify(leads.map(l => ({ title: l.title, text: l.body_text?.slice(0, 200) })))}
                
                Task:
                1. Identify 5 specific "Pain Points" (frustrations, problems, or "I wish" statements).
                2. Identify 5 "Vibe Keywords" (slang or industry terms common in this niche).
                
                Return a JSON object:
                {
                  "painPoints": [ { "quote": "...", "context": "...", "url": "..." } ],
                  "vibeKeywords": ["...", "..."]
                }
                
                Use the source data to find actual quotes where possible.
                ONLY return JSON.
            `;

            const aiRes = await AI.call({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: analysisPrompt }],
                response_format: { type: "json_object" },
                temperature: 0.1,
            });

            const content = aiRes.choices?.[0]?.message?.content;
            if (content) {
                const parsed = JSON.parse(content);
                painPoints = parsed.painPoints || [];
                vibeKeywords = parsed.vibeKeywords || [];
                
                // Attach URLs back to pain points if possible (matching by context/title)
                painPoints = painPoints.map(pp => {
                    const match = leads.find(l => l.title.includes(pp.context) || pp.context.includes(l.subreddit));
                    return { ...pp, url: match?.url || 'https://reddit.com' };
                });
            }
        } catch (e) {
            console.error('[NicheExplorer] AI Extraction Failed', e);
        }
    }

    return {
        subreddits: sortedSubreddits,
        painPoints: painPoints.slice(0, 5),
        vibeKeywords: vibeKeywords.slice(0, 8)
    };
}
