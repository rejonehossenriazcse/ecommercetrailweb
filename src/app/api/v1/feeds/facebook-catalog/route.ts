import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const products = await db.getProducts();
    const baseUrl = 'https://stridedistrict.com';

    const headers = [
      'id',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'brand',
      'google_product_category',
    ];

    const rows = products.map((p) => {
      const availability = p.stock > 0 ? 'in stock' : 'out of stock';
      const cleanTitle = `"${p.name.replace(/"/g, '""')}"`;
      const cleanDesc = `"${p.description.replace(/"/g, '""')}"`;
      const cleanBrand = `"${p.brand.replace(/"/g, '""')}"`;
      return [
        p.id,
        cleanTitle,
        cleanDesc,
        availability,
        'new',
        `${p.price.toFixed(2)} USD`,
        `${baseUrl}/product/${p.slug}`,
        p.thumbnail,
        cleanBrand,
        'Apparel & Accessories > Shoes',
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'inline; filename="facebook_catalog_feed.csv"',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
