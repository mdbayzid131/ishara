'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Search,
  Filter,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Save,
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/data/mockProducts';
import { Product, ProductVariant } from '@/types';

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Quick Stock / Status Edit Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTotalStock, setEditTotalStock] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<string>('published');
  const [editVariants, setEditVariants] = useState<ProductVariant[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          setProductsList(data.products);
        }
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/products?limit=100')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.products && data.products.length > 0 && isMounted) {
          setProductsList(data.products);
        }
      })
      .catch((err) => console.error('Failed to load products:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setEditTotalStock(prod.totalStock);
    setEditStatus('published');
    setEditVariants(prod.variants ? JSON.parse(JSON.stringify(prod.variants)) : []);
    setFeedbackMsg(null);
  };

  const handleSaveProductEdit = async () => {
    if (!editingProduct) return;
    setIsSaving(true);
    setFeedbackMsg(null);

    const calculatedStock =
      editVariants.length > 0
        ? editVariants.reduce((sum, v) => sum + (v.stock || 0), 0)
        : editTotalStock;

    try {
      const res = await fetch(`/api/admin/products/${editingProduct.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          totalStock: calculatedStock,
          variants: editVariants.map((v) => ({
            sku: v.sku,
            name: v.name,
            stock: Number(v.stock),
            price: v.price,
          })),
        }),
      });

      if (res.ok) {
        setProductsList((prev) =>
          prev.map((p) =>
            p.slug === editingProduct.slug
              ? {
                  ...p,
                  totalStock: calculatedStock,
                  variants: editVariants,
                }
              : p
          )
        );
        setFeedbackMsg({ type: 'success', text: 'Inventory updated successfully!' });
        setTimeout(() => {
          setEditingProduct(null);
          setFeedbackMsg(null);
        }, 1200);
      } else {
        const data = await res.json();
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to update stock' });
      }
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ type: 'error', text: 'Network error occurred while updating' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = productsList.filter((p) => {
    if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c]">
            Product Catalog & Variant Inventory
          </h1>
          <p className="text-xs sm:text-sm text-[#6b5e62] mt-0.5">
            Manage your collections, individual variant SKUs, price tags, and real-time stock levels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            disabled={isLoading}
            className="px-3.5 py-2.5 bg-white border border-[#efe8e1] hover:bg-[#faf6f2] text-[#201a1c] text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#b45f77]' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#efe8e1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
          />
          <Search className="w-4 h-4 text-[#8c7e83] absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#8c7e83]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#faf6f2] border border-[#efe8e1] text-xs py-2 px-3 rounded-xl font-medium text-[#201a1c] focus:outline-none focus:border-[#b45f77] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#efe8e1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf6f2] text-[#8c7e83] uppercase tracking-wider border-b border-[#efe8e1]">
              <tr>
                <th className="py-4 px-6 font-semibold">Product</th>
                <th className="py-4 px-6 font-semibold">Category</th>
                <th className="py-4 px-6 font-semibold">Price (BDT)</th>
                <th className="py-4 px-6 font-semibold">Variant Count</th>
                <th className="py-4 px-6 font-semibold">Total Stock</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efe8e1] text-[#201a1c]">
              {filteredProducts.map((p) => (
                <tr key={p.id || p.slug} className="hover:bg-[#faf6f2]/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#faf6f2] shrink-0 border border-[#efe8e1]">
                        <Image
                          src={p.images && p.images[0] ? p.images[0] : '/images/placeholder.jpg'}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#201a1c] max-w-xs truncate">{p.title}</h4>
                        <span className="text-[11px] text-[#8c7e83]">
                          SKU: {p.variants && p.variants[0]?.sku ? p.variants[0].sku : p.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-[#6b5e62]">{p.category}</td>
                  <td className="py-4 px-6 font-bold text-[#b45f77]">
                    ৳{p.basePrice.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    {p.hasVariants && p.variants?.length ? (
                      <span className="px-2.5 py-1 bg-[#fdf5f7] text-[#b45f77] rounded-full text-[10px] font-bold">
                        {p.variants.length} Variants
                      </span>
                    ) : (
                      <span className="text-[#8c7e83]">Standard</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {p.totalStock > 10 ? (
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {p.totalStock} units
                      </span>
                    ) : p.totalStock > 0 ? (
                      <span className="font-bold text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {p.totalStock} low stock
                      </span>
                    ) : (
                      <span className="font-bold text-rose-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Published
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="px-3 py-1.5 rounded-xl border border-[#efe8e1] hover:text-[#b45f77] hover:bg-[#faf6f2] font-semibold text-xs flex items-center gap-1.5 ml-auto cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Stock</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Stock & Status Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-[#efe8e1] flex flex-col">
            <div className="p-5 bg-[#faf6f2] border-b border-[#efe8e1] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#b45f77] uppercase tracking-wider block">
                  Quick Stock Adjustment
                </span>
                <h3 className="font-bold text-sm text-[#201a1c] max-w-md truncate">
                  {editingProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 text-[#6b5e62] hover:text-[#201a1c] rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {feedbackMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    feedbackMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {feedbackMsg.text}
                </div>
              )}

              {/* Status */}
              <div>
                <label className="text-xs font-bold text-[#201a1c] block mb-1">
                  Catalog Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-[#faf6f2] border border-[#efe8e1] rounded-xl px-3 py-2 text-xs font-semibold text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                >
                  <option value="published">Published (Visible in Store)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Variants Stock Editor */}
              {editVariants && editVariants.length > 0 ? (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#201a1c] block">
                    Variant-Level Stock Quantities
                  </label>
                  <div className="space-y-2 border border-[#efe8e1] rounded-2xl p-3 bg-[#faf6f2]/50 max-h-56 overflow-y-auto">
                    {editVariants.map((v, idx) => (
                      <div
                        key={v.sku || idx}
                        className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#efe8e1]"
                      >
                        <div className="min-w-0 pr-3">
                          <span className="font-bold text-xs text-[#201a1c] block truncate">
                            {v.name}
                          </span>
                          <span className="text-[11px] font-mono text-[#8c7e83]">{v.sku}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <label className="text-[11px] text-[#8c7e83]">Stock:</label>
                          <input
                            type="number"
                            min="0"
                            value={v.stock}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              setEditVariants((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, stock: val } : item))
                              );
                            }}
                            className="w-20 px-2.5 py-1.5 bg-[#faf6f2] border border-[#efe8e1] rounded-lg text-xs font-bold text-center text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-[#201a1c] block mb-1">
                    Available Stock Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editTotalStock}
                    onChange={(e) => setEditTotalStock(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs font-bold text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[#efe8e1] text-xs font-bold rounded-xl hover:bg-[#faf6f2] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProductEdit}
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#b45f77] hover:bg-[#9e4a62] disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Stock'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
