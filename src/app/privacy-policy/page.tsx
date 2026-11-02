import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="reference-policy bg-[#0d0d0d] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161616] rounded-3xl border border-[#ffffff14] p-6 sm:p-12 shadow-xs space-y-8">
          <div>
            <span className="text-xs font-bold text-[#d43b4a] uppercase tracking-wider">
              Privacy First
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f3eee8] mt-1">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#b7aaa4] mt-1">
              How we safeguard customer information at Ishara
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#b7aaa4] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">1. What Information We Collect</h2>
              <p>
                When placing a Cash on Delivery order, we collect only necessary delivery coordinates: your full name, mobile phone number, delivery address, and any optional delivery notes. We do not store sensitive credit/debit card details because all transactions occur via Cash on Delivery.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">2. Use of Information</h2>
              <p>
                Your phone number and address are strictly shared with our authorized courier partners (e.g. Pathao, Steadfast, RedX) solely for delivering your order and coordinating doorstep handover. We never sell, rent, or trade your personal data with third-party advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">3. Analytics & Meta Pixel</h2>
              <p>
                We use privacy-conscious analytics and Meta Pixel tracking to evaluate aggregate store visits and measure social media campaign effectiveness without exposing personal identifiable records.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
