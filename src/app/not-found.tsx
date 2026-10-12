import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#faf6f2] px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#efe8e1] text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#fdf5f7] text-[#b45f77] mx-auto flex items-center justify-center font-black text-2xl">
          404
        </div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#201a1c]">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-[#6b5e62]">
            The product or page you are looking for might have been moved or is no longer available.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#b45f77] text-white text-xs font-bold rounded-full hover:bg-[#9e4a62] transition-colors shadow-xs"
          >
            Back to Homepage
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 bg-[#faf6f2] text-[#201a1c] border border-[#efe8e1] text-xs font-bold rounded-full hover:bg-white transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
