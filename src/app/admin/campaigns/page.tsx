'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Tag,
  Plus,
  Percent,
  TrendingUp,
  CheckCircle2,
  Copy,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  status: 'active' | 'paused' | 'expired';
  usageCount: number;
}

const INITIAL_PROMOS: PromoCode[] = [
  {
    id: 'promo-1',
    code: 'ISHARA10',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 2000,
    status: 'active',
    usageCount: 42,
  },
  {
    id: 'promo-2',
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 130,
    minSpend: 3000,
    status: 'active',
    usageCount: 88,
  },
  {
    id: 'promo-3',
    code: 'FESTIVE200',
    discountType: 'fixed',
    discountValue: 200,
    minSpend: 2500,
    status: 'paused',
    usageCount: 15,
  },
];

export default function AdminCampaignsPage() {
  const [promos, setPromos] = useState<PromoCode[]>(INITIAL_PROMOS);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New promo form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(1500);

  const [announcementText, setAnnouncementText] = useState(
    'Fast Delivery across Bangladesh • 100% Cash on Delivery'
  );
  const [isAnnouncementSaved, setIsAnnouncementSaved] = useState(false);

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newPromo: PromoCode = {
      id: `promo-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minSpend: Number(minSpend),
      status: 'active',
      usageCount: 0,
    };

    setPromos((prev) => [newPromo, ...prev]);
    setIsModalOpen(false);
    setCode('');
    setDiscountValue(10);
    setMinSpend(1500);
  };

  const handleDeletePromo = (id: string) => {
    setPromos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setPromos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'active' ? 'paused' : 'active' }
          : p
      )
    );
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnnouncementSaved(true);
    setTimeout(() => setIsAnnouncementSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c]">
            Marketing & Discount Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-[#6b5e62] mt-0.5">
            Manage promotional coupon codes, storewide announcements, and UTM ad campaign
            tracking.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#b45f77] hover:bg-[#9e4a62] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#efe8e1] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fdf5f7] flex items-center justify-center text-[#b45f77]">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#8c7e83] uppercase tracking-wider">
              Active Coupons
            </span>
            <p className="text-2xl font-black text-[#201a1c]">
              {promos.filter((p) => p.status === 'active').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#efe8e1] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#8c7e83] uppercase tracking-wider">
              Total Redemptions
            </span>
            <p className="text-2xl font-black text-[#201a1c]">
              {promos.reduce((sum, p) => sum + p.usageCount, 0)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#efe8e1] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#8c7e83] uppercase tracking-wider">
              Top Ad Source
            </span>
            <p className="text-xl font-bold text-[#201a1c]">Facebook / Meta</p>
          </div>
        </div>
      </div>

      {/* Announcement Bar Customizer */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#efe8e1]">
          <div>
            <h2 className="text-base font-bold text-[#201a1c]">
              Public Store Top Announcement Bar
            </h2>
            <p className="text-xs text-[#8c7e83]">
              Highlighted banner shown to all visitors at the top of the store.
            </p>
          </div>
        </div>

        {isAnnouncementSaved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Announcement updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveAnnouncement} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#b45f77] hover:bg-[#9e4a62] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Update Banner
          </button>
        </form>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-[#efe8e1] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#efe8e1]">
          <h2 className="text-base font-bold text-[#201a1c]">Active Promo Codes</h2>
          <p className="text-xs text-[#8c7e83]">Customers can apply these codes during checkout.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf6f2] text-[#8c7e83] font-bold uppercase tracking-wider border-b border-[#efe8e1]">
              <tr>
                <th className="py-3.5 px-6">Coupon Code</th>
                <th className="py-3.5 px-6">Discount</th>
                <th className="py-3.5 px-6">Min Order</th>
                <th className="py-3.5 px-6">Redemptions</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efe8e1]">
              {promos.map((p) => (
                <tr key={p.id} className="hover:bg-[#faf6f2]/50">
                  <td className="py-4 px-6 font-mono font-bold text-sm text-[#201a1c] flex items-center gap-2">
                    <span>{p.code}</span>
                    <button
                      onClick={() => handleCopy(p.code)}
                      className="p-1 text-[#8c7e83] hover:text-[#b45f77] cursor-pointer"
                      title="Copy code"
                    >
                      {copiedCode === p.code ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6 font-semibold text-[#b45f77]">
                    {p.discountType === 'percentage'
                      ? `${p.discountValue}% Off`
                      : `৳${p.discountValue} Off`}
                  </td>
                  <td className="py-4 px-6 font-medium text-[#6b5e62]">
                    ৳{p.minSpend.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 font-bold text-[#201a1c]">{p.usageCount} times</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(p.id)}
                        className="px-2.5 py-1 border border-[#efe8e1] rounded-lg text-[11px] font-semibold text-[#6b5e62] hover:bg-[#faf6f2] cursor-pointer"
                      >
                        {p.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeletePromo(p.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete promo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#efe8e1] p-6 space-y-5">
            <h3 className="text-base font-bold text-[#201a1c]">New Promo Code</h3>

            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FLASH20"
                  className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-mono font-bold text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs font-semibold text-[#201a1c]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (BDT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                    Value *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-bold text-[#201a1c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                  Minimum Order Spend (BDT)
                </label>
                <input
                  type="number"
                  min={0}
                  value={minSpend}
                  onChange={(e) => setMinSpend(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6b5e62] border border-[#efe8e1] rounded-xl hover:bg-[#faf6f2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#b45f77] hover:bg-[#9e4a62] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
