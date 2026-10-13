'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('Ishara Lifestyle');
  const [phone, setPhone] = useState('+880 1711-223344');
  const [supportEmail, setSupportEmail] = useState('support@ishara.com.bd');
  const [insideDhakaFee, setInsideDhakaFee] = useState(70);
  const [outsideDhakaFee, setOutsideDhakaFee] = useState(130);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(3000);
  const [metaPixelId, setMetaPixelId] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.settings && isMounted) {
          const s = data.settings;
          if (s.storeName) setStoreName(s.storeName);
          if (s.phone) setPhone(s.phone);
          if (s.supportEmail) setSupportEmail(s.supportEmail);
          if (typeof s.insideDhakaFee === 'number') setInsideDhakaFee(s.insideDhakaFee);
          if (typeof s.outsideDhakaFee === 'number') setOutsideDhakaFee(s.outsideDhakaFee);
          if (typeof s.freeShippingThreshold === 'number')
            setFreeShippingThreshold(s.freeShippingThreshold);
          if (s.metaPixelId !== undefined) setMetaPixelId(s.metaPixelId);
        }
      })
      .catch((err) => console.error('Failed to load settings:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName,
          phone,
          supportEmail,
          insideDhakaFee: Number(insideDhakaFee),
          outsideDhakaFee: Number(outsideDhakaFee),
          freeShippingThreshold: Number(freeShippingThreshold),
          metaPixelId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setStatusMsg({ type: 'success', text: 'Store settings saved successfully!' });
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: unknown) {
      console.error(err);
      setStatusMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error saving settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c]">
          Store & Delivery Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#6b5e62] mt-0.5">
          Configure delivery rates for Bangladesh zones, store support contacts, and marketing tracking.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Delivery Fees Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-5">
          <div className="pb-3 border-b border-[#efe8e1]">
            <h2 className="text-base font-bold text-[#201a1c]">
              Cash on Delivery (COD) Zone Rates
            </h2>
            <p className="text-xs text-[#8c7e83]">These fees are applied automatically during guest checkout.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Inside Dhaka Delivery Fee (BDT)
              </label>
              <input
                type="number"
                min={0}
                required
                value={insideDhakaFee}
                onChange={(e) => setInsideDhakaFee(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-bold text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Outside Dhaka Delivery Fee (BDT)
              </label>
              <input
                type="number"
                min={0}
                required
                value={outsideDhakaFee}
                onChange={(e) => setOutsideDhakaFee(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-bold text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
              Free Shipping Order Threshold (BDT)
            </label>
            <input
              type="number"
              min={0}
              required
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full sm:w-1/2 px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-bold text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
            />
            <span className="text-[11px] text-[#8c7e83] mt-1 block">
              Cart subtotal required for zero delivery charge inside Dhaka.
            </span>
          </div>
        </div>

        {/* Store Profile */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-5">
          <div className="pb-3 border-b border-[#efe8e1]">
            <h2 className="text-base font-bold text-[#201a1c]">Store Support Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Customer Support / WhatsApp Phone
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Support Email
              </label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
              />
            </div>
          </div>
        </div>

        {/* Marketing & Meta Pixel */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-5">
          <div className="pb-3 border-b border-[#efe8e1]">
            <h2 className="text-base font-bold text-[#201a1c]">Meta Pixel & Ads Tracking</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
              Meta Pixel ID
            </label>
            <input
              type="text"
              placeholder="e.g. 1234567890123456"
              value={metaPixelId}
              onChange={(e) => setMetaPixelId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-mono text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
            />
            <span className="text-[11px] text-[#8c7e83] mt-1 block">
              Leave blank if not running ads yet. When provided, standard browser tracking events will activate.
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving || isLoading}
          className="px-6 py-3 bg-[#b45f77] hover:bg-[#9e4a62] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Saving Settings...' : 'Save Settings to Database'}</span>
        </button>
      </form>
    </div>
  );
}
