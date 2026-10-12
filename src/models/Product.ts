import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductVariant {
  sku: string;
  name: string;
  attributes: Record<string, string>;
  price?: number;
  stock: number;
  image?: string;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  sku?: string;
  shortDescription: string;
  description: string;
  category: string;
  categorySlug: string;
  basePrice: number;
  compareAtPrice?: number;
  images: string[];
  hasVariants: boolean;
  variants: IProductVariant[];
  totalStock: number;
  salesCount: number;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isBestSeller: boolean;
  badge?: string;
  highlights: string[];
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    sku: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    attributes: { type: Map, of: String, default: {} },
    price: { type: Number },
    stock: { type: Number, required: true, default: 0, min: 0 },
    image: { type: String },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    sku: { type: String, trim: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    categorySlug: { type: String, required: true, lowercase: true, trim: true, index: true },
    basePrice: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    images: { type: [String], default: [] },
    hasVariants: { type: Boolean, default: false },
    variants: { type: [ProductVariantSchema], default: [] },
    totalStock: { type: Number, default: 0, min: 0, index: true },
    salesCount: { type: Number, default: 0, index: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isBestSeller: { type: Boolean, default: false, index: true },
    badge: { type: String },
    highlights: { type: [String], default: [] },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: auto-compute totalStock from variants if hasVariants is true
ProductSchema.pre('save', function () {
  if (this.hasVariants && this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
  }
});

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
