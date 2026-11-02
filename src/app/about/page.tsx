import Image from 'next/image';
import Link from 'next/link';
import { Heart, Truck, Wallet, Sparkles, ArrowRight } from 'lucide-react';
import PageIntro from '@/components/layout/PageIntro';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About Ishara | An Expression of You', description: 'Get to know Ishara, a Bangladesh-focused fashion, beauty and accessories store.' };

export default function AboutPage() {
  return <div className="reference-page about-reference"><PageIntro page="About us" eyebrow="OUR STORY" title="More than a look." accent="An expression of you." description="A considered world of fashion, beauty and accessories, inspired by the way you live, dress and feel." />
    <section className="about-story"><div className="about-story-image"><Image src="/images/editorial/ivory-dress.webp" alt="Ishara ivory dress studio concept" fill sizes="(max-width: 768px) 100vw, 50vw" /><span>THE ISHARA STUDIO</span></div><div><span className="intro-label">WHO WE ARE</span><h2>Wear what feels<br /><span>like you.</span></h2><span className="story-rule" /><p>Ishara brings fashion, beauty and accessories together in one place. We believe personal style begins with the little things you choose for yourself: a silhouette, a shade, a detail that catches your eye.</p><p>Our first studio collection explores that idea through original dress and beauty concepts. Alongside it, you can browse our available accessories and order with a straightforward cash-on-delivery checkout.</p><Link className="studio-button" href="/shop">Explore the collection <ArrowRight size={16} /></Link></div></section>
    <section className="about-values"><div className="reference-heading"><span className="intro-label">THE LITTLE THINGS THAT MATTER</span><h2>A better way to <span>find your favourites.</span></h2></div><div className="value-grid">{[
      { icon: Sparkles, title: 'A considered collection', text: 'Discover pieces across fashion, beauty and accessories, with clear product details and options.' },
      { icon: Wallet, title: 'Simple, guest checkout', text: 'No account required. Review your total and pay cash when your available order arrives.' },
      { icon: Truck, title: 'Delivery across Bangladesh', text: 'Choose your delivery area at checkout. Your delivery charge is shown before you confirm.' },
      { icon: Heart, title: 'Help when you need it', text: 'Ask about a product, follow an order, or talk to our team about delivery and exchanges.' },
    ].map(({icon:Icon,title,text}) => <article className="reference-card" key={title}><span className="support-icon"><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="about-invitation"><span className="intro-label">YOUR NEXT FAVOURITE IS WAITING</span><h2>A little more <em>you.</em></h2><p>Find your mood in the collection, or ask our team for a little help.</p><div><Link href="/shop" className="studio-button">Shop the edit <ArrowRight size={16} /></Link><Link href="/contact" className="text-link">Talk to Ishara <ArrowRight size={16} /></Link></div></section>
  </div>;
}
