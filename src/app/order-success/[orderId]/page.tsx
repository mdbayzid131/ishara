'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle,
  Truck,
  Phone,
  MapPin,
} from 'lucide-react';
import { trackPurchase } from '@/lib/tracking/pixel';

interface StoredOrder {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    deliveryZone: string;
    notes?: string;
  };
  items: {
    title: string;
    variantName?: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: string;
  createdAt: string;
}

function OrderSuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;
    let token = searchParams.get('token');
    try { token ||= sessionStorage.getItem(`order_token_${orderId}`); } catch { /* Use the URL token if storage is unavailable. */ }

    const fetchOrder = async () => {
      try {
        if (token) {
          const res = await fetch(`/api/orders/${orderId}?token=${encodeURIComponent(token)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.order && isMounted) {
              setOrder({
                orderNumber: data.order.orderNumber,
                customer: data.order.customer,
                items: data.order.items || [],
                subtotal: data.order.subtotal,
                deliveryFee: data.order.deliveryFee,
                grandTotal: data.order.totalAmount,
                paymentMethod: data.order.paymentMethod || 'Cash on Delivery (COD)',
                createdAt: data.order.createdAt,
              });

              trackPurchase({
                orderNumber: data.order.orderNumber,
                totalAmount: data.order.totalAmount,
                itemsCount: data.order.items?.length || 1,
              });
              return;
            }
          }
        }

        // Fallback to local session storage
        const stored = sessionStorage.getItem(`order_${orderId}`);
        if (stored && token && isMounted && token === sessionStorage.getItem(`order_token_${orderId}`)) {
          const parsed = JSON.parse(stored);
          setOrder({
            ...parsed,
            grandTotal: parsed.grandTotal || parsed.totalAmount || 0,
          });
          return;
        }

      } catch (e) {
        console.error('Failed to load order confirmation:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, searchParams]);

  if (isLoading) return <div role="status" className="p-16 text-center">Verifying your order…</div>;
  if (!order) return <div className="p-16 text-center space-y-4"><h1 className="text-2xl font-bold">We couldn’t verify this order</h1><p>Open the confirmation link from your order or track it using your order number and mobile number.</p><Link className="underline text-[#ed6974]" href="/track-order">Track your order</Link></div>;

  return (
    <div className="bg-[#0d0d0d] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161616] rounded-3xl border border-[#ffffff14] shadow-md p-6 sm:p-10 text-center space-y-8">
          {/* Success Check Icon */}
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#d43b4a] uppercase tracking-widest">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f3eee8]">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-[#b7aaa4] max-w-md mx-auto">
              Your order has been received and is now being prepared for dispatch. Our customer care team will call or WhatsApp you shortly.
            </p>
          </div>

          {/* Reference Badge */}
          <div className="inline-block p-4 rounded-2xl bg-[#241316] border border-[#f5d4dc] text-center">
            <p className="text-[11px] text-[#b7aaa4] uppercase tracking-wider font-semibold">
              Order Reference Number
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#d43b4a] tracking-wider mt-0.5">
              {orderId}
            </p>
            <p className="text-[11px] text-[#a89b95] mt-1">
              Save this reference code to track your parcel status.
            </p>
          </div>

          {/* Order Details Breakdown */}
          {isLoading ? (
            <div className="text-left border-t border-[#ffffff14] pt-6 space-y-4 animate-pulse">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-24 bg-[#0d0d0d] rounded-2xl" />
                <div className="h-24 bg-[#0d0d0d] rounded-2xl" />
              </div>
              <div className="h-28 bg-[#0d0d0d] rounded-2xl" />
            </div>
          ) : order ? (
            <div className="text-left border-t border-[#ffffff14] pt-6 space-y-6">
              {/* Delivery info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#0d0d0d] space-y-1">
                  <span className="font-bold text-[#f3eee8] flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#d43b4a]" /> Recipient & Address
                  </span>
                  <p className="font-semibold text-[#f3eee8]">{order.customer.name}</p>
                  <p className="text-[#b7aaa4]">{order.customer.phone}</p>
                  <p className="text-[#b7aaa4]">{order.customer.address}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0d0d0d] space-y-1">
                  <span className="font-bold text-[#f3eee8] flex items-center gap-1.5 mb-1">
                    <Truck className="w-3.5 h-3.5 text-[#d43b4a]" /> Shipping Method
                  </span>
                  <p className="font-semibold text-[#f3eee8]">{order.customer.deliveryZone}</p>
                  <p className="text-[#b7aaa4]">Payment: Cash on Delivery (COD)</p>
                  <p className="text-emerald-700 font-semibold">Pay upon receiving package</p>
                </div>
              </div>

              {/* Items Summary */}
              {order.items.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#f3eee8] uppercase tracking-wider">
                    Ordered Items
                  </h4>
                  <div className="space-y-2 border border-[#ffffff14] rounded-2xl p-4 bg-[#0d0d0d]/40">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#161616] shrink-0 border border-[#ffffff14]">
                            <Image
                              src={item.image || '/images/ishara-logo.png'}
                              alt={item.title || 'Product'}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-[#f3eee8]">{item.title}</p>
                            {item.variantName && (
                              <p className="text-[11px] text-[#b7aaa4]">
                                Variant: {item.variantName}
                              </p>
                            )}
                            <p className="text-[11px] text-[#a89b95]">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#d43b4a]">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}

                    <div className="pt-3 border-t border-[#ffffff14] flex justify-between text-sm font-extrabold text-[#f3eee8]">
                      <span>Total Amount Payable (COD):</span>
                      <span className="text-[#d43b4a]">৳{order.grandTotal.toLocaleString()} BDT</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/track-order"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#d43b4a] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-[#b72b39] transition-colors shadow-sm"
            >
              Track Order Status
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#161616] text-[#f3eee8] border border-[#ffffff14] text-xs sm:text-sm font-bold rounded-full hover:bg-[#0d0d0d] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* WhatsApp Support Notice */}
          <div className="pt-4 border-t border-[#ffffff14] text-xs text-[#b7aaa4] flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-[#d43b4a]" />
            <span>Have a query? WhatsApp us at <strong className="text-[#f3eee8]">+880 1711-223344</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#b7aaa4]">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
