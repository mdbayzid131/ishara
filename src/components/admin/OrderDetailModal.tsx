'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Printer,
  Truck,
  CheckCircle,
  Phone,
  MapPin,
  Save,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { OrderStatus } from '@/models/Order';

export interface AdminOrderDetailItem {
  productId: string;
  variantSku?: string;
  title: string;
  variantName?: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface AdminOrderDetail {
  _id?: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    deliveryZoneName?: string;
    deliveryZone?: string;
    notes?: string;
  };
  items: AdminOrderDetailItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  courier?: {
    provider?: string;
    trackingCode?: string;
    consignmentId?: string;
    notes?: string;
  };
  timeline?: {
    status: string;
    timestamp: string;
    note: string;
    actor: string;
  }[];
}

interface OrderDetailModalProps {
  order: AdminOrderDetail | null;
  onClose: () => void;
  onOrderUpdated: (updatedOrder: AdminOrderDetail) => void;
  onOpenInvoice: (order: AdminOrderDetail) => void;
}

const COURIER_PROVIDERS = [
  'Steadfast Courier',
  'Pathao Courier',
  'RedX Logistics',
  'Paperfly Delivery',
  'Manual / In-House Delivery',
];

export default function OrderDetailModal({
  order,
  onClose,
  onOrderUpdated,
  onOpenInvoice,
}: OrderDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order?.status || 'pending');
  const [courierProvider, setCourierProvider] = useState(order?.courier?.provider || 'Steadfast Courier');
  const [trackingCode, setTrackingCode] = useState(order?.courier?.trackingCode || '');
  const [adminNote, setAdminNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  if (!order) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const res = await fetch(`/api/admin/orders/${order.orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: currentStatus,
          courier: {
            provider: courierProvider,
            trackingCode: trackingCode.trim(),
          },
          adminNote: adminNote.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSaveError(data.error || 'Failed to update order');
        setIsSaving(false);
        return;
      }

      setSaveSuccess(true);
      setAdminNote('');
      setIsSaving(false);

      if (data.order) {
        onOrderUpdated(data.order);
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setSaveError('Network error while saving order updates');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-[#efe8e1] flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#faf6f2] border-b border-[#efe8e1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fdf5f7] border border-[#f5d4dc] flex items-center justify-center text-[#b45f77]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#201a1c]">{order.orderNumber}</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    currentStatus === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : currentStatus === 'confirmed'
                      ? 'bg-blue-100 text-blue-800'
                      : currentStatus === 'shipped'
                      ? 'bg-purple-100 text-purple-800'
                      : currentStatus === 'delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {currentStatus}
                </span>
              </div>
              <p className="text-[11px] text-[#8c7e83]">
                Placed on {new Date(order.createdAt).toLocaleString()} | Payment: {order.paymentMethod}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenInvoice(order)}
              className="px-3 py-2 bg-white hover:bg-[#faf6f2] border border-[#efe8e1] text-[#201a1c] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#b45f77]" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#6b5e62] hover:text-[#201a1c] hover:bg-white rounded-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Status & Courier Action Panel */}
          <div className="bg-[#faf6f2] p-6 rounded-2xl border border-[#efe8e1] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b45f77] flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Fulfillment & Logistics Controls
              </span>
              {saveSuccess && (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Updated successfully!
                </span>
              )}
              {saveError && (
                <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {saveError}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Order Status */}
              <div>
                <label className="text-[11px] font-bold text-[#201a1c] block mb-1">
                  Order Status
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as OrderStatus)}
                  className="w-full bg-white border border-[#efe8e1] rounded-xl px-3 py-2 text-xs font-semibold text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                >
                  <option value="pending">Pending (Awaiting Verification)</option>
                  <option value="confirmed">Confirmed (Verified with Customer)</option>
                  <option value="processing">Processing & Packaging</option>
                  <option value="shipped">Shipped (Handed to Courier)</option>
                  <option value="delivered">Delivered (Payment Collected)</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              {/* Courier Provider */}
              <div>
                <label className="text-[11px] font-bold text-[#201a1c] block mb-1">
                  Courier Partner
                </label>
                <select
                  value={courierProvider}
                  onChange={(e) => setCourierProvider(e.target.value)}
                  className="w-full bg-white border border-[#efe8e1] rounded-xl px-3 py-2 text-xs font-semibold text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                >
                  {COURIER_PROVIDERS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Courier Tracking Code */}
              <div>
                <label className="text-[11px] font-bold text-[#201a1c] block mb-1">
                  Tracking Code / Consignment Ref
                </label>
                <input
                  type="text"
                  placeholder="e.g. STDF-192837 or PTH-8821"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full bg-white border border-[#efe8e1] rounded-xl px-3 py-2 text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                />
              </div>
            </div>

            {/* Admin Internal Note */}
            <div>
              <label className="text-[11px] font-bold text-[#201a1c] block mb-1">
                Add Audit Log / Internal Admin Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Called customer on WhatsApp; verified address for 3 PM delivery."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full bg-white border border-[#efe8e1] rounded-xl px-3 py-2 text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#b45f77] hover:bg-[#9e4a62] disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Updates'}</span>
              </button>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-[#efe8e1] space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b45f77] block">
                Customer Details
              </span>
              <p className="font-extrabold text-sm text-[#201a1c]">{order.customer.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-[#6b5e62] font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#b45f77]" /> {order.customer.phone}
              </p>
              <p className="flex items-start gap-1.5 text-xs text-[#6b5e62] leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-[#b45f77] shrink-0 mt-0.5" />
                <span>{order.customer.address}</span>
              </p>
              {order.customer.notes && (
                <p className="text-xs text-[#8c7e83] italic pt-1 bg-[#faf6f2] p-2 rounded-lg">
                  Customer Note: &quot;{order.customer.notes}&quot;
                </p>
              )}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#efe8e1] space-y-2 text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b45f77] block">
                Financial Summary (COD)
              </span>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[#6b5e62]">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-[#201a1c]">৳{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6b5e62]">
                  <span>Delivery Zone:</span>
                  <span className="font-semibold text-[#201a1c]">
                    {order.customer.deliveryZoneName || order.customer.deliveryZone || 'Inside Dhaka'}
                  </span>
                </div>
                <div className="flex justify-between text-[#6b5e62]">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-[#201a1c]">
                    {order.deliveryFee === 0 ? 'FREE' : `৳${order.deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#efe8e1] flex justify-between text-sm font-extrabold text-[#201a1c]">
                  <span>Total Due at Doorstep:</span>
                  <span className="text-[#b45f77]">৳{order.totalAmount.toLocaleString()} BDT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#201a1c] block">
              Ordered Products ({order.items.length})
            </span>
            <div className="border border-[#efe8e1] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf6f2] text-[#8c7e83] uppercase tracking-wider border-b border-[#efe8e1]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Item</th>
                    <th className="py-3 px-4 font-semibold">SKU</th>
                    <th className="py-3 px-4 font-semibold text-right">Price</th>
                    <th className="py-3 px-4 font-semibold text-center">Qty</th>
                    <th className="py-3 px-4 font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efe8e1] text-[#201a1c]">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#faf6f2]/40">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#faf6f2] shrink-0 border border-[#efe8e1]">
                              <Image src={item.image} alt="" fill sizes="40px" className="object-cover" />
                            </div>
                          )}
                          <div>
                            <span className="font-bold block">{item.title}</span>
                            {item.variantName && (
                              <span className="text-[11px] text-[#b45f77] block">
                                Option: {item.variantName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#6b5e62]">
                        {item.variantSku || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        ৳{item.price.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold">{item.quantity}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#b45f77]">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#201a1c] block">
                Order Activity & Audit Trail
              </span>
              <div className="bg-[#faf6f2] p-4 rounded-2xl border border-[#efe8e1] space-y-3">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#b45f77] mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[11px] text-[#8c7e83]">
                        <span className="font-bold text-[#201a1c] uppercase">{event.status} ({event.actor})</span>
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-[#6b5e62] mt-0.5">{event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
