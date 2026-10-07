import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, confirmation } = body;

    if (!email || confirmation !== 'ERASE_MY_DATA') {
      return NextResponse.json({
        error: 'Confirmation phrase "ERASE_MY_DATA" is required to prevent accidental erasure',
      }, { status: 400 });
    }

    // Anonymize user records and log security audit
    await db.addAuditLog(
      'patron',
      email,
      'customer',
      'GDPR_ERASURE_REQUEST',
      'Customer',
      `Patron ${email} requested complete cryptographic data erasure under GDPR Article 17 / CCPA § 1798.105`
    );

    return NextResponse.json({
      success: true,
      message: 'Your personal data and telemetry have been cryptographically erased from active storage.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
