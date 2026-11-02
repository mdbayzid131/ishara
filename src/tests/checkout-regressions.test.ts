import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { normalizePhone } from '../lib/phone';
import { canTransitionOrder } from '../lib/order-status';
import { PRODUCTS } from '../data/mockProducts';

export async function runCheckoutRegressionTests() {
  for (const value of ['01711223344', '+880 1711-223344', '008801711223344', '০১৭১১২২৩৩৪৪']) {
    assert.equal(normalizePhone(value), '01711223344');
  }
  assert.equal(canTransitionOrder('pending', 'confirmed'), true);
  assert.equal(canTransitionOrder('delivered', 'returned'), true);
  assert.equal(canTransitionOrder('cancelled', 'confirmed'), false);
  assert.equal(canTransitionOrder('returned', 'shipped'), false);
  assert.equal(canTransitionOrder('pending', 'delivered'), false);

  // Read-only fixtures: never create an order in the configured store database.
  const previousDemo = process.env.ISHARA_DEMO_MODE;
  process.env.ISHARA_DEMO_MODE = '1';
  try {
    const { POST: quote } = await import('../app/api/checkout/quote/route');
    const { POST: order } = await import('../app/api/orders/route');
    const { POST: track } = await import('../app/api/orders/track/route');
    const { GET: details } = await import('../app/api/orders/[orderNumber]/route');
    const product = PRODUCTS.find((product) => product.hasVariants && product.variants.some((variant) => variant.stock > 0))!;
    const variant = product.variants.find((variant) => variant.stock > 0)!;
    const request = (path: string, body: unknown) => new NextRequest(`http://localhost:3000${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const item = { productId: product.id, variantSku: variant.sku, quantity: 1 };
    assert.equal((await quote(request('/api/checkout/quote', { deliveryZone: 'inside_dhaka', items: [{ ...item, variantSku: 'MISSING' }] }))).status, 400);
    assert.equal((await quote(request('/api/checkout/quote', { deliveryZone: 'inside_dhaka', items: [{ ...item, variantSku: '' }] }))).status, 400);
    assert.equal((await quote(request('/api/checkout/quote', { deliveryZone: 'inside_dhaka', items: Array.from({ length: 100 }, () => ({ ...item, quantity: 50 })) }))).status, 400);
    const validQuote = await quote(request('/api/checkout/quote', { deliveryZone: 'outside_dhaka', items: [item] }));
    assert.equal(validQuote.status, 200);
    const data = await validQuote.json();
    assert.equal(data.quote.canOrder, false);
    assert.equal(data.quote.totalAmount, (variant.price ?? product.basePrice) + 130);
    assert.equal((await order(request('/api/orders', { customer: { name: 'Checkout Test', phone: '০১৭১১২২৩৩৪৪', address: 'Local test address', deliveryZone: 'inside_dhaka' }, items: [item] }))).status, 503);
    assert.equal((await track(request('/api/orders/track', { orderNumber: 'ISH-DEMO-2026', phone: '01711223344' }))).status, 404);
    assert.equal((await details(new NextRequest('http://localhost:3000/api/orders/UNKNOWN'), { params: Promise.resolve({ orderNumber: 'UNKNOWN' }) })).status, 503);
    console.log('✓ Checkout regressions: phone formats, state transitions, variant validation, aggregate stock, honest demo responses');
  } finally {
    if (previousDemo === undefined) delete process.env.ISHARA_DEMO_MODE;
    else process.env.ISHARA_DEMO_MODE = previousDemo;
  }
}
