import React from 'react';

export default function TermsPage() {
  return (
    <div className="reference-policy bg-[#0d0d0d] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161616] rounded-3xl border border-[#ffffff14] p-6 sm:p-12 shadow-xs space-y-8">
          <div>
            <span className="text-xs font-bold text-[#d43b4a] uppercase tracking-wider">
              Legal Notice
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f3eee8] mt-1">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-[#b7aaa4] mt-1">
              Applicable to all Ishara online store orders
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#b7aaa4] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">1. Acceptance of Terms</h2>
              <p>
                By placing an order on Ishara, you confirm that you are at least 18 years old or possess parental consent, and agree to provide accurate recipient contact details for delivery.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">2. Pricing & Product Descriptions</h2>
              <p>
                All prices are stated in Bangladeshi Taka (BDT ৳) and are inclusive of standard local taxes. Delivery charges are displayed clearly before you confirm the order. We make every effort to display the colors and details of our products accurately.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">3. Cash on Delivery Commitment</h2>
              <p>
                Placing an order with Cash on Delivery creates a commitment for shipment preparation. If you wish to cancel an order, please notify us immediately before the parcel is dispatched with the courier.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
