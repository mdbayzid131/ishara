'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Menu, X, Phone, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CATEGORIES } from '@/data/mockProducts';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#efe8e1] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#b45f77] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 text-center font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Fast Delivery across Bangladesh
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Cash on Delivery
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="text-white/90">Customer Support: +880 1711-223344</span>
            <Link href="/track-order" className="underline underline-offset-2 hover:text-white/80 font-semibold">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-[#201a1c] hover:text-[#b45f77] hover:bg-[#faf6f2]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-36 h-12 sm:w-44 sm:h-14">
                <Image
                  src="/images/ishara-logo.png"
                  alt="Ishara - Elegance in Blush and Rose Gold"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-[#201a1c] hover:text-[#b45f77] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium text-[#201a1c] hover:text-[#b45f77] transition-colors"
            >
              All Products
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="text-sm font-medium text-[#6b5e62] hover:text-[#b45f77] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons: Search & Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full text-[#201a1c] hover:text-[#b45f77] hover:bg-[#faf6f2] transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#fdf5f7] text-[#b45f77] hover:bg-[#b45f77] hover:text-white transition-all shadow-sm flex items-center justify-center"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#201a1c] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="py-3 px-2 border-t border-[#efe8e1] animate-in fade-in slide-in-from-top-2 duration-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="relative max-w-2xl mx-auto flex items-center"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bags, jewelry, sunglasses, gadgets..."
                className="w-full bg-[#faf6f2] border border-[#efe8e1] rounded-full py-2.5 pl-11 pr-24 text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77] focus:ring-1 focus:ring-[#b45f77]"
                autoFocus
              />
              <Search className="absolute left-4 w-4 h-4 text-[#6b5e62]" />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 bg-[#b45f77] text-white text-xs font-semibold rounded-full hover:bg-[#9e4a62] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#efe8e1] bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in duration-200">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#201a1c] hover:bg-[#faf6f2] hover:text-[#b45f77]"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#201a1c] hover:bg-[#faf6f2] hover:text-[#b45f77]"
            >
              All Products
            </Link>
            <div className="pt-2 pb-1 px-3 text-xs font-semibold text-[#6b5e62] uppercase tracking-wider">
              Categories
            </div>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-[#6b5e62] hover:bg-[#faf6f2] hover:text-[#b45f77]"
              >
                {cat.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#efe8e1] space-y-2">
              <Link
                href="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#b45f77] bg-[#fdf5f7]"
              >
                📦 Track My Order
              </Link>
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-[#6b5e62]">
                <Phone className="w-3.5 h-3.5 text-[#b45f77]" />
                Call/WhatsApp: +880 1711-223344
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
