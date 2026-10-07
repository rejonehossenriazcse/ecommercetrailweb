import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const processedPaypalEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const eventId = event.id || `pp_evt_${Date.now()}`;

    // Idempotency protection
    if (processedPaypalEvents.has(eventId)) {
      return NextResponse.json({
        received: true,
        status: 'duplicate_ignored',
        eventId,
      });
    }

    processedPaypalEvents.add(eventId);

    const eventType = event.event_type || 'PAYMENT.CAPTURE.COMPLETED';
    const resource = event.resource || {};
    const invoiceId = resource.invoice_id || resource.custom_id || resource.id;

    if (invoiceId) {
      const orders = await db.getOrders();
      const matchedOrder = orders.find(
        (o) => o.id === invoiceId || o.orderNumber === invoiceId
      );

      if (matchedOrder) {
        if (eventType === 'PAYMENT.CAPTURE.COMPLETED' || eventType === 'CHECKOUT.ORDER.APPROVED') {
          matchedOrder.paymentStatus = 'paid';
          if (matchedOrder.status === 'pending') matchedOrder.status = 'processing';
          matchedOrder.updatedAt = new Date().toISOString();

          await db.addAuditLog(
            'system',
            'PayPal IPN / Webhook Engine',
            'super_admin',
            'PAYPAL_PAYMENT_CAPTURED',
            'Order',
            `PayPal event ${eventId} settled order ${matchedOrder.orderNumber}`
          );
        } else if (eventType === 'PAYMENT.CAPTURE.REFUNDED') {
          matchedOrder.paymentStatus = 'refunded';
          matchedOrder.status = 'refunded';
          matchedOrder.updatedAt = new Date().toISOString();

          await db.addAuditLog(
            'system',
            'PayPal IPN / Webhook Engine',
            'super_admin',
            'PAYPAL_CHARGE_REFUNDED',
            'Order',
            `PayPal refund event ${eventId} logged for order ${matchedOrder.orderNumber}`
          );
        }
      }
    }

    return NextResponse.json({
      received: true,
      processed: true,
      eventType,
      eventId,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'PayPal webhook error' }, { status: 500 });
  }
}
