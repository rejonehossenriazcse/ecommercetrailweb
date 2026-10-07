import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const products = await db.getProducts();
    const baseUrl = 'https://stridedistrict.com';

    const itemsXml = products
      .map((p) => {
        const availability = p.stock > 0 ? 'in_stock' : 'out_of_stock';
        return `
    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${p.description}]]></g:description>
      <g:link>${baseUrl}/product/${p.slug}</g:link>
      <g:image_link>${p.thumbnail}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${p.price.toFixed(2)} USD</g:price>
      <g:brand><![CDATA[${p.brand}]]></g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>Apparel &amp; Accessories &gt; Shoes</g:google_product_category>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard Insured</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>
    </item>`;
      })
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>STRIDE DISTRICT Google Shopping Merchant Feed</title>
    <link>${baseUrl}</link>
    <description>Curated verified authentic sneakers, grails, and streetwear culture.</description>
    ${itemsXml}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
