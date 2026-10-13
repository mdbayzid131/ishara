import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connect';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { PRODUCTS } from '@/data/mockProducts';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectToDatabase();

    if (db) {
      // 1. Order aggregation metrics
      const [orderStats, statusCounts, lowStockProducts, recentOrders] = await Promise.all([
        Order.aggregate([
          { $match: { status: { $ne: 'cancelled' } } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$totalAmount' },
              totalOrders: { $sum: 1 },
            },
          },
        ]),
        Order.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ]),
        Product.find({
          status: 'published',
          $or: [{ totalStock: { $lte: 10 } }, { 'variants.stock': { $lte: 5 } }],
        })
          .limit(10)
          .lean(),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

      const countsMap: Record<string, number> = {};
      statusCounts.forEach((s) => {
        countsMap[s._id] = s.count;
      });

      const totalRevenue = orderStats[0]?.totalRevenue || 0;
      const totalOrders = orderStats[0]?.totalOrders || 0;

      return NextResponse.json({
        success: true,
        stats: {
          totalRevenue,
          totalOrders,
          pendingOrders: countsMap['pending'] || 0,
          confirmedOrders: countsMap['confirmed'] || 0,
          processingOrders: countsMap['processing'] || 0,
          shippedOrders: countsMap['shipped'] || 0,
          deliveredOrders: countsMap['delivered'] || 0,
          cancelledOrders: countsMap['cancelled'] || 0,
          lowStockCount: lowStockProducts.length,
          lowStockItems: lowStockProducts.map((p) => ({
            id: String(p._id),
            title: p.title,
            slug: p.slug,
            totalStock: p.totalStock,
            variants: p.variants || [],
          })),
          recentOrders: recentOrders.map((o) => ({
            id: o.orderNumber,
            customer: o.customer.name,
            phone: o.customer.phone,
            zone: o.customer.deliveryZoneName,
            itemsCount: o.items.length,
            total: o.totalAmount,
            status: o.status,
            createdAt: o.createdAt,
          })),
        },
      });
    }

    // 2. Fallback mode (when MongoDB is not connected in local development)
    const fallbackLowStock = PRODUCTS.filter((p) => p.totalStock < 25);
    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: 24580,
        totalOrders: 14,
        pendingOrders: 3,
        confirmedOrders: 4,
        processingOrders: 2,
        shippedOrders: 3,
        deliveredOrders: 2,
        cancelledOrders: 0,
        lowStockCount: fallbackLowStock.length,
        lowStockItems: fallbackLowStock.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          totalStock: p.totalStock,
          variants: p.variants,
        })),
        recentOrders: [
          {
            id: 'ISH-2610-8421',
            customer: 'Tasmia Haque',
            phone: '01712998877',
            zone: 'Inside Dhaka',
            itemsCount: 2,
            total: 3140,
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'ISH-2610-8419',
            customer: 'Mahmudul Hasan',
            phone: '01819554433',
            zone: 'Outside Dhaka',
            itemsCount: 1,
            total: 1980,
            status: 'confirmed',
            createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          },
        ],
      },
    });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'digest' in error && String((error as { digest: string }).digest).startsWith('NEXT_PRERENDER_')) {
      throw error;
    }
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to compute admin statistics' }, { status: 500 });
  }
}
