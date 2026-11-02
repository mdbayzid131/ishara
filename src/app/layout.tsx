import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import './studio.css';
import './reference.css';
import { WishlistProvider } from '@/context/WishlistContext';
import { StoreProvider } from '@/context/StoreContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import AnalyticsTracker from '@/components/tracking/AnalyticsTracker';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ishara.com.bd'),
  title: 'Ishara — An Expression of You | Fashion & Beauty',
  description: 'Discover Ishara fashion, beauty and accessories in Bangladesh. 100% Cash on Delivery, 24-48h Dhaka delivery, and 7 days easy exchange.',
  keywords: ['Ishara', 'Ladies accessories Bangladesh', 'handbags Dhaka', 'jewelry online BD', 'Cash on Delivery', 'ladies fashion BD'],
  openGraph: {
    title: 'Ishara — Luxury Ladies Accessories & Lifestyle',
    description: 'Elegance in Every Detail. Handcrafted jewelry, structured luxury handbags, and lifestyle gadgets with Cash on Delivery in Bangladesh.',
    url: 'https://ishara.com.bd',
    siteName: 'Ishara Bangladesh',
    images: [
      {
        url: '/images/ishara-logo.png',
        width: 800,
        height: 600,
        alt: 'Ishara Brand',
      },
    ],
    locale: 'en_BD',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-[#faf6f2] text-[#201a1c] antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:p-3 focus:rounded-lg">Skip to content</a>
        <AnalyticsTracker />
        <StoreProvider><WishlistProvider><CartProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <Suspense fallback={null}>
            <CartDrawer />
          </Suspense>
          <main id="main-content" className="flex-1 storefront-content">
            {process.env.NODE_ENV !== 'production' && process.env.ISHARA_DEMO_MODE === '1' && <div role="status" className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-900">Preview mode · Sample products. Orders are disabled until the database is connected.</div>}
            {children}
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </CartProvider></WishlistProvider></StoreProvider>
      </body>
    </html>
  );
}
