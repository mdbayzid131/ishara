'use client';

import React, { useState } from 'react';
import { ChevronDown, CheckCircle2, ShieldCheck, Headphones } from 'lucide-react';

const FAQS = [
  {
    q: 'Can I check the product before paying the delivery rider?',
    a: 'Yes, absolutely! With our 100% Cash on Delivery (COD) service, you can open and inspect the package in front of the courier delivery rider before paying.',
  },
  {
    q: 'How much is the delivery charge and how long does it take?',
    a: 'Inside Dhaka delivery is only ৳70 (takes 24-48 hours). Outside Dhaka (all districts across Bangladesh) delivery is ৳130 (takes 2-4 days). Orders over ৳3,000 qualify for FREE delivery!',
  },
  {
    q: 'What is your exchange and return policy?',
    a: 'We offer an easy 7-day exchange guarantee. If there is any defect or size issue, simply notify our WhatsApp support (+880 1711-223344) within 7 days and we will arrange a replacement.',
  },
  {
    q: 'Do I need an account to place an order?',
    a: 'No account is required! You can place an order as a guest in less than 30 seconds by simply providing your name, phone number, and address.',
  },
];

export default function WhyIsharaSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-[#efe8e1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Why Ishara */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#b45f77] uppercase tracking-widest">
                The Ishara Promise
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c] mt-1">
                Why Thousands of Women Love Shopping With Us
              </h2>
            </div>

            <p className="text-sm text-[#6b5e62] leading-relaxed">
              We understand online shopping in Bangladesh requires trust, authenticity, and speed. That is why every single Ishara product is individually inspected for flawless craftsmanship before dispatch.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-[#fdf5f7] text-[#b45f77] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#201a1c]">Premium Craftsmanship</h4>
                  <p className="text-xs text-[#6b5e62] mt-0.5">Custom-designed hardware, high-density stitching, and anti-tarnish jewelry.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-[#fdf5f7] text-[#b45f77] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#201a1c]">Zero Advance Risk</h4>
                  <p className="text-xs text-[#6b5e62] mt-0.5">Pay safely via cash once the courier hands you the parcel.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-[#fdf5f7] text-[#b45f77] shrink-0 mt-0.5">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#201a1c]">Dedicated WhatsApp Support</h4>
                  <p className="text-xs text-[#6b5e62] mt-0.5">Instant human assistance for sizing questions, order updates, and tracking.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive FAQ Accordion */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-lg font-bold text-[#201a1c] mb-4">
              Frequently Asked Questions (FAQ)
            </h3>

            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border border-[#efe8e1] rounded-2xl overflow-hidden bg-[#faf6f2]/40 transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full py-4 px-5 flex items-center justify-between text-left gap-4 hover:bg-[#faf6f2] transition-colors"
                  >
                    <span className="text-sm font-semibold text-[#201a1c]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#b45f77] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#6b5e62] leading-relaxed border-t border-[#efe8e1]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
