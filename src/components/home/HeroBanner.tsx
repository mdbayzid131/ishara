import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdf5f7] via-[#faf6f2] to-[#faf6f2] py-8 sm:py-16">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ebb3c2]/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#f4ecdf]/60 rounded-full blur-2xl pointer-events-none -ml-20 -mb-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#efe8e1] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#b45f77]" />
              <span className="text-xs font-semibold text-[#b45f77] tracking-wider uppercase">
                New Eid & Festive Collection &apos;26
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#201a1c] tracking-tight leading-[1.15]">
              Elegance in Every <span className="text-[#b45f77]">Gesture</span>, Crafted for You.
            </h1>

            <p className="text-sm sm:text-base text-[#6b5e62] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover curated luxury handbags, 18K rose-gold jewelry, and beauty essentials. Handpicked for quality, packaged with love, and delivered directly to your doorstep.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#b45f77] hover:bg-[#9e4a62] text-white font-semibold text-sm rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop?category=handbags"
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-[#faf6f2] text-[#201a1c] border border-[#efe8e1] font-semibold text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>Explore Handbags</span>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#efe8e1]/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#b45f77] shrink-0" />
                <span className="text-[11px] sm:text-xs font-medium text-[#201a1c]">24-48h Dhaka</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#b45f77] shrink-0" />
                <span className="text-[11px] sm:text-xs font-medium text-[#201a1c]">100% COD</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#b45f77] shrink-0" />
                <span className="text-[11px] sm:text-xs font-medium text-[#201a1c]">7-Day Exchange</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85"
                alt="Ishara Luxury Collection"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#b45f77] tracking-wider">
                    Featured Spotlight
                  </p>
                  <h3 className="text-xs sm:text-sm font-bold text-[#201a1c]">
                    Classic Mini Crossbody Bag
                  </h3>
                  <p className="text-xs font-extrabold text-[#b45f77] mt-0.5">৳1,850 BDT</p>
                </div>
                <Link
                  href="/products/classic-mini-crossbody-bag"
                  className="px-3.5 py-2 bg-[#b45f77] text-white text-xs font-semibold rounded-xl hover:bg-[#9e4a62] transition-colors shadow-xs"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
