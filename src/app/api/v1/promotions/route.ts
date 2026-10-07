import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (code) {
      const promo = await db.getPromotionByCode(code);
      if (!promo) {
        return NextResponse.json(
          { success: false, valid: false, error: 'Invalid or expired promo code' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, valid: true, data: promo });
    }

    const promos = await db.getPromotions();
    return NextResponse.json({ success: true, data: promos });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, type, value, minSpend, description, usageLimit, startDate, endDate } = body;

    if (!code || value === undefined) {
      return NextResponse.json({ error: 'Promotion code and value are required' }, { status: 400 });
    }

    const created = await db.createPromotion(
      {
        code: code.toUpperCase(),
        type: type || 'percentage',
        value: Number(value),
        minSpend: Number(minSpend) || 0,
        description: description || `${value}${type === 'percentage' ? '%' : '$'} drop discount`,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || '2026-12-31T23:59:59Z',
        isActive: true,
      },
      'District Admin'
    );

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
