import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let orders = await db.getOrders();

    if (status) {
      orders = orders.filter((o) => o.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Simulate order placement
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `STRIDE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: body.customerName || 'Streetwear Collector',
      customerEmail: body.customerEmail || 'collector@stridedistrict.com',
      status: body.status || 'processing',
      paymentStatus: body.paymentStatus || 'paid',
      paymentMethod: body.paymentMethod || 'Stripe Credit Card',
      fulfillmentStatus: body.fulfillmentStatus || 'unfulfilled',
      currency: body.currency || 'USD',
      subtotal: body.subtotal || 0,
      discount: body.discount || 0,
      shipping: body.shipping || 0,
      tax: body.tax || 0,
      total: body.total || 0,
      items: body.items || [],
      shippingAddress: body.shippingAddress || {
        street: '540 Broadway, Apt 3B',
        city: 'New York',
        state: 'NY',
        zip: '10012',
        country: 'US',
      },
      billingAddress: body.billingAddress || {
        street: '540 Broadway, Apt 3B',
        city: body.billingAddress?.city || body.shippingAddress?.city || 'New York',
        state: body.billingAddress?.state || body.shippingAddress?.state || 'NY',
        zip: body.billingAddress?.zip || body.shippingAddress?.zip || '10012',
        country: body.billingAddress?.country || body.shippingAddress?.country || 'US',
      },
      carrier: body.carrier || 'UPS Worldwide Express',
      trackingNumber: body.trackingNumber || `UPS-1Z${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      couponCode: body.couponCode,
      internalNotes: body.notes || 'Order confirmed via Stride District storefront checkout.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save order in database singleton
    await db.createOrder(newOrder);

    // Deduct stock for each ordered item from multi-warehouse inventory
    for (const item of newOrder.items) {
      await db.adjustStock(item.productId, -item.quantity, 'ORDER_FULFILLMENT', 'Storefront Checkout');
    }

    await db.addAuditLog(
      'system',
      'Checkout Engine',
      'customer',
      'ORDER_CREATED',
      'Order',
      `New order confirmed: ${newOrder.orderNumber} for ${newOrder.customerEmail} ($${newOrder.total})`
    );

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
