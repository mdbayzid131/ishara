'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Plus, Heart } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { items: savedItems, toggle } = useWishlist();
  const saved = savedItems.some((item) => item.slug === product.slug);
  const { buyNow } = useCart();
  const preview = product.badge === 'Studio preview';
  const soldOut = product.totalStock <= 0 || (product.hasVariants && !product.variants.some((variant) => variant.stock > 0));
  function order() {
    if (preview || product.hasVariants) { router.push(`/products/${product.slug}`); return; }
    if (soldOut) return;
    buyNow(product, undefined, 1); router.push('/checkout');
  }
  const discount = product.compareAtPrice && product.compareAtPrice > product.basePrice ? Math.round((1 - product.basePrice / product.compareAtPrice) * 100) : 0;
  const sizes = [...new Set(product.variants.map((variant) => variant.attributes?.size).filter(Boolean))];
  return <article className="studio-product-card"><div className="product-visual"><Link href={`/products/${product.slug}`} className="product-image-link" aria-label={`View ${product.title}`}><Image src={product.images[0] || '/images/ishara-emblem.png'} alt={product.title} fill sizes="(max-width: 640px) 75vw, (max-width: 1024px) 40vw, 25vw" className="product-photo" />{product.images[1] && <Image src={product.images[1]} alt="" fill sizes="(max-width: 640px) 75vw, 25vw" className="product-photo product-photo-alt" />}</Link><span className={`product-badge ${preview ? 'is-preview' : ''}`}>{preview ? 'STUDIO PREVIEW' : soldOut ? 'SOLD OUT' : discount ? `−${discount}%` : product.badge || 'THE ISHARA EDIT'}</span><button type="button" className={`product-save ${saved ? 'is-saved' : ''}`} aria-label={`${saved ? 'Unsave' : 'Save'} ${product.title}`} aria-pressed={saved} onClick={() => toggle(product)}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button><Link href={`/products/${product.slug}`} className="product-quickview" aria-label={`Explore ${product.title}`}><ArrowUpRight size={19} /></Link><div className="product-hover-strip"><span>{preview ? 'A FIRST LOOK, BY ISHARA' : 'DISCOVER YOUR NEXT FAVOURITE'}</span><ArrowUpRight size={16} /></div></div><div className="product-meta"><div className="product-meta-line"><span>{product.category}</span><div className="product-options">{sizes.length ? sizes.slice(0, 3).map((size) => <span key={size}>{size}</span>) : <span className="color-swatch" style={{ background: product.categorySlug === 'beauty' ? '#a46664' : '#b8a28a' }} />}</div></div><Link className="product-title" href={`/products/${product.slug}`}>{product.title}</Link><div className="product-price-line"><div><span className="product-price">৳{product.basePrice.toLocaleString()}</span>{discount > 0 && <del>৳{product.compareAtPrice?.toLocaleString()}</del>}{preview && <small>illustrative price</small>}</div><button className="product-order-button" disabled={!preview && soldOut} aria-label={preview ? `View ${product.title} concept` : `Order ${product.title}`} onClick={order}>{preview ? <ArrowUpRight size={17} /> : <Plus size={17} />}</button></div></div></article>;
}
