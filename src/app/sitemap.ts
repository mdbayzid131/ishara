import type { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/db/connect';
import { Product } from '@/models/Product';
import { CATEGORIES, PRODUCTS } from '@/data/mockProducts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ishara.com.bd';
  const now = new Date();

  // Core static storefront routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/return-refund-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Category dedicated routes & filter routes
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.flatMap((cat) => [
    {
      url: `${baseUrl}/categories/${encodeURIComponent(cat.slug)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop?category=${encodeURIComponent(cat.slug)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]);

  // Dynamic products from database with fallback to seed products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectToDatabase();
    const dbProducts = await Product.find(
      { status: { $ne: 'archived' } },
      'slug updatedAt'
    ).lean();

    if (dbProducts && dbProducts.length > 0) {
      productRoutes = dbProducts.map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    } else {
      // Fallback to static mock products
      productRoutes = PRODUCTS.map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.warn('Database query failed for sitemap, falling back to mock products:', err);
    productRoutes = PRODUCTS.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
