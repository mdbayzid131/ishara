'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit3, Trash2, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { CATEGORIES } from '@/data/mockProducts';

interface CategoryItem {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  itemCount?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80');
    setEditingCategory(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || '');
    setFormImage(cat.image);
    setIsAddModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      setFormSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      setFeedback({ type: 'error', text: 'Name and slug are required.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (editingCategory) {
        const targetId = editingCategory._id || editingCategory.id || editingCategory.slug;
        const res = await fetch(`/api/categories/${targetId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName.trim(),
            slug: formSlug.trim().toLowerCase(),
            description: formDescription.trim(),
            image: formImage.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update category');

        setFeedback({ type: 'success', text: `Category "${formName}" updated!` });
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName.trim(),
            slug: formSlug.trim().toLowerCase(),
            description: formDescription.trim(),
            image: formImage.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create category');

        setFeedback({ type: 'success', text: `Category "${formName}" added successfully!` });
      }

      setIsAddModalOpen(false);
      fetchCategories();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error saving category.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (cat: CategoryItem) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      const targetId = cat._id || cat.id || cat.slug;
      const res = await fetch(`/api/categories/${targetId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setFeedback({ type: 'success', text: `Category "${cat.name}" removed.` });
      setCategories((prev) => prev.filter((c) => (c._id || c.id || c.slug) !== targetId));
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error deleting category.',
      });
    }
  };

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

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="p-2.5 bg-white border border-[#efe8e1] rounded-xl text-[#201a1c] hover:bg-[#faf6f2] transition-colors"
            title="Refresh categories"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#b45f77]' : ''}`} />
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-[#b45f77] text-white text-xs font-bold rounded-xl hover:bg-[#9e4a62] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id || cat.id || cat.slug}
            className="bg-white rounded-3xl border border-[#efe8e1] shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-[#faf6f2]">
              <Image
                src={cat.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover"
              />
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
                <span className="font-semibold text-[#8c7e83]">{cat.itemCount ?? 0} Products</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg border border-[#efe8e1] hover:text-[#b45f77] hover:bg-[#faf6f2] transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-1.5 rounded-lg border border-[#efe8e1] hover:text-red-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-[#efe8e1]">
            <div className="p-5 bg-[#faf6f2] border-b border-[#efe8e1] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#201a1c]">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <p className="text-xs text-[#6b5e62]">
                  {editingCategory ? `Updating ${editingCategory.name}` : 'Add collection to catalog'}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-[#8c7e83] hover:text-[#201a1c] rounded-xl hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Designer Clutches"
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
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value.toLowerCase())}
                  placeholder="designer-clutches"
                  className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm font-mono text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief description for category banner..."
                  className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-sm text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-[#6b5e62] border border-[#efe8e1] rounded-xl hover:bg-[#faf6f2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#b45f77] hover:bg-[#9e4a62] text-white text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
