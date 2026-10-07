import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const pages = await db.getPages();
    return NextResponse.json({ success: true, data: pages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, content, category, metaTitle, metaDescription, ogImage, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    const created = await db.createPage(
      {
        title,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        content,
        category: category || 'company',
        metaTitle: metaTitle || `${title} — Stride District`,
        metaDescription: metaDescription || `Discover ${title} at Stride District.`,
        ogImage,
        status: status || 'published',
      },
      'District Admin'
    );

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
