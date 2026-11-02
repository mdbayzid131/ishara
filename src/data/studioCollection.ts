import type { Product } from '@/types';

const base = {
  status: 'published' as const, totalStock: 0, salesCount: 0, isFeatured: true,
  rating: 0, reviewsCount: 0, badge: 'Studio preview',
  shortDescription: 'An Ishara studio concept, created for this collection preview. Not currently available to order.',
  description: 'This is a fictional product concept with AI-created campaign photography. The design and price are illustrative. Actual fabric, ingredients, sizing and availability must be confirmed before this product is offered for sale.',
  highlights: ['Ishara studio concept', 'Original campaign imagery', 'Preview only — not available to order'],
};

export const STUDIO_PRODUCTS: Product[] = [
  { ...base, id: 'studio-ivory-bloom', slug: 'ivory-bloom-embroidered-dress', title: 'Ivory Bloom Embroidered Dress', category: 'Dresses', categorySlug: 'dresses', basePrice: 3290, images: ['/images/editorial/ivory-dress.webp'], hasVariants: true, variants: ['S', 'M', 'L'].map((size) => ({ id: `IVORY-${size}`, sku: `ISH-STUDIO-IVORY-${size}`, name: `Ivory / ${size}`, attributes: { color: 'Ivory', size }, stock: 0 })) },
  { ...base, id: 'studio-rose-veil', slug: 'rose-veil-satin-lipstick', title: 'Rose Veil Satin Lipstick', category: 'Beauty', categorySlug: 'beauty', basePrice: 890, images: ['/images/editorial/rose-lip.webp'], hasVariants: false, variants: [] },
  { ...base, id: 'studio-noir-muse', slug: 'noir-muse-satin-dress', title: 'Noir Muse Satin Dress', category: 'Dresses', categorySlug: 'dresses', basePrice: 2890, images: ['/images/editorial/noir-dress.webp'], hasVariants: true, variants: ['S', 'M', 'L'].map((size) => ({ id: `NOIR-${size}`, sku: `ISH-STUDIO-NOIR-${size}`, name: `Noir / ${size}`, attributes: { color: 'Black', size }, stock: 0 })) },
  { ...base, id: 'studio-dewdrop', slug: 'dewdrop-glow-serum', title: 'Dewdrop Glow Serum', category: 'Beauty', categorySlug: 'beauty', basePrice: 1490, images: ['/images/editorial/glow-serum.webp'], hasVariants: false, variants: [] },
];

export const STUDIO_CATEGORIES = [
  { name: 'Dresses', slug: 'dresses', description: 'A little drama. A lot of you.', image: '/images/editorial/ivory-dress.webp', isFeatured: true, isActive: true, sortOrder: -2 },
  { name: 'Beauty', slug: 'beauty', description: 'Your everyday beauty ritual.', image: '/images/editorial/rose-lip.webp', isFeatured: true, isActive: true, sortOrder: -1 },
];
