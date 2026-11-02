# Ishara project review — 2 November 2026

## Product and architecture

Ishara is a Bangladesh-focused accessories and lifestyle store with guest cash-on-delivery checkout. It combines a Next.js App Router storefront, route-handler APIs, MongoDB/Mongoose persistence and a JWT-authenticated back office. Its key customer journey is collection → product/variant → shopping bag → delivery details → verified total → order confirmation/tracking.

## Implemented improvements

| Area | Finding | Change |
|---|---|---|
| Branding | A detailed promotional image became unreadable at navbar size | Added a legible wordmark; retained original artwork |
| Homepage | Hardcoded catalog and testimonials; promotional banner interrupted browsing | Uses published database products and active categories; products precede the promotion; clear three-step ordering guidance replaces sample testimonials |
| Product cards | Quick buy silently selected the first variant, including unavailable options | Variant products open the option picker; sold-out products cannot be added |
| Product details | Unknown URLs could display a different demo product; variant images prevented gallery browsing | Loading/unavailable states, live related products and working gallery selection; quantity resets when the option changes |
| Cart | Local storage could disagree with server-rendered markup; Buy Now left a drawer open | Per-boundary hydration snapshots, stored-item validation, stock guards and drawer closure on Buy Now |
| Accessibility | Drawer lacked focus containment and Escape support; small quantity controls | Dialog semantics, focus containment/restoration, scroll lock, larger controls, skip link, keyboard focus and reduced-motion support |
| Checkout | Client estimates could differ from server totals; optional fields increased friction | Server quote gates submission; settings-based delivery prices; Bangla/international phone normalization; optional fields collapse; mobile action stays visible with total; editable bag and retry UI |
| Order creation | Variant stock predicates could match different array entries; partial failure could leave deducted inventory | `$elemMatch` and a MongoDB transaction cover inventory and order creation |
| Duplicate orders | Double clicks or network retries could create another order | Client submit lock and request key, unique database index, replay and concurrent-retry handling |
| Availability | Missing DB could report successful orders or saves that never persisted | Ordering and writes return an unavailable response; explicit development-only preview mode disables checkout |
| Tracking/confirmation | Generated courier references and fabricated confirmation data | Removed simulated order results; tracking uses stored data; confirmation requires a real order or matching saved receipt; guest responses exclude internal notes |
| Fulfilment | Cancelled orders did not restore stock | Transactional cancellation/return restocking, status transition checks, concurrency protection and paid status on delivery |
| Catalog/admin | Empty catalog could resurrect sample data; admin could not list drafts; edits lost variant attributes | Database empty results remain empty, authenticated unpublished listing, stable IDs, preservation of variant metadata, integer stock validation |
| Authentication | Login could create an admin using a known default password | Removed automatic/default login; seed requires an explicit admin password; inactive admins cannot log in |
| Dependencies | Next.js 16.4.0 had a critical advisory; test runner was undeclared | Updated Next.js/config to 16.4.4 and installed `tsx` |

## Validation

- Final TypeScript, ESLint and production build checks passed.
- Existing business-rule and live HTTP integration tests pass against the connected store.
- New checkout regressions cover phone formats, invalid options, aggregate stock, order transitions and honest unavailable responses.
- Isolated MongoDB tests cover wrong-variant stock matching, rollback after a later item fails, server variant pricing, sequential and concurrent idempotent retries, cancellation restocking and prevention of repeated restocking/reopening.
- Database tests create a randomly named `ishara_test_*` database and remove it afterward. They do not write test orders into the store database.
- Browser checks exercised desktop homepage, variant selection, cart and checkout, plus mobile layout and cart restoration. Browser testing found and led to correction of a Suspense hydration mismatch.
- Production-only dependency audit reports zero vulnerabilities; the full dependency tree still reports 16 moderate development-tool advisories.
- The supplied database credential was applied only to the ignored local environment file; the MongoDB connection succeeded. No credentials are recorded here.

## Recommended next product work

1. Replace sample catalog photos, ratings/review counts and business contact/address copy with verified store content. The retained brand artwork suits promotional use; a final approved vector logo would improve consistency across invoices, social images and favicon.
2. Implement persisted campaigns/coupons with server-side eligibility, expiry and redemption limits. The current campaigns page is explicitly labelled a preview; it does not apply discounts.
3. Add image uploads with validation and storage management. Current product media uses URLs.
4. Add courier API integration and confirmation notifications once the merchant selects providers and supplies credentials. Courier assignment remains manual.
5. Consider a complete Bangla language option and district/area selectors, then measure checkout abandonment before adding more required fields.
6. Add verified-purchase reviews, account recovery/password management, session revocation and role-specific permissions. Production rate limiting currently uses per-process memory and should move to a shared store when running multiple instances.
7. Add pagination for larger catalogs/order lists, product-specific server metadata, monitoring and a deployment smoke test. Audit admin hard deletion separately from cancellation and inventory reconciliation.
8. Review remaining moderate development-tool dependency advisories without forcing incompatible ESLint downgrades. The critical Next.js advisory was resolved by the patch update.

## Operating notes

MongoDB transactions require Atlas or another replica-set deployment. Run `npm run dev` normally for the connected store. For an intentional read-only development preview, set `ISHARA_DEMO_MODE=1` in the process environment; production ignores that flag. Do not run the seed script against an existing catalog without reviewing its upserts.
