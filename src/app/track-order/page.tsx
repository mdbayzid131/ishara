'use client';

import React, { useState } from 'react';
import PageIntro from '@/components/layout/PageIntro';
import { normalizePhone } from '@/lib/phone';
import type { OrderStatus } from '@/types';
import { Search, AlertCircle, Phone } from 'lucide-react';

interface TrackingResult {
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  deliveryZone: string;
  totalAmount: number;
  courierName?: string;
  trackingCode?: string;
  createdAt: string;
  estimatedDelivery: string;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    setResult(null);

    const cleanOrder = orderNumber.trim().toUpperCase();
    const cleanPhone = normalizePhone(phoneNumber);

    if (!cleanOrder || !cleanPhone) {
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: cleanOrder, phone: cleanPhone }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.order) {
        setResult({
          orderNumber: data.order.orderNumber,
          status: data.order.status,
          customerName: data.order.customerName,
          deliveryZone: data.order.deliveryZone,
          totalAmount: data.order.totalAmount,
          courierName: data.order.courierName,
          trackingCode: data.order.trackingCode,
          createdAt: new Date(data.order.createdAt).toLocaleDateString(),
          estimatedDelivery: data.order.status === 'delivered' ? 'Delivered' : data.order.status === 'cancelled' ? 'Order cancelled' : data.order.status === 'returned' ? 'Order returned' : 'Our team will confirm the delivery schedule',
        });
        setIsSearching(false);
        return;
      }

      setNotFound(true);
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received in system', key: 'pending' },
    { title: 'Confirmed', desc: 'Verified by Ishara team', key: 'confirmed' },
    { title: 'Packed & Processing', desc: 'Inspected and packaged', key: 'processing' },
    { title: 'With Courier', desc: 'Dispatched for doorstep delivery', key: 'shipped' },
    { title: 'Delivered', desc: 'Completed at destination', key: 'delivered' },
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const order = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="reference-page tracking-reference">
      <PageIntro page="Track order" eyebrow="YOUR ORDER, AT A GLANCE" title="From our door" accent="to yours." description="Enter your order number and mobile number below to find the latest status of your Ishara order." image="/images/editorial/beauty-campaign.webp" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="bg-[#161616] rounded-3xl border border-[#ffffff14] p-6 sm:p-8 shadow-xs mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#f3eee8] uppercase tracking-wider mb-1.5">
                  Order Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ISH-2610-1234"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#ffffff14] rounded-xl text-sm uppercase text-[#f3eee8] focus:outline-none focus:border-[#d43b4a] focus:bg-[#161616]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#f3eee8] uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#ffffff14] rounded-xl text-sm text-[#f3eee8] focus:outline-none focus:border-[#d43b4a] focus:bg-[#161616]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-3.5 px-6 bg-[#d43b4a] hover:bg-[#b72b39] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? 'Checking Status...' : 'Track My Order'}</span>
            </button>
          </form>
        </div>

        {/* Not Found State */}
        {notFound && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
            <h3 className="text-sm font-bold text-amber-900">Order Not Found</h3>
            <p className="text-xs text-amber-700 max-w-md mx-auto">
              We couldn&apos;t find an order matching that reference number and phone number. Please check the spelling or reach out on WhatsApp.
            </p>
          </div>
        )}

        {/* Tracking Details View */}
        {result && (
          <div className="bg-[#161616] rounded-3xl border border-[#ffffff14] p-6 sm:p-8 shadow-md space-y-8 animate-in fade-in duration-300">
            {/* Top Details */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-[#ffffff14] gap-4">
              <div>
                <span className="text-[11px] text-[#a89b95] uppercase tracking-wider font-semibold">
                  Order Reference
                </span>
                <h3 className="text-xl font-black text-[#d43b4a]">{result.orderNumber}</h3>
                <p className="text-xs text-[#b7aaa4] mt-0.5">Placed on {result.createdAt}</p>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] text-[#a89b95] uppercase tracking-wider font-semibold">
                  Total Payable (COD)
                </span>
                <p className="text-lg font-bold text-[#f3eee8]">৳{result.totalAmount.toLocaleString()} BDT</p>
                <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded-full mt-1">
                  Cash on Delivery
                </span>
              </div>
            </div>

            {/* Courier Tracking Info */}
            {result.trackingCode ? (
              <div className="p-4 rounded-2xl bg-[#241316] border border-[#f5d4dc] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div>
                  <p className="font-bold text-[#f3eee8]">
                    Courier Partner: {result.courierName}
                  </p>
                  <p className="text-[#b7aaa4]">Tracking Code: {result.trackingCode}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[#b7aaa4]">Estimated Delivery</p>
                  <p className="font-extrabold text-[#d43b4a]">{result.estimatedDelivery}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#0d0d0d] border border-[#ffffff14] flex items-center justify-between text-xs">
                <span className="text-[#b7aaa4]">Fulfillment Partner:</span>
                <span className="font-bold text-[#d43b4a]">Preparing package for courier handover</span>
              </div>
            )}

            {/* Timeline Stepper */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-[#f3eee8] uppercase tracking-wider">
                Progress Timeline
              </h4>

              <div className="relative pl-6 space-y-8 border-l-2 border-[#ffffff14]">
                {(result.status === 'cancelled' || result.status === 'returned') && <p role="status" className="font-semibold text-[#ed6974]">This order has been {result.status}.</p>}
                {steps.map((step, idx) => {
                  const state = getStepStatus(step.key, result.status);
                  return (
                    <div key={idx} className="relative">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                          state === 'completed'
                            ? 'bg-[#d43b4a] text-white'
                            : state === 'current'
                            ? 'bg-[#d43b4a] text-white ring-4 ring-[#d43b4a]/20'
                            : 'bg-[#0d0d0d] text-[#a89b95] border border-[#ffffff14]'
                        }`}
                      >
                        {state === 'completed' ? '✓' : idx + 1}
                      </div>

                      <div>
                        <h5
                          className={`text-xs sm:text-sm font-bold ${
                            state === 'upcoming' ? 'text-[#a89b95]' : 'text-[#f3eee8]'
                          }`}
                        >
                          {step.title}
                        </h5>
                        <p className="text-[11px] text-[#b7aaa4] mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Need Help */}
            <div className="pt-6 border-t border-[#ffffff14] flex items-center justify-between text-xs text-[#b7aaa4]">
              <span>Need assistance with this parcel?</span>
              <a
                href="https://wa.me/8801711223344"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#d43b4a] hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" /> WhatsApp Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
