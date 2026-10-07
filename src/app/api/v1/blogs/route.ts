import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const blogs = await db.getBlogs();
    return NextResponse.json({ success: true, data: blogs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, category, coverImage, author, tags, readTimeMinutes, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    const created = await db.createBlog(
      {
        title,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        excerpt: excerpt || title,
        content,
        category: category || 'Culture & Grails',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
        author: author || {
          name: 'Marcus Chen',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          role: 'Head of Authenticity',
        },
        publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTimeMinutes: Number(readTimeMinutes) || 5,
        tags: tags || ['Streetwear', 'Culture', 'Grails'],
        status: status || 'published',
      },
      'District Admin'
    );

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
