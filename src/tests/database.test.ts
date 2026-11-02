/** Run with: node --env-file=.env.local --import tsx src/tests/database.test.ts
 * All writes are confined to a newly generated, disposable test database.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { Product } from '../models/Product';
import { Order } from '../models/Order';

async function main() {
  assert(process.env.MONGODB_URI, 'MONGODB_URI is required');
  const databaseName = `ishara_test_${crypto.randomBytes(8).toString('hex')}`;
  const uri = new URL(process.env.MONGODB_URI);
  uri.pathname = `/${databaseName}`;
  process.env.MONGODB_URI = uri.toString();
  delete process.env.ISHARA_DEMO_MODE;
  await mongoose.connect(uri.toString());
  global.mongooseCache = { conn: mongoose, promise: null };
  try {
    await Promise.all([Product.init(), Order.init()]);
    const { POST } = await import('../app/api/orders/route');
    const product = await Product.create({ title: 'Transaction test', slug: 'transaction-test', category: 'Test', categorySlug: 'test', basePrice: 100, hasVariants: true, totalStock: 6, variants: [{ sku: 'LOW', name: 'Low stock', stock: 1 }, { sku: 'HIGH', name: 'Available', stock: 5, price: 150 }] });
    let requestNumber = 0;
    const submit = (items: unknown[], key = crypto.randomUUID(), expectedTotal?: number) => POST(new NextRequest('http://localhost:3000/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key, 'x-forwarded-for': `10.44.0.${++requestNumber}` }, body: JSON.stringify({ expectedTotal, customer: { name: 'Isolated test', phone: '01711223344', address: 'Disposable test address', deliveryZone: 'inside_dhaka' }, items }) }));
    const item = (variantSku: string, quantity: number) => ({ productId: String(product._id), variantSku, quantity });

    assert.equal((await submit([item('LOW', 2)])).status, 409, 'Another variant must not satisfy the stock check');
    assert.equal((await Product.findById(product._id))?.variants[0].stock, 1);
    assert.equal((await submit([item('HIGH', 1), item('LOW', 2)])).status, 409);
    assert.equal((await Product.findById(product._id))?.variants[1].stock, 5, 'Failed multi-item orders must roll back all stock');
    assert.equal(await Order.countDocuments(), 0);
    assert.equal((await submit([item('HIGH', 1)], undefined, 1)).status, 409, 'Do not place an order at a different total than the customer reviewed');
    assert.equal((await Product.findById(product._id))?.variants[1].stock, 5);

    const key = crypto.randomUUID();
    const first = await submit([item('HIGH', 1)], key);
    assert.equal(first.status, 200);
    const firstData = await first.json();
    assert.equal(firstData.order.totalAmount, 220, 'Use the stored variant price plus delivery fee');
    const second = await submit([item('HIGH', 1)], key);
    assert.equal(second.status, 200);
    assert.equal((await second.json()).orderNumber, firstData.orderNumber);
    assert.equal(await Order.countDocuments(), 1, 'Retried requests must not create duplicate orders');
    assert.equal((await Product.findById(product._id))?.variants[1].stock, 4);
    const concurrentKey = crypto.randomUUID();
    const concurrent = await Promise.all([submit([item('HIGH', 1)], concurrentKey), submit([item('HIGH', 1)], concurrentKey)]);
    assert.deepEqual(concurrent.map((response) => response.status), [200, 200]);
    assert.equal(await Order.countDocuments(), 2);
    assert.equal((await Product.findById(product._id))?.variants[1].stock, 3);

    const { PATCH } = await import('../app/api/admin/orders/[id]/route');
    const { signAdminToken, ADMIN_COOKIE_NAME } = await import('../lib/auth');
    const token = signAdminToken({ id: 'test-admin', email: 'test@example.com', name: 'Test admin', role: 'superadmin' });
    const changeStatus = (status: string) => PATCH(new NextRequest('http://localhost:3000/api/admin/orders/test', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Cookie: `${ADMIN_COOKIE_NAME}=${token}` }, body: JSON.stringify({ status }) }), { params: Promise.resolve({ id: firstData.orderNumber }) });
    assert.equal((await changeStatus('cancelled')).status, 200);
    assert.equal((await Product.findById(product._id))?.variants[1].stock, 4);
    assert.equal((await changeStatus('cancelled')).status, 200);
    assert.equal((await Product.findById(product._id))?.variants[1].stock, 4, 'Repeated cancellation must not restore inventory twice');
    assert.equal((await changeStatus('confirmed')).status, 409);
    console.log('✓ Isolated MongoDB tests: variant stock, rollback, authoritative price, concurrent retries and exactly-once cancellation restocking');
  } finally {
    // Never drop a supplied store database: validate our freshly generated name.
    assert(/^ishara_test_[0-9a-f]{16}$/.test(databaseName));
    assert.equal(mongoose.connection.name, databaseName);
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    console.log('✓ Removed the disposable test database');
  }
}

main().catch((error) => { console.error(error instanceof Error ? error.message : 'Database tests failed'); process.exitCode = 1; });
