import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { MediaAssetRecord } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || undefined;
    const media = await db.getMediaAssets(folder);
    return NextResponse.json({
      success: true,
      count: media.length,
      data: media,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.url) {
      return NextResponse.json(
        { success: false, error: 'Asset name and URL are required' },
        { status: 400 }
      );
    }

    const newAsset: MediaAssetRecord = {
      id: `med-${Date.now()}`,
      name: body.name,
      url: body.url,
      folder: body.folder || 'Products',
      sizeBytes: body.sizeBytes || 250000,
      mimeType: body.mimeType || 'image/webp',
      dimensions: body.dimensions || '1920x1080',
      altText: body.altText || body.name,
      usageCount: 0,
      uploadedAt: new Date().toISOString(),
    };

    const saved = await db.addMediaAsset(newAsset, 'Executive Admin');
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
