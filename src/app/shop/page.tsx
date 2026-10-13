'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, RefreshCw } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/mockProducts';
import { Product } from '@/types';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state when URL search params change
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('q');
    const s = searchParams.get('sort');
    if (cat !== null) setSelectedCategory(cat);
    if (q !== null) setSearchQuery(q);
    if (s !== null) setSortBy(s);
  }, [searchParams]);

  // Fetch real products from API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch('/api/products?limit=100')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.products && data.products.length > 0 && isMounted) {
          setProductsList(data.products);
          // Auto adjust max price if higher products exist
          const highest = Math.max(...data.products.map((p: Product) => p.basePrice || 0));
          if (highest > 10000) {
            setMaxPrice(Math.ceil(highest / 1000) * 1000);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch shop products:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.categories && data.categories.length > 0 && isMounted) {
          setCategoriesList(data.categories);
        }
      })
      .catch((err) => console.error('Failed to fetch categories:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return productsList
      .filter((product) => {
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
          const matchesDesc = (product.description || '').toLowerCase().includes(q);
          const matchesCategory = (product.category || '').toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesCategory) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
        if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
        if (sortBy === 'bestseller') return (b.salesCount || 0) - (a.salesCount || 0);
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        return 0; // default featured
      });
  }, [productsList, selectedCategory, maxPrice, searchQuery, sortBy]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

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
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#b45f77] text-white shadow-xs'
                : 'bg-white text-[#201a1c] border border-[#efe8e1] hover:bg-[#faf6f2]'
            }`}
          >
            All Items ({productsList.length})
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.id || cat.slug}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
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
              {(selectedCategory !== 'all' || maxPrice < 10000 || searchQuery) && (
                <button
                  onClick={() => {
                    handleCategorySelect('all');
                    setMaxPrice(10000);
                    setSearchQuery('');
                  }}
                  className="text-xs text-[#b45f77] font-semibold hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* In-page Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#201a1c] uppercase tracking-wider block">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Bags, earrings, serum..."
                  className="w-full pl-9 pr-3 py-2 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                />
                <Search className="w-3.5 h-3.5 text-[#8c7e83] absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#201a1c] uppercase tracking-wider block">
                Max Price: ৳{maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#b45f77] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#8c7e83]">
                <span>৳500</span>
                <span>৳10,000</span>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2 pt-2 border-t border-[#efe8e1]">
              <label className="text-xs font-bold text-[#201a1c] uppercase tracking-wider block">
                Categories
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#faf6f2] text-[#b45f77] font-bold'
                      : 'text-[#6b5e62] hover:bg-[#faf6f2]'
                  }`}
                >
                  All Products
                </button>
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      selectedCategory === cat.slug
                        ? 'bg-[#faf6f2] text-[#b45f77] font-bold'
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

        {/* Products Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#efe8e1] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold text-[#6b5e62]">
              Showing <strong className="text-[#201a1c]">{filteredProducts.length}</strong> products
            </span>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-3 py-2 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs font-semibold text-[#201a1c] flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5 text-[#b45f77]" />
                <span>Filters</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#8c7e83]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#faf6f2] border border-[#efe8e1] text-xs py-2 px-3 rounded-xl font-medium text-[#201a1c] focus:outline-none focus:border-[#b45f77] cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="bestseller">Best Selling</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(selectedCategory !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#fdf5f7] text-[#b45f77] border border-[#f5d4dc]">
                  Category: {categoriesList.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => handleCategorySelect('all')}>
                    <X className="w-3.5 h-3.5 hover:text-[#9e4a62]" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#fdf5f7] text-[#b45f77] border border-[#f5d4dc]">
                  Keyword: {searchQuery}
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3.5 h-3.5 hover:text-[#9e4a62]" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id || product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#efe8e1] p-8 space-y-4">
              <div className="w-16 h-16 bg-[#fdf5f7] rounded-full flex items-center justify-center mx-auto text-[#b45f77]">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#201a1c]">No Products Found</h3>
              <p className="text-xs text-[#6b5e62] max-w-sm mx-auto">
                No products match your current filters. Try adjusting the price range or resetting categories.
              </p>
              <button
                onClick={() => {
                  handleCategorySelect('all');
                  setMaxPrice(10000);
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-[#b45f77] text-white text-xs font-bold rounded-xl hover:bg-[#9e4a62] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#efe8e1]">
              <span className="text-base font-bold text-[#201a1c] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#b45f77]" />
                Filter Products
              </span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-[#8c7e83]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#201a1c] uppercase tracking-wider block">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Product title..."
                className="w-full px-3 py-2 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs text-[#201a1c]"
              />
            </div>

            {/* Mobile Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#201a1c] uppercase tracking-wider block">
                Max Price: ৳{maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#b45f77]"
              />
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2 pt-2 border-t border-[#efe8e1]">
              <label className="text-xs font-bold text-[#201a1c] uppercase tracking-wider block">
                Category
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    handleCategorySelect('all');
                    setIsMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs ${
                    selectedCategory === 'all'
                      ? 'bg-[#b45f77] text-white font-bold'
                      : 'text-[#6b5e62]'
                  }`}
                >
                  All Products
                </button>
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => {
                      handleCategorySelect(cat.slug);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs ${
                      selectedCategory === cat.slug
                        ? 'bg-[#b45f77] text-white font-bold'
                        : 'text-[#6b5e62]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-[#b45f77] text-white text-xs font-bold rounded-xl mt-6 shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-[#8c7e83]">
          Loading Ishara Collections...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
