import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const settings = await db.getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { general, superAdmin, payments, tracking, shipping, header, footer, seo, newSuperAdminPassword } = body;

    // Handle Super Admin email and password changes
    if (superAdmin?.email) {
      const users = await db.getUsers();
      const adminUser = users.find((u) => u.role === 'super_admin');
      if (adminUser) {
        await db.updateUserEmail(adminUser.id, superAdmin.email, 'Super Admin');
        if (newSuperAdminPassword) {
          const newHash = await hashPassword(newSuperAdminPassword);
          await db.updateUserPassword(adminUser.id, newHash, 'Super Admin');
        }
      }
    }

    const updated = await db.updateSettings(
      {
        general: general || undefined,
        superAdmin: superAdmin ? { email: superAdmin.email, updatedAt: new Date().toISOString() } : undefined,
        payments: payments || undefined,
        tracking: tracking || undefined,
        shipping: shipping || undefined,
        header: header !== undefined ? header : undefined,
        footer: footer !== undefined ? footer : undefined,
        seo: seo !== undefined ? seo : undefined,
      },
      'Super Admin'
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
