import { connectToDatabase } from '@/lib/db/connect';
import { StoreSetting } from '@/models/StoreSetting';
import { DELIVERY_ZONES, FREE_SHIPPING_THRESHOLD } from '@/config/delivery';

export async function getDeliveryPricing(zoneId: string, subtotal: number) {
  const db = await connectToDatabase();
  const settings = db ? await StoreSetting.findOne({ key: 'global_store_settings' }).lean() : null;
  const zone = DELIVERY_ZONES.find((zone) => zone.id === zoneId) || DELIVERY_ZONES[0];
  const threshold = settings?.freeShippingThreshold ?? FREE_SHIPPING_THRESHOLD;
  const fee = zoneId === 'inside_dhaka' ? (settings?.insideDhakaFee ?? zone.fee) : (settings?.outsideDhakaFee ?? zone.fee);
  const isFreeShipping = zoneId === 'inside_dhaka' && subtotal >= threshold;
  return { zone, isFreeShipping, deliveryFee: isFreeShipping ? 0 : fee };
}
