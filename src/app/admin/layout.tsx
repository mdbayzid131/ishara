'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Settings,
  Megaphone,
  LogOut,
  ExternalLink,
  Store,
  Menu,
  X,
  Loader2,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If on login page, don't wrap with backoffice sidebar layout
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    let isMounted = true;
    fetch('/api/admin/auth/me')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unauthenticated');
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.authenticated) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            router.push('/admin/login');
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#201a1c] flex flex-col items-center justify-center p-4">
        <div className="relative w-40 h-14 mb-4 animate-pulse">
          <Image
            src="/images/ishara-logo.png"
            alt="Ishara Admin"
            fill
            sizes="160px"
            className="object-contain brightness-125"
          />
        </div>
        <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-[#b45f77]" />
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    } finally {
      router.push('/admin/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products & Stock', href: '/admin/products', icon: ShoppingBag },
    { name: 'Orders & COD', href: '/admin/orders', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Campaigns & Promos', href: '/admin/campaigns', icon: Megaphone },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#faf6f2] flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#201a1c] border-b border-[#3d3437] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="relative w-28 h-8">
          <Image
            src="/images/ishara-logo.png"
            alt="Ishara Admin"
            fill
            sizes="112px"
            className="object-contain brightness-125"
          />
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#ded5d7] hover:text-white rounded-lg bg-[#2c2527] border border-[#3d3437]"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Slide-out */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:flex w-full md:w-64 bg-[#201a1c] text-[#ded5d7] flex-col justify-between shrink-0 border-r border-[#3d3437] z-30 md:sticky md:top-0 md:h-screen`}
      >
        <div className="overflow-y-auto">
          {/* Brand header */}
          <div className="p-6 border-b border-[#3d3437] hidden md:block">
            <div className="relative w-36 h-10">
              <Image
                src="/images/ishara-logo.png"
                alt="Ishara Backoffice"
                fill
                sizes="144px"
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
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(item.href + '/');
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
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#3d3437] space-y-2 shrink-0">
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
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-950/40 transition-all text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
