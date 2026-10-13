import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
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
  title: 'Ishara — Luxury Ladies Accessories & Lifestyle | Cash on Delivery Bangladesh',
  description: 'Shop luxury handbags, fine rose-gold jewelry, sunglasses, and curated beauty gadgets in Bangladesh. 100% Cash on Delivery, 24-48h Dhaka delivery, and 7 days easy exchange.',
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
        <AnalyticsTracker />
        <CartProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <Suspense fallback={null}>
            <CartDrawer />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}
