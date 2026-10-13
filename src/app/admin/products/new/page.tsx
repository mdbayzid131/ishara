'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface VariantInput {
  name: string;
  sku: string;
  stock: number;
  price: number;
}

const DEFAULT_CATEGORIES = [
  { name: 'Handbags & Purses', slug: 'handbags' },
  { name: 'Fine Jewelry', slug: 'jewelry' },
  { name: 'Beauty & Skincare Gadgets', slug: 'beauty-devices' },
  { name: 'Designer Sunglasses', slug: 'sunglasses' },
  { name: 'Wallets & Clutches', slug: 'wallets' },
];

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [categorySlug, setCategorySlug] = useState('handbags');
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [compareAtPrice, setCompareAtPrice] = useState<number | ''>('');
  const [totalStock, setTotalStock] = useState<number>(20);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [badge, setBadge] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<VariantInput[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-generate slug from title if user hasn't typed custom slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(autoSlug);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    const defaultSku = `${sku ? sku + '-' : 'SKU-'}${variants.length + 1}`;
    setVariants((prev) => [
      ...prev,
      {
        name: `Option ${prev.length + 1}`,
        sku: defaultSku,
        stock: 10,
        price: Number(basePrice) || 0,
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: keyof VariantInput,
    val: string | number
  ) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a product title.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Please enter a unique URL slug.');
      return;
    }
    if (!basePrice || Number(basePrice) <= 0) {
      setErrorMsg('Please specify a valid base price in BDT.');
      return;
    }
    if (imageUrls.length === 0) {
      setErrorMsg('Please provide at least one product image URL.');
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryObj =
        DEFAULT_CATEGORIES.find((c) => c.slug === categorySlug) || DEFAULT_CATEGORIES[0];

      const payload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        sku: sku.trim() || `ISH-${slug.slice(0, 4).toUpperCase()}`,
        category: categoryObj.name,
        categorySlug: categoryObj.slug,
        basePrice: Number(basePrice),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        totalStock: hasVariants
          ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
          : Number(totalStock) || 0,
        status,
        badge: badge.trim() || undefined,
        isFeatured,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        images: imageUrls,
        hasVariants,
        variants: hasVariants
          ? variants.map((v) => ({
              sku: v.sku.trim(),
              name: v.name.trim(),
              stock: Number(v.stock) || 0,
              price: Number(v.price) || Number(basePrice),
            }))
          : [],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to create product');
      }

      setSuccessMsg('Product added successfully! Redirecting to catalog...');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1200);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Error creating product.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-white rounded-xl border border-[#efe8e1] hover:bg-[#faf6f2] transition-colors text-[#201a1c]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-[#201a1c]">Add New Product</h1>
            <p className="text-xs text-[#6b5e62]">Create a new listing in Ishara’s catalog</p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#201a1c] border-b border-[#efe8e1] pb-3">
            Product Essentials
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Royal Rose Gold Crystal Handbag"
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="royal-rose-gold-crystal-handbag"
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-mono text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Product SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="ISH-HB-001"
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-mono text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-medium text-[#201a1c] focus:outline-none focus:border-[#b45f77] cursor-pointer"
              >
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Catalog Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-medium text-[#201a1c] focus:outline-none focus:border-[#b45f77] cursor-pointer"
              >
                <option value="published">Published (Live in Store)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#201a1c] border-b border-[#efe8e1] pb-3">
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Regular Price (BDT) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="2450"
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-bold text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Compare-at Price (BDT)
              </label>
              <input
                type="number"
                min={1}
                value={compareAtPrice}
                onChange={(e) =>
                  setCompareAtPrice(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="3200"
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Stock Quantity (Units)
              </label>
              <input
                type="number"
                min={0}
                disabled={hasVariants}
                value={totalStock}
                onChange={(e) => setTotalStock(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-bold text-[#201a1c] focus:outline-none focus:border-[#b45f77] disabled:opacity-50"
              />
              {hasVariants && (
                <p className="text-[11px] text-[#8c7e83] mt-1">
                  Computed automatically from variant stocks.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                Promotional Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Bestseller, New Arrival, 20% Off"
                className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#b45f77] cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-xs font-bold text-[#201a1c] cursor-pointer">
                Show as Featured on Public Homepage
              </label>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#efe8e1] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#201a1c]">Product Gallery Images</h2>
              <p className="text-xs text-[#8c7e83]">Provide high quality image URLs</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2.5 bg-[#b45f77] text-white text-xs font-bold rounded-xl hover:bg-[#9e4a62] transition-colors"
            >
              Add URL
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imageUrls.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-2xl overflow-hidden border border-[#efe8e1] bg-[#faf6f2] group"
              >
                <Image
                  src={url}
                  alt={`Product view ${idx + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Variants Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#efe8e1] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#201a1c]">Product Variants (Colors / Sizes)</h2>
              <p className="text-xs text-[#8c7e83]">Enable if this product comes in different options</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
                className="w-4 h-4 accent-[#b45f77]"
              />
              <span className="text-xs font-bold text-[#201a1c]">Has Variants</span>
            </label>
          </div>

          {hasVariants && (
            <div className="space-y-4">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#faf6f2] border border-[#efe8e1] grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
                >
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#6b5e62] mb-1">
                      Variant Name
                    </label>
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Blush Pink"
                      className="w-full px-3 py-2 bg-white border border-[#efe8e1] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#6b5e62] mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                      placeholder="SKU-PINK"
                      className="w-full px-3 py-2 bg-white border border-[#efe8e1] rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#6b5e62] mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={v.stock}
                      onChange={(e) =>
                        handleVariantChange(idx, 'stock', Number(e.target.value))
                      }
                      className="w-full px-3 py-2 bg-white border border-[#efe8e1] rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold uppercase text-[#6b5e62] mb-1">
                        Price (BDT)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={v.price}
                        onChange={(e) =>
                          handleVariantChange(idx, 'price', Number(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-white border border-[#efe8e1] rounded-lg text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddVariant}
                className="px-4 py-2.5 bg-white border border-[#efe8e1] hover:bg-[#faf6f2] text-xs font-bold text-[#b45f77] rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Variant Option</span>
              </button>
            </div>
          )}
        </div>

        {/* Descriptions */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#201a1c] border-b border-[#efe8e1] pb-3">
            Description & Highlights
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
              Short Summary
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief tagline shown on mobile cards"
              className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
              Full Product Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe materials, dimensions, care instructions, and authenticity details..."
              className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-[#efe8e1] bg-white hover:bg-[#faf6f2] text-[#201a1c] text-xs font-bold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#b45f77] hover:bg-[#9e4a62] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Product...' : 'Publish Product to Store'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
