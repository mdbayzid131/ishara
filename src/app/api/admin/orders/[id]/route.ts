import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/connect';
import { Order, OrderStatus } from '@/models/Order';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';

const updateOrderSchema = z.object({
  status: z
    .enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])
    .optional(),
  courier: z
    .object({
      provider: z.string().optional(),
      trackingCode: z.string().optional(),
      consignmentId: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  adminNote: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const db = await connectToDatabase();

    if (db) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = isObjectId ? { _id: id } : { orderNumber: id.toUpperCase() };
      const order = await Order.findOne(query).lean();

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 });
  } catch (error) {
    console.error('Admin order GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve order' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const parsed = updateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid update payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { status, courier, adminNote } = parsed.data;
    const db = await connectToDatabase();

    if (db) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = isObjectId ? { _id: id } : { orderNumber: id.toUpperCase() };

      const existingOrder = await Order.findOne(query);
      if (!existingOrder) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      const updateData: Record<string, unknown> = {};
      const newTimelineEvents = [];

      if (status && status !== existingOrder.status) {
        updateData.status = status;
        newTimelineEvents.push({
          status: status as OrderStatus,
          timestamp: new Date(),
          note: adminNote || `Order status updated from ${existingOrder.status} to ${status}.`,
          actor: admin.name || 'Admin',
        });
      } else if (adminNote) {
        newTimelineEvents.push({
          status: existingOrder.status,
          timestamp: new Date(),
          note: adminNote,
          actor: admin.name || 'Admin',
        });
      }

      if (courier) {
        updateData.courier = {
          provider: courier.provider !== undefined ? courier.provider : (existingOrder.courier?.provider || ''),
          trackingCode: courier.trackingCode !== undefined ? courier.trackingCode : (existingOrder.courier?.trackingCode || ''),
          consignmentId: courier.consignmentId !== undefined ? courier.consignmentId : (existingOrder.courier?.consignmentId || ''),
          notes: courier.notes !== undefined ? courier.notes : (existingOrder.courier?.notes || ''),
        };

        if (courier.trackingCode && courier.trackingCode !== existingOrder.courier?.trackingCode) {
          newTimelineEvents.push({
            status: existingOrder.status,
            timestamp: new Date(),
            note: `Assigned courier tracking code: ${courier.provider || 'Courier'} - ${courier.trackingCode}`,
            actor: admin.name || 'Admin',
          });
        }
      }

      const updateQuery: Record<string, unknown> = { $set: updateData };
      if (newTimelineEvents.length > 0) {
        updateQuery.$push = { timeline: { $each: newTimelineEvents } };
      }

      const updated = await Order.findOneAndUpdate(query, updateQuery, { new: true }).lean();

      return NextResponse.json({
        success: true,
        message: 'Order updated successfully',
        order: updated,
      });
    }

    // Fallback mode for local development
    return NextResponse.json({
      success: true,
      message: 'Order updated in fallback mode',
      order: {
        orderNumber: id,
        status: status || 'confirmed',
        courier: courier || { provider: 'Steadfast', trackingCode: 'STDF-DEMO123' },
      },
    });
  } catch (error) {
    console.error('Admin order PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const db = await connectToDatabase();
    if (db) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = isObjectId ? { _id: id } : { orderNumber: id.toUpperCase() };

      const deleted = await Order.findOneAndDelete(query);
      if (!deleted) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Order removed successfully' });
    }

    return NextResponse.json({ success: true, message: 'Order removed in fallback mode' });
  } catch (error) {
    console.error('Admin order DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
