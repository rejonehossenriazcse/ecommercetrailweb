import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await db.getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, fulfillmentStatus, carrier, trackingNumber, action, refundAmount, reason, restock, returnStatus } = body;

    // Handle refund action
    if (action === 'refund') {
      const refunded = await db.processRefund(
        id,
        refundAmount || 0,
        reason || 'Customer RMA Request',
        restock !== undefined ? restock : true,
        'Executive Admin'
      );
      return NextResponse.json({ success: true, data: refunded });
    }

    // Handle cancel action
    if (action === 'cancel') {
      const cancelled = await db.cancelOrder(id, reason || 'Cancelled by store administrator', 'Executive Admin');
      return NextResponse.json({ success: true, data: cancelled });
    }

    // Handle RMA return review action
    if (action === 'update_return' || returnStatus) {
      const updatedReturn = await db.updateReturnStatus(
        id,
        returnStatus,
        reason || '',
        'Executive Admin'
      );
      return NextResponse.json({ success: true, data: updatedReturn });
    }

    const updated = await db.updateOrderStatus(
      id,
      status,
      fulfillmentStatus,
      carrier,
      trackingNumber,
      'Executive Admin'
    );

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
