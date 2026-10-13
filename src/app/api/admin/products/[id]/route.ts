import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/connect';
import { Product } from '@/models/Product';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';

const updateProductSchema = z.object({
  status: z.enum(['draft', 'published', 'archived']).optional(),
  basePrice: z.number().positive().optional(),
  compareAtPrice: z.number().positive().optional(),
  totalStock: z.number().min(0).optional(),
  badge: z.string().optional(),
  variants: z
    .array(
      z.object({
        sku: z.string(),
        name: z.string(),
        price: z.number().optional(),
        stock: z.number().min(0),
      })
    )
    .optional(),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid update payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (db) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = isObjectId ? { _id: id } : { slug: id };

      const updateData: Record<string, unknown> = { ...parsed.data };

      // If variants are provided, recompute totalStock
      if (parsed.data.variants && parsed.data.variants.length > 0) {
        updateData.totalStock = parsed.data.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
      }

      const updated = await Product.findOneAndUpdate(query, { $set: updateData }, { new: true }).lean();

      if (!updated) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Product updated successfully',
        product: updated,
      });
    }

    // Fallback mode for local development
    return NextResponse.json({
      success: true,
      message: 'Product updated in fallback mode',
      product: { id, ...parsed.data },
    });
  } catch (error) {
    console.error('Admin product PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
