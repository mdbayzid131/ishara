import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/connect';
import { Product, IProduct, IProductVariant } from '@/models/Product';
import { Order, IOrder, IOrderItem } from '@/models/Order';
import { normalizePhone } from '@/lib/phone';
import { getDeliveryPricing } from '@/lib/store';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/security/rateLimit';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  variantSku: z.string().optional().default(''),
  quantity: z.number().int().min(1).max(50),
});

const createOrderSchema = z.object({
  expectedTotal: z.number().min(0).optional(),
  customer: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    phone: z
      .string()
      .trim()
      .transform(normalizePhone)
      .refine(
        (val) => /^01[3-9]\d{8}$/.test(val),
        'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01711223344)'
      ),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().trim().min(8, 'Please provide a detailed street/delivery address'),
    deliveryZone: z.enum(['inside_dhaka', 'outside_dhaka']),
    notes: z.string().optional().default(''),
  }),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one product').max(100),
  marketing: z
    .object({
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      utmTerm: z.string().optional(),
      utmContent: z.string().optional(),
    })
    .optional(),
});

function generateOrderNumber(): string {
  const date = new Date();
  const yy = date.getFullYear().toString().slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const randomSuffix = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `ISH-${yy}${mm}-${randomSuffix}`;
}

function orderResponse(order: IOrder) {
  return NextResponse.json({ success: true, orderNumber: order.orderNumber, accessToken: order.accessToken, order: {
    orderNumber: order.orderNumber, customer: order.customer, items: order.items,
    subtotal: order.subtotal, deliveryFee: order.deliveryFee, totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod, status: order.status, createdAt: order.createdAt,
  } });
}

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, {
      windowMs: 60 * 1000,
      max: 10,
      keyPrefix: 'orders_create',
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'Too many order requests. Please wait a moment before trying again.',
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
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid order data' },
        { status: 400 }
      );
    }

    const { customer, items } = parsed.data;
    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json({ error: 'Ordering is temporarily unavailable. Your bag has been kept. Please try again later.' }, { status: 503 });
    }
    const idempotencyKey = req.headers.get('Idempotency-Key');
    if (idempotencyKey && !/^[a-zA-Z0-9-]{16,100}$/.test(idempotencyKey)) return NextResponse.json({ error: 'Invalid request key' }, { status: 400 });
    if (idempotencyKey) {
      const previous = await Order.findOne({ idempotencyKey });
      if (previous) return orderResponse(previous);
    }
    const session = await mongoose.startSession();
    try {
      const createdOrder = await session.withTransaction(async () => {
      const orderItemSnapshots: IOrderItem[] = [];
      let subtotal = 0;
      // 1. Process and atomically deduct each item from MongoDB
      for (const item of items) {
        const isObjectId = mongoose.Types.ObjectId.isValid(item.productId);
        const productFilter: Record<string, unknown> = isObjectId
          ? { _id: item.productId, status: 'published' }
          : { slug: item.productId, status: 'published' };

        let updatedProduct: IProduct | null = null;

        if (item.variantSku) {
          // Atomically decrement variant stock and total stock
          updatedProduct = await Product.findOneAndUpdate(
            {
              ...productFilter,
              hasVariants: true,
              variants: { $elemMatch: { sku: item.variantSku, stock: { $gte: item.quantity } } },
            },
            {
              $inc: {
                'variants.$.stock': -item.quantity,
                totalStock: -item.quantity,
                salesCount: item.quantity,
              },
            },
            { returnDocument: 'after', session }
          );
        } else {
          // Atomically decrement product totalStock (non-variant item)
          updatedProduct = await Product.findOneAndUpdate(
            {
              ...productFilter,
              hasVariants: false,
              totalStock: { $gte: item.quantity },
            },
            {
              $inc: {
                totalStock: -item.quantity,
                salesCount: item.quantity,
              },
            },
            { returnDocument: 'after', session }
          );
        }

        if (!updatedProduct) throw new Error('STOCK_UNAVAILABLE');

        // Resolve snapshot pricing & details from authoritative database document
        let matchedVariant: IProductVariant | null = null;
        if (item.variantSku && updatedProduct.variants) {
          const found = updatedProduct.variants.find((v) => v.sku === item.variantSku);
          if (found) {
            matchedVariant = found as unknown as IProductVariant;
          }
        }

        const unitPrice =
          matchedVariant?.price !== undefined && matchedVariant?.price !== null
            ? matchedVariant.price
            : updatedProduct.basePrice;

        const itemSubtotal = unitPrice * item.quantity;
        subtotal += itemSubtotal;

        orderItemSnapshots.push({
          productId: String(updatedProduct._id),
          variantSku: item.variantSku || '',
          title: updatedProduct.title,
          variantName: matchedVariant?.name || '',
          price: unitPrice,
          quantity: item.quantity,
          image:
            matchedVariant?.image ||
            (updatedProduct.images && updatedProduct.images[0]) ||
            '/images/placeholder.jpg',
          subtotal: itemSubtotal,
        });
      }

      const { zone: selectedZoneConfig, deliveryFee } = await getDeliveryPricing(customer.deliveryZone, subtotal);
      const totalAmount = subtotal + deliveryFee;
      if (parsed.data.expectedTotal !== undefined && Math.abs(parsed.data.expectedTotal - totalAmount) > 0.01) throw new Error('PRICE_CHANGED');

      // Unique Order Number Generation
      let orderNumber = generateOrderNumber();
      while (await Order.exists({ orderNumber })) {
        orderNumber = generateOrderNumber();
      }

      const accessToken = crypto.randomBytes(24).toString('hex');

      // Create Order Document
      const [createdOrder] = await Order.create([{
        orderNumber,
        idempotencyKey: idempotencyKey || undefined,
        accessToken,
        customer: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email || undefined,
          address: customer.address,
          deliveryZone: customer.deliveryZone,
          deliveryZoneName: selectedZoneConfig.name,
          notes: customer.notes || '',
        },
        items: orderItemSnapshots,
        subtotal,
        deliveryFee,
        discount: 0,
        totalAmount,
        paymentMethod: 'COD',
        paymentStatus: 'unpaid',
        status: 'pending',
        courier: {
          provider: 'Manual',
          trackingCode: '',
          consignmentId: '',
          notes: '',
        },
        marketing: parsed.data.marketing || {},
        timeline: [
          {
            status: 'pending',
            timestamp: new Date(),
            note: 'Order placed via Cash on Delivery (COD) guest checkout.',
            actor: 'Customer',
          },
        ],
      }], { session });
      return createdOrder;
      });

      return orderResponse(createdOrder);
    } finally {
      await session.endSession();
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'PRICE_CHANGED') {
      return NextResponse.json({ error: 'A price or delivery charge changed. Please review the updated total before placing your order.' }, { status: 409 });
    }
    // Concurrent retries may race the unique index; return the committed order.
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      const key = req.headers.get('Idempotency-Key');
      const previous = key ? await Order.findOne({ idempotencyKey: key }) : null;
      if (previous) return orderResponse(previous);
    }
    if (error instanceof Error && error.message === 'STOCK_UNAVAILABLE') {
      return NextResponse.json({ error: 'An item or selected option is no longer available in the requested quantity. Please update your bag.' }, { status: 409 });
    }
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while placing your order. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: true, count: 0, orders: [] });
    }

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(limit).lean();

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
