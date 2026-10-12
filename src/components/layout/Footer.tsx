'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, ShieldCheck, RefreshCw, Truck, Heart } from 'lucide-react';
import { CATEGORIES } from '@/data/mockProducts';

export default function Footer() {
  return (
    <footer className="bg-[#201a1c] text-[#ded5d7] pt-16 pb-12 border-t border-[#3d3437]">
      {/* Value Badges Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-6 bg-[#2c2527] rounded-2xl border border-[#3d3437]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#b45f77]/20 flex items-center justify-center text-[#dc8ba0] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Doorstep Delivery</h4>
              <p className="text-xs text-[#8c7e83] mt-0.5">24-48 hours Dhaka, 2-4 days Nationwide</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Cash on Delivery</h4>
              <p className="text-xs text-[#8c7e83] mt-0.5">Check before paying right at your doorstep</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#b45f77]/20 flex items-center justify-center text-[#dc8ba0] shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">7 Days Easy Return/Exchange</h4>
              <p className="text-xs text-[#8c7e83] mt-0.5">Hassle-free replacement policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative w-40 h-14">
              <Image
                src="/images/ishara-logo.png"
                alt="Ishara Brand"
                fill
                className="object-contain brightness-110"
              />
            </div>
            <p className="text-sm text-[#8c7e83] leading-relaxed max-w-sm">
              Ishara offers exquisite ladies&apos; accessories, handcrafted jewelry, luxury handbags, and curated beauty gadgets for the modern Bangladeshi woman. Elegance in every detail.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="text-xs text-[#8c7e83]">Payment:</div>
              <span className="px-2.5 py-1 rounded bg-[#3d3437] text-white text-xs font-medium">
                Cash On Delivery (COD)
              </span>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Collections
                </Link>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/shop?category=${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors text-[#dc8ba0] font-medium">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/return-refund-policy" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-[#8c7e83]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#dc8ba0] shrink-0 mt-0.5" />
                <span>Road 11, Banani / Gulshan, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#dc8ba0] shrink-0" />
                <span className="text-white font-medium">+880 1711-223344</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#dc8ba0] shrink-0" />
                <span>support@ishara.com.bd</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#3d3437] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8c7e83]">
          <p>© 2026 Ishara Lifestyle. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-[#b45f77] fill-[#b45f77]" /> for fashion lovers in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
