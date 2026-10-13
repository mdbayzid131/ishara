'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Truck,
  CreditCard,
  Lock,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { DELIVERY_ZONES, FREE_SHIPPING_THRESHOLD } from '@/config/delivery';
import { DeliveryZoneId } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZoneId>('inside_dhaka');
  const [notes, setNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedZoneObj = DELIVERY_ZONES.find((z) => z.id === deliveryZone) || DELIVERY_ZONES[0];
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD && deliveryZone === 'inside_dhaka';
  const deliveryFee = isFreeShipping ? 0 : selectedZoneObj.fee;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Form validation
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01711223344).');
      return;
    }
    if (!address.trim() || address.trim().length < 8) {
      setErrorMessage('Please provide your complete delivery address (House, Road, Area, Thana/City).');
      return;
    }
    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before placing an order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          name: name.trim(),
          phone: cleanPhone,
          address: address.trim(),
          deliveryZone,
          notes: notes.trim(),
        },
        items: items.map((i) => ({
          productId: i.productId,
          variantSku: i.sku || '',
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.error || 'An error occurred while placing your order. Please check your information and try again.'
        );
        setIsSubmitting(false);
        return;
      }

      const { orderNumber, accessToken, order } = data;

      // Save order snapshot in sessionStorage as immediate local cache
      sessionStorage.setItem(`order_${orderNumber}`, JSON.stringify(order));
      sessionStorage.setItem(`order_token_${orderNumber}`, accessToken);

      // Clear shopping bag
      clearCart();

      // Navigate to order confirmation with security access token
      router.push(`/order-success/${orderNumber}?token=${accessToken}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage('A network error occurred while connecting to our server. Please try again or WhatsApp us.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#fdf5f7] text-[#b45f77] mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 opacity-70" />
        </div>
        <h2 className="text-2xl font-bold text-[#201a1c]">Your Shopping Bag is Empty</h2>
        <p className="text-xs sm:text-sm text-[#6b5e62]">
          You have no items in your cart to checkout. Choose an item to place an order with Cash on Delivery.
        </p>
        <Link
          href="/shop"
          className="inline-block mt-4 px-6 py-3 bg-[#b45f77] text-white text-xs font-bold rounded-full hover:bg-[#9e4a62] transition-colors"
        >
          Explore All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#faf6f2] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <span className="text-xs font-bold text-[#b45f77] uppercase tracking-wider">
            Fast 1-Step Checkout
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#201a1c] mt-1">
            Cash on Delivery Checkout
          </h1>
          <p className="text-xs sm:text-sm text-[#6b5e62] mt-1">
            No advance payment needed. Pay cash only when you receive and inspect your parcel.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Customer & Delivery Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Info Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-[#efe8e1]">
                  <Truck className="w-5 h-5 text-[#b45f77]" />
                  <h2 className="text-base font-bold text-[#201a1c]">
                    1. Delivery Information
                  </h2>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                    Your Full Name <span className="text-[#b45f77]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full px-4 py-3 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77] focus:bg-white transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                    Mobile Number (11 Digits) <span className="text-[#b45f77]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01711223344"
                    className="w-full px-4 py-3 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77] focus:bg-white transition-all"
                  />
                  <span className="text-[11px] text-[#8c7e83] mt-1 block">
                    Our team will call or WhatsApp this number to confirm your order dispatch.
                  </span>
                </div>

                {/* Delivery Zone Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-2">
                    Delivery Location <span className="text-[#b45f77]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DELIVERY_ZONES.map((zone) => {
                      const isSelected = deliveryZone === zone.id;
                      return (
                        <label
                          key={zone.id}
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                            isSelected
                              ? 'border-[#b45f77] bg-[#fdf5f7]'
                              : 'border-[#efe8e1] bg-white hover:bg-[#faf6f2]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#201a1c]">
                              {zone.name}
                            </span>
                            <input
                              type="radio"
                              name="deliveryZone"
                              checked={isSelected}
                              onChange={() => setDeliveryZone(zone.id)}
                              className="accent-[#b45f77]"
                            />
                          </div>
                          <div className="flex justify-between items-baseline text-xs">
                            <span className="text-[#6b5e62]">{zone.estimatedDelivery}</span>
                            <span className="font-extrabold text-[#b45f77]">
                              {isFreeShipping && zone.id === 'inside_dhaka' ? 'FREE' : `৳${zone.fee}`}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                    Full Delivery Address <span className="text-[#b45f77]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number, Road number, Area/Block, City (e.g. House 14, Road 7, Block C, Banani, Dhaka)"
                    className="w-full px-4 py-3 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77] focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please deliver after 3:00 PM / Call before arrival"
                    className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77] focus:bg-white"
                  />
                </div>
              </div>

              {/* Payment Method Badge */}
              <div className="bg-white p-6 rounded-3xl border border-[#efe8e1] shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#efe8e1]">
                  <CreditCard className="w-5 h-5 text-[#b45f77]" />
                  <h2 className="text-base font-bold text-[#201a1c]">
                    2. Payment Method
                  </h2>
                </div>
                <div className="p-4 rounded-2xl bg-[#faf6f2] border border-[#efe8e1] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#b45f77] text-white flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#201a1c]">
                        Cash on Delivery (COD)
                      </h4>
                      <p className="text-[11px] text-[#6b5e62] mt-0.5">
                        Pay cash directly to the delivery person after verifying your items.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-extrabold bg-[#b45f77]/10 text-[#b45f77] px-2.5 py-1 rounded-full shrink-0">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Placement */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#efe8e1]">
                  <h3 className="text-base font-bold text-[#201a1c]">Order Summary</h3>
                  <span className="text-xs text-[#6b5e62] font-semibold">
                    {items.length} unique {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.sku} className="flex gap-3 items-center text-xs">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#faf6f2] shrink-0 border border-[#efe8e1]">
                        <Image src={item.image} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#201a1c] truncate">{item.title}</p>
                        {item.variantName && (
                          <p className="text-[11px] text-[#6b5e62]">{item.variantName}</p>
                        )}
                        <p className="text-[11px] text-[#8c7e83]">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-[#b45f77]">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation Breakdown */}
                <div className="space-y-2 pt-4 border-t border-[#efe8e1] text-xs">
                  <div className="flex justify-between text-[#6b5e62]">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-[#201a1c]">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#6b5e62]">
                    <span>Delivery Charge ({selectedZoneObj.name})</span>
                    <span className="font-semibold text-[#201a1c]">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-bold">FREE</span>
                      ) : (
                        `৳${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-[#201a1c] pt-3 border-t border-[#efe8e1]">
                    <span>Total Payable</span>
                    <span className="text-[#b45f77] text-lg">৳{grandTotal.toLocaleString()} BDT</span>
                  </div>
                </div>

                {/* Submit Action */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-[#b45f77] hover:bg-[#9e4a62] disabled:opacity-60 text-white font-extrabold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <span>CONFIRM ORDER (CASH ON DELIVERY)</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#8c7e83]">
                    <Lock className="w-3.5 h-3.5 text-[#b45f77]" />
                    <span>Safe & Encrypted • 100% Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
