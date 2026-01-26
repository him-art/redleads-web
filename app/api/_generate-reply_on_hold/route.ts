import { NextResponse } from 'next/server';

// System prompt placeholder - User needs to fill this in or provide it
const SYSTEM_PROMPT = `You are an expert Reddit growth marketer. Your goal is to draft replies that provide immense value first and mention a product only if it's genuinely helpful and relevant. 
You must avoid salesy language, buzzwords, and clear "ads".
The replies should be conversational, empathetic, and sound like a real user.

Output Format:
Return a JSON object with a "replies" array. Each item in the array must have:
- "title": A short label (e.g., "Value First", "Subtle Mention", "Direct Answer")
- "content": The reply text itself.
- "explanation": A one-sentence explanation of why this reply works and is ban-safe.
- "psychology": An array of strings describing the principles used (e.g., ["Social Proof", "Reciprocity", "Authority", "Validation"]).

Generate 3 variants.
`;

export async function POST(req: Request) {
  try {
    const { productUrl, redditPost, includeMention } = await req.json();

    if (!productUrl || !redditPost) {
      return NextResponse.json(
        { error: 'Product URL and Reddit Post are required' },
        { status: 400 }
      );
    }

    // 1. Scrape Product Context (Lightweight)
    let productContext = '';
    
    // Normalize URL - add https:// if no protocol specified
    let normalizedUrl = productUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    
    try {
      const response = await fetch(normalizedUrl, {
        headers: { 'User-Agent': 'RedLeads-Bot/1.0' },
        signal: AbortSignal.timeout(5000) // 5s timeout
      });
      const html = await response.text();
      
      // Basic Regex Extraction
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);

      productContext = `
        Product Title: ${titleMatch ? titleMatch[1] : 'Unknown'}
        Meta Description: ${descMatch ? descMatch[1] : 'Unknown'}
        Main Heading: ${h1Match ? h1Match[1] : 'Unknown'}
      `.trim();
    } catch (scrapeError) {
      console.warn('Scraping failed:', scrapeError);
      productContext = 'Could not fetch product details. Rely on URL only.';
    }

    // 2. Prepare LLM Payload for OpenRouter (using free model)
    const apiKey = process.env.OPENROUTER_API_KEY_1;
    
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY_1 is not set in environment variables');
      return NextResponse.json({
        error: 'Server configuration error: Missing API Key (OPENROUTER_API_KEY_1)'
      }, { status: 500 });
    }

    const prompt = `
      Product Context: ${productUrl}
      ${productContext}

      Reddit Post Context:
      ${redditPost}

      User Preference: ${includeMention ? 'Include subtle product mention' : 'Do NOT mention product, focus purely on value'}

      IMPORTANT: Return ONLY a valid JSON object with a "replies" array. No markdown, no code blocks.
    `;

    // 3. Call OpenRouter with free model
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://redleads.co',
        'X-Title': 'RedLeads Reply Generator'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free', // Free Llama model - more reliable
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.text();
      console.error('OpenRouter API Error:', errorData);
      throw new Error(`OpenRouter API Error: ${openRouterResponse.statusText}`);
    }

    const completion = await openRouterResponse.json();
    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from AI');
    }

    // Parse JSON from content (handle potential markdown code blocks)
    let parsedData;
    try {
      // Clean up response - remove markdown code blocks if present
      let cleanedContent = content.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.slice(7);
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      cleanedContent = cleanedContent.trim();
      
      parsedData = JSON.parse(cleanedContent);
    } catch (e) {
      console.error('JSON Parse Error:', e, 'Content:', content);
      throw new Error('Failed to parse AI response');
    }

    return NextResponse.json({ replies: parsedData.replies });

  } catch (error) {
    console.error('Generate Reply Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate replies. Please try again.' },
      { status: 500 }
    );
  }
}
