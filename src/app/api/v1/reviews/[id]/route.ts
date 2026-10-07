import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.status || !['approved', 'rejected'].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status (approved or rejected) is required' },
        { status: 400 }
      );
    }

    const updated = await db.updateReviewStatus(id, body.status, 'Executive Admin');
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
