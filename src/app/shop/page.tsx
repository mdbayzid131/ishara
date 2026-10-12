'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/mockProducts';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || 'featured';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.categorySlug !== selectedCategory) {
        return false;
      }
      // Price filter
      if (product.basePrice > maxPrice) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCategory) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'bestseller') return b.salesCount - a.salesCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default featured
    });
  }, [selectedCategory, maxPrice, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 border-b border-[#efe8e1] pb-6">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#201a1c]">
          All Collections
        </h1>
        <p className="text-xs sm:text-sm text-[#6b5e62] mt-1">
          Explore handcrafted accessories, bags, fine jewelry, and beauty devices.
        </p>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#b45f77] text-white shadow-xs'
                : 'bg-white text-[#201a1c] border border-[#efe8e1] hover:bg-[#faf6f2]'
            }`}
          >
            All Items ({PRODUCTS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-[#b45f77] text-white shadow-xs'
                  : 'bg-white text-[#201a1c] border border-[#efe8e1] hover:bg-[#faf6f2]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#efe8e1] shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-[#efe8e1]">
              <span className="text-sm font-bold text-[#201a1c] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#b45f77]" />
                Filters
              </span>
              {(selectedCategory !== 'all' || maxPrice < 4000 || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMaxPrice(4000);
                    setSearchQuery('');
                  }}
                  className="text-xs text-[#b45f77] font-semibold hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#201a1c] uppercase tracking-wider block">
                Max Price: ৳{maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min="500"
                max="4000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#b45f77] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#8c7e83]">
                <span>৳500</span>
                <span>৳4,000</span>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2 pt-2 border-t border-[#efe8e1]">
              <label className="text-xs font-bold text-[#201a1c] uppercase tracking-wider block">
                Categories
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#fdf5f7] text-[#b45f77] font-bold'
                      : 'text-[#6b5e62] hover:bg-[#faf6f2]'
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg font-medium transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-[#fdf5f7] text-[#b45f77] font-bold'
                        : 'text-[#6b5e62] hover:bg-[#faf6f2]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid & Sorting Bar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Bar */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#efe8e1] flex items-center justify-between gap-4">
            <span className="text-xs text-[#6b5e62]">
              Showing <span className="font-bold text-[#201a1c]">{filteredProducts.length}</span> items
            </span>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#efe8e1] text-xs font-semibold text-[#201a1c] hover:bg-[#faf6f2]"
              >
                <Filter className="w-3.5 h-3.5 text-[#b45f77]" />
                <span>Filters</span>
              </button>

              {/* Sort Select */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#6b5e62] hidden sm:inline" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs py-1.5 px-3 text-[#201a1c] font-medium focus:outline-none focus:border-[#b45f77]"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="bestseller">Sort: Best Selling</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#efe8e1] p-12 text-center space-y-3">
              <p className="text-base font-semibold text-[#201a1c]">
                No products found matching your filters
              </p>
              <p className="text-xs text-[#6b5e62]">
                Try adjusting your price range or clearing search keywords.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setMaxPrice(4000);
                  setSearchQuery('');
                }}
                className="px-5 py-2 bg-[#b45f77] text-white text-xs font-semibold rounded-full hover:bg-[#9e4a62] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#efe8e1]">
                  <h3 className="font-bold text-base text-[#201a1c]">Filter Products</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full text-[#6b5e62]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#201a1c] uppercase tracking-wider block">
                    Max Price: ৳{maxPrice.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="4000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#b45f77]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#201a1c] uppercase tracking-wider block">
                    Category
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setIsMobileFilterOpen(false);
                      }}
                      className="w-full text-left text-xs py-2 px-3 rounded-lg font-medium text-[#201a1c] hover:bg-[#faf6f2]"
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.slug);
                          setIsMobileFilterOpen(false);
                        }}
                        className="w-full text-left text-xs py-2 px-3 rounded-lg font-medium text-[#201a1c] hover:bg-[#faf6f2]"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#b45f77] text-white text-xs font-bold rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#6b5e62]">Loading collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
