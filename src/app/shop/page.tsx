'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import PageIntro from '@/components/layout/PageIntro';
import { CATEGORIES } from '@/data/mockProducts';
import { Product } from '@/types';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch real products from API
  useEffect(() => {
    let isMounted = true;
    fetch('/api/products?limit=100')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.products && isMounted) {
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
        if (data?.success && data.categories && isMounted) {
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
    if (searchQuery.trim()) params.set('q', searchQuery.trim()); else params.delete('q');
    params.set('sort', sortBy);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="studio-shop reference-page">
      {/* Header */}
      <div className="mb-8 border-b border-[#ffffff14] pb-6">
        <PageIntro page="Shop" eyebrow="THE ISHARA COLLECTION" title="Find your style." accent="Make it yours." description="Discover dresses, beauty and accessories — with clear options, simple checkout and cash on delivery across Bangladesh." />

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#d43b4a] text-white shadow-xs'
                : 'bg-[#161616] text-[#f3eee8] border border-[#ffffff14] hover:bg-[#0d0d0d]'
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
                  ? 'bg-[#d43b4a] text-white shadow-xs'
                  : 'bg-[#161616] text-[#f3eee8] border border-[#ffffff14] hover:bg-[#0d0d0d]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

          {/* Controls Bar */}
          <div className="catalog-controls bg-[#161616] p-4 rounded-2xl border border-[#ffffff14] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="catalog-search"><Search size={16} /><input aria-label="Search this collection" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search products…" /></div>
            <span className="text-xs font-semibold text-[#b7aaa4]">
              Showing <strong className="text-[#f3eee8]">{filteredProducts.length}</strong> products
            </span>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-3 py-2 bg-[#0d0d0d] border border-[#ffffff14] rounded-xl text-xs font-semibold text-[#f3eee8] flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5 text-[#d43b4a]" />
                <span>Filters</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#a89b95]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#0d0d0d] border border-[#ffffff14] text-xs py-2 px-3 rounded-xl font-medium text-[#f3eee8] focus:outline-none focus:border-[#d43b4a] cursor-pointer"
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


      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-[#161616] p-6 rounded-2xl border border-[#ffffff14] shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-[#ffffff14]">
              <span className="text-sm font-bold text-[#f3eee8] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#d43b4a]" />
                Filters
              </span>
              {(selectedCategory !== 'all' || maxPrice < 10000 || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMaxPrice(10000);
                    setSearchQuery('');
                    router.replace('/shop', { scroll: false });
                  }}
                  className="text-xs text-[#d43b4a] font-semibold hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#f3eee8] uppercase tracking-wider block">
                Max Price: ৳{maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#d43b4a] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#a89b95]">
                <span>৳500</span>
                <span>৳10,000</span>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2 pt-2 border-t border-[#ffffff14]">
              <label className="text-xs font-bold text-[#f3eee8] uppercase tracking-wider block">
                Categories
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#0d0d0d] text-[#d43b4a] font-bold'
                      : 'text-[#b7aaa4] hover:bg-[#0d0d0d]'
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
                        ? 'bg-[#0d0d0d] text-[#d43b4a] font-bold'
                        : 'text-[#b7aaa4] hover:bg-[#0d0d0d]'
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
          {/* Active Filter Badges */}
          {(selectedCategory !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#241316] text-[#d43b4a] border border-[#f5d4dc]">
                  Category: {categoriesList.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => handleCategorySelect('all')}>
                    <X className="w-3.5 h-3.5 hover:text-[#b72b39]" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#241316] text-[#d43b4a] border border-[#f5d4dc]">
                  Keyword: {searchQuery}
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3.5 h-3.5 hover:text-[#b72b39]" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {isLoading ? (<div role="status" className="p-16 text-center">Loading products…</div>) : filteredProducts.length > 0 ? (
            <div className="catalog-product-grid grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id || product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#161616] rounded-3xl border border-[#ffffff14] p-8 space-y-4">
              <div className="w-16 h-16 bg-[#241316] rounded-full flex items-center justify-center mx-auto text-[#d43b4a]">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#f3eee8]">No Products Found</h3>
              <p className="text-xs text-[#b7aaa4] max-w-sm mx-auto">
                No products match your current filters. Try adjusting the price range or resetting categories.
              </p>
              <button
                onClick={() => {
                  handleCategorySelect('all');
                  setMaxPrice(10000);
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-[#d43b4a] text-white text-xs font-bold rounded-xl hover:bg-[#b72b39] transition-colors"
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
          <div className="w-full max-w-xs bg-[#161616] h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#ffffff14]">
              <span className="text-base font-bold text-[#f3eee8] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#d43b4a]" />
                Filter Products
              </span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-[#a89b95]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#f3eee8] uppercase tracking-wider block">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Product title..."
                className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#ffffff14] rounded-xl text-xs text-[#f3eee8]"
              />
            </div>

            {/* Mobile Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#f3eee8] uppercase tracking-wider block">
                Max Price: ৳{maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#d43b4a]"
              />
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2 pt-2 border-t border-[#ffffff14]">
              <label className="text-xs font-bold text-[#f3eee8] uppercase tracking-wider block">
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
                      ? 'bg-[#d43b4a] text-white font-bold'
                      : 'text-[#b7aaa4]'
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
                        ? 'bg-[#d43b4a] text-white font-bold'
                        : 'text-[#b7aaa4]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-[#d43b4a] text-white text-xs font-bold rounded-xl mt-6 shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ShopWithParams() {
  const searchParams = useSearchParams();
  return <ShopContent key={searchParams.toString()} />;
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-[#a89b95]">
          Loading Ishara Collections...
        </div>
      }
    >
      <ShopWithParams />
    </Suspense>
  );
}
