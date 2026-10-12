'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/data/mockProducts';

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = PRODUCTS.filter((p) => {
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
            Product & Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6b5e62] mt-0.5">
            Manage your catalog, variant SKUs, pricing overrides, and available stocks.
          </p>
        </div>

        <button
          onClick={() => alert('Product creation form modal ready for Phase 4 full form integration.')}
          className="px-4 py-2.5 bg-[#b45f77] hover:bg-[#9e4a62] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
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
            className="bg-[#faf6f2] border border-[#efe8e1] text-xs py-2 px-3 rounded-xl font-medium text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
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
                <th className="py-4 px-6 font-semibold">Variants</th>
                <th className="py-4 px-6 font-semibold">Total Stock</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efe8e1] text-[#201a1c]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#faf6f2]/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#faf6f2] shrink-0 border border-[#efe8e1]">
                        <Image src={p.images[0]} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#201a1c] max-w-xs truncate">{p.title}</h4>
                        <span className="text-[11px] text-[#8c7e83]">SKU: {p.variants[0]?.sku || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-[#6b5e62]">{p.category}</td>
                  <td className="py-4 px-6 font-bold text-[#b45f77]">
                    ৳{p.basePrice.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    {p.hasVariants ? (
                      <span className="px-2.5 py-1 bg-[#fdf5f7] text-[#b45f77] rounded-full text-[10px] font-bold">
                        {p.variants.length} Variants
                      </span>
                    ) : (
                      <span className="text-[#8c7e83]">Standard</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {p.totalStock > 15 ? (
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {p.totalStock} units
                      </span>
                    ) : (
                      <span className="font-bold text-rose-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {p.totalStock} left
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Published
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => alert(`Edit ${p.title}`)}
                        className="p-1.5 rounded-lg border border-[#efe8e1] hover:text-[#b45f77] hover:bg-[#faf6f2]"
                        aria-label="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => alert(`Archive ${p.title}`)}
                        className="p-1.5 rounded-lg border border-[#efe8e1] hover:text-red-500 hover:bg-[#faf6f2]"
                        aria-label="Archive product"
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
    </div>
  );
}
