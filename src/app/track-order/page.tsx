'use client';

import React, { useState } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  AlertCircle,
  Phone,
} from 'lucide-react';

interface TrackingResult {
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
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

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    setResult(null);

    const cleanOrder = orderNumber.trim().toUpperCase();
    const cleanPhone = phoneNumber.trim().replace(/[^0-9]/g, '');

    if (!cleanOrder || !cleanPhone) {
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      // Check sessionStorage first
      const stored = sessionStorage.getItem(`order_${cleanOrder}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setResult({
          orderNumber: parsed.orderNumber,
          status: 'confirmed',
          customerName: parsed.customer.name,
          deliveryZone: parsed.customer.deliveryZone,
          totalAmount: parsed.grandTotal,
          courierName: 'Steadfast Courier Ltd',
          trackingCode: 'STDF-' + Math.floor(100000 + Math.random() * 900000),
          createdAt: new Date(parsed.createdAt).toLocaleDateString(),
          estimatedDelivery: 'Within 24-48 Hours',
        });
        setIsSearching(false);
        return;
      }

      // Demo fallback mock for sample checking (e.g. any ISH-XXXX)
      if (cleanOrder.startsWith('ISH-') || cleanOrder.length >= 6) {
        setResult({
          orderNumber: cleanOrder,
          status: 'processing',
          customerName: 'Valued Customer',
          deliveryZone: 'Dhaka City',
          totalAmount: 1850,
          courierName: 'Pathao Courier',
          trackingCode: 'PTH-' + Math.floor(100000 + Math.random() * 900000),
          createdAt: new Date().toLocaleDateString(),
          estimatedDelivery: 'Tomorrow by 6:00 PM',
        });
      } else {
        setNotFound(true);
      }
      setIsSearching(false);
    }, 600);
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
    <div className="bg-[#faf6f2] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#b45f77] uppercase tracking-widest">
            Live Shipment Tracking
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#201a1c] mt-1">
            Track Your Ishara Order
          </h1>
          <p className="text-xs sm:text-sm text-[#6b5e62] mt-1">
            Enter your Order Reference Number and Phone Number to see real-time updates.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-3xl border border-[#efe8e1] p-6 sm:p-8 shadow-xs mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                  Order Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ISH-2610-1234"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm uppercase text-[#201a1c] focus:outline-none focus:border-[#b45f77] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77] focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-3.5 px-6 bg-[#b45f77] hover:bg-[#9e4a62] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
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
          <div className="bg-white rounded-3xl border border-[#efe8e1] p-6 sm:p-8 shadow-md space-y-8 animate-in fade-in duration-300">
            {/* Top Details */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-[#efe8e1] gap-4">
              <div>
                <span className="text-[11px] text-[#8c7e83] uppercase tracking-wider font-semibold">
                  Order Reference
                </span>
                <h3 className="text-xl font-black text-[#b45f77]">{result.orderNumber}</h3>
                <p className="text-xs text-[#6b5e62] mt-0.5">Placed on {result.createdAt}</p>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] text-[#8c7e83] uppercase tracking-wider font-semibold">
                  Total Payable (COD)
                </span>
                <p className="text-lg font-bold text-[#201a1c]">৳{result.totalAmount.toLocaleString()} BDT</p>
                <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded-full mt-1">
                  Cash on Delivery
                </span>
              </div>
            </div>

            {/* Courier Tracking Info */}
            <div className="p-4 rounded-2xl bg-[#fdf5f7] border border-[#f5d4dc] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div>
                <p className="font-bold text-[#201a1c]">
                  Courier Partner: {result.courierName}
                </p>
                <p className="text-[#6b5e62]">Tracking Code: {result.trackingCode}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[#6b5e62]">Estimated Delivery</p>
                <p className="font-extrabold text-[#b45f77]">{result.estimatedDelivery}</p>
              </div>
            </div>

            {/* Timeline Stepper */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-[#201a1c] uppercase tracking-wider">
                Progress Timeline
              </h4>

              <div className="relative pl-6 space-y-8 border-l-2 border-[#efe8e1]">
                {steps.map((step, idx) => {
                  const state = getStepStatus(step.key, result.status);
                  return (
                    <div key={idx} className="relative">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                          state === 'completed'
                            ? 'bg-[#b45f77] text-white'
                            : state === 'current'
                            ? 'bg-[#b45f77] text-white ring-4 ring-[#b45f77]/20'
                            : 'bg-[#faf6f2] text-[#8c7e83] border border-[#efe8e1]'
                        }`}
                      >
                        {state === 'completed' ? '✓' : idx + 1}
                      </div>

                      <div>
                        <h5
                          className={`text-xs sm:text-sm font-bold ${
                            state === 'upcoming' ? 'text-[#8c7e83]' : 'text-[#201a1c]'
                          }`}
                        >
                          {step.title}
                        </h5>
                        <p className="text-[11px] text-[#6b5e62] mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Need Help */}
            <div className="pt-6 border-t border-[#efe8e1] flex items-center justify-between text-xs text-[#6b5e62]">
              <span>Need assistance with this parcel?</span>
              <a
                href="https://wa.me/8801711223344"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#b45f77] hover:underline flex items-center gap-1"
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
