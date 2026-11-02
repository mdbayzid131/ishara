import React from 'react';
import { Truck, MapPin } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="reference-policy bg-[#0d0d0d] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161616] rounded-3xl border border-[#ffffff14] p-6 sm:p-12 shadow-xs space-y-8">
          <div>
            <span className="text-xs font-bold text-[#d43b4a] uppercase tracking-wider">
              Transparency & Care
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f3eee8] mt-1">
              Shipping & Delivery Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#b7aaa4] mt-1">
              Last updated: October 2026 • Bangladesh Operations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#241316] border border-[#f5d4dc] space-y-1">
              <span className="text-xs font-bold text-[#d43b4a] uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Inside Dhaka City
              </span>
              <p className="text-xl font-black text-[#f3eee8]">৳70 BDT</p>
              <p className="text-xs text-[#b7aaa4]">Delivered within 24 - 48 Hours</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-[#ffffff14] space-y-1">
              <span className="text-xs font-bold text-[#d43b4a] uppercase flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Outside Dhaka (All BD)
              </span>
              <p className="text-xl font-black text-[#f3eee8]">৳130 BDT</p>
              <p className="text-xs text-[#b7aaa4]">Delivered within 2 - 4 Business Days</p>
            </div>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#b7aaa4] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">1. 100% Cash on Delivery (COD)</h2>
              <p>
                We do not demand any advance payment before order dispatch. You pay the exact invoice amount in cash directly to the courier delivery rider at your doorstep.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">2. Package Inspection at Doorstep</h2>
              <p>
                We encourage you to open the courier parcel and check the contents before making payment. If you notice any damage or incorrect model, you may return the package immediately with the rider without paying.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">3. Order Confirmation Call / WhatsApp</h2>
              <p>
                To prevent accidental or duplicate submissions, our customer support team will place a brief verification call or send a WhatsApp confirmation message before handing your package to the courier service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">4. Free Shipping Offer</h2>
              <p>
                Orders totaling ৳3,000 or more automatically qualify for FREE delivery across Dhaka!
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
