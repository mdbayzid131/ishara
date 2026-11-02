'use client';

import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import PageIntro from '@/components/layout/PageIntro';
import ProductCard from '@/components/product/ProductCard';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
  const { items } = useWishlist();
  return <div className="reference-page"><PageIntro page="Saved pieces" eyebrow="YOUR LITTLE COLLECTION" title="Love it now." accent="Find it later." description="Keep the pieces that catch your eye. Your saved collection stays on this device, ready when you are." image="/images/editorial/beauty-campaign.webp" />{items.length ? <section className="saved-collection"><div className="saved-heading"><h2>Your saved pieces <span>({items.length})</span></h2><Link href="/shop">Keep exploring <ArrowRight size={15} /></Link></div><div className="studio-product-grid">{items.map((product) => <ProductCard key={product.slug} product={product} />)}</div></section> : <div className="saved-empty"><Heart size={34} strokeWidth={1.3} /><h2>A little space for your favourites.</h2><p>Tap the heart on any product to save it here.</p><Link href="/shop" className="studio-button">Explore the collection <ArrowRight size={16} /></Link></div>}</div>;
}
