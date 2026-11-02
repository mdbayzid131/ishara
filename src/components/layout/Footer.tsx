'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import Brand from '@/components/layout/Brand';

export default function Footer() {
  const pathname = usePathname();
  const { settings } = useStore();
  if (pathname.startsWith('/admin')) return null;
  return <footer className={`studio-footer ${pathname === '/' ? '' : 'compact-footer'}`}><div className="footer-main"><div className="footer-brand"><Link href="/" aria-label="Ishara home"><Brand light /></Link><p>Fashion for your mood.<br />Beauty for your everyday.<br />A little more you.</p><Link href="/shop" className="text-link">Find your next favourite <ArrowUpRight size={16} /></Link></div><div><h3>Explore</h3><Link href="/shop">All collections</Link><Link href="/shop?category=dresses">The dress edit</Link><Link href="/shop?category=beauty">Beauty essentials</Link><Link href="/about">Our story</Link></div><div><h3>Here to help</h3><Link href="/track-order">Track your order</Link><Link href="/shipping-policy">Delivery information</Link><Link href="/return-refund-policy">Returns & exchanges</Link><Link href="/contact">Contact us</Link></div><div className="footer-contact"><h3>Let’s talk</h3><a href={`tel:${settings.phone.replace(/[^+0-9]/g, '')}`}>{settings.phone}</a><a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a><span>Dhaka, Bangladesh</span><span className="cod-pill">CASH ON DELIVERY</span></div></div><div className="footer-wordmark" aria-hidden="true">ISHARA<span>®</span></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Ishara. An expression of you.</span><div><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link><span>BDT ৳ / BANGLADESH</span></div></div></footer>;
}
