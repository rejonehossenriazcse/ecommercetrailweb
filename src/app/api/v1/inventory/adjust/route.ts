import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, changeQuantity, reason } = body;

    if (!productId || changeQuantity === undefined) {
      return NextResponse.json({ error: 'productId and changeQuantity are required' }, { status: 400 });
    }

    const updated = await db.adjustStock(
      productId,
      Number(changeQuantity),
      reason || 'MANUAL_ADJUSTMENT',
      'Executive Admin'
    );

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
