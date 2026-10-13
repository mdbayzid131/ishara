import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/connect';
import { StoreSetting } from '@/models/StoreSetting';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';

const updateSettingsSchema = z.object({
  storeName: z.string().min(2).default('Ishara Lifestyle'),
  phone: z.string().min(5).default('+880 1711-223344'),
  supportEmail: z.string().email().default('support@ishara.com.bd'),
  insideDhakaFee: z.number().min(0).default(70),
  outsideDhakaFee: z.number().min(0).default(130),
  freeShippingThreshold: z.number().min(0).default(3000),
  metaPixelId: z.string().optional().default(''),
});

const DEFAULT_SETTINGS = {
  storeName: 'Ishara Lifestyle',
  phone: '+880 1711-223344',
  supportEmail: 'support@ishara.com.bd',
  insideDhakaFee: 70,
  outsideDhakaFee: 130,
  freeShippingThreshold: 3000,
  metaPixelId: '',
};

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const setting = await StoreSetting.findOne({ key: 'global_store_settings' }).lean();
      if (setting) {
        return NextResponse.json({ success: true, settings: setting });
      }
    }
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized backoffice access' }, { status: 401 });
    }

    const body = await req.json();
    const result = updateSettingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not connected. Please verify MongoDB connection.' },
        { status: 503 }
      );
    }

    const updated = await StoreSetting.findOneAndUpdate(
      { key: 'global_store_settings' },
      { $set: result.data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Failed to save store settings' }, { status: 500 });
  }
}
