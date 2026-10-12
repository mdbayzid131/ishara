'use client';

import React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Package,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Truck,
  TrendingUp,
} from 'lucide-react';
import { PRODUCTS } from '@/data/mockProducts';

export default function AdminDashboardPage() {
  // Sample recent orders for admin overview
  const recentOrders = [
    {
      id: 'ISH-2610-8421',
      customer: 'Tasmia Haque',
      phone: '01712998877',
      zone: 'Inside Dhaka',
      itemsCount: 2,
      total: 3140,
      status: 'pending',
      date: 'Today, 2:30 PM',
    },
    {
      id: 'ISH-2610-8419',
      customer: 'Mahmudul Hasan (Gift)',
      phone: '01819554433',
      zone: 'Outside Dhaka',
      itemsCount: 1,
      total: 1980,
      status: 'confirmed',
      date: 'Today, 11:15 AM',
    },
    {
      id: 'ISH-2610-8408',
      customer: 'Shamima Akter',
      phone: '01911443322',
      zone: 'Inside Dhaka',
      itemsCount: 1,
      total: 1290,
      status: 'shipped',
      date: 'Yesterday',
    },
    {
      id: 'ISH-2610-8395',
      customer: 'Anika Tabassum',
      phone: '01678112233',
      zone: 'Inside Dhaka',
      itemsCount: 3,
      total: 4500,
      status: 'delivered',
      date: 'Oct 10, 2026',
    },
  ];

  const lowStockItems = PRODUCTS.filter((p) => p.totalStock < 25);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c]">
            Store Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#6b5e62] mt-0.5">
            Monitor real-time Cash on Delivery orders, delivery logistics, and inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 bg-[#b45f77] text-white text-xs font-bold rounded-xl hover:bg-[#9e4a62] transition-colors shadow-xs"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#efe8e1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8c7e83]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#201a1c]">৳184,500</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <TrendingUp className="w-3 h-3" /> +18% from last week
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#efe8e1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8c7e83]">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#201a1c]">12 Orders</p>
          <span className="text-[11px] text-amber-700 font-semibold">
            Action required: phone verify
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#efe8e1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8c7e83]">
            <span className="text-xs font-bold uppercase tracking-wider">With Courier</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#201a1c]">28 Parcels</p>
          <span className="text-[11px] text-[#6b5e62]">
            Pathao & Steadfast deliveries
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#efe8e1] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8c7e83]">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Warnings</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#201a1c]">{lowStockItems.length} SKUs</p>
          <span className="text-[11px] text-rose-700 font-semibold">
            Less than 25 units available
          </span>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Stock Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#efe8e1] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#efe8e1] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#201a1c]">Recent Orders (COD)</h2>
              <p className="text-xs text-[#8c7e83]">Last customer orders placed via storefront</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-[#b45f77] font-bold hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf6f2] text-[#8c7e83] uppercase tracking-wider border-b border-[#efe8e1]">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Order</th>
                  <th className="py-3.5 px-6 font-semibold">Customer</th>
                  <th className="py-3.5 px-6 font-semibold">Location</th>
                  <th className="py-3.5 px-6 font-semibold">Total</th>
                  <th className="py-3.5 px-6 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efe8e1] text-[#201a1c]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#faf6f2]/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#b45f77]">
                      {ord.id}
                      <span className="block text-[10px] text-[#8c7e83] font-normal">{ord.date}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold">{ord.customer}</span>
                      <span className="block text-[#8c7e83] text-[11px]">{ord.phone}</span>
                    </td>
                    <td className="py-4 px-6 text-[#6b5e62]">{ord.zone}</td>
                    <td className="py-4 px-6 font-bold">৳{ord.total.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watch */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#efe8e1] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#efe8e1]">
            <h3 className="text-sm font-bold text-[#201a1c] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#b45f77]" />
              <span>Low Inventory Watch</span>
            </h3>
            <span className="text-[10px] text-[#8c7e83]">Threshold: 25</span>
          </div>

          <div className="space-y-3">
            {lowStockItems.map((prod) => (
              <div
                key={prod.id}
                className="p-3 rounded-2xl bg-[#faf6f2] border border-[#efe8e1] flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-[#201a1c] truncate">{prod.title}</p>
                  <p className="text-[11px] text-[#8c7e83]">{prod.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-rose-600 block">
                    {prod.totalStock} left
                  </span>
                  <span className="text-[10px] text-[#8c7e83]">Restock soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
