'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Package,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Truck,
  ChevronRight,
} from 'lucide-react';
import { PRODUCTS } from '@/data/mockProducts';

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  lowStockCount: number;
  lowStockItems: {
    id: string;
    title: string;
    slug: string;
    totalStock: number;
    variants?: { sku: string; name: string; stock: number }[];
  }[];
  recentOrders: {
    id: string;
    customer: string;
    phone: string;
    zone: string;
    itemsCount: number;
    total: number;
    status: string;
    createdAt: string;
  }[];
}

const DEFAULT_STATS: AdminStats = {
  totalRevenue: 34500,
  totalOrders: 16,
  pendingOrders: 4,
  confirmedOrders: 5,
  processingOrders: 2,
  shippedOrders: 3,
  deliveredOrders: 2,
  cancelledOrders: 0,
  lowStockCount: 3,
  lowStockItems: PRODUCTS.filter((p) => p.totalStock < 25).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    totalStock: p.totalStock,
    variants: p.variants.map((v) => ({ sku: v.sku, name: v.name, stock: v.stock })),
  })),
  recentOrders: [
    {
      id: 'ISH-2610-8421',
      customer: 'Tasmia Haque',
      phone: '01712998877',
      zone: 'Inside Dhaka',
      itemsCount: 2,
      total: 3140,
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ISH-2610-8419',
      customer: 'Mahmudul Hasan',
      phone: '01819554433',
      zone: 'Outside Dhaka',
      itemsCount: 1,
      total: 1980,
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ],
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>(DEFAULT_STATS);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.stats && isMounted) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error('Failed to load admin stats:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c]">
            Store Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#6b5e62] mt-0.5">
            Monitor real-time Cash on Delivery orders, delivery logistics, and inventory status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 bg-[#b45f77] text-white text-xs font-bold rounded-xl hover:bg-[#9e4a62] transition-colors shadow-xs flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Process Orders</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-4 py-2.5 bg-white border border-[#efe8e1] text-[#201a1c] text-xs font-bold rounded-xl hover:bg-[#faf6f2] transition-colors shadow-xs"
          >
            Catalog & Stocks
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-[#efe8e1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8c7e83]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#201a1c]">
            ৳{stats.totalRevenue.toLocaleString()} BDT
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            Across {stats.totalOrders} total orders
          </span>
        </div>

        {/* Pending Verification */}
        <div className="bg-white p-6 rounded-3xl border border-[#efe8e1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8c7e83]">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#201a1c]">{stats.pendingOrders}</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
            Awaiting customer phone verification
          </span>
        </div>

        {/* Shipped & Courier */}
        <div className="bg-white p-6 rounded-3xl border border-[#efe8e1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8c7e83]">
            <span className="text-xs font-bold uppercase tracking-wider">With Courier</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#201a1c]">{stats.shippedOrders}</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700">
            In-transit for doorstep COD collection
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-3xl border border-[#efe8e1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8c7e83]">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Alert</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600">{stats.lowStockCount}</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
            Items need reordering soon
          </span>
        </div>
      </div>

      {/* Low Stock Notice Banner (If any) */}
      {stats.lowStockItems && stats.lowStockItems.length > 0 && (
        <div className="bg-rose-50/60 border border-rose-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-rose-950">
                  Critical Inventory Notice: {stats.lowStockItems.length} Products Low in Stock
                </h3>
                <p className="text-xs text-rose-800/80">
                  Prevent stock-outs before running social ad campaigns.
                </p>
              </div>
            </div>

            <Link
              href="/admin/products"
              className="text-xs font-bold text-rose-700 hover:text-rose-900 underline flex items-center gap-1"
            >
              <span>Manage Inventory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.lowStockItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-2xl border border-rose-200/80 flex items-center justify-between shadow-xs"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-[#201a1c] truncate">{item.title}</p>
                  <span className="text-[11px] text-[#8c7e83]">
                    {item.variants && item.variants.length > 0
                      ? `${item.variants.length} Variants`
                      : 'Single SKU'}
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-black rounded-lg shrink-0">
                  {item.totalStock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Recent Orders & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Orders */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#efe8e1] shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#201a1c]">Recent Guest Orders</h2>
              <p className="text-xs text-[#6b5e62]">Latest Cash on Delivery customer submissions</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#b45f77] hover:text-[#9e4a62] flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf6f2] text-[#8c7e83] uppercase tracking-wider border-b border-[#efe8e1]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Zone</th>
                  <th className="py-3 px-4 font-semibold">COD Total</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efe8e1] text-[#201a1c]">
                {stats.recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#faf6f2]/50 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-[#b45f77]">{ord.id}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold block">{ord.customer}</span>
                      <span className="text-[11px] text-[#8c7e83]">{ord.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#6b5e62]">{ord.zone}</td>
                    <td className="py-3.5 px-4 font-bold">৳{ord.total.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/admin/orders"
                        className="px-2.5 py-1 bg-white border border-[#efe8e1] text-xs font-bold rounded-lg hover:bg-[#faf6f2] transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Courier & Operational Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-[#efe8e1] shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#201a1c] uppercase tracking-wider">
              COD Fulfillment Funnel
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf6f2] text-xs">
                <span className="font-semibold text-[#201a1c]">1. Pending Verification</span>
                <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  {stats.pendingOrders}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf6f2] text-xs">
                <span className="font-semibold text-[#201a1c]">2. Confirmed & Packaging</span>
                <span className="font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  {stats.confirmedOrders + stats.processingOrders}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf6f2] text-xs">
                <span className="font-semibold text-[#201a1c]">3. In Courier Transit</span>
                <span className="font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  {stats.shippedOrders}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf6f2] text-xs">
                <span className="font-semibold text-[#201a1c]">4. Delivered & Paid</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {stats.deliveredOrders}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/orders"
                className="w-full py-2.5 bg-[#b45f77] hover:bg-[#9e4a62] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs"
              >
                <span>Open Fulfillment Center</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
