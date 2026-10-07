import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Product } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { products: newProducts } = body;

    if (!Array.isArray(newProducts) || newProducts.length === 0) {
      return NextResponse.json({ error: 'Array of products required for bulk import' }, { status: 400 });
    }

    const currentProducts = await db.getProducts();
    let importedCount = 0;
    let updatedCount = 0;

    newProducts.forEach((p: Partial<Product>) => {
      if (!p.name || !p.sku) return;

      const existingIndex = currentProducts.findIndex((cp) => cp.sku === p.sku || cp.id === p.id);
      if (existingIndex >= 0) {
        currentProducts[existingIndex] = {
          ...currentProducts[existingIndex],
          ...p,
          updatedAt: new Date().toISOString(),
        } as Product;
        updatedCount++;
      } else {
        const newProd: Product = {
          id: p.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: p.name,
          brand: p.brand || 'Stride District',
          category: p.category || 'Sneakers',
          categorySlug: p.categorySlug || 'sneakers',
          tags: p.tags || ['Streetwear', 'Heat'],
          sku: p.sku,
          price: Number(p.price) || 120,
          compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
          stock: Number(p.stock) || 10,
          stockStatus: (Number(p.stock) || 10) > 0 ? 'in_stock' : 'out_of_stock',
          badges: p.badges || ['New Drop'],
          rating: p.rating || 5.0,
          reviewCount: p.reviewCount || 1,
          images: p.images || [p.thumbnail || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'],
          thumbnail: p.thumbnail || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
          shortDescription: p.shortDescription || p.name,
          description: p.description || p.shortDescription || p.name,
          options: p.options || [],
          variants: p.variants || [],
          specifications: p.specifications || [],
          createdAt: p.createdAt || new Date().toISOString(),
        };
        currentProducts.push(newProd);
        importedCount++;
      }
    });

    await db.addAuditLog(
      'admin',
      'Catalog Administrator',
      'super_admin',
      'PRODUCT_BULK_IMPORT',
      'Product',
      `Bulk import completed: ${importedCount} created, ${updatedCount} updated`
    );

    return NextResponse.json({
      success: true,
      importedCount,
      updatedCount,
      totalCatalogSize: currentProducts.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Bulk import failed' }, { status: 500 });
  }
}
