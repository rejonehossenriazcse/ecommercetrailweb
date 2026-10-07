import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Customer email required' }, { status: 400 });
    }

    const customers = await db.getCustomers();
    const customer = customers.find((c) => c.email.toLowerCase() === email.toLowerCase());

    const allOrders = await db.getOrders();
    const customerOrders = allOrders.filter(
      (o) => o.customerEmail.toLowerCase() === email.toLowerCase() || (customer && o.customerId === customer.id)
    );

    const subscribers = await db.getSubscribers();
    const subscription = subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());

    const exportDossier = {
      exportMetadata: {
        legalFramework: 'GDPR Article 20 (Right to Data Portability) & CCPA § 1798.100',
        issuedBy: 'AURA Studios International SA (Zurich Data Controller)',
        timestamp: new Date().toISOString(),
        subjectEmail: email,
      },
      profile: customer || { email, status: 'guest' },
      orders: customerOrders.map((o) => ({
        orderNumber: o.orderNumber,
        date: o.createdAt,
        total: o.total,
        currency: o.currency,
        paymentStatus: o.paymentStatus,
        fulfillmentStatus: o.fulfillmentStatus,
        shippingAddress: o.shippingAddress,
        items: o.items.map((i) => ({ name: i.name, sku: i.sku, quantity: i.quantity, price: i.price })),
      })),
      newsletterSubscription: subscription || null,
    };

    return NextResponse.json({
      success: true,
      dossier: exportDossier,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
