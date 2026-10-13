import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStoreSetting extends Document {
  key: string;
  storeName: string;
  phone: string;
  supportEmail: string;
  insideDhakaFee: number;
  outsideDhakaFee: number;
  freeShippingThreshold: number;
  metaPixelId?: string;
  updatedAt: Date;
}

const StoreSettingSchema = new Schema<IStoreSetting>(
  {
    key: { type: String, required: true, unique: true, default: 'global_store_settings' },
    storeName: { type: String, default: 'Ishara Lifestyle' },
    phone: { type: String, default: '+880 1711-223344' },
    supportEmail: { type: String, default: 'support@ishara.com.bd' },
    insideDhakaFee: { type: Number, default: 70 },
    outsideDhakaFee: { type: Number, default: 130 },
    freeShippingThreshold: { type: Number, default: 3000 },
    metaPixelId: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const StoreSetting: Model<IStoreSetting> =
  mongoose.models.StoreSetting ||
  mongoose.model<IStoreSetting>('StoreSetting', StoreSettingSchema);
