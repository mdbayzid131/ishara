import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { STUDIO_PRODUCTS, STUDIO_CATEGORIES } from '../data/studioCollection';

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    for (const category of STUDIO_CATEGORIES) await Category.updateOne({ slug: category.slug }, { $setOnInsert: category }, { upsert: true });
    for (const concept of STUDIO_PRODUCTS) {
      const { id: localId, ...product } = concept;
      void localId;
      await Product.updateOne({ slug: product.slug }, { $setOnInsert: product }, { upsert: true, runValidators: true });
    }
    console.log('Added four original studio concepts with zero inventory. Existing catalog records were preserved.');
  } finally { await mongoose.disconnect(); }
}
main().catch(() => { console.error('Could not add the studio collection.'); process.exitCode = 1; });
