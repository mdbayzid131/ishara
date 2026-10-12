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
