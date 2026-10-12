import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles, Star, Quote } from 'lucide-react';
import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import WhyIsharaSection from '@/components/home/WhyIsharaSection';
import ProductCard from '@/components/product/ProductCard';
import { PRODUCTS } from '@/data/mockProducts';

export default function HomePage() {
  const bestSellers = [...PRODUCTS]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 4);

  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Category Highlights */}
      <CategorySection />

      {/* 3. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b45f77] uppercase tracking-widest">
              <Flame className="w-4 h-4 fill-current" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c] mt-1">
              Best Selling Creations
            </h2>
          </div>
          <Link
            href="/shop?sort=bestseller"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#b45f77] hover:text-[#9e4a62] transition-colors"
          >
            <span>See All Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Luxury Promotional Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden luxury-gradient p-8 sm:p-14 text-white shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
              Limited Edition
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Elevate Your Everyday Style With Ishara
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
              Order today and enjoy Cash on Delivery right to your home. Free delivery inside Dhaka on orders above ৳3,000.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#9e4a62] hover:bg-[#faf6f2] font-bold text-xs sm:text-sm rounded-full shadow-md transition-all active:scale-[0.98]"
              >
                <span>Shop All Items</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trending / Featured Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b45f77] uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c] mt-1">
              Featured New Arrivals
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#b45f77] hover:text-[#9e4a62] transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Customer Testimonials / Social Proof */}
      <section className="bg-white py-12 sm:py-16 border-y border-[#efe8e1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#b45f77] uppercase tracking-widest">
              Loved Across Dhaka & Beyond
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c] mt-1">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#faf6f2] border border-[#efe8e1] space-y-3 relative">
              <Quote className="w-8 h-8 text-[#b45f77]/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#3d3437] italic leading-relaxed">
                &ldquo;Ordered the Classic Mini Crossbody Bag yesterday in Dhanmondi and got it within 24 hours! The vegan leather finish is surprisingly soft and the rose-gold lock looks so luxurious.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#efe8e1]">
                <p className="text-xs font-bold text-[#201a1c]">Nabila Rahman</p>
                <p className="text-[11px] text-[#8c7e83]">Dhanmondi, Dhaka</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#faf6f2] border border-[#efe8e1] space-y-3 relative">
              <Quote className="w-8 h-8 text-[#b45f77]/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#3d3437] italic leading-relaxed">
                &ldquo;I was skeptical about buying jewelry online, but Ishara let me inspect the baroque pearl choker before paying the delivery rider. It came in such a beautiful pouch! Highly recommend.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#efe8e1]">
                <p className="text-xs font-bold text-[#201a1c]">Sadia Chowdhury</p>
                <p className="text-[11px] text-[#8c7e83]">Chittagong</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#faf6f2] border border-[#efe8e1] space-y-3 relative">
              <Quote className="w-8 h-8 text-[#b45f77]/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#3d3437] italic leading-relaxed">
                &ldquo;The Rose-Glow sculpting wand works like magic. It helped with morning facial puffiness so much. Cash on delivery was seamless.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#efe8e1]">
                <p className="text-xs font-bold text-[#201a1c]">Farzana Yasmin</p>
                <p className="text-[11px] text-[#8c7e83]">Uttara, Dhaka</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why Ishara & FAQ */}
      <WhyIsharaSection />
    </div>
  );
}
