import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { Category } from '@/models/Category';
import { connectToDatabase } from '@/lib/db/connect';
import { Product } from '@/models/Product';
import { CATEGORIES, PRODUCTS } from '@/data/mockProducts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
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
  try {
    const db = await connectToDatabase();
    const [categories, products] = db ? await Promise.all([
      Category.find({ isActive: true }, 'slug updatedAt').lean(),
      Product.find({ status: 'published' }, 'slug updatedAt').lean(),
    ]) : [CATEGORIES.map((category) => ({ slug: category.slug, updatedAt: now })), PRODUCTS.map((product) => ({ slug: product.slug, updatedAt: now }))];
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({ url: baseUrl + '/categories/' + encodeURIComponent(category.slug), lastModified: category.updatedAt || now, changeFrequency: 'weekly', priority: 0.7 }));
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({ url: baseUrl + '/products/' + encodeURIComponent(product.slug), lastModified: product.updatedAt || now, changeFrequency: 'weekly', priority: 0.8 }));
    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    // A database outage must not publish draft or fabricated product URLs.
    return staticRoutes;
  }
}
