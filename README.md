# Ishara

A Bangladesh-focused accessories and lifestyle store with guest cash-on-delivery checkout, product variants, inventory, order tracking and an admin back office.

Built with Next.js 16.4, React 19, TypeScript, Tailwind CSS and MongoDB/Mongoose. Admin sessions use HTTP-only JWT cookies.

## Run locally

1. Run npm install.
2. Copy .env.example to .env.local and configure your MongoDB Atlas URI and JWT secret. Never commit .env.local.
3. Run npm run dev and open http://localhost:3000.

For a sample-data preview, set ISHARA_DEMO_MODE=1 in development. Ordering and admin writes remain disabled until a database is connected. This flag is ignored in production.

## Admin and catalog setup

For a new database, configure ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) and run npm run seed. The script creates a missing admin and upserts sample products/categories. Review it before running on an existing store; it can replace catalog values. There is no automatic default-password login.

Admin login is at /admin/login. Store settings manage contact information, delivery fees, free delivery threshold and Meta Pixel ID. Campaigns are currently a labelled UI preview; coupons are not applied at checkout.

## Verification

- npm run lint
- npm run typecheck
- npm test — business rules, checkout regressions and HTTP integration tests. Start the development server first. TEST_BASE_URL can select another test server.
- npm run test:db — transaction/concurrency tests in a generated disposable MongoDB database, removed afterward. Requires Atlas or a replica set and permission to create/remove that test database. Does not write test orders to the store database.
- npm run build

Order creation and cancellation use MongoDB transactions, requiring Atlas or a replica set. Product media currently uses image URLs; courier assignment is manual.

See [PROJECT_REVIEW.md](PROJECT_REVIEW.md) for implemented fixes and the next product priorities, and [DEPLOYMENT.md](DEPLOYMENT.md) for deployment notes.
