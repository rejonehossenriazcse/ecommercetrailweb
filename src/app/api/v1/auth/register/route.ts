import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const customerData = {
      id: `cust-${Date.now()}`,
      userId: `user-${Date.now()}`,
      name,
      email,
      phone: '', // Can be added later
      defaultShippingAddress: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
      // Password checking would be here
    };

    const newCustomer = await db.createCustomer(customerData, 'Self Registration');

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: newCustomer,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
