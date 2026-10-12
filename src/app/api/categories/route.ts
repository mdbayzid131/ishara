import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/connect';
import { Category } from '@/models/Category';
import { CATEGORIES } from '@/data/mockProducts';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
      if (categories.length > 0) {
        return NextResponse.json({ success: true, categories });
      }
    }
    return NextResponse.json({ success: true, categories: CATEGORIES });
  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = categorySchema.safeParse(body);

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

    const newCategory = await Category.create(result.data);
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Categories POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
