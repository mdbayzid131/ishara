import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface IOrderItem {
  productId: string;
  variantSku: string;
  title: string;
  variantName?: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export interface IOrderTimeline {
  status: OrderStatus;
  timestamp: Date;
  note: string;
  actor: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  accessToken: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    deliveryZone: string;
    deliveryZoneName: string;
    notes?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'COD';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  status: OrderStatus;
  courier?: {
    provider?: string;
    trackingCode?: string;
    consignmentId?: string;
    notes?: string;
  };
  marketing?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
  };
  timeline: IOrderTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    variantSku: { type: String, required: true },
    title: { type: String, required: true },
    variantName: { type: String },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderTimelineSchema = new Schema<IOrderTimeline>(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' },
    actor: { type: String, default: 'System' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    accessToken: { type: String, required: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true, index: true },
      email: { type: String, trim: true },
      address: { type: String, required: true, trim: true },
      deliveryZone: { type: String, required: true },
      deliveryZoneName: { type: String, required: true },
      notes: { type: String, default: '' },
    },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, default: 'COD' },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
      index: true,
    },
    courier: {
      provider: { type: String, default: '' },
      trackingCode: { type: String, default: '' },
      consignmentId: { type: String, default: '' },
      notes: { type: String, default: '' },
    },
    marketing: {
      utmSource: { type: String, default: '' },
      utmMedium: { type: String, default: '' },
      utmCampaign: { type: String, default: '' },
      utmTerm: { type: String, default: '' },
      utmContent: { type: String, default: '' },
    },
    timeline: { type: [OrderTimelineSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
