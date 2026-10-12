'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, ShoppingBag, Zap } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, buyNow } = useCart();

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants[0];
    buyNow(product, defaultVariant, 1);
    router.push('/checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants[0];
    addToCart(product, defaultVariant, 1);
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#efe8e1] overflow-hidden card-shadow card-hover flex flex-col h-full relative">
      {/* Product Image & Badges */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[#faf6f2]">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 bg-[#b45f77] text-white text-[10px] font-bold rounded-full tracking-wider uppercase shadow-xs">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 bg-[#201a1c] text-white text-[10px] font-bold rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Variant Count Pill */}
        {product.hasVariants && product.variants.length > 1 && (
          <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[#201a1c] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#efe8e1] shadow-xs">
            {product.variants.length} options
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#6b5e62] mb-1">
            <span className="uppercase tracking-wider font-medium text-[#b45f77]">
              {product.category}
            </span>
            <span>•</span>
            <div className="flex items-center gap-0.5 text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              <span>{product.rating}</span>
              <span className="text-[#8c7e83]">({product.reviewsCount})</span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-[#201a1c] group-hover:text-[#b45f77] transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-[#efe8e1]/60">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-bold text-[#b45f77]">
              ৳{product.basePrice.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#8c7e83] line-through">
                ৳{product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Quick Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-2.5 rounded-xl border border-[#b45f77] text-[#b45f77] hover:bg-[#b45f77] hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
              aria-label="Add to bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
            <button
              onClick={handleQuickBuy}
              className="w-full py-2 px-2.5 rounded-xl bg-[#b45f77] hover:bg-[#9e4a62] text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-xs"
              aria-label="Order now"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
