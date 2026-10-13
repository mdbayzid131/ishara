import { DeliveryZone } from '@/types';

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'inside_dhaka',
    name: 'Inside Dhaka',
    fee: 70,
    estimatedDelivery: '1-2 Days',
  },
  {
    id: 'outside_dhaka',
    name: 'Outside Dhaka (All Bangladesh)',
    fee: 130,
    estimatedDelivery: '2-4 Days',
  },
];

export const FREE_SHIPPING_THRESHOLD = 3000; // Free shipping over 3,000 BDT

/**
 * Calculates delivery fee based on zone and order subtotal.
 * Orders >= 3,000 BDT inside Dhaka receive free shipping.
 */
export function calculateDeliveryCharge(deliveryZoneId: string, subtotal: number): number {
  const zone = DELIVERY_ZONES.find((z) => z.id === deliveryZoneId) || DELIVERY_ZONES[0];
  if (deliveryZoneId === 'inside_dhaka' && subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return zone.fee;
}
