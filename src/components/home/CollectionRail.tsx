'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/types';

export default function CollectionRail({ products }: { products: Product[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('all');
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const filtered = products.filter((product) => filter === 'all' || product.categorySlug === filter);
  function move(direction: number) {
    const element = rail.current;
    if (!element) return;
    const width = element.firstElementChild?.getBoundingClientRect().width || 300;
    const next = element.scrollLeft + direction * (width + 24);
    const maximum = element.scrollWidth - element.clientWidth;
    element.scrollTo({ left: direction > 0 && element.scrollLeft >= maximum - 2 ? 0 : Math.min(maximum, Math.max(0, next)), behavior: 'smooth' });
  }
  useEffect(() => {
    if (paused || hovered || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => { if (!document.hidden) move(1); }, 4500);
    return () => window.clearInterval(timer);
  }, [paused, hovered, filter]);
  return <section className="studio-section collection-section" aria-labelledby="collection-heading">
    <div className="section-heading"><div><p className="eyebrow"><span className="red-dash" />THE NEW PERSPECTIVE</p><h2 id="collection-heading">Find your <em>signature.</em></h2></div><Link className="text-link" href="/shop">Explore all pieces <ArrowRight size={17} /></Link></div>
    <div className="collection-toolbar"><div className="collection-tabs" role="group" aria-label="Filter studio collection">{[['all', 'All pieces'], ['dresses', 'Dresses'], ['beauty', 'Beauty']].map(([value, label]) => <button key={value} className={filter === value ? 'is-active' : ''} aria-pressed={filter === value} onClick={() => { setFilter(value); rail.current?.scrollTo({ left: 0 }); }}>{label}</button>)}</div><div className="rail-controls"><button aria-label={paused ? 'Play collection scrolling' : 'Pause collection scrolling'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}</button><button aria-label="Previous products" onClick={() => move(-1)}><ArrowLeft size={17} /></button><button aria-label="Next products" onClick={() => move(1)}><ArrowRight size={17} /></button></div></div>
    <div ref={rail} className="collection-rail" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setHovered(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false); }}>{filtered.map((product) => <div className="rail-item" key={product.id}><ProductCard product={product} /></div>)}</div>
    <div className="collection-footnote"><span>THE STUDIO COLLECTION</span><span>Original concepts. A first look at what’s next.</span></div>
  </section>;
}
