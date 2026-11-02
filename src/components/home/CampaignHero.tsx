'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const slides = [
  { image: '/images/editorial/campaign-hero.webp', eyebrow: 'THE ISHARA STUDIO · VOL. 01', title: ['A little bold.', 'Entirely you.'], description: 'Considered silhouettes. Beautiful little rituals. An expression of everything you are.', link: '/shop?category=dresses', cta: 'Explore the collection', position: '70% center' },
  { image: '/images/editorial/beauty-campaign.webp', eyebrow: 'BEAUTY, IN YOUR OWN WAY', title: ['Your ritual.', 'Reimagined.'], description: 'Discover our beauty studio. Rich tones, thoughtful details, and a little everyday indulgence.', link: '/shop?category=beauty', cta: 'Discover beauty', position: 'center center' },
];

export default function CampaignHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (paused || hovered || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => { if (!document.hidden) setActive((value) => (value + 1) % slides.length); }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, hovered]);
  const slide = slides[active];
  return <section className="campaign-hero" aria-roledescription="carousel" aria-label="Ishara campaigns" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setHovered(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false); }}>
    {slides.map((item, index) => <div key={item.image} className={`campaign-slide ${index === active ? 'is-active' : ''}`} aria-hidden={index !== active}><Image src={item.image} alt={index === 0 ? 'Ishara studio: black satin dress against sculptural burgundy drapery' : 'Original Ishara beauty concepts on travertine and burgundy satin'} fill priority={index === 0} sizes="100vw" style={{ objectFit: 'cover', objectPosition: item.position }} /></div>)}
    <div className="campaign-shade" />
    <div className="campaign-copy" key={active}>
      <p className="eyebrow"><span className="red-dash" />{slide.eyebrow}</p>
      <h1>{slide.title[0]}<br /><em>{slide.title[1]}</em></h1>
      <p className="campaign-description">{slide.description}</p>
      <Link className="studio-button" href={slide.link}>{slide.cta}<ArrowUpRight size={17} /></Link>
      <span className="campaign-note">Original studio concepts · Fashion & beauty</span>
    </div>
    <div className="campaign-side-controls"><button aria-label="Previous campaign" onClick={() => setActive((active + slides.length - 1) % slides.length)}><ChevronLeft size={17} /></button><button aria-label="Next campaign" onClick={() => setActive((active + 1) % slides.length)}><ChevronRight size={17} /></button></div>
    <div className="campaign-dots">{slides.map((_, index) => <button key={index} aria-label={`Show campaign ${index + 1}`} aria-current={active === index ? 'true' : undefined} onClick={() => setActive(index)} />)}</div>
    <div className="campaign-bottom"><span className="campaign-caption">DHAKA, BANGLADESH<br /><b>MADE FOR YOUR EVERYDAY.</b></span><div className="campaign-controls"><span className="slide-number">0{active + 1}<i>/ 02</i></span><button aria-label={paused ? 'Play campaigns' : 'Pause campaigns'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={13} /> : <Pause size={13} />}</button></div></div>
  </section>;
}
