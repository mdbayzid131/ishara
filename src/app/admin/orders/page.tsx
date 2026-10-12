'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  address: string;
  zone: string;
  items: string;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  courier?: string;
  trackingCode?: string;
  date: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ISH-2610-8421',
    customer: 'Tasmia Haque',
    phone: '01712998877',
    address: 'House 12, Road 4, Sector 7, Uttara, Dhaka',
    zone: 'Inside Dhaka',
    items: 'Classic Mini Crossbody Bag (Beige) x1, Celestial Pearl Choker x1',
    total: 3140,
    status: 'pending',
    date: 'Today, 2:30 PM',
  },
  {
    id: 'ISH-2610-8419',
    customer: 'Mahmudul Hasan',
    phone: '01819554433',
    address: 'Chowdhury Bari, GEC Circle, Chittagong',
    zone: 'Outside Dhaka',
    items: 'Classic Mini Crossbody Bag (Noir Black) x1',
    total: 1980,
    status: 'confirmed',
    courier: 'Steadfast',
    trackingCode: 'STDF-881923',
    date: 'Today, 11:15 AM',
  },
  {
    id: 'ISH-2610-8408',
    customer: 'Shamima Akter',
    phone: '01911443322',
    address: 'Block C, Dhanmondi 27, Dhaka',
    zone: 'Inside Dhaka',
    items: 'Celestial Baroque Pearl Choker x1',
    total: 1290,
    status: 'shipped',
    courier: 'Pathao',
    trackingCode: 'PTH-992144',
    date: 'Yesterday',
  },
  {
    id: 'ISH-2610-8395',
    customer: 'Anika Tabassum',
    phone: '01678112233',
    address: 'Gulshan 1, Dhaka',
    zone: 'Inside Dhaka',
    items: 'Rose-Glow Sonic Wand x1, Aurora Crystal Earrings x1',
    total: 3600,
    status: 'delivered',
    courier: 'Pathao',
    trackingCode: 'PTH-771120',
    date: 'Oct 10, 2026',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c]">
          Orders & Cash on Delivery Fulfillment
        </h1>
        <p className="text-xs sm:text-sm text-[#6b5e62] mt-0.5">
          Verify guest orders, update delivery status, and attach courier tracking codes.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#efe8e1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by order #, customer or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
          />
          <Search className="w-4 h-4 text-[#8c7e83] absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize shrink-0 transition-all ${
                statusFilter === st
                  ? 'bg-[#b45f77] text-white shadow-xs'
                  : 'bg-[#faf6f2] text-[#6b5e62] hover:bg-white border border-[#efe8e1]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#efe8e1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf6f2] text-[#8c7e83] uppercase tracking-wider border-b border-[#efe8e1]">
              <tr>
                <th className="py-4 px-6 font-semibold">Order #</th>
                <th className="py-4 px-6 font-semibold">Customer & Address</th>
                <th className="py-4 px-6 font-semibold">Items</th>
                <th className="py-4 px-6 font-semibold">COD Total</th>
                <th className="py-4 px-6 font-semibold">Courier Tracking</th>
                <th className="py-4 px-6 font-semibold">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efe8e1] text-[#201a1c]">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#faf6f2]/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-[#b45f77] block">{ord.id}</span>
                    <span className="text-[11px] text-[#8c7e83]">{ord.date}</span>
                  </td>
                  <td className="py-4 px-6 max-w-xs">
                    <span className="font-bold block">{ord.customer}</span>
                    <span className="text-[11px] text-[#8c7e83] block">{ord.phone}</span>
                    <span className="text-[11px] text-[#6b5e62] line-clamp-1">{ord.address}</span>
                  </td>
                  <td className="py-4 px-6 max-w-xs text-[#6b5e62]">
                    <span className="line-clamp-2">{ord.items}</span>
                  </td>
                  <td className="py-4 px-6 font-extrabold text-[#201a1c]">
                    ৳{ord.total.toLocaleString()} BDT
                  </td>
                  <td className="py-4 px-6">
                    {ord.courier ? (
                      <span className="text-[11px] font-semibold text-[#201a1c] block">
                        {ord.courier}: {ord.trackingCode}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#8c7e83] italic">Not Assigned</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={ord.status}
                      onChange={(e) =>
                        handleStatusChange(ord.id, e.target.value as AdminOrder['status'])
                      }
                      className={`text-xs py-1.5 px-3 rounded-xl font-bold uppercase tracking-wider border focus:outline-none ${
                        ord.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : ord.status === 'confirmed'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : ord.status === 'shipped'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
