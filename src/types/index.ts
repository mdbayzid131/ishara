export type DeliveryZoneId = 'inside_dhaka' | 'outside_dhaka';

export interface DeliveryZone {
  id: DeliveryZoneId;
  name: string;
  fee: number;
  estimatedDelivery: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  attributes: {
    color?: string;
    size?: string;
    material?: string;
    [key: string]: string | undefined;
  };
  price?: number; // Override price if different from basePrice
  stock: number;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  categorySlug: string;
  basePrice: number;
  compareAtPrice?: number;
  images: string[];
  hasVariants: boolean;
  variants: ProductVariant[];
  totalStock: number;
  salesCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  badge?: string; // e.g. "Trending", "New", "Hot"
  highlights?: string[];
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  productSlug: string;
  title: string;
  variantName?: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  deliveryZone: DeliveryZoneId;
  deliveryZoneName: string;
  notes?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  variantId?: string;
  productSlug: string;
  title: string;
  variantName?: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  accessToken: string;
  customer: OrderCustomer;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'COD';
  status: OrderStatus;
  courier?: {
    provider?: string;
    trackingCode?: string;
    consignmentId?: string;
    notes?: string;
  };
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note: string;
    actor: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  isFeatured?: boolean;
}
