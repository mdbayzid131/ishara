import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizePhone } from '@/lib/phone';
import { connectToDatabase } from '@/lib/db/connect';
import { Order } from '@/models/Order';
import { checkRateLimit } from '@/lib/security/rateLimit';

const trackOrderSchema = z.object({
  orderNumber: z.string().trim().min(4, 'Order number is required'),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .refine((val) => /^01[3-9]\d{8}$/.test(val), 'Valid 11-digit mobile number is required'),
});

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, {
      windowMs: 60 * 1000,
      max: 20,
      keyPrefix: 'orders_track',
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'Too many tracking attempts. Please wait a moment before trying again.',
          retryAfter: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfterSeconds),
          },
        }
      );
    }

    const body = await req.json();
    const parsed = trackOrderSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue ? issue.message : 'Invalid tracking request' },
        { status: 400 }
      );
    }

    const { orderNumber, phone } = parsed.data;
    const cleanOrderNumber = orderNumber.toUpperCase();

    const db = await connectToDatabase();

    if (db) {
      const order = await Order.findOne({
        orderNumber: cleanOrderNumber,
        'customer.phone': phone,
      }).lean();

      if (order) {
        return NextResponse.json({
          success: true,
          order: {
            orderNumber: order.orderNumber,
            status: order.status,
            customerName: order.customer.name,
            deliveryZone: order.customer.deliveryZoneName,
            totalAmount: order.totalAmount,
            courierName: order.courier?.provider || 'Not assigned yet',
            trackingCode: order.courier?.trackingCode || '',
            itemsCount: order.items?.length || 1,
            timeline: order.timeline.map((event) => ({ status: event.status, timestamp: event.timestamp })),
            createdAt: order.createdAt,
          },
        });
      }

      // If DB is connected and no order found with this number and phone, return 404
      return NextResponse.json(
        { error: 'No order found matching this Order Number and Phone Number. Please check your information and try again.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'No order found matching this Order Number and Phone Number. Please check your information and try again.' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to look up order. Please try again shortly.' },
      { status: 500 }
    );
  }
}
