import { NextResponse } from 'next/server';
import { onboardingAi } from '@/lib/ai';
import { createClient } from '@/lib/supabase/server';
import { guideRatelimit } from '@/lib/ratelimit';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { website_url, description, keywords } = body;

        // 1. Auth Check (Protect the API)
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1.5 Rate Limiting
        const { success } = await guideRatelimit.limit(user.id);
        if (!success) {
            return NextResponse.json(
                { error: 'You have reached your daily limit for generating custom strategies. Please try again tomorrow.' }, 
                { status: 429 }
            );
        }

        // 2. Validate inputs
        if (!website_url && !description) {
            return NextResponse.json({ error: 'No profile context provided' }, { status: 400 });
        }

        // 3. Construct Expert Prompt
        const prompt = `
            You are "RedLeads OS", an expert growth consultant built into the RedLeads dashboard. You are creating a hyper-personalized, gamified 14-day roadmap to help this specific SaaS founder get their first 100 users.
            
            USER CONTEXT:
            - Website: ${website_url || 'N/A'}
            - Description: ${description || 'N/A'}
            - Keywords they track: ${keywords ? keywords.join(', ') : 'N/A'}

            STRICT RULES:
            1. DO NOT tell the user to "log in" or "sign up". They are reading this inside the RedLeads dashboard.
            2. DO NOT mention any "content ideation tool" or tools that don't exist. RedLeads has ONLY three core features: The Command Center (live keyword feed), Power Search (deep semantic historical search), and AI Drafter (writing replies).
            3. BE SPECIFIC. In your content, you MUST recommend 3-5 exact subreddits (e.g., r/SaaS, r/Entrepreneur, etc.) that perfectly match their product description. DO NOT tell them to "go find subreddits", name the subreddits for them.
            4. Suggest exact search queries they should type into Power Search based on their product.
            
            REDDIT SAFETY & SPAM RULES (CRITICAL):
            5. NEVER recommend tracking keywords containing "hate [competitor]" or "angry [competitor]". This gets domains banned.
            6. NEVER suggest sending unsolicited DMs or follow-ups to Reddit users. This violates Reddit ToS and gets accounts suspended.
            7. ALWAYS advise users to NEVER drop direct links in comments. Explain the correct flow: add value first -> get asked for a link -> share in DM or invite DM.
            8. ALWAYS emphasize building karma in general subreddits first (non-niche/non-promo) before mentioning their product.
            9. Tell the user about shadowban checking (log out and view profile page).
            
            READY-TO-PASTE DRAFTS (CRITICAL COPYWRITING FORMULAS):
            10. For days where you instruct the user to post, comment, or set up their profile, you MUST generate realistic, high-quality, pre-written templates tailored to their SaaS using one of these four Reddit copywriting formulas:
                - Day 1 (Reddit Founder Bio Template): Write a personal, non-corporate bio template for their settings. Hook: "Building [SaaS] to help [Audience] solve [Pain]...". For this day, set "target_subreddit" to null (since the bio is for settings, not a post). The Markdown content of the node MUST link directly to "[r/ShadowBan](https://reddit.com/r/ShadowBan)" to run the automated check.
                - Day 4 or similar (The Founder's Journey): Hook: "I spent X hours building [Product] because I was tired of [Pain]. Here is what I learned." Write a humble story detailing the builder's frustration, what they learned, and asking the community for brutally honest feedback (no direct links).
                - Day 6 or similar (The Value Bomb / How-To): Walk the reader through a 3-step manual solution to a major problem. Offer a 100% free workaround first (80% content), then mention their SaaS at the very end as a 1-click automated alternative (20% content). Offer to DM the link.
                - Day 12 or similar (The Transparent Case Study): Hook: "How we got our first [X] users/conversions for our [niche] SaaS with $0 ad spend." Share traffic/revenue channels, highlight what failed (e.g., cold emails, Twitter), detail the exact acquisition playbook, and invite questions.
                - Day 14 or similar (The Vulnerable Post-Mortem / Failure Log): Hook: "We launched our SaaS, got high traffic, and converted exactly 0 signups. Here is the post-mortem." Walk through honest landing page or product mistakes, lessons learned, and ask the community: "How would you handle this pivot?"
            11. When generating a draft, populate "target_subreddit" (e.g., "r/SaaS", "r/SideProject", "r/startups", "r/Entrepreneur") for post templates, or null (like for the Day 1 bio setup). Use curiosity-driven, non-ad title hooks for "suggested_title", and the full pre-written post copy for "ready_to_paste_content".
            12. For days where no drafting action is required (e.g., Day 2, 3, 5, 8, etc.) or when setting up settings, set "target_subreddit", "suggested_title", and "ready_to_paste_content" to null as appropriate.
            
            PHASE RULES (STRICT DAY MAP):
            - Day 1: "Account Health & Shadowban Audit" (Do not start with keyword setup. Focus on auditing Reddit account age/karma, checking for shadowbans by instructing the user to visit [r/ShadowBan](https://reddit.com/r/ShadowBan), and styling the profile bio. Set action_link to "https://www.reddit.com/settings/profile" and action_label to "Optimize Reddit Profile").
            - Day 2: "The Karma Shield Protocol" (Focus on building initial, non-promotional karma safely in general subreddits).
            - Day 3: "Keyword Calibration & Intent" (Configure the tracked keywords in RedLeads settings, categorizing them into three intent tiers: pain points, competitor alternatives, and contextual topics).
            - Day 4: "Subreddit Rules Decoding" (Investigate rule sheets and promo thread schedules for the 3-5 recommended subreddits).
            - Days 5-10 (Phase 2): "The 10-Minute Engine" (Establish a strict daily routine using the Command Center. Answer leads using the AI Drafter, teaching the "value-first, soft-pitch, link-second" methodology).
            - Days 11-14 (Phase 3): "Deep Hunting & Power Search" (Search historically for high-intent conversations using semantic queries, and follow up in threads where they can offer expert value).
 
            OUTPUT FORMAT:
            Return ONLY a valid JSON object with an array called "nodes". It must contain exactly 14 objects (one for each day). Ensure descriptions are short punchy hooks. Content should be formatted in Markdown.
            {
                "nodes": [
                    {
                        "id": "day-1",
                        "phase": 1,
                        "day_number": 1,
                        "title": "Actionable Title",
                        "description": "Very short hook.",
                        "content": "Full markdown string with '# Heading', '## Steps', and your personalized recommendations.",
                        "warning_content": "A high-risk warning string (e.g., 'Warning: never post links directly in comments in this subreddit as it will be removed by auto-moderators.') or null if no warning is needed.",
                        "action_label": "Go to Settings",
                        "action_link": "?tab=settings",
                        "estimated_minutes": 15,
                        "target_subreddit": "r/SaaS",
                        "suggested_title": "Suggested post title or comment topic",
                        "ready_to_paste_content": "A personalized post or comment draft tailored to their product description and matching the subreddit's culture"
                    },
                    ... (up to day 14)
                ]
            }
        `;

        // 4. Call AI
        const aiResponse = await onboardingAi.call({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.7
        });

        const result = JSON.parse(aiResponse.choices[0]?.message?.content || '{}');

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('[Generate Guide Error]:', error);
        return NextResponse.json(
            { error: 'Failed to generate guide.' }, 
            { status: 500 }
        );
    }
}
