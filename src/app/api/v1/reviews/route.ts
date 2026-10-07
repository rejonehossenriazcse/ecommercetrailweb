import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ReviewRecord } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const productId = searchParams.get('productId') || undefined;
    const reviews = await db.getReviews(status, productId);
    return NextResponse.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.productId || !body.customerName || !body.rating || !body.comment) {
      return NextResponse.json(
        { success: false, error: 'Product ID, customer name, rating, and comment are required' },
        { status: 400 }
      );
    }

    const newReview: ReviewRecord = {
      id: `rev-${Date.now()}`,
      productId: body.productId,
      productName: body.productName || 'Stride District Item',
      customerName: body.customerName,
      customerEmail: body.customerEmail || '',
      rating: Number(body.rating),
      title: body.title || 'Product Feedback',
      comment: body.comment,
      isVerified: Boolean(body.isVerified ?? true),
      status: 'pending', // Moderation required
      createdAt: new Date().toISOString(),
    };

    const created = await db.addReview(newReview);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
