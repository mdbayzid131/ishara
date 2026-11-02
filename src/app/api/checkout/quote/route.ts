import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/connect';
import { Product, IProduct, IProductVariant } from '@/models/Product';
import { PRODUCTS } from '@/data/mockProducts';
import { STUDIO_PRODUCTS } from '@/data/studioCollection';
import { getDeliveryPricing } from '@/lib/store';

const quoteRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantSku: z.string().optional().default(''),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1, 'Cart cannot be empty').max(100),
  deliveryZone: z.enum(['inside_dhaka', 'outside_dhaka']),
});

interface VerifiedQuoteItem {
  productId: string;
  slug: string;
  title: string;
  variantSku: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  itemTotal: number;
  image: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = quoteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid quote request', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { items, deliveryZone } = parsed.data;
    const db = await connectToDatabase();

    let subtotal = 0;
    const verifiedItems: VerifiedQuoteItem[] = [];
    const requestedStock = new Map<string, number>();

    for (const item of items) {
      let productDoc: (IProduct & { id?: string }) | null = null;
      let matchedVariant: IProductVariant | null = null;

      if (db) {
        // Try finding by MongoDB _id or slug
        const query: Record<string, unknown> = { status: 'published' };
        if (item.productId.match(/^[0-9a-fA-F]{24}$/)) {
          query._id = item.productId;
        } else {
          query.$or = [{ slug: item.productId }, { sku: item.productId }];
        }
        productDoc = (await Product.findOne(query).lean()) as unknown as (IProduct & { id?: string }) | null;
      }

      // Fallback lookup if not found in DB
      if (!db && !productDoc) {
        const fallback = [...STUDIO_PRODUCTS, ...PRODUCTS].find(
          (p) =>
            p.id === item.productId ||
            p.slug === item.productId ||
            p.variants.some((v) => v.sku === item.variantSku)
        );
        if (fallback) {
          productDoc = fallback as unknown as (IProduct & { id?: string });
        }
      }

      if (!productDoc) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }

      // Find variant if specified
      if (item.variantSku && productDoc.variants && productDoc.variants.length > 0) {
        const found = productDoc.variants.find((v) => v.sku === item.variantSku);
        if (found) {
          matchedVariant = found as unknown as IProductVariant;
        }
      }

      if ((productDoc.hasVariants && !matchedVariant) || (!productDoc.hasVariants && item.variantSku)) {
        return NextResponse.json({ error: `Please choose an available option for ${productDoc.title}.` }, { status: 400 });
      }

      const unitPrice =
        matchedVariant?.price !== undefined && matchedVariant?.price !== null
          ? matchedVariant.price
          : productDoc.basePrice;

      const availableStock = matchedVariant
        ? matchedVariant.stock
        : productDoc.totalStock;

      const stockKey = `${productDoc._id || productDoc.id}:${matchedVariant?.sku || ''}`;
      const requested = (requestedStock.get(stockKey) || 0) + item.quantity;
      requestedStock.set(stockKey, requested);
      if (availableStock < requested) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${productDoc.title}"${
              matchedVariant ? ` (${matchedVariant.name})` : ''
            }. Available: ${availableStock}, Requested: ${item.quantity}.`,
          },
          { status: 400 }
        );
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      verifiedItems.push({
        productId: productDoc._id ? String(productDoc._id) : (productDoc.id || ''),
        slug: productDoc.slug,
        title: productDoc.title,
        variantSku: matchedVariant?.sku || '',
        variantName: matchedVariant?.name || '',
        unitPrice,
        quantity: item.quantity,
        itemTotal,
        image:
          matchedVariant?.image ||
          (productDoc.images && productDoc.images[0]) ||
          '/images/placeholder.jpg',
      });
    }

    const { zone: selectedZoneConfig, deliveryFee, isFreeShipping } = await getDeliveryPricing(deliveryZone, subtotal);
    const totalAmount = subtotal + deliveryFee;

    return NextResponse.json({
      success: true,
      quote: {
        canOrder: Boolean(db),
        subtotal,
        deliveryFee,
        discount: 0,
        totalAmount,
        isFreeShipping,
        deliveryZone: selectedZoneConfig.id,
        deliveryZoneName: selectedZoneConfig.name,
        estimatedDelivery: selectedZoneConfig.estimatedDelivery,
        items: verifiedItems,
      },
    });
  } catch (error) {
    console.error('Quote calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate checkout quote' },
      { status: 500 }
    );
  }
}
