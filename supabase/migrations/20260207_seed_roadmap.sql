-- Seed Roadmap Content (Refined with Expert Limits)

-- Clear existing nodes to avoid duplicates during dev
delete from public.roadmap_nodes;

-- Phase 1: The Trojan Horse (Days 1-7)
insert into public.roadmap_nodes (phase, order_index, title, description, content, action_link, action_label) values
(1, 10, 'The Setup', 'Build a profile that looks like a veteran, not a spammer.', 
'# The 5-Year Veteran Disguise

Reddit users have a sixth sense for "Marketroids". Your goal today is to become invisible.

## 1. The "Human" Test
- **Avatar:** Do NOT use your company logo. Use a picture of you, or a stylized Snoo.
- **Bio:** Write established interests, not a sales pitch.
    - *Bad:* "CEO of SaaSTool. We help you..."
    - *Good:* "Indie dev building tools for productivity. Coffee addict."

## ⚠️ Safety Check
If your account is **less than 48 hours old**, you are on "Probation". 
- Do NOT post. 
- Do NOT comment more than 5 times today.
- Just subscribe and upvote.', 
'?tab=settings', 'Setup Keywords'),

(1, 20, 'The Listener', 'Identify your target communities and learn their language.',
'# Read the Room

Before you speak, you must listen. Every subreddit has its own culture, inside jokes, and enemies.

## Task
1. Go to **Command Center**.
2. Look at the "Top" posts in your discovered subreddits.
3. Note the "lingo". Do they say "SaaS" or "Micro-SaaS"? "Clients" or "Custies"?

## 🕒 The 9:1 Rule
For every **1 time** you promote yourself, you must make **9 genuine contributions** (comments, helpful posts). 
Start your "9" today by just upvoting good content.', '?tab=live', 'Go to Command Center'),

(1, 30, 'The Sniper DM', 'Get your first user without even posting publicly.',
'# The Shadow Strategy

You have 0 Karma. You cannot post. But you CAN message.
But tread lightly.

## The Strategy
1. Find a user in **Command Center** complaining effectively about a competitor.
2. Click "View on Reddit".
3. Send a **Helpful DM**.

### The Script
"Hey! Saw your post about [Competitor]. I actually built a tiny tool that fixes [Specific Pain]. It is free to try, no credit card.
[Link]
Let me know if it sucks!"

## 🛑 DANGER ZONE
- **Max DMs:** 3 per day.
- **Timing:** Wait at least 15 minutes between DMs.
- If you send 10 DMs in an hour, you **WILL** be shadowbanned. Be a sniper, not a machine gun.', '?tab=live', 'Find a Lead to DM'),

(1, 40, 'The Me-Too Comment', 'Validate others to build your first karma points.',
'# The "This!" Comment

You need Karma to survive. The easiest way to get it? Validate angry people.

## The Tactic
1. Find a "Rant" post.
2. Comment agreeing with them.
3. Share a *personal* anecdote of similar pain.
4. **DO NOT LINK YOUR TOOL.**

## 🕒 Best Time to Comment
Only comment on posts that are **less than 4 hours old**.
- < 1 Hour: Gold Mine (High chance of becoming top comment).
- > 12 Hours: Graveyard (No one will see you).', '?tab=live', 'Find a Rant'),

-- Phase 2: The Helpful Expert (Days 8-21)
(2, 50, 'The Listicle', 'Draft a "Top Tools" list to subtly position your product.',
'# The Trojan List

People love lists. They get high engagement.
We will use this to slide your product in under the radar.

## The Formula
Write a comment or post listing "Top 5 Tools for [Problem]".
1. The Giant (Standard advice)
2. The Open Source (For techies)
3. **Your Product** (Positioned as the "Specialist" option)
4. The Niche Alternative
5. The Weird One

## ⚠️ The "Humble" Rule
Do not put yourself at #1. 
Put yourself at #3 or #4. It looks less biased.', null, null),

(2, 60, 'The First Post', 'Share your founder story in a safe space.',
'# The Origin Story

Subreddits like r/IndieHackers and r/SideProject *want* you to succeed. They are safe spaces.

## Task
1. Use the **AI Post Generator** (coming soon) or draft a story.
2. Title: "I was tired of [Problem], so I built this."
3. Be vulnerable. Share the struggle.

## 🛑 Strict Posting Rules
- **No Links in Body:** Put the link in the *comments* or only if someone asks.
- **Frequency:** Post this only to **1 subreddit** today. Do not blast 5 subreddits at once.', null, null),

-- Phase 3: The Machine (Days 22+)
(3, 70, 'The Lead Magnet', 'Scale your outreach with free value.',
'# Give to Get

Stop selling the tool. Sell the *result*.

## The Tactic
1. Create a free PDF, Calculator, or Template related to your niche.
2. Search RedLeads for people asking "How to [X]?".
3. Reply: "I made a free calculator for this. [Link]."

## The Hook
The calculator is free. But the "Save Results" button? That requires your SaaS.

## 🕒 Automation Schedule
- Send max **5 replies** per day using this method.
- Varya your phrasing every time. Copy-paste gets you banned.', null, null);
