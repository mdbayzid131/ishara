'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { CATEGORIES } from '@/data/mockProducts';

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201a1c]">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6b5e62] mt-0.5">
            Organize catalog groupings, navigation hierarchy, and promotional covers.
          </p>
        </div>

        <button
          onClick={() => alert('New category creation ready for Phase 4.')}
          className="px-4 py-2.5 bg-[#b45f77] text-white text-xs font-bold rounded-xl hover:bg-[#9e4a62] transition-colors shadow-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-[#efe8e1] shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-[#faf6f2]">
              <Image src={cat.image} alt={cat.name} fill className="object-cover" />
            </div>

            <div className="p-5 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b45f77]">
                  Slug: /{cat.slug}
                </span>
                <h3 className="text-base font-bold text-[#201a1c]">{cat.name}</h3>
                <p className="text-xs text-[#6b5e62] mt-1 line-clamp-2">{cat.description}</p>
              </div>

              <div className="pt-3 border-t border-[#efe8e1] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#8c7e83]">{cat.itemCount} Products</span>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 rounded-lg border border-[#efe8e1] hover:text-[#b45f77]">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg border border-[#efe8e1] hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
