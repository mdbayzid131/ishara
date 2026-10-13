import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Heart, Truck, RefreshCw, Award, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Ishara | Elegance in Blush and Rose Gold',
  description:
    'Discover Ishara — a modern Bangladeshi luxury brand dedicated to exquisite handbags, fine jewelry, and beauty devices.',
};

export default function AboutPage() {
  const pillars = [
    {
      icon: Award,
      title: 'Curated Elegance',
      desc: 'Every purse, jewelry piece, and skincare gadget is meticulously chosen to inspire poise and luxury.',
    },
    {
      icon: ShieldCheck,
      title: '100% Cash on Delivery',
      desc: 'Zero risk shopping. Inspect and verify your parcel directly with the courier at your doorstep before paying.',
    },
    {
      icon: Truck,
      title: 'Rapid Nationwide Delivery',
      desc: 'Swift 24-48 hour delivery inside Dhaka, and reliable 2-4 days courier service to every district in Bangladesh.',
    },
    {
      icon: RefreshCw,
      title: '7-Day Easy Exchange',
      desc: 'Unhappy with size or color? Our friendly support team is always ready on WhatsApp to assist.',
    },
  ];

  return (
    <div className="bg-[#faf6f2] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#201a1c] text-white p-8 sm:p-16 lg:p-20 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#b45f77]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#b45f77]/30 text-[#dc8ba0] border border-[#b45f77]/50">
              <Sparkles className="w-3.5 h-3.5" />
              The Ishara Story
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Crafting Timeless Sophistication for Modern Women
            </h1>
            <p className="text-sm sm:text-base text-[#ded5d7] leading-relaxed">
              Born in Dhaka with a vision to redefine women’s fashion accessories, Ishara bridges
              contemporary glamour with effortless functionality. We believe true elegance is in
              the details.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#b45f77] hover:bg-[#9e4a62] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md"
              >
                <span>Explore Our Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Mission & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#b45f77]">
              Our Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c]">
              Inspired by Blush Silhouettes & Rose Gold Accents
            </h2>
            <p className="text-sm text-[#6b5e62] leading-relaxed">
              At Ishara, we understand that an accessory is never just an item — it is an extension
              of your confidence and self-expression. Whether you are dressing for a festive wedding,
              an executive meeting, or an intimate weekend brunch, our collections are styled to
              turn heads.
            </p>
            <p className="text-sm text-[#6b5e62] leading-relaxed">
              We collaborate with skilled artisans and premium manufacturers to guarantee that every
              stitch, clasp, and crystal stone meets the highest quality standards before reaching
              your doorstep.
            </p>
          </div>

          <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-lg border border-[#efe8e1] bg-white">
            <Image
              src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1200&q=85"
              alt="Ishara Lifestyle Aesthetics"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c]">Why Choose Ishara?</h2>
            <p className="text-xs sm:text-sm text-[#6b5e62]">
              Delivering uncompromised quality with consumer trust at the heart of everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#fdf5f7] flex items-center justify-center text-[#b45f77]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#201a1c]">{item.title}</h3>
                  <p className="text-xs text-[#6b5e62] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commitment Banner */}
        <div className="bg-[#2c2527] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6">
          <Heart className="w-10 h-10 text-[#b45f77] fill-[#b45f77] mx-auto animate-pulse" />
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold">Dedicated Customer Care</h3>
            <p className="text-xs sm:text-sm text-[#ded5d7]">
              Have questions about an order or product size? Our dedicated team is available
              Saturday through Thursday, 10:00 AM – 9:00 PM.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#b45f77] hover:bg-[#9e4a62] text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              Get in Touch
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all border border-white/20"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
