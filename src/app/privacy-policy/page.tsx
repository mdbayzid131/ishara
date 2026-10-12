import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#faf6f2] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#efe8e1] p-6 sm:p-12 shadow-xs space-y-8">
          <div>
            <span className="text-xs font-bold text-[#b45f77] uppercase tracking-wider">
              Privacy First
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#201a1c] mt-1">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#6b5e62] mt-1">
              How we safeguard customer information at Ishara
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#6b5e62] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#201a1c]">1. What Information We Collect</h2>
              <p>
                When placing a Cash on Delivery order, we collect only necessary delivery coordinates: your full name, mobile phone number, delivery address, and any optional delivery notes. We do not store sensitive credit/debit card details because all transactions occur via Cash on Delivery.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#201a1c]">2. Use of Information</h2>
              <p>
                Your phone number and address are strictly shared with our authorized courier partners (e.g. Pathao, Steadfast, RedX) solely for delivering your order and coordinating doorstep handover. We never sell, rent, or trade your personal data with third-party advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#201a1c]">3. Analytics & Meta Pixel</h2>
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
