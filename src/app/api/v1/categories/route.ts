import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIES } from '@/data/mockData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      count: CATEGORIES.length,
      data: CATEGORIES,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
