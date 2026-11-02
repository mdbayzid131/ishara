'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, ArrowUpRight, Truck, Wallet, RotateCcw, Phone, Heart, UserRound } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const { settings } = useStore();
  const { items: saved } = useWishlist();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  if (pathname.startsWith('/admin')) return null;
  const links = [['Home', '/'], ['Shop', '/shop'], ['About', '/about'], ['Contact', '/contact']];
  function submit(event: FormEvent) { event.preventDefault(); if (query.trim()) { router.push(`/shop?q=${encodeURIComponent(query.trim())}`); setSearch(false); setMenu(false); } }
  return <header className="studio-header compact-header"><div className="studio-topbar"><span><Truck size={12} />Nationwide Delivery<i /><Wallet size={12} />Cash on Delivery<i /><RotateCcw size={12} /><Link href="/return-refund-policy">Returns & Exchanges</Link><i /><Phone size={12} /><a href={`tel:${settings.phone.replace(/[^+0-9]/g, '')}`}>Call: {settings.phone}</a></span><Link href="/track-order">Track order <ArrowUpRight size={12} /></Link></div>
    <div className="studio-nav"><Link className="compact-brand" href="/" aria-label="Ishara home" onClick={() => setMenu(false)}><span className="brand-monogram">I<span>.</span></span><span>ISHARA<span className="brand-dot">.</span></span></Link><nav aria-label="Main navigation" className="desktop-nav">{links.map(([label, href]) => <Link href={href} key={label} className={(href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'is-active' : ''}>{label}</Link>)}</nav><form className="header-search" onSubmit={submit}><Search size={15} /><input aria-label="Search products" placeholder="Search products…" value={query} onChange={(event) => setQuery(event.target.value)} /><button type="submit" aria-label="Submit search"><ArrowUpRight size={13} /></button></form><div className="nav-actions"><button className="mobile-search-toggle" aria-label="Open product search" aria-expanded={search} onClick={() => setSearch(!search)}><Search size={19} /></button><Link className="nav-saved" href="/wishlist" aria-label={`Saved products${saved.length ? `, ${saved.length} items` : ''}`}><Heart size={19} />{saved.length > 0 && <span>{saved.length}</span>}</Link><Link href="/track-order" aria-label="My orders" className="nav-orders"><UserRound size={19} /></Link><button className="nav-bag" aria-label={`View shopping bag${totalItems ? `, ${totalItems} items` : ''}`} onClick={() => setIsCartOpen(true)}><ShoppingBag size={19} /><span className="bag-count">{totalItems}</span></button><button className="mobile-nav-toggle" aria-label={menu ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={22} /> : <Menu size={22} />}</button></div></div>
    {search && <form className="studio-search" onSubmit={submit}><Search size={18} /><input type="search" autoFocus aria-label="Search the collection" placeholder="Search dresses, beauty, accessories…" value={query} onChange={(event) => setQuery(event.target.value)} /><button type="submit">Search</button><button type="button" aria-label="Close search" onClick={() => setSearch(false)}><X size={18} /></button></form>}
    {menu && <nav className="studio-mobile-menu" aria-label="Mobile navigation">{[...links, ['Dresses', '/shop?category=dresses'], ['Beauty', '/shop?category=beauty'], ['Saved pieces', '/wishlist']].map(([label, href]) => <Link href={href} key={label} onClick={() => setMenu(false)}>{label}<ArrowUpRight size={17} /></Link>)}</nav>}
  </header>;
}
