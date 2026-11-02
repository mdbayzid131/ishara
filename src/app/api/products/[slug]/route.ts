 import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connect';
import { Product } from '@/models/Product';
import { PRODUCTS } from '@/data/mockProducts';
import { STUDIO_PRODUCTS } from '@/data/studioCollection';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim();
    const db = await connectToDatabase();

    if (db) {
      const product = await Product.findOne({
        slug: cleanSlug,
        status: 'published',
      }).lean();

      if (product) {
        return NextResponse.json({
          success: true,
          product: {
            ...product,
            id: product._id.toString(),
            variants: product.variants.map((variant) => ({ ...variant, id: variant.sku })),
          },
        });
      }
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Fallback to in-memory mock catalog
    const mockProduct = [...STUDIO_PRODUCTS, ...PRODUCTS].find((p) => p.slug === cleanSlug);

    if (mockProduct) {
      return NextResponse.json({
        success: true,
        product: mockProduct,
      });
    }

    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Product GET by slug error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}
