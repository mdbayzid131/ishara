import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';

export default function PageIntro({ page, eyebrow, title, accent, description, image = '/images/editorial/campaign-hero.webp' }: { page: string; eyebrow: string; title: string; accent: string; description: string; image?: string }) {
  return <section className="page-intro"><div className="page-intro-copy"><nav aria-label="Breadcrumb" className="page-breadcrumb"><Link href="/">Home</Link><ChevronRight size={12} /><span>{page}</span></nav><span className="intro-label"><Sparkles size={12} />{eyebrow}</span><h1>{title} <span>{accent}</span></h1><p>{description}</p></div><div className="page-intro-image"><Image src={image} alt="Ishara fashion and beauty studio" fill sizes="(max-width: 640px) 100vw, 320px" /><span>ISHARA / {page.toUpperCase()}</span></div></section>;
}
