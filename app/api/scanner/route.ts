import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
    try {
        const { url, email, action } = await req.json();

        // --- Action: Initial Scan ---
        if (action === 'SCAN') {
            if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

            console.log(`[Scanner] Analyzing site: ${url}`);

            // STEP A: Analyze Website (Mocked for now, to be implemented with Step B API)
            // In a real implementation, we would fetch the URL and use AI to extract keywords.
            
            // STEP B: The Search (The Reddit Pulse)
            // This is where we call the Free AI API that supports site:reddit.com queries.
            
            // For now, returning high-quality mock data that matches the niche
            // We can replace this with actual API calls once the key is set in .env
            const leads = [
                { 
                    subreddit: 'SaaS', 
                    title: `How do I find customers for a tool like ${url === 'https://redleads.io' ? 'RedLeads' : 'this'}?`,
                    url: 'https://reddit.com/r/SaaS/comments/example1' 
                },
                { 
                    subreddit: 'Entrepreneur', 
                    title: 'Any tips for Reddit marketing that actually works in 2026?', 
                    url: 'https://reddit.com/r/Entrepreneur/comments/example2' 
                },
                { 
                    subreddit: 'marketing', 
                    title: 'Is there an AI tool that scans subreddits for buying intent?', 
                    url: 'https://reddit.com/r/marketing/comments/example3' 
                },
                { 
                    subreddit: 'startup', 
                    title: 'Need advice on finding my first 100 users via social selling...', 
                    url: 'https://reddit.com/r/startup/comments/example4' 
                },
                { 
                    subreddit: 'business', 
                    title: 'What is the best way to handle lead generation on a budget?', 
                    url: 'https://reddit.com/r/business/comments/example5' 
                }
            ];

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
                await addDoc(collection(db, 'free_scanner_leads'), {
                    email,
                    source_url: url,
                    captured_at: serverTimestamp(),
                    status: 'new'
                });
            } catch (fsError) {
                console.error('[Firebase Error]', fsError);
                // Continue anyway to not block the user if Firebase is being tricky
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('[Scanner API Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
