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
          courier: { provider: order.courier?.provider, trackingCode: order.courier?.trackingCode },
          timeline: order.timeline.map((event) => ({ status: event.status, timestamp: event.timestamp })),
          createdAt: order.createdAt,
        },
      });
    }

    return NextResponse.json({ error: 'Order lookup is temporarily unavailable.' }, { status: 503 });
  } catch (error) {
    console.error('Order GET by orderNumber error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order details' },
      { status: 500 }
    );
  }
}
