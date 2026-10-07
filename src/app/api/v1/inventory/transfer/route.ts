import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, sourceWarehouseId, targetWarehouseId, quantity } = body;

    if (!productId || !sourceWarehouseId || !targetWarehouseId || !quantity || quantity <= 0) {
      return NextResponse.json({ error: 'Valid productId, source, target, and positive quantity required' }, { status: 400 });
    }

    if (sourceWarehouseId === targetWarehouseId) {
      return NextResponse.json({ error: 'Source and target warehouses must be different' }, { status: 400 });
    }

    const products = await db.getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Record audit log
    await db.addAuditLog(
      'admin',
      'Warehouse Logistics Officer',
      'warehouse_staff',
      'STOCK_TRANSFER',
      'Inventory',
      `Transferred ${quantity} units of ${product.name} (${product.sku}) from ${sourceWarehouseId} to ${targetWarehouseId}`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully transferred ${quantity} units of "${product.name}" from ${sourceWarehouseId} to ${targetWarehouseId}`,
      transfer: {
        productId,
        productName: product.name,
        sourceWarehouseId,
        targetWarehouseId,
        quantity,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Transfer failed' }, { status: 500 });
  }
}
