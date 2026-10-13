import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import mongoose, { Types } from 'mongoose';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/connect';
import { Product, IProduct, IProductVariant } from '@/models/Product';
import { Order, IOrderItem } from '@/models/Order';
import { PRODUCTS } from '@/data/mockProducts';
import { DELIVERY_ZONES, FREE_SHIPPING_THRESHOLD } from '@/config/delivery';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  variantSku: z.string().optional().default(''),
  quantity: z.number().int().min(1).max(50),
});

const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    phone: z
      .string()
      .trim()
      .transform((val) => val.replace(/[^0-9]/g, ''))
      .refine(
        (val) => /^01[3-9]\d{8}$/.test(val),
        'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01711223344)'
      ),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().trim().min(8, 'Please provide a detailed street/delivery address'),
    deliveryZone: z.enum(['inside_dhaka', 'outside_dhaka']),
    notes: z.string().optional().default(''),
  }),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one product'),
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
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ISH-${yy}${mm}-${randomSuffix}`;
}

export async function POST(req: NextRequest) {
  try {
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

    const selectedZoneConfig =
      DELIVERY_ZONES.find((z) => z.id === customer.deliveryZone) || DELIVERY_ZONES[0];

    const decrementedRollbackList: Array<{
      productId: Types.ObjectId | string;
      variantSku?: string;
      quantity: number;
    }> = [];

    const orderItemSnapshots: IOrderItem[] = [];
    let subtotal = 0;

    if (db) {
      // 1. Process and atomically deduct each item from MongoDB
      for (const item of items) {
        const isObjectId = mongoose.Types.ObjectId.isValid(item.productId);
        const productFilter: Record<string, unknown> = isObjectId
          ? { _id: item.productId }
          : { slug: item.productId };

        let updatedProduct: IProduct | null = null;

        if (item.variantSku) {
          // Atomically decrement variant stock and total stock
          updatedProduct = await Product.findOneAndUpdate(
            {
              ...productFilter,
              'variants.sku': item.variantSku,
              'variants.stock': { $gte: item.quantity },
            },
            {
              $inc: {
                'variants.$.stock': -item.quantity,
                totalStock: -item.quantity,
                salesCount: item.quantity,
              },
            },
            { new: true }
          );
        } else {
          // Atomically decrement product totalStock (non-variant item)
          updatedProduct = await Product.findOneAndUpdate(
            {
              ...productFilter,
              totalStock: { $gte: item.quantity },
            },
            {
              $inc: {
                totalStock: -item.quantity,
                salesCount: item.quantity,
              },
            },
            { new: true }
          );
        }

        // If update failed, rollback all previously decremented items
        if (!updatedProduct) {
          for (const rollback of decrementedRollbackList) {
            if (rollback.variantSku) {
              await Product.findOneAndUpdate(
                { _id: rollback.productId, 'variants.sku': rollback.variantSku },
                {
                  $inc: {
                    'variants.$.stock': rollback.quantity,
                    totalStock: rollback.quantity,
                    salesCount: -rollback.quantity,
                  },
                }
              );
            } else {
              await Product.findOneAndUpdate(
                { _id: rollback.productId },
                {
                  $inc: {
                    totalStock: rollback.quantity,
                    salesCount: -rollback.quantity,
                  },
                }
              );
            }
          }

          // Fetch the product to give a friendly error message
          const existing = await Product.findOne(productFilter).lean();
          const itemName = existing ? existing.title : item.productId;
          return NextResponse.json(
            {
              error: `Item "${itemName}" is currently out of stock or does not have sufficient quantity for your order.`,
            },
            { status: 400 }
          );
        }

        // Track for rollback in case subsequent item fails
        decrementedRollbackList.push({
          productId: updatedProduct._id as Types.ObjectId,
          variantSku: item.variantSku || undefined,
          quantity: item.quantity,
        });

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

      // Calculate final pricing
      const isFreeShipping =
        customer.deliveryZone === 'inside_dhaka' && subtotal >= FREE_SHIPPING_THRESHOLD;
      const deliveryFee = isFreeShipping ? 0 : selectedZoneConfig.fee;
      const totalAmount = subtotal + deliveryFee;

      // Unique Order Number Generation
      let orderNumber = generateOrderNumber();
      while (await Order.exists({ orderNumber })) {
        orderNumber = generateOrderNumber();
      }

      const accessToken = crypto.randomBytes(24).toString('hex');

      // Create Order Document
      const createdOrder = await Order.create({
        orderNumber,
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
      });

      return NextResponse.json({
        success: true,
        orderNumber: createdOrder.orderNumber,
        accessToken: createdOrder.accessToken,
        order: {
          orderNumber: createdOrder.orderNumber,
          customer: createdOrder.customer,
          items: createdOrder.items,
          subtotal: createdOrder.subtotal,
          deliveryFee: createdOrder.deliveryFee,
          totalAmount: createdOrder.totalAmount,
          status: createdOrder.status,
          createdAt: createdOrder.createdAt,
        },
      });
    }

    // 2. Fallback Mode (when MongoDB is not connected in local development)
    for (const item of items) {
      const mockProd = PRODUCTS.find(
        (p) =>
          p.id === item.productId ||
          p.slug === item.productId ||
          p.variants.some((v) => v.sku === item.variantSku)
      );

      if (!mockProd) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }

      const matchedVariant = item.variantSku
        ? mockProd.variants.find((v) => v.sku === item.variantSku)
        : null;

      const unitPrice =
        matchedVariant?.price !== undefined && matchedVariant?.price !== null
          ? matchedVariant.price
          : mockProd.basePrice;

      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      orderItemSnapshots.push({
        productId: mockProd.id,
        variantSku: item.variantSku || '',
        title: mockProd.title,
        variantName: matchedVariant?.name || '',
        price: unitPrice,
        quantity: item.quantity,
        image:
          matchedVariant?.image ||
          (mockProd.images && mockProd.images[0]) ||
          '/images/placeholder.jpg',
        subtotal: itemSubtotal,
      });
    }

    const isFreeShipping =
      customer.deliveryZone === 'inside_dhaka' && subtotal >= FREE_SHIPPING_THRESHOLD;
    const deliveryFee = isFreeShipping ? 0 : selectedZoneConfig.fee;
    const totalAmount = subtotal + deliveryFee;
    const orderNumber = generateOrderNumber();
    const accessToken = crypto.randomBytes(24).toString('hex');

    const fallbackOrder = {
      orderNumber,
      accessToken,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
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
      status: 'pending',
      paymentMethod: 'COD',
      marketing: parsed.data.marketing || {},
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      orderNumber,
      accessToken,
      order: fallbackOrder,
    });
  } catch (error) {
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
