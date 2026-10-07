import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Product } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const search = searchParams.get('search') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const badge = searchParams.get('badge') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const queryResult = await db.queryProducts({
      category,
      brand,
      search,
      tag,
      badge,
      sort,
      minPrice,
      maxPrice,
      inStockOnly,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      count: queryResult.products.length,
      total: queryResult.total,
      page: queryResult.page,
      limit: queryResult.limit,
      totalPages: queryResult.totalPages,
      facets: queryResult.facets,
      data: queryResult.products,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, brand, category, price, sku } = body;

    if (!name || !price || !sku) {
      return NextResponse.json({ error: 'Name, price, and SKU are required' }, { status: 400 });
    }

    const defaultThumbnail = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80';

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name,
      brand: brand || 'Stride District',
      category: category || 'Sneakers',
      categorySlug: (category || 'sneakers').toLowerCase().replace(/\s+/g, '-'),
      tags: body.tags || ['Streetwear', 'Heat'],
      sku,
      price: Number(price),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
      costPrice: body.costPrice ? Number(body.costPrice) : undefined,
      stock: Number(body.stock || 20),
      stockStatus: Number(body.stock || 20) > 0 ? 'in_stock' : 'out_of_stock',
      badges: body.badges || ['New Drop'],
      rating: 5.0,
      reviewCount: 0,
      thumbnail: body.thumbnail || defaultThumbnail,
      images: body.images && body.images.length > 0 ? body.images : [body.thumbnail || defaultThumbnail],
      shortDescription: body.shortDescription || 'Verified authentic streetwear drop engineered for high-heat styling.',
      description: body.description || '100% verified authentic deadstock with multi-point authentication and UV scan.',
      options: body.options || [],
      variants: body.variants || [],
      specifications: body.specifications || [],
      createdAt: new Date().toISOString(),
    };

    const created = await db.createProduct(newProduct, 'District Admin');
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
