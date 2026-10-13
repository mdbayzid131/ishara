import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/connect';
import { Product } from '@/models/Product';
import { PRODUCTS } from '@/data/mockProducts';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';

const createProductSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1),
  categorySlug: z.string().min(1),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  images: z.array(z.string()).default([]),
  hasVariants: z.boolean().default(false),
  variants: z
    .array(
      z.object({
        sku: z.string(),
        name: z.string(),
        attributes: z.record(z.string(), z.string()).optional(),
        price: z.number().optional(),
        stock: z.number().min(0),
        image: z.string().optional(),
      })
    )
    .default([]),
  isFeatured: z.boolean().default(false),
  badge: z.string().optional(),
  totalStock: z.number().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort') || 'featured';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const db = await connectToDatabase();

    if (db) {
      const filter: Record<string, unknown> = { status: 'published' };
      if (category && category !== 'all') {
        filter.categorySlug = category;
      }
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ];
      }

      let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
      if (sort === 'price-asc') sortOptions = { basePrice: 1 };
      if (sort === 'price-desc') sortOptions = { basePrice: -1 };
      if (sort === 'bestseller') sortOptions = { salesCount: -1 };

      const products = await Product.find(filter)
        .sort(sortOptions)
        .limit(limit)
        .lean();

      if (products.length > 0) {
        return NextResponse.json({ success: true, count: products.length, products });
      }
    }

    // Fallback to in-memory catalog
    let list = [...PRODUCTS];
    if (category && category !== 'all') {
      list = list.filter((p) => p.categorySlug === category);
    }
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({ success: true, count: list.length, products: list });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not connected. Please set MONGODB_URI in .env' },
        { status: 503 }
      );
    }

    const newProduct = await Product.create(result.data);
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
