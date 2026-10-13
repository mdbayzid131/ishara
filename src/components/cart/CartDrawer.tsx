'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { FREE_SHIPPING_THRESHOLD } from '@/config/delivery';

export default function CartDrawer() {
  const pathname = usePathname();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();

  if (pathname?.startsWith('/admin')) return null;
  if (!isCartOpen) return null;

  const freeShippingDifference = FREE_SHIPPING_THRESHOLD - subtotal;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#efe8e1] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#b45f77]" />
              <h2 className="text-lg font-bold text-[#201a1c]">Your Shopping Bag</h2>
              <span className="text-xs bg-[#fdf5f7] text-[#b45f77] px-2 py-0.5 rounded-full font-semibold">
                {totalItems} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#6b5e62] hover:text-[#201a1c] rounded-full hover:bg-[#faf6f2] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#fdf5f7] p-3.5 border-b border-[#efe8e1] text-xs">
            {freeShippingDifference > 0 ? (
              <p className="text-[#6b5e62] flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-[#b45f77] shrink-0" />
                Add <span className="font-bold text-[#b45f77]">৳{freeShippingDifference.toLocaleString()}</span> more for <span className="font-bold">FREE Delivery</span>!
              </p>
            ) : (
              <p className="text-emerald-700 flex items-center gap-1.5 font-bold">
                🎉 Congratulations! You unlocked FREE Delivery across Dhaka!
              </p>
            )}
            <div className="w-full bg-[#f3ede6] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#b45f77] h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#faf6f2] flex items-center justify-center text-[#b45f77] mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-base font-semibold text-[#201a1c]">Your bag is empty</h3>
                <p className="text-xs text-[#6b5e62] mt-1 max-w-xs">
                  Discover our latest jewelry, handbags, and lifestyle accessories.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-[#b45f77] text-white text-xs font-semibold rounded-full hover:bg-[#9e4a62] transition-all shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={item.sku || `${item.productId}-${idx}`}
                  className="flex gap-4 p-3 rounded-xl border border-[#efe8e1] bg-[#faf6f2]/40 relative group"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white shrink-0 border border-[#efe8e1]">
                    <Image
                      src={item.image || '/images/ishara-logo.png'}
                      alt={item.title || 'Cart product'}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-[#201a1c] line-clamp-2">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.sku)}
                          className="text-[#8c7e83] hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.variantName && (
                        <p className="text-[11px] text-[#6b5e62] font-medium mt-0.5">
                          Variant: {item.variantName}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#efe8e1]/60">
                      <div className="flex items-center border border-[#efe8e1] rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                          className="p-1 hover:text-[#b45f77] text-[#6b5e62]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#201a1c]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          className="p-1 hover:text-[#b45f77] text-[#6b5e62]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#b45f77]">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#efe8e1] bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6b5e62]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#201a1c]">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6b5e62]">
                  <span>Delivery Charge</span>
                  <span className="text-emerald-700 font-medium">Calculated at Checkout</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#201a1c] pt-2 border-t border-[#efe8e1]">
                  <span>Estimated Total</span>
                  <span className="text-[#b45f77] text-base">৳{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#b45f77] hover:bg-[#9e4a62] text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
                >
                  <span>Proceed to Checkout (COD)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-center text-[#8c7e83] mt-2">
                  🔒 No online advance payment required. Pay Cash on Delivery.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
