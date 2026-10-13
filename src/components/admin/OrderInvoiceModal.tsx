'use client';

import React from 'react';
import Image from 'next/image';
import { X, Printer, Phone, MapPin, Calendar, CheckSquare } from 'lucide-react';

interface InvoiceOrderItem {
  title: string;
  variantName?: string;
  variantSku?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface InvoiceOrder {
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    deliveryZoneName?: string;
    deliveryZone?: string;
    notes?: string;
  };
  items: InvoiceOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  courier?: {
    provider?: string;
    trackingCode?: string;
  };
}

interface OrderInvoiceModalProps {
  order: InvoiceOrder | null;
  onClose: () => void;
}

export default function OrderInvoiceModal({ order, onClose }: OrderInvoiceModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Container */}
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#efe8e1] flex flex-col max-h-[92vh]">
        {/* Modal Controls Header (Hidden in Print) */}
        <div className="p-4 bg-[#faf6f2] border-b border-[#efe8e1] flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-[#b45f77] uppercase tracking-wider">
            Order Invoice & Packing Slip
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#b45f77] hover:bg-[#9e4a62] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Slip</span>
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

        {/* Printable Area */}
        <div id="printable-invoice" className="p-8 sm:p-10 overflow-y-auto space-y-8 text-[#201a1c] bg-white print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#efe8e1] pb-6 gap-4">
            <div>
              <div className="relative w-36 h-10 mb-1">
                <Image
                  src="/images/ishara-logo.png"
                  alt="Ishara Luxury"
                  fill
                  sizes="144px"
                  className="object-contain"
                />
              </div>
              <p className="text-[11px] text-[#6b5e62]">
                Refined Luxury & Handcrafted Accessories
              </p>
              <p className="text-[11px] text-[#8c7e83] mt-0.5">
                Dhaka, Bangladesh | Support: +880 1711-223344
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs uppercase font-extrabold text-[#b45f77] tracking-widest block">
                Cash on Delivery Invoice
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#201a1c] tracking-tight mt-0.5">
                {order.orderNumber}
              </p>
              <div className="flex items-center sm:justify-end gap-1.5 text-xs text-[#8c7e83] mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#faf6f2] p-5 rounded-2xl border border-[#efe8e1]">
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b45f77] block">
                Ship To Customer
              </span>
              <p className="font-extrabold text-sm text-[#201a1c]">{order.customer.name}</p>
              <p className="flex items-center gap-1.5 text-[#6b5e62] font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#b45f77]" /> {order.customer.phone}
              </p>
              <p className="flex items-start gap-1.5 text-[#6b5e62] leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-[#b45f77] shrink-0 mt-0.5" />
                <span>{order.customer.address}</span>
              </p>
              {order.customer.notes && (
                <p className="text-[11px] text-[#8c7e83] italic pt-1">
                  Note: &quot;{order.customer.notes}&quot;
                </p>
              )}
            </div>

            <div className="space-y-1.5 text-xs sm:border-l sm:border-[#efe8e1] sm:pl-6">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b45f77] block">
                Fulfillment Logistics
              </span>
              <p className="text-[#6b5e62]">
                <strong className="text-[#201a1c]">Delivery Zone:</strong>{' '}
                {order.customer.deliveryZoneName || order.customer.deliveryZone || 'Inside Dhaka'}
              </p>
              <p className="text-[#6b5e62]">
                <strong className="text-[#201a1c]">Payment Mode:</strong> Cash on Delivery (COD)
              </p>
              <p className="text-[#6b5e62]">
                <strong className="text-[#201a1c]">Courier Assigned:</strong>{' '}
                {order.courier?.provider || 'Manual / Steadfast'}
              </p>
              {order.courier?.trackingCode && (
                <p className="text-[#6b5e62]">
                  <strong className="text-[#201a1c]">Tracking Ref:</strong>{' '}
                  <span className="font-mono font-bold text-[#b45f77]">{order.courier.trackingCode}</span>
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-[#efe8e1] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf6f2] text-[#8c7e83] uppercase tracking-wider border-b border-[#efe8e1]">
                <tr>
                  <th className="py-3 px-4 font-semibold w-12 text-center">#</th>
                  <th className="py-3 px-4 font-semibold">Product Description</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold text-right">Unit Price</th>
                  <th className="py-3 px-4 font-semibold text-center w-16">Qty</th>
                  <th className="py-3 px-4 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efe8e1] text-[#201a1c]">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#faf6f2]/40">
                    <td className="py-3.5 px-4 text-center text-[#8c7e83]">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold block">{item.title}</span>
                      {item.variantName && (
                        <span className="text-[11px] text-[#b45f77] block font-medium">
                          Option: {item.variantName}
                        </span>
                      )}
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

          {/* Totals & Notes Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
            <div className="space-y-2 text-xs text-[#6b5e62] max-w-sm">
              <div className="flex items-center gap-1.5 text-[#201a1c] font-bold">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Doorstep Inspection Permitted</span>
              </div>
              <p className="text-[11px] text-[#8c7e83] leading-relaxed">
                Customer is requested to inspect package seal and outer condition upon receipt before paying the courier representative.
              </p>
              <div className="pt-6 border-t border-[#efe8e1] flex justify-between gap-6 text-[11px] text-[#8c7e83]">
                <div>
                  <div className="w-32 border-b border-[#201a1c]/40 mb-1" />
                  <span>Prepared By</span>
                </div>
                <div>
                  <div className="w-32 border-b border-[#201a1c]/40 mb-1" />
                  <span>Customer Signature</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-72 bg-[#faf6f2] p-4 rounded-2xl border border-[#efe8e1] space-y-2 text-xs">
              <div className="flex justify-between text-[#6b5e62]">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#201a1c]">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6b5e62]">
                <span>Delivery Charge:</span>
                <span className="font-semibold text-[#201a1c]">
                  {order.deliveryFee === 0 ? 'FREE' : `৳${order.deliveryFee.toLocaleString()}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#efe8e1] flex justify-between text-sm font-black text-[#201a1c]">
                <span>Total Due (COD):</span>
                <span className="text-base text-[#b45f77]">৳{order.totalAmount.toLocaleString()} BDT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
