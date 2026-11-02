import { connectToDatabase } from '@/lib/db/connect';
import { Product as ProductModel } from '@/models/Product';
import { Category as CategoryModel } from '@/models/Category';
import { PRODUCTS, CATEGORIES } from '@/data/mockProducts';
import type { Product, Category } from '@/types';
import { STUDIO_PRODUCTS, STUDIO_CATEGORIES } from '@/data/studioCollection';

export async function getHomeCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
  const db = await connectToDatabase();
  if (!db) return { products: [...STUDIO_PRODUCTS, ...PRODUCTS], categories: [...STUDIO_CATEGORIES.map((category) => ({ ...category, id: category.slug, itemCount: 2 })), ...CATEGORIES] };
  const [products, categories] = await Promise.all([
    ProductModel.find({ status: 'published' }).sort({ isFeatured: -1, salesCount: -1 }).limit(100).lean(),
    CategoryModel.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
  ]);
  return JSON.parse(JSON.stringify({
    products: products.map((product) => ({ ...product, id: String(product._id), variants: product.variants.map((variant) => ({ ...variant, id: variant.sku })) })),
    categories: categories.map((category) => ({ ...category, id: String(category._id) })),
  }));
}
