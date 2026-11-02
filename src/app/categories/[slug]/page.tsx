'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Sparkles, Filter } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/mockProducts';
import { Product, Category } from '@/types';

function CategoryDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const initialCat = CATEGORIES.find((c) => c.slug === slug);
  const [categoryData, setCategoryData] = useState(initialCat || null);
  const [products, setProducts] = useState<Product[]>(
    PRODUCTS.filter((p) => p.categorySlug === slug)
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    // Fetch live categories if available
    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.categories && isMounted) {
          const found = data.categories.find((c: Category) => c.slug === slug);
          setCategoryData(found || null);
        }
      })
      .catch((err) => console.error(err));

    // Fetch live products for this category
    fetch(`/api/products?category=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.products && isMounted) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!categoryData && !isLoading) {
    return (
      <div className="bg-[#0d0d0d] min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#f3eee8]">Category Not Found</h2>
        <p className="text-xs text-[#b7aaa4]">The category you are looking for does not exist.</p>
        <Link
          href="/shop"
          className="px-5 py-2.5 bg-[#d43b4a] text-white text-xs font-bold rounded-xl"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const categoryName = categoryData?.name || slug;
  const categoryDesc =
    categoryData?.description ||
    'Discover handpicked luxury pieces crafted with uncompromised attention to detail.';
  const categoryImage = categoryData?.image;

  return (
    <div className="bg-[#0d0d0d] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#a89b95]">
          <Link href="/" className="hover:text-[#d43b4a]">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#d43b4a]">
            Shop
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#f3eee8]">{categoryName}</span>
        </div>

        {/* Hero Category Card */}
        <div className="relative rounded-3xl overflow-hidden bg-[#201a1c] text-white p-6 sm:p-12 shadow-md">
          {categoryImage && (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <Image
                src={categoryImage}
                alt={categoryName}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#d43b4a]/30 text-[#dc8ba0] border border-[#d43b4a]/50">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Collection
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold">{categoryName}</h1>
            <p className="text-xs sm:text-sm text-[#ded5d7] leading-relaxed">{categoryDesc}</p>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between border-b border-[#ffffff14] pb-4">
          <p className="text-xs sm:text-sm font-semibold text-[#b7aaa4]">
            Showing <strong className="text-[#f3eee8]">{products.length}</strong> items in{' '}
            {categoryName}
          </p>

          <Link
            href={`/shop?category=${slug}`}
            className="px-3.5 py-2 bg-[#161616] border border-[#ffffff14] rounded-xl text-xs font-bold text-[#d43b4a] hover:bg-[#0d0d0d] flex items-center gap-1.5 transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Open in Full Filter View</span>
          </Link>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id || prod.slug} product={prod} />
            ))}
          </div>
        ) : (
          <div className="bg-[#161616] rounded-3xl p-12 text-center border border-[#ffffff14] space-y-4">
            <p className="text-sm font-semibold text-[#f3eee8]">
              New products in this collection are arriving soon!
            </p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 bg-[#d43b4a] text-white text-xs font-bold rounded-xl"
            >
              Browse All Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-sm text-[#b7aaa4]">
          Loading collection...
        </div>
      }
    >
      <CategoryDetailContent />
    </Suspense>
  );
}
