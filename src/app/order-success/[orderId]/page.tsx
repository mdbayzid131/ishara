'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle,
  Truck,
  Phone,
  MapPin,
} from 'lucide-react';

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
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    if (orderId) {
      const timer = setTimeout(() => {
        try {
          const stored = sessionStorage.getItem(`order_${orderId}`);
          if (stored) {
            setOrder(JSON.parse(stored));
          } else {
            setOrder({
              orderNumber: orderId,
              customer: {
                name: 'Valued Customer',
                phone: '01XXXXXXXXX',
                address: 'Dhaka, Bangladesh',
                deliveryZone: 'Inside Dhaka',
              },
              items: [],
              subtotal: 0,
              deliveryFee: 70,
              grandTotal: 70,
              paymentMethod: 'Cash on Delivery (COD)',
              createdAt: '2026-10-12T16:00:00.000Z',
            });
          }
        } catch (e) {
          console.error(e);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [orderId]);

  return (
    <div className="bg-[#faf6f2] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#efe8e1] shadow-md p-6 sm:p-10 text-center space-y-8">
          {/* Success Check Icon */}
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#b45f77] uppercase tracking-widest">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#201a1c]">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-[#6b5e62] max-w-md mx-auto">
              Your order has been received and is now being prepared for dispatch. Our customer care team will call or WhatsApp you shortly.
            </p>
          </div>

          {/* Reference Badge */}
          <div className="inline-block p-4 rounded-2xl bg-[#fdf5f7] border border-[#f5d4dc] text-center">
            <p className="text-[11px] text-[#6b5e62] uppercase tracking-wider font-semibold">
              Order Reference Number
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#b45f77] tracking-wider mt-0.5">
              {orderId}
            </p>
            <p className="text-[11px] text-[#8c7e83] mt-1">
              Save this reference code to track your parcel status.
            </p>
          </div>

          {/* Order Details Breakdown */}
          {order && (
            <div className="text-left border-t border-[#efe8e1] pt-6 space-y-6">
              {/* Delivery info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#faf6f2] space-y-1">
                  <span className="font-bold text-[#201a1c] flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#b45f77]" /> Recipient & Address
                  </span>
                  <p className="font-semibold text-[#201a1c]">{order.customer.name}</p>
                  <p className="text-[#6b5e62]">{order.customer.phone}</p>
                  <p className="text-[#6b5e62]">{order.customer.address}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#faf6f2] space-y-1">
                  <span className="font-bold text-[#201a1c] flex items-center gap-1.5 mb-1">
                    <Truck className="w-3.5 h-3.5 text-[#b45f77]" /> Shipping Method
                  </span>
                  <p className="font-semibold text-[#201a1c]">{order.customer.deliveryZone}</p>
                  <p className="text-[#6b5e62]">Payment: Cash on Delivery (COD)</p>
                  <p className="text-emerald-700 font-semibold">Pay upon receiving package</p>
                </div>
              </div>

              {/* Items Summary */}
              {order.items.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#201a1c] uppercase tracking-wider">
                    Ordered Items
                  </h4>
                  <div className="space-y-2 border border-[#efe8e1] rounded-2xl p-4 bg-[#faf6f2]/40">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-[#efe8e1]">
                            <Image src={item.image} alt="" fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#201a1c]">{item.title}</p>
                            {item.variantName && (
                              <p className="text-[11px] text-[#6b5e62]">
                                Variant: {item.variantName}
                              </p>
                            )}
                            <p className="text-[11px] text-[#8c7e83]">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#b45f77]">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}

                    <div className="pt-3 border-t border-[#efe8e1] flex justify-between text-sm font-extrabold text-[#201a1c]">
                      <span>Total Amount Payable (COD):</span>
                      <span className="text-[#b45f77]">৳{order.grandTotal.toLocaleString()} BDT</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/track-order"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#b45f77] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-[#9e4a62] transition-colors shadow-sm"
            >
              Track Order Status
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#201a1c] border border-[#efe8e1] text-xs sm:text-sm font-bold rounded-full hover:bg-[#faf6f2] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* WhatsApp Support Notice */}
          <div className="pt-4 border-t border-[#efe8e1] text-xs text-[#6b5e62] flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-[#b45f77]" />
            <span>Have a query? WhatsApp us at <strong className="text-[#201a1c]">+880 1711-223344</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#6b5e62]">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
