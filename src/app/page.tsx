import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { connection } from 'next/server';
import { ArrowRight, ArrowUpRight, Truck, PackageCheck, Headphones, Wallet, Sparkle } from 'lucide-react';
import CampaignHero from '@/components/home/CampaignHero';
import CollectionRail from '@/components/home/CollectionRail';
import ProductCard from '@/components/product/ProductCard';
import { getHomeCatalog } from '@/lib/catalog';
import { STUDIO_PRODUCTS } from '@/data/studioCollection';

const worlds = [
  { name: 'The dress edit', label: 'DRESS FOR YOURSELF', image: '/images/editorial/ivory-dress.webp', href: '/shop?category=dresses', className: 'world-dress' },
  { name: 'Beauty, your way', label: 'THE EVERYDAY RITUAL', image: '/images/editorial/rose-lip.webp', href: '/shop?category=beauty', className: 'world-beauty' },
  { name: 'After-dark elegance', label: 'A DIFFERENT KIND OF DRAMA', image: '/images/editorial/noir-dress.webp', href: '/products/noir-muse-satin-dress', className: 'world-noir' },
];

async function HomeContent() {
  await connection();
  const { products } = await getHomeCatalog();
  const studio = STUDIO_PRODUCTS.map((concept) => products.find((product) => product.slug === concept.slug)).filter((product) => product !== undefined);
  const collection = studio.length ? studio : products.slice(0, 6);
  return <div className="studio-home">
    <div className="hero-frame"><CampaignHero /></div>
    <section className="service-strip studio-section" aria-label="Shopping with Ishara">{[
      { icon: Truck, title: 'Nationwide delivery', detail: 'From Dhaka, to your doorstep' },
      { icon: Wallet, title: 'Cash on delivery', detail: 'No advance payment needed' },
      { icon: PackageCheck, title: 'Shop with confidence', detail: 'Clear delivery & return policies' },
      { icon: Headphones, title: 'Here to help', detail: 'A real team, a message away' },
    ].map(({ icon: Icon, title, detail }) => <div className="service-item" key={title}><span className="service-icon"><Icon size={22} strokeWidth={1.4} /></span><div><h3>{title}</h3><p>{detail}</p></div></div>)}</section>

    <section className="studio-section worlds-section"><div className="section-heading"><div><p className="eyebrow"><span className="red-dash" />A WORLD OF YOUR OWN</p><h2>Choose your <em>mood.</em></h2></div><Link className="text-link" href="/shop">All collections <ArrowRight size={17} /></Link></div>
      <div className="worlds-grid">{worlds.map((world, index) => <Link className={`world-card ${world.className}`} href={world.href} key={world.name}><Image src={world.image} alt={world.name} fill sizes="(max-width: 640px) 82vw, 33vw" className="world-image" /><div className="world-shade" /><span className="world-index">0{index + 1}</span><div className="world-caption"><div><span>{world.label}</span><h3>{world.name}</h3></div><span className="world-arrow"><ArrowUpRight size={22} /></span></div></Link>)}</div>
    </section>

    <CollectionRail products={collection} />

    <div className="studio-marquee" aria-label="Wear your mood. Own your moment. Made for you."><div className="marquee-track">{[0, 1, 2, 3].map((index) => <span key={index} aria-hidden={index > 0}>WEAR YOUR MOOD <Sparkle /> OWN YOUR MOMENT <Sparkle /> MADE FOR YOU <Sparkle /></span>)}</div></div>

    <section className="beauty-story studio-section"><div className="beauty-story-image"><Image src="/images/editorial/beauty-campaign.webp" alt="Original Ishara beauty campaign: lipstick, serum and beauty essentials styled on sculptural stone" fill sizes="(max-width: 768px) 100vw, 60vw" /><span className="image-credit">ISHARA STUDIO / BEAUTY NOTES, 01</span></div><div className="beauty-story-copy"><p className="eyebrow"><span className="red-dash" />LESS ROUTINE. MORE RITUAL.</p><h2>Little things.<br /><em>Beautiful feeling.</em></h2><p>A favourite shade. A quiet moment. A little something that feels entirely like you. Meet our first beauty concepts, imagined in the Ishara studio.</p><Link className="studio-button" href="/shop?category=beauty">Meet your beauty edit <ArrowUpRight size={17} /></Link><div className="story-signature">The everyday, elevated.<span>— ISHARA</span></div></div></section>

    <section className="studio-section new-edit"><div className="section-heading"><div><p className="eyebrow"><span className="red-dash" />CONSIDERED. CURATED. YOURS.</p><h2>The studio <em>selection.</em></h2></div><span className="section-aside">A first look at our fashion & beauty direction.</span></div><div className="studio-product-grid">{collection.slice().reverse().slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div></section>

    <section className="studio-section closing-note"><span className="eyebrow">THE ISHARA WAY</span><h2>Good style doesn’t shout.<br />It feels like <em>you.</em></h2><Link href="/about" className="text-link">Get to know Ishara <ArrowRight size={17} /></Link></section>
    <section className="studio-section studio-faq"><div><p className="eyebrow"><span className="red-dash" />A LITTLE HELP</p><h2>Before you <em>fall in love.</em></h2></div><div className="studio-faq-list">{[
      ['How do I place an order?', 'Choose a product and an available option, add it to your bag, then enter your name, mobile number and delivery address. Review the total and confirm. No account is required.'],
      ['Can I pay when it arrives?', 'Yes. Available products can be ordered with cash on delivery. Your delivery charge is clearly shown at checkout.'],
      ['What is the studio collection?', 'These are original fashion and beauty concepts with AI-created campaign imagery. They are labelled Studio preview and cannot be ordered until actual products and inventory are confirmed.'],
    ].map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}<Link href="/contact" className="text-link">Still have a question? Talk to us <ArrowUpRight size={15} /></Link></div></section>
  </div>;
}

export default function HomePage() { return <Suspense fallback={<div className="studio-loading" role="status">A little elegance is on its way…</div>}><HomeContent /></Suspense>; }
