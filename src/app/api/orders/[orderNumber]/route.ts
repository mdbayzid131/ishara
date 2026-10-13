import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connect';
import { Order } from '@/models/Order';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await context.params;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required' }, { status: 400 });
    }

    const cleanOrderNumber = orderNumber.toUpperCase().trim();
    const db = await connectToDatabase();

    // Check if requester is logged-in admin
    const adminCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isAdmin = adminCookie ? !!verifyAdminToken(adminCookie) : false;

    if (db) {
      const order = await Order.findOne({ orderNumber: cleanOrderNumber }).lean();

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Security check: Must supply matching guest accessToken or be authenticated admin
      if (!isAdmin && (!token || token !== order.accessToken)) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid or missing access token' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        order: {
          orderNumber: order.orderNumber,
          customer: {
            name: order.customer.name,
            phone: order.customer.phone,
            address: order.customer.address,
            deliveryZone: order.customer.deliveryZoneName,
            notes: order.customer.notes,
          },
          items: order.items,
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          discount: order.discount,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentMethod: order.paymentMethod,
          courier: order.courier,
          timeline: order.timeline,
          createdAt: order.createdAt,
        },
      });
    }

    // Fallback mode for local development without DB
    return NextResponse.json({
      success: true,
      order: {
        orderNumber: cleanOrderNumber,
        customer: {
          name: 'Valued Customer',
          phone: '01711223344',
          address: 'House 12, Road 4, Banani, Dhaka',
          deliveryZone: 'Inside Dhaka',
        },
        items: [],
        subtotal: 1850,
        deliveryFee: 70,
        discount: 0,
        totalAmount: 1920,
        status: 'pending',
        paymentMethod: 'COD',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Order GET by orderNumber error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order details' },
      { status: 500 }
    );
  }
}
