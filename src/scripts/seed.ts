import mongoose from 'mongoose';
import { Admin } from '../models/Admin';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { hashPassword } from '../lib/auth';
import { CATEGORIES, PRODUCTS } from '../data/mockProducts';

const MONGODB_URI = process.env.MONGODB_URI;

export async function seedDatabase() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    return;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB.');

    // 1. Seed Default Admin
    const adminEmail = 'admin@ishara.com.bd';
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log('👤 Creating default superadmin account...');
      const passwordHash = await hashPassword('IsharaAdmin2026!');
      await Admin.create({
        username: 'admin',
        email: adminEmail,
        name: 'Ishara Super Admin',
        passwordHash,
        role: 'superadmin',
        isActive: true,
      });
      console.log(`✅ Admin account created: ${adminEmail}`);
    } else {
      console.log('ℹ️ Admin account already exists.');
    }

    // 2. Seed Categories
    for (const cat of CATEGORIES) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          itemCount: cat.itemCount,
          isFeatured: cat.isFeatured ?? true,
          isActive: true,
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Seeded ${CATEGORIES.length} categories.`);

    // 3. Seed Products
    for (const prod of PRODUCTS) {
      await Product.findOneAndUpdate(
        { slug: prod.slug },
        {
          title: prod.title,
          slug: prod.slug,
          shortDescription: prod.shortDescription,
          description: prod.description,
          category: prod.category,
          categorySlug: prod.categorySlug,
          basePrice: prod.basePrice,
          compareAtPrice: prod.compareAtPrice,
          images: prod.images,
          hasVariants: prod.hasVariants,
          variants: prod.variants.map((v) => ({
            sku: v.sku,
            name: v.name,
            attributes: v.attributes,
            price: v.price,
            stock: v.stock,
            image: v.image,
          })),
          totalStock: prod.totalStock,
          salesCount: prod.salesCount,
          status: 'published',
          isFeatured: prod.isFeatured ?? false,
          isBestSeller: prod.isBestSeller ?? false,
          badge: prod.badge,
          highlights: prod.highlights ?? [],
          rating: prod.rating,
          reviewsCount: prod.reviewsCount,
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Seeded ${PRODUCTS.length} products.`);

    console.log('🎉 Database seeding complete!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

// Allow running directly via tsx/node
if (require.main === module) {
  seedDatabase();
}
