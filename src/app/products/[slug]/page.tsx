'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  Zap,
  Check,
  Plus,
  Minus,
  ChevronRight,
  PackageCheck,
} from 'lucide-react';
import { PRODUCTS } from '@/data/mockProducts';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/product/ProductCard';
import { ProductVariant } from '@/types';
import { trackViewContent, trackAddToCart } from '@/lib/tracking/pixel';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const initialProduct = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  const [product, setProduct] = useState(initialProduct);
  const { addToCart, buyNow } = useCart();

  // Active state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants[0] ? (product.variants[0] as ProductVariant) : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'shipping' | 'care'>('desc');

  // Sync with live server API
  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    fetch(`/api/products/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && data.product && isMounted) {
          setProduct(data.product);
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant((prev) => {
              if (!prev) return data.product.variants[0];
              const matched = data.product.variants.find(
                (v: ProductVariant) => v.sku === prev.sku || v.id === prev.id
              );
              return matched || data.product.variants[0];
            });
          }
        }
      })
      .catch((err) => console.error('Live product fetch error:', err));

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const currentPrice = selectedVariant?.price ?? product.basePrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.totalStock;
  const isOutOfStock = currentStock <= 0;

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - currentPrice) / product.compareAtPrice) * 100)
    : 0;

  // Track Meta Pixel ViewContent event
  useEffect(() => {
    if (product) {
      trackViewContent({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: currentPrice,
        category: product.category,
      });
    }
  }, [product, currentPrice]);

  const handleBuyNow = () => {
    buyNow(product, selectedVariant, quantity);
    trackAddToCart({
      title: product.title,
      sku: selectedVariant?.sku || product.slug,
      price: currentPrice,
      quantity,
    });
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    trackAddToCart({
      title: product.title,
      sku: selectedVariant?.sku || product.slug,
      price: currentPrice,
      quantity,
    });
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.images,
    description: product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: 'Ishara',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BDT',
      price: currentPrice,
      availability: currentStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="pb-24 lg:pb-16 pt-4 sm:pt-8 bg-[#faf6f2]">
      {/* JSON-LD Schema for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="flex items-center gap-1.5 text-xs text-[#8c7e83]">
          <Link href="/" className="hover:text-[#b45f77] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-[#b45f77] transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#201a1c] font-medium truncate max-w-xs">
            {product.title}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl border border-[#efe8e1] p-4 sm:p-8 lg:p-10 shadow-sm">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#faf6f2] border border-[#efe8e1]">
              <Image
                src={selectedVariant?.image || product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                fill
                priority
                className="object-cover object-center"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#b45f77] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#b45f77] ring-2 ring-[#b45f77]/20'
                        : 'border-[#efe8e1] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Buy Box & Product Info */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-[#b45f77] uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 bg-[#faf6f2] px-2.5 py-1 rounded-full border border-[#efe8e1]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span className="text-xs font-bold text-[#201a1c]">{product.rating}</span>
                  <span className="text-[11px] text-[#8c7e83]">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-3xl font-extrabold text-[#201a1c] leading-tight">
                {product.title}
              </h1>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#6b5e62] mt-2.5 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Pricing Box */}
              <div className="mt-5 p-4 rounded-2xl bg-[#fdf5f7] border border-[#f5d4dc] flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-[#b45f77]">
                  ৳{currentPrice.toLocaleString()} BDT
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-sm text-[#8c7e83] line-through">
                      ৳{product.compareAtPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 bg-[#b45f77] text-white text-[11px] font-bold rounded-full">
                      SAVE {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Variant Picker (Color/Finish) */}
              {product.hasVariants && (
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#201a1c] uppercase tracking-wider">
                      Select Variant:{' '}
                      <span className="text-[#b45f77] font-semibold">{selectedVariant?.name}</span>
                    </span>
                    <span className="text-[11px] text-[#8c7e83]">
                      SKU: {selectedVariant?.sku}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((variant: ProductVariant) => {
                      const isSelected = selectedVariant?.sku
                        ? selectedVariant.sku === variant.sku
                        : selectedVariant?.id === (variant.id || (variant as unknown as { _id?: string })._id);
                      return (
                        <button
                          key={variant.sku || variant.id || (variant as unknown as { _id?: string })._id}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                            isSelected
                              ? 'border-[#b45f77] bg-[#b45f77] text-white shadow-xs'
                              : 'border-[#efe8e1] bg-white text-[#201a1c] hover:bg-[#faf6f2]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{variant.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Stock Status */}
              <div className="mt-6 flex items-center gap-6">
                <div>
                  <span className="text-xs font-bold text-[#201a1c] uppercase tracking-wider block mb-2">
                    Quantity
                  </span>
                  <div className="flex items-center border border-[#efe8e1] rounded-xl bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2 text-[#6b5e62] hover:text-[#b45f77] disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-[#201a1c]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      disabled={quantity >= currentStock}
                      className="p-2 text-[#6b5e62] hover:text-[#b45f77] disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-5">
                  {currentStock > 5 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full">
                      <PackageCheck className="w-4 h-4" /> In Stock (Available for COD)
                    </span>
                  ) : currentStock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-semibold bg-amber-50 px-3 py-1.5 rounded-full">
                      🔥 Only {currentStock} left in stock!
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 font-semibold bg-red-50 px-3 py-1.5 rounded-full">
                      Currently Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Big CTA Action Buttons */}
              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full py-4 px-6 bg-[#b45f77] hover:bg-[#9e4a62] disabled:bg-gray-300 text-white font-extrabold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99]"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>ORDER NOW — CASH ON DELIVERY</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full py-3.5 px-6 bg-white hover:bg-[#fdf5f7] border-2 border-[#b45f77] text-[#b45f77] font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>
              </div>

              {/* Delivery & Trust Guarantee Badges */}
              <div className="mt-6 p-4 rounded-2xl bg-[#faf6f2] border border-[#efe8e1] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#201a1c] font-medium">
                  <Truck className="w-4 h-4 text-[#b45f77] shrink-0" />
                  <span>
                    <strong>Inside Dhaka:</strong> ৳70 (24-48 hours) | <strong>Outside Dhaka:</strong> ৳130 (2-4 days)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#201a1c] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#b45f77] shrink-0" />
                  <span>
                    <strong>Inspect before pay:</strong> Check package condition in front of delivery person.
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#201a1c] font-medium">
                  <RotateCcw className="w-4 h-4 text-[#b45f77] shrink-0" />
                  <span>
                    <strong>7 Days Easy Exchange:</strong> Hassle-free support via WhatsApp (+880 1711-223344).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Highlights, Shipping */}
        <div className="mt-12 bg-white rounded-3xl border border-[#efe8e1] p-6 sm:p-10 shadow-xs">
          <div className="flex border-b border-[#efe8e1] gap-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'desc'
                  ? 'border-[#b45f77] text-[#b45f77]'
                  : 'border-transparent text-[#6b5e62] hover:text-[#201a1c]'
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'shipping'
                  ? 'border-[#b45f77] text-[#b45f77]'
                  : 'border-transparent text-[#6b5e62] hover:text-[#201a1c]'
              }`}
            >
              Delivery & Returns
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'desc' && (
              <div className="space-y-6">
                <p className="text-sm text-[#6b5e62] leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>

                {product.highlights && product.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-3">
                      Key Highlights
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6b5e62]">
                      {product.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#b45f77] shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs sm:text-sm text-[#6b5e62] leading-relaxed">
                <p>
                  We partner with top-rated couriers including Pathao, Steadfast, and RedX to ensure safe and timely delivery to your doorstep anywhere in Bangladesh.
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Dhaka City:</strong> ৳70 delivery charge (within 24-48 hours).</li>
                  <li><strong>Sub-Dhaka & All Other Districts:</strong> ৳130 delivery charge (within 2-4 business days).</li>
                  <li><strong>Free Delivery:</strong> Orders exceeding ৳3,000 qualify for zero delivery fee.</li>
                  <li><strong>Package Inspection:</strong> You are welcome to inspect your item before handing over cash.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#201a1c]">
              Complete Your Look
            </h3>
            <p className="text-xs text-[#6b5e62] mt-0.5">
              Customers who viewed this item also loved these selections:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar on Mobile for Instant Ad Conversion */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#efe8e1] p-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
        <div>
          <span className="text-[11px] text-[#8c7e83] block">Cash on Delivery</span>
          <span className="text-base font-extrabold text-[#b45f77]">
            ৳{currentPrice.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 py-3 px-4 bg-[#b45f77] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>ORDER NOW (COD)</span>
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm text-[#6b5e62]">Loading product...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
