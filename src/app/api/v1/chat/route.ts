import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    const products = await db.getProducts();
    const lowerMsg = message.toLowerCase();

    // 1. Keyword extraction
    const terms = lowerMsg.split(/\s+/);
    
    // 2. Simple matching algorithm
    let matches = products.map(product => {
      let score = 0;
      const searchableText = `${product.name} ${product.description} ${product.category} ${product.brand} ${product.tags?.join(' ') || ''}`.toLowerCase();
      
      terms.forEach(term => {
        if (term.length > 2 && searchableText.includes(term)) {
          score += 1;
        }
      });

      // Price heuristics
      if (lowerMsg.includes('cheap') || lowerMsg.includes('under 100')) {
        if (product.price < 150) score += 2;
      }
      if (lowerMsg.includes('expensive') || lowerMsg.includes('grail') || lowerMsg.includes('luxury')) {
        if (product.price > 300) score += 2;
      }

      return { product, score };
    });

    // 3. Filter and sort
    matches = matches.filter(m => m.score > 0).sort((a, b) => b.score - a.score);
    const topMatches = matches.slice(0, 3).map(m => m.product);

    let replyText = '';
    let quickReplies: string[] = [];

    if (topMatches.length > 0) {
      replyText = `I checked the District Vault and found some heat that matches your vibe! Check out these recommendations:`;
      quickReplies = ['Show me something else', 'How do I use code STREET10?', 'Check Order Delivery Status'];
    } else {
      // Fallbacks
      if (lowerMsg.includes('suggest') || lowerMsg.includes('recommend') || lowerMsg.includes('trending') || lowerMsg.includes('best') || lowerMsg.includes('hot')) {
        const featured = products.filter(p => p.isFeatured || p.price > 200).slice(0, 3);
        replyText = "Here are some of our most exclusive and trending pieces right now. These are flying off the shelves!";
        topMatches.push(...featured);
        quickReplies = ['Show me Jordans', 'How do I use code STREET10?'];
      } else if (lowerMsg.includes('order') || lowerMsg.includes('track') || lowerMsg.includes('delivery')) {
        replyText = "You can track any package instantly using your Order ID. Tap below to launch our live tracker!";
        quickReplies = ['Open Order Tracker', 'Return Policy'];
      } else if (lowerMsg.includes('size') || lowerMsg.includes('fit') || lowerMsg.includes('jordan')) {
        replyText = "Air Jordan 1s and Nike Dunks fit True To Size (TTS). For Yeezy Slides, we recommend going 1 full size up.";
        quickReplies = ['Open Order Tracker', 'How do I use code STREET10?'];
      } else if (lowerMsg.includes('coupon') || lowerMsg.includes('discount')) {
        replyText = "Use promo code STREET10 at checkout to get 10% off your order! Plus, orders over $150 get Free Express Shipping!";
        quickReplies = ['Check Order Delivery Status', 'Sneaker Sizing Guide'];
      } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
        replyText = "Yo! What's good? I'm KAI, your streetwear concierge. Tell me what kind of drip you're looking for (e.g. 'I need some fresh Jordans' or 'show me cheap hoodies'), and I'll hook you up!";
        quickReplies = ['Recommend me something', 'Show me Jordans', 'Do Jordans fit True To Size?'];
      } else {
        replyText = "I couldn't find exact matches for that right now. We drop new grails every week. Want to browse all our newest arrivals or look for something specific like 'Jordans' or 'Hoodies'?";
        quickReplies = ['Recommend me something', 'Show me Jordans', 'What is authentic guaranteed?'];
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        text: replyText,
        quickReplies,
        recommendations: topMatches.length > 0 ? topMatches : undefined
      }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process chat' }, { status: 500 });
  }
}
