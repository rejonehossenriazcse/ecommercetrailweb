import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db.deleteMediaAsset(id, 'Executive Admin');
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Media asset not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Media asset deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
