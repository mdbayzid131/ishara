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
import { useStore } from '@/context/StoreContext';
import { trackViewContent, trackAddToCart } from '@/lib/tracking/pixel';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { settings } = useStore();
  const slug = params?.slug as string;

  const initialProduct = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  const [product, setProduct] = useState(initialProduct);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [relatedProducts, setRelatedProducts] = useState<typeof PRODUCTS>([]);
  const { addToCart, buyNow } = useCart();

  // Active state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageOverride, setImageOverride] = useState<string | null>(null);
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
          setLoadState('ready');
          if (data.product.hasVariants && data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant((prev) => {
              if (!prev) return data.product.variants.find((variant: ProductVariant) => variant.stock > 0) || data.product.variants[0];
              const matched = data.product.variants.find(
                (v: ProductVariant) => v.sku === prev.sku || v.id === prev.id
              );
              return matched || data.product.variants.find((variant: ProductVariant) => variant.stock > 0) || data.product.variants[0];
            });
          } else { setSelectedVariant(undefined); }
        } else if (isMounted) { setLoadState('error'); }
      })
      .catch(() => { if (isMounted) setLoadState('error'); });

    fetch('/api/products?limit=8').then((res) => res.json()).then((data) => { if (isMounted && data.success) setRelatedProducts(data.products); }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const currentPrice = selectedVariant?.price ?? product.basePrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.totalStock;
  const isStudioPreview = product.badge === 'Studio preview';
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
    if (isOutOfStock) return;
    buyNow(product, selectedVariant, Math.min(quantity, currentStock));
    trackAddToCart({
      title: product.title,
      sku: selectedVariant?.sku || product.slug,
      price: currentPrice,
      quantity,
    });
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, Math.min(quantity, currentStock));
    trackAddToCart({
      title: product.title,
      sku: selectedVariant?.sku || product.slug,
      price: currentPrice,
      quantity,
    });
  };



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

  if (loadState === 'loading') return <div role="status" className="p-16 text-center">Loading product…</div>;
  if (loadState === 'error') return <div className="p-16 text-center space-y-4"><h1 className="text-2xl font-bold">This product is unavailable</h1><p>Please explore our current collection.</p><Link href="/shop" className="text-[#ed6974] underline">Continue shopping</Link></div>;

  return (
    <div className="studio-detail reference-detail pb-24 lg:pb-16 pt-4 sm:pt-8 bg-[#0d0d0d]">
      {/* JSON-LD Schema for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="flex items-center gap-1.5 text-xs text-[#a89b95]">
          <Link href="/" className="hover:text-[#d43b4a] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-[#d43b4a] transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#f3eee8] font-medium truncate max-w-xs">
            {product.title}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reference-product-layout grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Image */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#0d0d0d] border border-[#ffffff14]">
              <Image
                src={imageOverride || selectedVariant?.image || product.images?.[selectedImageIndex] || product.images?.[0] || '/images/ishara-logo.png'}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover object-center"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#d43b4a] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
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
                    aria-label={`View image ${idx + 1} of ${product.title}`}
                    onClick={() => { setSelectedImageIndex(idx); setImageOverride(img); }}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#d43b4a] ring-2 ring-[#d43b4a]/20'
                        : 'border-[#ffffff14] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="80px" className="object-cover" />
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
                <span className="text-xs font-bold text-[#d43b4a] uppercase tracking-wider">
                  {product.category}
                </span>
                {product.reviewsCount > 0 && <div className="flex items-center gap-1 bg-[#0d0d0d] px-2.5 py-1 rounded-full border border-[#ffffff14]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span className="text-xs font-bold text-[#f3eee8]">{product.rating}</span>
                  <span className="text-[11px] text-[#a89b95]">({product.reviewsCount} reviews)</span>
                </div>}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-3xl font-extrabold text-[#f3eee8] leading-tight">
                {product.title}
              </h1>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#b7aaa4] mt-2.5 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Pricing Box */}
              <div className="reference-pricing mt-5 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-[#d43b4a]">
                  ৳{currentPrice.toLocaleString()} BDT {isStudioPreview && <small className="text-xs font-normal text-[#a89b95]">Illustrative price</small>}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-sm text-[#a89b95] line-through">
                      ৳{product.compareAtPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 bg-[#d43b4a] text-white text-[11px] font-bold rounded-full">
                      SAVE {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Variant Picker (Color/Finish) */}
              {product.hasVariants && (
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#f3eee8] uppercase tracking-wider">
                      Select Variant:{' '}
                      <span className="text-[#d43b4a] font-semibold">{selectedVariant?.name}</span>
                    </span>
                    <span className="text-[11px] text-[#a89b95]">
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
                          onClick={() => { setSelectedVariant(variant); setQuantity(1); setImageOverride(null); }}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                            isSelected
                              ? 'border-[#d43b4a] bg-[#d43b4a] text-white shadow-xs'
                              : 'border-[#ffffff14] bg-[#161616] text-[#f3eee8] hover:bg-[#0d0d0d]'
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
                  <span className="text-xs font-bold text-[#f3eee8] uppercase tracking-wider block mb-2">
                    Quantity
                  </span>
                  <div className="flex items-center border border-[#ffffff14] rounded-xl bg-[#161616] shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2 text-[#b7aaa4] hover:text-[#d43b4a] disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-[#f3eee8]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      disabled={quantity >= currentStock}
                      className="p-2 text-[#b7aaa4] hover:text-[#d43b4a] disabled:opacity-40"
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
                      {isStudioPreview ? 'Studio preview · Not available to order' : 'Currently Out of Stock'}
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
                  className="w-full py-4 px-6 bg-[#d43b4a] hover:bg-[#b72b39] disabled:bg-gray-300 text-white font-extrabold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99]"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>{isStudioPreview ? 'STUDIO PREVIEW · COMING TO LIFE' : 'ORDER NOW — CASH ON DELIVERY'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full py-3.5 px-6 bg-[#161616] hover:bg-[#241316] border-2 border-[#d43b4a] text-[#d43b4a] font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>
              </div>

              {/* Delivery & Trust Guarantee Badges */}
              <div className="mt-6 p-4 rounded-2xl bg-[#0d0d0d] border border-[#ffffff14] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#f3eee8] font-medium">
                  <Truck className="w-4 h-4 text-[#d43b4a] shrink-0" />
                  <span>
                    <strong>Inside Dhaka:</strong> ৳{settings.insideDhakaFee} (1–2 days) | <strong>Outside Dhaka:</strong> ৳{settings.outsideDhakaFee} (2–4 days)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#f3eee8] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#d43b4a] shrink-0" />
                  <span>
                    <strong>Inspect before pay:</strong> Check package condition in front of delivery person.
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#f3eee8] font-medium">
                  <RotateCcw className="w-4 h-4 text-[#d43b4a] shrink-0" />
                  <span>
                    <strong>7 Days Easy Exchange:</strong> Hassle-free support via WhatsApp (+880 1711-223344).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Highlights, Shipping */}
        <div className="mt-12 bg-[#161616] rounded-3xl border border-[#ffffff14] p-6 sm:p-10 shadow-xs">
          <div className="flex border-b border-[#ffffff14] gap-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'desc'
                  ? 'border-[#d43b4a] text-[#d43b4a]'
                  : 'border-transparent text-[#b7aaa4] hover:text-[#f3eee8]'
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'shipping'
                  ? 'border-[#d43b4a] text-[#d43b4a]'
                  : 'border-transparent text-[#b7aaa4] hover:text-[#f3eee8]'
              }`}
            >
              Delivery & Returns
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'desc' && (
              <div className="space-y-6">
                <p className="text-sm text-[#b7aaa4] leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>

                {product.highlights && product.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-[#f3eee8] uppercase tracking-wider mb-3">
                      Key Highlights
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#b7aaa4]">
                      {product.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#d43b4a] shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs sm:text-sm text-[#b7aaa4] leading-relaxed">
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
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#f3eee8]">
              Complete Your Look
            </h3>
            <p className="text-xs text-[#b7aaa4] mt-0.5">
              More pieces to explore from our collection:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.filter((item) => item.id !== product.id).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar on Mobile for Instant Ad Conversion */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-[#161616]/95 backdrop-blur-md border-t border-[#ffffff14] p-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
        <div>
          <span className="text-[11px] text-[#a89b95] block">{isStudioPreview ? 'Studio preview' : 'Cash on Delivery'}</span>
          <span className="text-base font-extrabold text-[#d43b4a]">
            ৳{currentPrice.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 py-3 px-4 bg-[#d43b4a] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{isStudioPreview ? 'STUDIO PREVIEW' : 'ORDER NOW (COD)'}</span>
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm text-[#b7aaa4]">Loading product...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
