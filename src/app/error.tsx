'use client';

import Link from 'next/link';

export default function StoreError({ retry }: { retry: () => void }) {
  return <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-5">
    <h1 className="text-2xl font-bold">We couldn’t load the store</h1>
    <p className="text-[#6b5e62]">Please try again in a moment. Your shopping bag is kept on this device.</p>
    <button onClick={retry} className="rounded-xl bg-[#8c4056] px-6 py-3 text-white">Try again</button>
    <Link href="/contact" className="block underline text-[#8c4056]">Contact us</Link>
  </div>;
}
