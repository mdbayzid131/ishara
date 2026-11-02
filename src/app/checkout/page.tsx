'use client';

import React, { useState, useRef } from 'react';
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
import { DELIVERY_ZONES } from '@/config/delivery';
import { DeliveryZoneId } from '@/types';
import { normalizePhone } from '@/lib/phone';
import { useStore } from '@/context/StoreContext';
import { getStoredUtmParams, clearStoredUtmParams } from '@/lib/tracking/utm';
import { trackInitiateCheckout } from '@/lib/tracking/pixel';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, isHydrated, setIsCartOpen } = useCart();

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZoneId>('inside_dhaka');
  const [notes, setNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { settings } = useStore();
  const zones = DELIVERY_ZONES.map((zone) => ({ ...zone, fee: zone.id === 'inside_dhaka' ? settings.insideDhakaFee : settings.outsideDhakaFee }));
  const quoteKey = JSON.stringify({ items: items.map((item) => ({ productId: item.productSlug || item.productId, variantSku: item.variantId ? item.sku : '', quantity: item.quantity })), deliveryZone });
  const [quote, setQuote] = useState<{ key: string; canOrder: boolean; subtotal: number; deliveryFee: number; totalAmount: number; isFreeShipping: boolean } | null>(null);
  const [quoteError, setQuoteError] = useState('');
  const [quoteAttempt, setQuoteAttempt] = useState(0);
  const submitLock = useRef(false);
  const requestKey = useRef('');
  const requestFingerprint = useRef('');
  const selectedZoneObj = zones.find((zone) => zone.id === deliveryZone) || zones[0];
  const quoteReady = quote?.key === quoteKey;
  const isFreeShipping = quoteReady ? quote.isFreeShipping : subtotal >= settings.freeShippingThreshold && deliveryZone === 'inside_dhaka';
  const deliveryFee = quoteReady ? quote.deliveryFee : (isFreeShipping ? 0 : selectedZoneObj.fee);
  const verifiedSubtotal = quoteReady ? quote.subtotal : subtotal;
  const grandTotal = quoteReady ? quote.totalAmount : subtotal + deliveryFee;

  React.useEffect(() => {
    if (!isHydrated || !items.length) return;
    const controller = new AbortController();
    fetch('/api/checkout/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: quoteKey, signal: controller.signal })
      .then(async (res) => { const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Could not verify your bag.'); return data; })
      .then((data) => { setQuote({ key: quoteKey, ...data.quote }); setQuoteError(''); })
      .catch((error) => { if (!controller.signal.aborted) setQuoteError(error.message || 'Could not verify your bag. Please retry.'); });
    return () => controller.abort();
  }, [quoteKey, isHydrated, items.length, quoteAttempt]);

  React.useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout(items.length, subtotal);
    }
  }, [items.length, subtotal]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLock.current || !quoteReady || !quote.canOrder) return;
    setErrorMessage('');

    // Form validation
    if (name.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanPhone = normalizePhone(phone);
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01711223344).');
      return;
    }
    if (!address.trim() || address.trim().length < 8) {
      setErrorMessage('Please provide your complete delivery address (House, Road, Area, Thana/City).');
      return;
    }
    if (!isHydrated || items.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before placing an order.');
      return;
    }

    submitLock.current = true;
    setIsSubmitting(true);

    try {
      const payload = {
        expectedTotal: grandTotal,
        customer: {
          name: name.trim(),
          phone: cleanPhone,
          email: email.trim() || undefined,
          address: address.trim(),
          deliveryZone,
          notes: notes.trim(),
        },
        items: items.map((i) => ({
          productId: i.productSlug || i.productId,
          variantSku: i.variantId ? i.sku : '',
          quantity: i.quantity,
        })),
        marketing: getStoredUtmParams(),
      };

      const fingerprint = JSON.stringify(payload);
      if (requestFingerprint.current !== fingerprint) { requestKey.current = crypto.randomUUID(); requestFingerprint.current = fingerprint; }
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestKey.current },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 409) { setQuote(null); setQuoteAttempt((value) => value + 1); }
        setErrorMessage(
          data.error || 'An error occurred while placing your order. Please check your information and try again.'
        );
        submitLock.current = false;
        setIsSubmitting(false);
        return;
      }

      const { orderNumber, accessToken, order } = data;

      // Clear UTM parameters once order is placed
      clearStoredUtmParams();

      // Save order snapshot in sessionStorage as immediate local cache
      try {
        sessionStorage.setItem(`order_${orderNumber}`, JSON.stringify(order));
        sessionStorage.setItem(`order_token_${orderNumber}`, accessToken);
      } catch { /* Confirmation remains available through the access token URL. */ }

      // Clear shopping bag
      clearCart();

      // Navigate to order confirmation with security access token
      router.push(`/order-success/${orderNumber}?token=${accessToken}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage('A network error occurred while connecting to our server. Please try again or WhatsApp us.');
      setIsSubmitting(false);
      submitLock.current = false;
    }
  };

  if (!isHydrated || (items.length === 0 && isSubmitting)) return <div role="status" className="p-16 text-center">{isSubmitting ? 'Opening your confirmation…' : 'Loading your bag…'}</div>;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#241316] text-[#d43b4a] mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 opacity-70" />
        </div>
        <h2 className="text-2xl font-bold text-[#f3eee8]">Your Shopping Bag is Empty</h2>
        <p className="text-xs sm:text-sm text-[#b7aaa4]">
          You have no items in your cart to checkout. Choose an item to place an order with Cash on Delivery.
        </p>
        <Link
          href="/shop"
          className="inline-block mt-4 px-6 py-3 bg-[#d43b4a] text-white text-xs font-bold rounded-full hover:bg-[#b72b39] transition-colors"
        >
          Explore All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d0d] pt-6 pb-32 sm:pt-12 lg:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <span className="text-xs font-bold text-[#d43b4a] uppercase tracking-wider">
            Fast 1-Step Checkout
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f3eee8] mt-1">
            Cash on Delivery Checkout
          </h1>
          <p className="text-xs sm:text-sm text-[#b7aaa4] mt-1">
            No account or advance payment needed. Review your total, then pay cash when your order arrives.
          </p>
        </div>

        {(errorMessage || quoteError) && (
          <div role="alert" className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage || quoteError}</span>
            {quoteError && <button type="button" className="underline font-bold shrink-0" onClick={() => { setQuoteError(''); setQuote(null); setQuoteAttempt((value) => value + 1); }}>Retry</button>}
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Customer & Delivery Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Info Card */}
              <div className="bg-[#161616] p-6 sm:p-8 rounded-3xl border border-[#ffffff14] shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-[#ffffff14]">
                  <Truck className="w-5 h-5 text-[#d43b4a]" />
                  <h2 className="text-base font-bold text-[#f3eee8]">
                    1. Delivery Information
                  </h2>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="checkout-name" className="block text-xs font-bold text-[#f3eee8] uppercase tracking-wider mb-1.5">
                    Your Full Name <span className="text-[#d43b4a]">*</span>
                  </label>
                  <input
                    id="checkout-name" name="name" autoComplete="name" minLength={2}
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#ffffff14] rounded-xl text-sm text-[#f3eee8] focus:outline-none focus:border-[#d43b4a] focus:bg-[#161616] transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="checkout-phone" className="block text-xs font-bold text-[#f3eee8] uppercase tracking-wider mb-1.5">
                    Mobile Number <span className="text-[#d43b4a]">*</span>
                  </label>
                  <input
                    id="checkout-phone" name="phone" autoComplete="tel" inputMode="tel"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01711223344 or +8801711223344"
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#ffffff14] rounded-xl text-sm text-[#f3eee8] focus:outline-none focus:border-[#d43b4a] focus:bg-[#161616] transition-all"
                  />
                  <span className="text-[11px] text-[#a89b95] mt-1 block">
                    Our team will call or WhatsApp this number to confirm your order dispatch.
                  </span>
                </div>

                {/* Delivery Zone Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#f3eee8] uppercase tracking-wider mb-2">
                    Delivery Location <span className="text-[#d43b4a]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {zones.map((zone) => {
                      const isSelected = deliveryZone === zone.id;
                      return (
                        <label
                          key={zone.id}
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                            isSelected
                              ? 'border-[#d43b4a] bg-[#241316]'
                              : 'border-[#ffffff14] bg-[#161616] hover:bg-[#0d0d0d]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#f3eee8]">
                              {zone.name}
                            </span>
                            <input
                              type="radio"
                              name="deliveryZone"
                              checked={isSelected}
                              onChange={() => setDeliveryZone(zone.id)}
                              className="accent-[#d43b4a]"
                            />
                          </div>
                          <div className="flex justify-between items-baseline text-xs">
                            <span className="text-[#b7aaa4]">{zone.estimatedDelivery}</span>
                            <span className="font-extrabold text-[#d43b4a]">
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
                  <label htmlFor="checkout-address" className="block text-xs font-bold text-[#f3eee8] uppercase tracking-wider mb-1.5">
                    Full Delivery Address <span className="text-[#d43b4a]">*</span>
                  </label>
                  <textarea
                    id="checkout-address" name="address" autoComplete="street-address" minLength={8}
                    rows={3}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number, Road number, Area/Block, City (e.g. House 14, Road 7, Block C, Banani, Dhaka)"
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#ffffff14] rounded-xl text-sm text-[#f3eee8] focus:outline-none focus:border-[#d43b4a] focus:bg-[#161616] transition-all resize-none"
                  />
                </div>

                <details className="border-t border-[#ffffff14] pt-4">
                  <summary className="text-sm font-semibold text-[#ed6974]">Add email or delivery instructions (optional)</summary>
                  <div className="space-y-5 mt-4">
                {/* Email Address (Optional) */}
                <div>
                  <label htmlFor="checkout-email" className="block text-xs font-bold text-[#f3eee8] uppercase tracking-wider mb-2">
                    Email Address <span className="text-[#a89b95] font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    id="checkout-email" name="email" autoComplete="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#ffffff14] rounded-xl text-sm text-[#f3eee8] focus:outline-none focus:border-[#d43b4a] focus:bg-[#161616] transition-all"
                  />
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-xs font-bold text-[#f3eee8] uppercase tracking-wider mb-1.5">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please deliver after 3:00 PM / Call before arrival"
                    className="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#ffffff14] rounded-xl text-xs text-[#f3eee8] focus:outline-none focus:border-[#d43b4a] focus:bg-[#161616]"
                  />
                </div>
                  </div>
                </details>
              </div>

              {/* Payment Method Badge */}
              <div className="bg-[#161616] p-6 rounded-3xl border border-[#ffffff14] shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#ffffff14]">
                  <CreditCard className="w-5 h-5 text-[#d43b4a]" />
                  <h2 className="text-base font-bold text-[#f3eee8]">
                    2. Payment Method
                  </h2>
                </div>
                <div className="p-4 rounded-2xl bg-[#0d0d0d] border border-[#ffffff14] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#d43b4a] text-white flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#f3eee8]">
                        Cash on Delivery (COD)
                      </h4>
                      <p className="text-[11px] text-[#b7aaa4] mt-0.5">
                        Pay cash to the delivery person when your order arrives.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-extrabold bg-[#d43b4a]/10 text-[#d43b4a] px-2.5 py-1 rounded-full shrink-0">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Placement */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="bg-[#161616] p-6 sm:p-8 rounded-3xl border border-[#ffffff14] shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#ffffff14]">
                  <div><h3 className="text-base font-bold text-[#f3eee8]">Order Summary</h3><button type="button" onClick={() => setIsCartOpen(true)} className="text-xs text-[#ed6974] underline mt-1">Edit your bag</button></div>
                  <span className="text-xs text-[#b7aaa4] font-semibold">
                    {items.length} unique {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div key={item.sku || `${item.productId}-${idx}`} className="flex gap-3 items-center text-xs">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#0d0d0d] shrink-0 border border-[#ffffff14]">
                        <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#f3eee8] truncate">{item.title}</p>
                        {item.variantName && (
                          <p className="text-[11px] text-[#b7aaa4]">{item.variantName}</p>
                        )}
                        <p className="text-[11px] text-[#a89b95]">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-[#d43b4a]">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation Breakdown */}
                <div className="space-y-2 pt-4 border-t border-[#ffffff14] text-xs">
                  <div className="flex justify-between text-[#b7aaa4]">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-[#f3eee8]">৳{verifiedSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#b7aaa4]">
                    <span>Delivery Charge ({selectedZoneObj.name})</span>
                    <span className="font-semibold text-[#f3eee8]">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-bold">FREE</span>
                      ) : (
                        `৳${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-[#f3eee8] pt-3 border-t border-[#ffffff14]">
                    <span>Total Payable</span>
                    <span className="text-[#d43b4a] text-lg">৳{grandTotal.toLocaleString()} BDT</span>
                  </div>
                </div>

                {quoteReady && verifiedSubtotal !== subtotal && <p role="status" className="text-sm text-[#ed6974]">Prices have been updated. Please review the verified total before placing your order.</p>}
                {/* Keep the reviewed total and checkout action within thumb reach. */}
                <div className="fixed bottom-0 inset-x-0 z-30 bg-[#161616] border-t border-[#ffffff14] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:static lg:border-0 lg:p-0">
                  <button
                    type="submit"
                    disabled={isSubmitting || !quoteReady || !quote.canOrder || !!quoteError}
                    className="w-full py-4 px-6 bg-[#d43b4a] hover:bg-[#b72b39] disabled:opacity-60 text-white font-extrabold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <span>{quoteReady ? (quote.canOrder ? `Place order · ৳${grandTotal.toLocaleString()}` : 'Preview only · ordering unavailable') : 'Checking price & stock…'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#a89b95]">
                    <Lock className="w-3.5 h-3.5 text-[#d43b4a]" />
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
