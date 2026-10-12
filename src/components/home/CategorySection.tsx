import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/data/mockProducts';

export default function CategorySection() {
  return (
    <section className="py-12 sm:py-16 bg-[#faf6f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#b45f77] uppercase tracking-widest">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c] mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#b45f77] hover:text-[#9e4a62] transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-4/5 rounded-2xl overflow-hidden shadow-xs border border-[#efe8e1] bg-white flex flex-col justify-end p-4 card-hover"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors" />

              <div className="relative z-10 text-white space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-rose-200 font-medium">
                  {cat.itemCount} items
                </span>
                <h3 className="text-sm sm:text-base font-bold leading-tight">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
