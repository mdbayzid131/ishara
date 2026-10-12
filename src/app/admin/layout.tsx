'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  Store,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't wrap with backoffice sidebar layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (e) {
      console.error(e);
      router.push('/admin/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products & Stock', href: '/admin/products', icon: ShoppingBag },
    { name: 'Orders & COD', href: '/admin/orders', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#faf6f2] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#201a1c] text-[#ded5d7] flex flex-col justify-between shrink-0 border-r border-[#3d3437]">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#3d3437]">
            <div className="relative w-36 h-10">
              <Image
                src="/images/ishara-logo.png"
                alt="Ishara Backoffice"
                fill
                className="object-contain brightness-125"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#b45f77] block mt-2">
              Merchant Admin Portal
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#b45f77] text-white shadow-sm'
                      : 'text-[#8c7e83] hover:text-white hover:bg-[#2c2527]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#3d3437] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#8c7e83] hover:text-white hover:bg-[#2c2527] transition-all"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#c5a880]" />
              <span>View Live Store</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-950/40 transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
