import React from 'react';

export default function ReturnRefundPolicyPage() {
  return (
    <div className="reference-policy bg-[#0d0d0d] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161616] rounded-3xl border border-[#ffffff14] p-6 sm:p-12 shadow-xs space-y-8">
          <div>
            <span className="text-xs font-bold text-[#d43b4a] uppercase tracking-wider">
              Peace of Mind
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f3eee8] mt-1">
              Returns & Exchanges Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#b7aaa4] mt-1">
              7 Days Hassle-Free Exchange Guarantee
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#b7aaa4] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">1. Eligibility for 7-Day Exchange</h2>
              <p>
                We want you to feel completely confident when shopping with Ishara. If your item has a manufacturing defect, arrived in damaged condition, or you received the incorrect color/variant, you are entitled to an exchange within 7 days of parcel delivery.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">2. Conditions for Return / Replacement</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>The item must be unused, unwashed, and in its original pristine condition.</li>
                <li>All original brand tags, velvet pouches, or jewelry boxes must be intact.</li>
                <li>Provide a clear photo or short unboxing video showing the issue to our WhatsApp team.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#f3eee8]">3. How to Initiate an Exchange</h2>
              <p>
                Simply message us on WhatsApp at <strong className="text-[#f3eee8]">+880 1711-223344</strong> with your Order Number (e.g. ISH-2610-XXXX) and photo of the item. Our support agent will arrange a reverse courier pickup or doorstep swap.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
