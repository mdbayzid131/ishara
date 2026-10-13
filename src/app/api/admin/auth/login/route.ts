import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/connect';
import { Admin } from '@/models/Admin';
import { verifyPassword, signAdminToken, ADMIN_COOKIE_NAME, hashPassword } from '@/lib/auth';
import { checkRateLimit } from '@/lib/security/rateLimit';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, {
      windowMs: 60 * 1000,
      max: 5,
      keyPrefix: 'admin_login',
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please wait 1 minute before trying again.',
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
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid email or password format' },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const db = await connectToDatabase();

    let adminRecord = null;

    if (db) {
      adminRecord = await Admin.findOne({ email: email.toLowerCase() });
      if (!adminRecord) {
        // If no admin exists in the database at all yet, auto-create initial superadmin if credentials match default
        const count = await Admin.countDocuments();
        if (count === 0 && email.toLowerCase() === 'admin@ishara.com.bd' && password === 'IsharaAdmin2026!') {
          const passwordHash = await hashPassword(password);
          adminRecord = await Admin.create({
            username: 'admin',
            email: 'admin@ishara.com.bd',
            name: 'Ishara Super Admin',
            passwordHash,
            role: 'superadmin',
            isActive: true,
          });
        }
      }
    }

    // In local / fallback mode if DB is not configured yet
    if (!db && email.toLowerCase() === 'admin@ishara.com.bd' && password === 'IsharaAdmin2026!') {
      adminRecord = {
        _id: 'mock-admin-01',
        email: 'admin@ishara.com.bd',
        name: 'Ishara Super Admin',
        role: 'superadmin',
        isActive: true,
      };
    }

    if (!adminRecord) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password if fetched from DB with hash
    if ('passwordHash' in adminRecord) {
      const isValid = await verifyPassword(password, adminRecord.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    const token = signAdminToken({
      id: String(adminRecord._id),
      email: adminRecord.email,
      name: adminRecord.name,
      role: adminRecord.role,
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        email: adminRecord.email,
        name: adminRecord.name,
        role: adminRecord.role,
      },
    });

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
