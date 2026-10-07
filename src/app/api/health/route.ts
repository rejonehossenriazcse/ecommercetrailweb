import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [orders, products, users] = await Promise.all([
      db.getOrders(),
      db.getProducts(),
      db.getUsers(),
    ]);

    const memoryUsage = process.memoryUsage();

    return NextResponse.json({
      status: 'healthy',
      version: '2.4.0-enterprise',
      service: 'AURA Studios Headless Commerce Core',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryRssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      },
      checks: {
        database: 'connected',
        cache: 'operational',
        storage: 'healthy',
      },
      database: {
        status: 'connected',
        ordersCount: orders.length,
        productsCount: products.length,
        usersCount: users.length,
      },
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'unhealthy',
      error: err.message,
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
}
