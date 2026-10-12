তোমার সিদ্ধান্ত অনুযায়ী Ishara E-commerce-এর প্রথম ভার্সনটি হবে English-language, mobile-first, low-cost এবং COD-focused custom e-commerce platform। শুরুতে অপ্রয়োজনীয় paid service এড়িয়ে এমন architecture নেব, যাতে তুমি AI coding tools দিয়ে তৈরি করতে পারো এবং পরে নিজেই maintenance ও feature development করতে পারো।

সবচেয়ে গুরুত্বপূর্ণ বিষয় হলো, তোমার প্রোডাক্টের landing page, order management এবং inventory variant system শুরু থেকেই ঠিকভাবে তৈরি করতে হবে। এগুলো পরে নতুন করে তৈরি করা ব্যয়বহুল হতে পারে।

# ১. Final technology stack

[Making a custom 404 page in Next.js - DEV Community](https://images.openai.com/static-rsc-4/bLlalbNp6jrlR_MDbXrZboKQVewUYbl540tPaxrKHfeYhkUuIbcY24EuZwqdvoz2T6syE51AVhW2nzEAnbXMhFU1S9FS9hfRUHcmE0rqe4-MftFGYbc3hxELPbunRQ4RO1h7brQUYFBkCbuY4CGkHzzUDPnQR728ILI1Y17qp2M?purpose=inline)

Next.js + TypeScript

Recommended

Customer website, admin dashboard, SEO এবং প্রাথমিক backend API—একটি codebase-এ।

[MongoDB plant zukunftsweisende Plattform für Entwickler](https://images.openai.com/static-rsc-4/136BlWeMvcmIH2DH7Rg6HuRSqHqTtAIC7RGRTUvH4rRdJNo6c5USca82FDUZkLd2ymgppngcGzZpzJQKj7FFtoWavAOfmTW1hSNTulrLckMa_TCAa5KCn8P5-eoAX7CZcTcLbQx3FXIO61z58kmkoRF7Cdj8spG6E-Ru3wO_FRQ?purpose=inline)

MongoDB Atlas

Products, variant-level stock, orders, customers, settings ও campaigns।

[How to Use Vercel - Getting Started Guide (2026) | Delv](https://images.openai.com/static-rsc-4/II9DBEprjDf0_Y2RIUGxgZ4bjOULzr-2p-vKNBRgqy7HlRqGOMqEpPcOwUNksEJ5cF_VNDkA9VOZEQMGM7tEd68wU6Qq1Ie8oBMWk56TuhpHeXCmYhRbaAIW1gPry2H2caHr25d3R9XsGDeBbGjL3gVZdw_ZqTY_kipySshbK7A?purpose=inline)

Vercel — প্রথম hosting পছন্দ

Next.js deployment সহজ রাখার জন্য। বর্তমান free-tier limits ও commercial-use terms যাচাই করে ব্যবহার করবে।

[What are the pricing options for Cloudinary?](https://images.openai.com/static-rsc-4/OPbhFycGwlssoeEULXHIstrwsP_TeDKNX4ljDtTyGIaecXcmde0kf9YBV9xSAfGfZtXvftXhnVhczID0Tq56Zpl2pcrUl0XfTQQG0IxZ3fc4MDccWQA03dbRDqfYrKDUGosG8bKLhERnwNvl6ELc-V5KDmBE5UaFM61X3YF6S2o?purpose=inline)

Cloudinary — Product Images

প্রোডাক্টের ছবি আপলোড ও অপ্টিমাইজ করার জন্য। Free-tier allowance যথেষ্ট কি না ব্যবহারের পরিমাণ অনুযায়ী যাচাই করবে।

[Vela | AI, optimization & more - Optimize listing content and appearance to improve performance | Shopify App Store](https://images.openai.com/static-rsc-4/7X3AVTAkjGDwnNKXjanYWe6OaK51RCg2sChCeHa-AHqZY4coNcTDplspp_oE7Tt1ZeUSgw4DqV7VGrExM6b8Ph3RtdTRkCdPPeID5XqeML_mpk9bkJykSoIU0JyQT3G6nXHDc1lojjuJLjG7KZ5Orm_ZWCVLmww6Aey9rqjARrI?purpose=inline)

Meta Pixel

Product views, cart activity, checkout এবং order conversion tracking।

প্রয়োজনীয় documentation:

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Meta Pixel Documentation](https://developers.facebook.com/docs/meta-pixel/)

কেন শুরুতে আলাদা Node.js/Express server নয়? Next.js-এর server-side capabilities দিয়ে প্রথম সংস্করণের API চালানো যাবে। এতে আলাদা backend deployment, configuration এবং monitoring-এর খরচ ও জটিলতা কমবে। ব্যবসা বড় হলে আলাদা Node.js backend-এ স্থানান্তর করার মতো modular code রাখব।

এটি full-stack custom application হবে। Firebase বাধ্যতামূলক নয়, আর প্রথম সংস্করণে Firebase Auth, Firestore ও আলাদা backend একসঙ্গে ব্যবহার করে অপ্রয়োজনীয় complexity বাড়ানোর দরকার নেই।

# ২. Final architecture

### Customer & Admin UI

Next.js · React · TypeScript · Tailwind CSS

### Server-side Application Layer

Route Handlers · Validation · Authentication · Business Logic

### MongoDB Atlas

Products · Variants · Inventory · Orders · Settings

Image Storage

Cloudinary

Marketing

Meta Pixel + UTM

## Project folder structure

```
ishara/
├── public/
├── src/
│   ├── app/
│   │   ├── (store)/
│   │   │   ├── page.tsx
│   │   │   ├── shop/
│   │   │   ├── categories/[slug]/
│   │   │   ├── products/[slug]/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── order-success/[orderId]/
│   │   │   └── track-order/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── campaigns/
│   │   │   └── settings/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── product/
│   │   ├── cart/
│   │   └── checkout/
│   ├── features/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── orders/
│   │   ├── customers/
│   │   └── marketing/
│   ├── lib/
│   │   ├── db/
│   │   ├── auth/
│   │   ├── validation/
│   │   ├── tracking/
│   │   └── security/
│   ├── models/
│   ├── services/
│   ├── types/
│   └── config/
├── tests/
├── .env.example
├── README.md
└── package.json
```

এখানে `features` ও `services`-এ business logic রাখবে, যাতে পরে API বা backend পরিবর্তন করলেও UI পুরোপুরি নতুন করে লিখতে না হয়।

# ৩. Variant inventory: শুরু থেকেই সঠিকভাবে তৈরি করা

তুমি variant-based inventory বেছে নিয়েছ, তাই প্রতিটি variant-এর নিজস্ব SKU, মূল্য ও stock রাখার ব্যবস্থা থাকবে।

উদাহরণস্বরূপ, একটি হ্যান্ডব্যাগের প্রোডাক্ট:

[IRIS MINI Top handle Beige                      – Zarena 1970 LTD](https://images.openai.com/static-rsc-4/lBYbn7gzc9LPy6XAP6ZtQMZcd87FmdRcW8nFzVYr82g1sZcgGYs1MH4OCeh6RpHH15c_bW0vItmD9GhgGb-ZxIJCCQbE1WVcbF6oYiHVFNXzItJ0sAUVEa7iZsRL2a0M_LkdZV13esbBwRT6X8GETqAEzkM6io3-yYHzPa8d3L0?purpose=inline)

Classic Mini Handbag

Product ID: BAG-001

## ৳1,290

Variants / Stock

| Variant | SKU         | Stock |
| ------- | ----------- | ----- |
| Black   | BAG-001-BLK | 8     |
| Beige   | BAG-001-BEG | 5     |
| Pink    | BAG-001-PNK | 3     |

এগুলো কেবল উদাহরণ; বাস্তব পণ্যের তথ্য নয়।

Backend-এ প্রতিটি variant-এর stock আলাদাভাবে যাচাই করতে হবে। Checkout-এর সময় variant-এর ID, quantity এবং বর্তমান stock পুনরায় যাচাই হবে। একাধিক customer একই সময়ে শেষ stock অর্ডার করতে চাইলে atomic stock update বা উপযুক্ত transaction strategy ব্যবহার করতে হবে।

শুরুতে stock reservation জটিল না করলেও চলবে, কিন্তু সফল order creation-এর সময় stock update যেন নির্ভরযোগ্য হয়। Cancellation ও return হলে কখন stock ফেরত যোগ হবে, তারও পরিষ্কার নিয়ম থাকবে।

# ৪. Delivery management: Manual দিয়ে শুরু, API পরে

তোমার জন্য এই ধাপগুলো সবচেয়ে বাস্তবসম্মত।

1. প্রথম সংস্করণ: Admin dashboard থেকে অর্ডার দেখা, কাস্টমারের তথ্য যাচাই, status পরিবর্তন ও courier reference সংরক্ষণ।
2. পরবর্তী ধাপ: নির্বাচিত courier-এর API সমর্থন থাকলে booking, tracking ID ও delivery status synchronization যোগ করা।
3. আরও পরে: Delivered, cancelled ও returned order থেকে প্রকৃত বিক্রির হিসাব এবং delivery success rate তৈরি করা।

বাংলাদেশে তুমি কোন কুরিয়ার ব্যবহার করবে, সেটি এখনো নির্দিষ্ট নয়। তাই কোনো একটি কুরিয়ারের API ধরে পুরো architecture তৈরি করব না। বরং `CourierProvider`-এর মতো একটি interface রাখব, যাতে ভবিষ্যতে নির্দিষ্ট provider যোগ করা যায়।

# ৫. Customer account: Optional login

Guest checkout থাকবে প্রধান flow হিসেবে।

- Account ছাড়াই অর্ডার করা যাবে।
- Customer account তৈরি করতে চাইলে করা যাবে।
- ভবিষ্যতে login করে order history ও saved addresses দেখা যাবে।
- Guest order এবং account-এর order ownership নিরাপদভাবে যাচাই করতে হবে।
- শুধু Order ID জানলেই যেন অন্যের ব্যক্তিগত order details দেখা না যায়।

প্রথম সংস্করণে email/password registration, social login এবং password reset বাধ্যতামূলকভাবে বানানোর দরকার নেই। Optional account feature-টি প্রথম release-এ রাখতে চাইলে secure authentication-সহ তৈরি করতে হবে; নইলে পরের phase-এ যোগ করা ভালো।

# ৬. Low-budget deployment plan

Development

নিজের কম্পিউটারে Next.js চালাবে; local environment-এ MongoDB Atlas-এর development database ব্যবহার করতে পারো।

Database

MongoDB Atlas-এর উপযুক্ত free বা low-cost plan দিয়ে শুরু করা যায়, যদি বর্তমান limits ও usage তোমার প্রয়োজন মেটায়। Production-এর জন্য backup ও recovery strategy রাখবে।

Hosting

Vercel প্রথমে পরীক্ষা করো। যদি বর্তমান free plan-এর commercial-use বা resource limits উপযুক্ত না হয়, Render-এর paid web service বা অন্য উপযুক্ত hosting বিবেচনা করো।

Domain

প্রথমে hosting-এর দেওয়া deployment URL দিয়ে পরীক্ষা করবে। ব্যবসা চালু করার আগে নিজের domain যুক্ত করা ভালো।

বর্তমান hosting ও database plan-এর দাম, free-tier eligibility এবং commercial-use conditions আমি এখানে live যাচাই করিনি; এগুলো পরিবর্তন হতে পারে। তাই এখন নির্দিষ্ট মাসিক খরচ নিশ্চিত করে বলা ঠিক হবে না।

### খরচ বাঁচানোর কৌশল

- প্রথমে online payment gateway ব্যবহার করবে না।
- আলাদা backend server deploy করবে না।
- Admin dashboard-এ অপ্রয়োজনীয় animation বা heavy chart library এড়াবে।
- Product images optimize করবে এবং যথাযথ caching ব্যবহার করবে।
- Email/SMS notifications-এর জন্য প্রথমেই paid provider যোগ করবে না।
- Meta Pixel-এর browser integration আগে তৈরি করবে; CAPI পরে।
- Development, staging ও production-এর database credentials আলাদা রাখবে।
- Free tier-কে permanent production guarantee ধরে নেবে না।

একটি গুরুত্বপূর্ণ বিষয়: Facebook Ads চালানোর খরচ, পণ্যের খরচ, packaging, courier charge ও সম্ভাব্য return/cancellation খরচ—এসব hosting-এর বাজেট থেকে আলাদা ব্যবসায়িক খরচ।

# ৭. Final AI Coding Prompt — Ishara E-commerce

এই prompt-টি তোমার নির্বাচিত technology, low-budget deployment, variant inventory, optional customer accounts এবং manual-to-API delivery plan অনুযায়ী তৈরি করা হয়েছে।

# ISHARA E-COMMERCE — FINAL IMPLEMENTATION SPECIFICATION

## 1. Your Role

Act as a senior full-stack engineer, software architect, UI/UX designer, database designer, security engineer and QA engineer.

Build a complete custom e-commerce platform named **Ishara** for a Bangladesh-based business selling ladies' accessories, fashion products and selected gadgets.

The owner is a developer who will maintain the application using AI coding tools. Therefore, the code must be modular, well-documented, secure, understandable and easy to extend.

Do not build only a frontend prototype. Implement the frontend, database integration, backend APIs, admin dashboard, COD ordering flow and deployment documentation.

Do not claim that a feature works until it has been implemented and tested.

## 2. Business Requirements

- Website language: English
- Currency: BDT (৳)
- Primary market: Bangladesh
- Primary sales channel: Facebook and Instagram advertising
- Payment method: Cash on Delivery
- Customer accounts: Optional; guest checkout is mandatory
- Inventory: Product variants with independent stock tracking
- Delivery: Manual fulfillment initially, courier API integration later
- Budget: Minimize recurring expenses without compromising essential security
- Domain: To be purchased and connected later
- Product details pages: Default advertising landing pages

This is a single-store application, not a multi-vendor marketplace.

## 3. Technology

Use:

- Next.js App Router
- React and TypeScript with strict type checking
- Tailwind CSS
- MongoDB Atlas
- Mongoose or a suitable MongoDB data-access layer
- Zod for server-side validation
- Next.js Route Handlers for the initial backend
- Secure session-based admin authentication
- Cloudinary or S3-compatible image storage
- Vercel as the initial hosting candidate, subject to current plan eligibility and usage limits
- Automated tests appropriate to the application

Use maintained, mutually compatible dependencies. Document installation commands and important package choices.

Do not add Firebase, Redis, a separate Express server or paid third-party services unless an identified requirement justifies them.

Keep business logic independent from presentation components. Use a modular service layer so a separate Node.js backend can be introduced later.

## 4. Design System

Create an elegant, modern, minimal and mobile-first English-language storefront.

Suggested palette:

- Background: #F7F0E9
- Surface: #FFFFFF
- Primary: #B45F77
- Text: #292525

Create reusable components for:

- Header and navigation
- Footer
- Search
- Product cards
- Product galleries
- Variant selectors
- Price displays
- Cart controls
- Checkout forms
- Admin tables
- Status badges
- Dialogs and notifications
- Loading, empty and error states

The design must be responsive across mobile, tablet and desktop. Use clear typography, accessible contrast, keyboard-friendly controls, optimized images and obvious purchase actions.

Avoid unnecessary animations and excessive UI complexity.

## 5. Storefront Pages

Implement:

- Homepage
- Shop / All Products
- Category and subcategory pages
- Product details pages
- Search results
- Cart
- Checkout
- Order confirmation
- Order tracking
- About Us
- Contact Us
- Privacy Policy
- Shipping Policy
- Return and Refund Policy
- Terms and Conditions
- Not-found and error pages

The homepage must include configurable banners, categories, best sellers, new arrivals, featured products, promotional sections, delivery information and a footer.

Best sellers must be based on a clearly defined sales metric. Do not randomly label products as best sellers.

## 6. Product Catalog

Each product should support:

- Name and unique slug
- SKU or product code where appropriate
- Short and detailed descriptions
- Category and optional subcategory
- Multiple images
- Base price and optional compare-at price
- Product status: draft, published or archived
- Product variants
- Variant-specific SKU, price override where applicable, stock and availability
- SEO title, description and social sharing metadata
- Featured-product configuration

Implement server-side search, filtering, sorting and pagination.

Support searching by product name, SKU and relevant fields. Include category, price and availability filters.

Validate unique slugs and SKU values where applicable. Do not permanently delete products that are referenced by historical orders without an appropriate archival strategy.

## 7. Variant-Level Inventory

Products may have variants such as color, size or other options.

Each variant must have a stable identifier, SKU where applicable, available stock, and any required price override or image association.

The product page must require customers to select a variant when the product has variants.

The cart must retain the selected variant ID and quantity.

During order creation, the server must revalidate the variant, current price, requested quantity and stock.

Prevent overselling with atomic stock updates or an appropriate transaction strategy.

Handle concurrent orders safely. If order creation fails after stock has been reserved or modified, implement appropriate rollback or recovery behavior.

Define inventory behavior for cancelled and returned orders. Do not automatically restock a returned item until the business rules permit it.

## 8. Product Landing Pages and Social Ads

Use the standard product details page as the default landing page.

Example:\
`/products/pearl-handbag`

Implement:

- Product image gallery
- Product title, price and valid discount
- Variant selection
- Stock availability
- Quantity selector
- Product features and description
- Delivery information
- Add to Cart
- Buy Now
- Related products
- FAQ and promotional sections when configured
- Mobile sticky purchase controls

Buy Now must take the customer to checkout with the selected product, variant and quantity preserved.

Add to Cart must retain the selected variant and allow the customer to continue shopping.

Support campaign URLs and UTM parameters.

Implement a simple landing-page configuration system with editable headlines, images, content sections, CTA text and section ordering.

Do not build a full drag-and-drop page builder in the first release. Keep the configuration system extensible.

## 9. Cart and Checkout

Guest checkout must work without mandatory registration.

Collect:

- Customer name
- Phone number
- Delivery zone
- Full address
- Optional order notes

Display:

- Product and selected variant
- Quantity
- Unit price
- Discounts where valid
- Delivery fee
- Final order total
- COD payment method

All price calculations must happen on the server using trusted database values.

Never trust browser-submitted prices, discounts, shipping charges or totals.

Validate all inputs. Use an idempotency mechanism or equivalent protection against duplicate submissions.

Create a stable, non-sequential public order reference. Do not expose MongoDB identifiers as the only authorization mechanism for private order information.

After order creation, show a confirmation page containing the reference and order summary.

Avoid exposing complete customer addresses or phone numbers in public URLs, analytics events or browser logs.

## 10. Delivery Configuration

Initially, implement manual delivery fulfillment.

Admins must be able to:

- Review and confirm orders
- Update fulfillment status
- Add internal notes
- Record courier name
- Record courier tracking reference
- View delivery information
- Record cancellation or return reasons
- Review status history

Create a courier integration interface that can support future provider-specific implementations.

Do not invent courier API endpoints or credentials. Build a provider integration only after the selected courier's current documentation is available.

Allow delivery fees to be configured by delivery zone.

## 11. Order Lifecycle

Support:

- Pending
- Confirmed
- Processing
- Shipped
- Delivered
- Cancelled
- Returned

Define permitted status transitions and record timestamps and the responsible admin.

Maintain an order event history.

Track created orders separately from delivered orders. COD order creation must not automatically be treated as a completed sale.

If reporting revenue, clearly state which order statuses are included. Do not report profit unless cost-of-goods and relevant expenses are available.

## 12. Optional Customer Accounts

Guest checkout is mandatory.

Optional registered accounts may support:

- Registration and login
- Secure password handling
- Password reset
- Order history
- Saved addresses

Implement customer account functionality only with appropriate authentication, authorization and ownership checks.

A customer must never be able to retrieve another customer's orders by guessing an order ID.

If full account functionality materially increases initial complexity, implement it as a separate phase without blocking guest checkout.

## 13. Admin Dashboard

Implement secure routes under `/admin`.

Modules:

- Dashboard overview
- Products
- Categories
- Variant inventory
- Orders
- Customer records where needed
- Campaigns
- Landing-page settings
- Delivery settings
- Store settings
- SEO settings

Dashboard metrics should include pending orders, confirmed orders, shipped orders, delivered orders, cancellations, low-stock items and best-selling products.

Include search, pagination and appropriate filters in product and order tables.

Support CSV export with permission checks and safe handling of customer data.

Create an initial admin account through a secure setup procedure or a documented command-line initialization script. Never hardcode production credentials.

All protected APIs must enforce server-side authorization. Hiding admin pages in the UI is insufficient.

## 14. MongoDB Models

Design and document appropriate models for:

- Product
- Category
- Order
- Admin
- Customer, if accounts are enabled
- StoreSettings
- Campaign
- OrderEvent

Embed order item snapshots containing product name, SKU, variant details, unit price, quantity and line totals.

Use schema validation, timestamps, indexes, unique constraints and suitable references.

Store prices as integer BDT minor units or use a consistent, documented monetary representation that avoids floating-point rounding errors.

Use a reliable database connection strategy for the chosen deployment environment.

Avoid unbounded arrays and unnecessary duplication of frequently changing data.

## 15. Meta Pixel and Analytics

Implement consent-aware browser tracking for appropriate events:

- PageView
- ViewContent
- Search
- AddToCart
- InitiateCheckout
- Purchase

Include appropriate product identifiers, currency and values.

Define Purchase clearly as an order-creation conversion in the initial COD workflow. Do not imply that the order has been delivered.

Store useful attribution information such as UTM source, medium, campaign and content where appropriate.

Do not send unnecessary personal information to Meta or other analytics services.

Keep the Pixel ID configurable. Do not expose server secrets in client code.

Implement browser Pixel tracking first. Treat Conversions API and delivered-order conversion reporting as later phases, with correct event deduplication and appropriate privacy safeguards.

## 16. SEO and Performance

Implement:

- Server-rendered public product and category pages where appropriate
- Unique metadata
- Canonical URLs
- XML sitemap
- robots.txt
- Open Graph metadata
- Product structured data based on actual product information
- Image optimization
- Appropriate caching and revalidation
- Accessible semantic HTML
- Responsive layouts
- Useful loading and error states

Do not index admin pages or private order data.

Avoid exposing database credentials or private environment variables to the browser.

## 17. Security

Implement:

- Secure admin sessions
- Password hashing using an appropriate maintained library
- Server-side authentication and authorization
- Schema validation for untrusted input
- Rate limiting on sensitive endpoints
- Safe image upload validation
- Secure cookies and appropriate origin policies
- Protection against duplicate orders
- Safe database query construction
- Error responses that do not reveal secrets
- Audit history for sensitive admin operations

Use environment variables for all credentials.

Provide `.env.example` with placeholder values only.

Use separate development and production credentials and databases.

Document backups, restoration and recovery procedures.

## 18. Testing

Implement unit, integration and end-to-end tests where appropriate.

At minimum, test:

- Product and category management
- Search and filtering
- Variant selection
- Stock validation
- Concurrent stock updates
- Server-side price calculation
- Delivery fee calculation
- Guest checkout
- Duplicate order prevention
- Order status transitions
- Admin authorization
- Customer order ownership
- Landing-page configuration
- Pixel event behavior

Use isolated test data and prevent test orders from entering real fulfillment workflows.

Run linting, type checking, tests and the production build before declaring a phase complete.

## 19. Deployment

Prepare the project for:

- Git-based deployment
- MongoDB Atlas
- Cloudinary or compatible image storage
- Vercel or another compatible hosting platform
- A custom domain connected later

Document:

- Required environment variables
- Local development setup
- MongoDB network and user configuration
- Image storage configuration
- Build and deployment commands
- Admin initialization
- Database indexes
- Production migration procedure
- Backup and recovery
- Custom domain and HTTPS setup
- Meta Pixel configuration

Never allow unrestricted database network access as a permanent production solution. Configure appropriate access controls and strong credentials.

Verify the hosting provider's current pricing, commercial-use terms, limits and runtime compatibility before production deployment.

## 20. Implementation Workflow

Do not attempt to create the entire application in a single unverified step.

First inspect the workspace and provide:

1. Architecture plan
2. Requirements and assumptions
3. Route map
4. Database schema
5. API specification
6. UI design plan
7. Security checklist
8. Phased implementation plan

Then implement the project in these phases:

Phase 1: Project setup, design system and responsive storefront UI.

Phase 2: MongoDB connection, product and category models, APIs and admin authentication.

Phase 3: Product variants, stock management, cart and checkout.

Phase 4: Order management, admin dashboard and manual fulfillment.

Phase 5: SEO, configurable landing pages, Meta Pixel and UTM tracking.

Phase 6: Automated tests, security review, performance checks and deployment documentation.

At the end of each phase:

- List the files created or modified.
- Run relevant checks and tests.
- Fix discovered errors.
- Document completed and incomplete features.
- State assumptions and known limitations.
- Provide the exact commands needed to run the application.

Do not replace working project files unnecessarily. Do not overwrite existing user work without inspecting it first.

If a required decision is missing, state a sensible provisional assumption and ask only questions that materially affect implementation.

## 21. Definition of Done

The first release is complete only when:

- The storefront works on mobile and desktop.
- Products and variants can be managed through the admin dashboard.
- Search, categories, filtering and sorting work.
- Guest customers can place COD orders.
- Server-side totals are correct.
- Inventory updates safely.
- Duplicate submissions are handled.
- Admin routes and APIs are protected.
- Orders can be managed manually.
- Product URLs can be shared in social ads.
- Landing-page content is configurable within the agreed scope.
- Meta Pixel events follow documented definitions.
- Production build and essential tests pass.
- Deployment and backup instructions are documented.

Begin with architecture and implementation planning, then proceed phase by phase. Prioritize a reliable, maintainable first release over unnecessary complexity.

# ৮. এখন বাস্তবে কাজ শুরু করার সঠিক ক্রম

1. তোমার প্রজেক্টের জন্য একটি Git repository তৈরি করো।
2. AI coding tool-এ উপরের Master Prompt দাও এবং প্রথমে শুধু architecture, database schema ও implementation plan তৈরি করতে বলো।
3. তারপর Phase 1-এর UI তৈরি করো। প্রোডাক্ট ও চেকআউটের ডিজাইন ঠিক হওয়ার পর backend যুক্ত করো।
4. MongoDB Atlas এবং image storage configuration করো। Local development-এ test products ব্যবহার করো।
5. COD checkout, variant inventory ও admin order management end-to-end পরীক্ষা করো।
6. সবকিছু ঠিক থাকলে hosting-এ deploy করো, নিজের domain যুক্ত করো এবং এরপর Meta Pixel ও বিজ্ঞাপন পরীক্ষা করো।

আমার শেষ পরামর্শ: প্রথমে storefront, variant inventory, COD checkout এবং admin order management সম্পূর্ণ করো। Courier API, CAPI, full page builder এবং advanced analytics পরে যোগ করো।

এতে কম খরচে শুরু করা যাবে, আবার ব্যবসা ভালো চললে Ishara-কে আরও বড় e-commerce platform হিসেবে সম্প্রসারণ করাও সম্ভব হবে।