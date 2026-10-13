'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Printer, Eye, RefreshCw, Package } from 'lucide-react';
import OrderDetailModal, { AdminOrderDetail } from '@/components/admin/OrderDetailModal';
import OrderInvoiceModal from '@/components/admin/OrderInvoiceModal';
import { OrderStatus } from '@/models/Order';

const FALLBACK_ORDERS: AdminOrderDetail[] = [
  {
    orderNumber: 'ISH-2610-8421',
    createdAt: new Date().toISOString(),
    status: 'pending',
    paymentMethod: 'COD',
    customer: {
      name: 'Tasmia Haque',
      phone: '01712998877',
      address: 'House 12, Road 4, Sector 7, Uttara, Dhaka',
      deliveryZoneName: 'Inside Dhaka',
      notes: 'Please call before delivery',
    },
    items: [
      {
        productId: 'prod-01',
        title: 'Classic Mini Crossbody Bag',
        variantName: 'Champagne Beige',
        variantSku: 'BAG-MINI-BEG',
        price: 1850,
        quantity: 1,
        subtotal: 1850,
      },
      {
        productId: 'prod-02',
        title: 'Celestial Baroque Pearl Choker',
        variantName: 'Gold / White Pearl',
        variantSku: 'JWL-CHK-GLD',
        price: 1290,
        quantity: 1,
        subtotal: 1290,
      },
    ],
    subtotal: 3140,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 3140,
    timeline: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
        note: 'Order placed via Cash on Delivery (COD) guest checkout.',
        actor: 'Customer',
      },
    ],
  },
  {
    orderNumber: 'ISH-2610-8419',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    status: 'confirmed',
    paymentMethod: 'COD',
    customer: {
      name: 'Mahmudul Hasan',
      phone: '01819554433',
      address: 'Chowdhury Bari, GEC Circle, Chittagong',
      deliveryZoneName: 'Outside Dhaka',
    },
    items: [
      {
        productId: 'prod-01',
        title: 'Classic Mini Crossbody Bag',
        variantName: 'Noir Black',
        variantSku: 'BAG-MINI-BLK',
        price: 1850,
        quantity: 1,
        subtotal: 1850,
      },
    ],
    subtotal: 1850,
    deliveryFee: 130,
    discount: 0,
    totalAmount: 1980,
    courier: {
      provider: 'Steadfast Courier',
      trackingCode: 'STDF-881923',
    },
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderDetail[]>(FALLBACK_ORDERS);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<AdminOrderDetail | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = statusFilter !== 'all' ? `/api/orders?status=${statusFilter}` : '/api/orders';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.orders && data.orders.length > 0) {
          setOrders(data.orders);
        }
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    let isMounted = true;
    const url = statusFilter !== 'all' ? `/api/orders?status=${statusFilter}` : '/api/orders';
    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.orders && data.orders.length > 0 && isMounted) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error('Failed to load orders:', err));

    return () => {
      isMounted = false;
    };
  }, [statusFilter]);

  const handleQuickStatusChange = async (orderNumber: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrderUpdated = (updated: AdminOrderDetail) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderNumber === updated.orderNumber ? updated : o))
    );
    if (selectedOrder?.orderNumber === updated.orderNumber) {
      setSelectedOrder(updated);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c]">
            Orders & Cash on Delivery Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-[#6b5e62] mt-0.5">
            Process incoming guest orders, assign courier providers, track parcels, and print COD invoices.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="px-4 py-2.5 bg-white border border-[#efe8e1] hover:bg-[#faf6f2] text-[#201a1c] text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#b45f77]' : ''}`} />
          <span>Refresh</span>
        </button>
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

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize shrink-0 transition-all cursor-pointer ${
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
                <th className="py-4 px-6 font-semibold">Customer & Destination</th>
                <th className="py-4 px-6 font-semibold">Items Snapshot</th>
                <th className="py-4 px-6 font-semibold">COD Total</th>
                <th className="py-4 px-6 font-semibold">Courier Tracking</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efe8e1] text-[#201a1c]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8c7e83]">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <span>No orders found matching the criteria.</span>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.orderNumber} className="hover:bg-[#faf6f2]/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-[#b45f77] block">{ord.orderNumber}</span>
                      <span className="text-[11px] text-[#8c7e83]">
                        {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <span className="font-bold block">{ord.customer.name}</span>
                      <span className="text-[11px] text-[#8c7e83] block">{ord.customer.phone}</span>
                      <span className="text-[11px] text-[#6b5e62] line-clamp-1">{ord.customer.address}</span>
                    </td>
                    <td className="py-4 px-6 max-w-xs text-[#6b5e62]">
                      <span className="line-clamp-2">
                        {ord.items.map((i) => `${i.title} (x${i.quantity})`).join(', ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-[#201a1c]">
                      ৳{ord.totalAmount.toLocaleString()} BDT
                    </td>
                    <td className="py-4 px-6">
                      {ord.courier?.trackingCode ? (
                        <div>
                          <span className="text-[11px] font-bold text-[#201a1c] block">
                            {ord.courier.provider || 'Courier'}
                          </span>
                          <span className="text-[11px] font-mono text-[#b45f77]">
                            {ord.courier.trackingCode}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#8c7e83] italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          handleQuickStatusChange(ord.orderNumber, e.target.value as OrderStatus)
                        }
                        className={`text-xs py-1.5 px-3 rounded-xl font-bold uppercase tracking-wider border focus:outline-none cursor-pointer ${
                          ord.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : ord.status === 'confirmed'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : ord.status === 'processing'
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                            : ord.status === 'shipped'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : ord.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : ord.status === 'returned'
                            ? 'bg-orange-50 text-orange-800 border-orange-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-2 rounded-xl border border-[#efe8e1] hover:text-[#b45f77] hover:bg-[#faf6f2] transition-colors cursor-pointer"
                          title="View order details and assign courier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setInvoiceOrder(ord)}
                          className="p-2 rounded-xl border border-[#efe8e1] hover:text-[#b45f77] hover:bg-[#faf6f2] transition-colors cursor-pointer"
                          title="Print COD invoice / slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={handleOrderUpdated}
          onOpenInvoice={(ord) => {
            setSelectedOrder(null);
            setInvoiceOrder(ord);
          }}
        />
      )}

      {/* Order Invoice Modal */}
      {invoiceOrder && (
        <OrderInvoiceModal
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
