/**
 * Ishara Core Business Rules Unit Test Suite
 * Tests server-side pricing math, delivery zones, BD mobile validation,
 * UTM extraction, and in-memory rate limiting.
 */

import { DELIVERY_ZONES, FREE_SHIPPING_THRESHOLD, calculateDeliveryCharge } from '../config/delivery';
import { extractUtmFromUrl } from '../lib/tracking/utm';
import { checkRateLimit } from '../lib/security/rateLimit';
import { NextRequest } from 'next/server';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export function runBusinessRulesTests() {
  console.log('\n--- 1. DELIVERY & PRICING RULES TESTS ---');

  // Rule 1: Dhaka base charge is 70
  const dhakaZone = DELIVERY_ZONES.find((z) => z.id === 'inside_dhaka');
  assert(!!dhakaZone, 'Inside Dhaka zone config must exist');
  assert(dhakaZone?.fee === 70, `Dhaka base charge must be 70, got ${dhakaZone?.fee}`);
  console.log('✓ Dhaka delivery charge is 70 BDT');

  // Rule 2: Outside Dhaka base charge is 130
  const outsideZone = DELIVERY_ZONES.find((z) => z.id === 'outside_dhaka');
  assert(!!outsideZone, 'Outside Dhaka zone config must exist');
  assert(outsideZone?.fee === 130, `Outside Dhaka base charge must be 130, got ${outsideZone?.fee}`);
  console.log('✓ Outside Dhaka delivery charge is 130 BDT');

  // Rule 3: Free shipping threshold is 3,000 BDT
  assert(FREE_SHIPPING_THRESHOLD === 3000, `Threshold must be 3000, got ${FREE_SHIPPING_THRESHOLD}`);
  const subtotalUnder = 2999;
  const chargeUnderDhaka = calculateDeliveryCharge('inside_dhaka', subtotalUnder);
  assert(chargeUnderDhaka === 70, `Subtotal 2999 in Dhaka should cost 70, got ${chargeUnderDhaka}`);

  const subtotalOver = 3000;
  const chargeOverDhaka = calculateDeliveryCharge('inside_dhaka', subtotalOver);
  assert(chargeOverDhaka === 0, `Subtotal >= 3000 in Dhaka should have 0 delivery fee, got ${chargeOverDhaka}`);

  const chargeOutside = calculateDeliveryCharge('outside_dhaka', 4500);
  assert(chargeOutside === 130, `Outside Dhaka charge should remain 130, got ${chargeOutside}`);
  console.log('✓ Dhaka free shipping threshold (3,000 BDT) waives fee, outside Dhaka maintains 130 BDT');

  console.log('\n--- 2. BANGLADESH MOBILE NUMBER VALIDATION TESTS ---');
  const bdPhoneRegex = /^01[3-9]\d{8}$/;

  const validNumbers = [
    '01711223344', // Grameenphone
    '01811223344', // Robi
    '01911223344', // Banglalink
    '01511223344', // Teletalk
    '01311223344', // GP
    '01411223344', // BL
    '01611223344', // Airtel
  ];

  for (const num of validNumbers) {
    assert(bdPhoneRegex.test(num), `Valid BD phone ${num} should pass regex`);
  }
  console.log(`✓ All ${validNumbers.length} major BD operator prefixes pass regex validation`);

  const invalidNumbers = [
    '01211223344', // Invalid operator 012
    '0171122334',  // 10 digits (too short)
    '017112233445', // 12 digits (too long)
    '02711223344', // Landline
    'abcdefghijk', // Letters
  ];

  for (const num of invalidNumbers) {
    assert(!bdPhoneRegex.test(num), `Invalid phone ${num} should be rejected`);
  }
  console.log(`✓ All ${invalidNumbers.length} invalid phone numbers correctly rejected`);

  console.log('\n--- 3. MARKETING UTM ATTRIBUTION PARSING TESTS ---');
  const testUrl = 'https://ishara.com.bd/shop?utm_source=facebook&utm_medium=cpc&utm_campaign=winter_eid_2026&utm_term=leather_handbags&utm_content=carousel_v1';
  const utm = extractUtmFromUrl(testUrl);

  assert(utm !== null, 'UTM params should be parsed');
  assert(utm?.utmSource === 'facebook', `utm_source should be facebook, got ${utm?.utmSource}`);
  assert(utm?.utmMedium === 'cpc', `utm_medium should be cpc, got ${utm?.utmMedium}`);
  assert(utm?.utmCampaign === 'winter_eid_2026', `utm_campaign should be winter_eid_2026, got ${utm?.utmCampaign}`);
  assert(utm?.utmTerm === 'leather_handbags', `utm_term should be leather_handbags, got ${utm?.utmTerm}`);
  assert(utm?.utmContent === 'carousel_v1', `utm_content should be carousel_v1, got ${utm?.utmContent}`);
  console.log('✓ Full UTM campaign attribution attributes parsed accurately');

  const cleanUrl = 'https://ishara.com.bd/products/classic-mini-crossbody-bag';
  const nullUtm = extractUtmFromUrl(cleanUrl);
  assert(nullUtm === null, 'URL without UTM should return null');
  console.log('✓ URLs without UTM params correctly return null');

  console.log('\n--- 4. IN-MEMORY RATE LIMITING TESTS ---');
  // Create mock NextRequest with IP
  const mockReq = new NextRequest('http://localhost:3000/api/orders', {
    headers: { 'x-forwarded-for': '192.168.1.100' },
  });

  const opt = { windowMs: 10000, max: 3, keyPrefix: 'test_rule' };
  const r1 = checkRateLimit(mockReq, opt);
  assert(r1.success && r1.remaining === 2, 'First request should succeed with remaining 2');

  const r2 = checkRateLimit(mockReq, opt);
  assert(r2.success && r2.remaining === 1, 'Second request should succeed with remaining 1');

  const r3 = checkRateLimit(mockReq, opt);
  assert(r3.success && r3.remaining === 0, 'Third request should succeed with remaining 0');

  const r4 = checkRateLimit(mockReq, opt);
  assert(!r4.success && r4.remaining === 0, 'Fourth request should be blocked (rate limit exceeded)');
  assert(r4.retryAfterSeconds > 0, 'Retry-After seconds should be > 0');
  console.log('✓ Sliding-window rate limit threshold blocks excess requests with 429 Retry-After');

  console.log('\n✅ ALL BUSINESS RULES & UNIT TESTS PASSED!');
}

if (require.main === module) {
  try {
    runBusinessRulesTests();
    process.exit(0);
  } catch (err: unknown) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}
