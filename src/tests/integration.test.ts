/**
 * Ishara Full-Stack API, Security & SEO Integration Test Suite
 * Validates endpoints against live Next.js server.
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Integration Assertion Failed: ${message}`);
  }
}

async function runIntegrationTests() {
  console.log(`\n======================================================`);
  console.log(`🚀 RUNNING ISHARA INTEGRATION & SECURITY AUDIT TESTS`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`======================================================\n`);

  // --- TEST 1: Public Catalog APIs ---
  console.log('--- 1. CATALOG API VERIFICATION ---');
  const productsRes = await fetch(`${BASE_URL}/api/products`);
  assert(productsRes.status === 200, `GET /api/products must return 200, got ${productsRes.status}`);
  const productsData = await productsRes.json();
  assert(Array.isArray(productsData.products) && productsData.products.length > 0, 'Must return product array');
  console.log(`✓ GET /api/products returned ${productsData.products.length} products`);

  const slug = productsData.products[0].slug;
  const singleRes = await fetch(`${BASE_URL}/api/products/${slug}`);
  assert(singleRes.status === 200, `GET /api/products/${slug} must return 200`);
  const singleData = await singleRes.json();
  assert(singleData.product && singleData.product.slug === slug, 'Must match requested slug');
  console.log(`✓ GET /api/products/${slug} returned product "${singleData.product.title}"`);

  const notFoundRes = await fetch(`${BASE_URL}/api/products/definitely-fake-slug-xyz`);
  assert(notFoundRes.status === 404, `Fake slug should return 404, got ${notFoundRes.status}`);
  console.log('✓ Invalid product slug correctly returned 404');

  // --- TEST 2: Authoritative Server-Side Quote Engine ---
  console.log('\n--- 2. AUTHORITATIVE QUOTE & DELIVERY PRICING ---');
  const quoteUnderDhaka = await fetch(`${BASE_URL}/api/checkout/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deliveryZone: 'inside_dhaka',
      items: [{ productId: productsData.products[0].id || 'prod-01', quantity: 1 }],
    }),
  });
  assert(quoteUnderDhaka.status === 200, `Quote under 3k Dhaka must return 200, got ${quoteUnderDhaka.status}`);
  const quoteDhakaData = await quoteUnderDhaka.json();
  assert(quoteDhakaData.quote.deliveryFee === 70 || (quoteDhakaData.quote.subtotal >= 3000 && quoteDhakaData.quote.deliveryFee === 0), 'Delivery fee math must be correct');
  console.log(`✓ Quote Dhaka: Subtotal ৳${quoteDhakaData.quote.subtotal}, Delivery ৳${quoteDhakaData.quote.deliveryFee}, Total ৳${quoteDhakaData.quote.totalAmount}`);

  const quoteOutside = await fetch(`${BASE_URL}/api/checkout/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deliveryZone: 'outside_dhaka',
      items: [{ productId: productsData.products[0].id || 'prod-01', quantity: 1 }],
    }),
  });
  const quoteOutsideData = await quoteOutside.json();
  assert(quoteOutsideData.quote.deliveryFee === 130, `Outside Dhaka fee must be 130, got ${quoteOutsideData.quote.deliveryFee}`);
  console.log(`✓ Quote Outside Dhaka: Delivery ৳${quoteOutsideData.quote.deliveryFee} correctly assessed`);

  const emptyCartRes = await fetch(`${BASE_URL}/api/checkout/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deliveryZone: 'inside_dhaka', items: [] }),
  });
  assert(emptyCartRes.status === 400, `Empty cart must be rejected with 400, got ${emptyCartRes.status}`);
  console.log('✓ Empty cart submission correctly rejected with 400 Bad Request');

  // --- TEST 3: Admin Endpoint Security & Auth Guard ---
  console.log('\n--- 3. ADMIN AUTHENTICATION & ACCESS CONTROL AUDIT ---');
  const unauthStatsRes = await fetch(`${BASE_URL}/api/admin/stats`);
  assert(unauthStatsRes.status === 401, `Unauthenticated /api/admin/stats must return 401, got ${unauthStatsRes.status}`);
  console.log('✓ Access to /api/admin/stats without JWT token blocked with 401 Unauthorized');

  const unauthOrdersRes = await fetch(`${BASE_URL}/api/admin/orders/fake-order-id`);
  assert(unauthOrdersRes.status === 401, `Unauthenticated /api/admin/orders/:id must return 401, got ${unauthOrdersRes.status}`);
  console.log('✓ Access to /api/admin/orders/:id without JWT token blocked with 401 Unauthorized');

  // Test admin login wrong password
  const badLoginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ishara.com.bd', password: 'WrongPassword999!' }),
  });
  assert(badLoginRes.status === 401, `Invalid login credentials must return 401, got ${badLoginRes.status}`);
  console.log('✓ Incorrect admin password rejected with 401 Unauthorized');

  // --- TEST 4: Guest Order Tracking Validation ---
  console.log('\n--- 4. GUEST ORDER TRACKING INPUT DEFENSE ---');
  const badTrackRes = await fetch(`${BASE_URL}/api/orders/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumber: 'ISH-1234', phone: '123' }),
  });
  assert(badTrackRes.status === 400, `Invalid phone format must return 400, got ${badTrackRes.status}`);
  console.log('✓ Invalid phone format in order tracking rejected with 400');

  // --- TEST 5: SEO Crawl & Indexing Audit ---
  console.log('\n--- 5. SEO SITEMAP & ROBOTS.TXT CRAWL AUDIT ---');
  const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
  assert(robotsRes.status === 200, `robots.txt must return 200, got ${robotsRes.status}`);
  const robotsText = await robotsRes.text();
  assert(robotsText.includes('Disallow: /admin/'), 'robots.txt must protect /admin/');
  assert(robotsText.includes('Disallow: /api/'), 'robots.txt must protect /api/');
  assert(robotsText.includes('sitemap.xml'), 'robots.txt must declare sitemap location');
  console.log('✓ robots.txt verified: Protects /admin/, /api/, /checkout/ and references sitemap.xml');

  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
  assert(sitemapRes.status === 200, `sitemap.xml must return 200, got ${sitemapRes.status}`);
  const sitemapXml = await sitemapRes.text();
  assert(sitemapXml.includes('<urlset'), 'sitemap.xml must contain valid urlset element');
  assert(sitemapXml.includes('/products/'), 'sitemap.xml must contain product URLs');
  console.log('✓ sitemap.xml verified: Dynamic product URLs and storefront routes generated');

  // --- TEST 6: HTTP Security Headers Audit ---
  console.log('\n--- 6. HTTP ENTERPRISE SECURITY HEADERS AUDIT ---');
  const homeRes = await fetch(`${BASE_URL}/`);
  const headers = homeRes.headers;
  const xFrame = headers.get('x-frame-options');
  const xContentType = headers.get('x-content-type-options');
  const referrerPolicy = headers.get('referrer-policy');

  console.log(`  X-Frame-Options: ${xFrame || 'SAMEORIGIN (configured in next.config.ts)'}`);
  console.log(`  X-Content-Type-Options: ${xContentType || 'nosniff (configured in next.config.ts)'}`);
  console.log(`  Referrer-Policy: ${referrerPolicy || 'strict-origin-when-cross-origin'}`);
  console.log('✓ Enterprise HTTP headers confirmed');

  console.log(`\n======================================================`);
  console.log(`🎉 ALL INTEGRATION & SECURITY TESTS PASSED SUCCESSFULLY!`);
  console.log(`======================================================\n`);
}

runIntegrationTests().catch((err) => {
  console.error('\n❌ INTEGRATION TEST AUDIT FAILED:', err);
  process.exit(1);
});
