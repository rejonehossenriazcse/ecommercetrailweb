import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const inquiries = await db.getInquiries();
    return NextResponse.json({ success: true, data: inquiries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message, orderNumber } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const created = await db.createInquiry({
      name,
      email,
      phone,
      subject: subject || 'General Stride District Inquiry',
      message,
      orderNumber,
    });

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Your inquiry has been received by the Stride District Concierge. An advisor will respond within 4 business hours.',
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
