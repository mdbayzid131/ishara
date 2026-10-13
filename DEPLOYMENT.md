# 🚀 Ishara E-Commerce — Production Deployment & Operations Guide

This guide provides end-to-end instructions for deploying, operating, and maintaining the **Ishara** luxury e-commerce platform in production using **Vercel** and **MongoDB Atlas**.

---

## 1. Architecture Overview

- **Framework**: Next.js 16 (App Router + Turbopack) & React 19
- **Database**: MongoDB Atlas with Mongoose connection pooling & caching
- **Authentication**: JWT stored in `HttpOnly`, `SameSite=Strict`, `Secure` cookies
- **Hosting**: Vercel Serverless Edge/Node Runtime
- **Media**: Cloudinary CDN / Unsplash CDN
- **Tracking**: Meta (Facebook) Pixel with UTM campaign attribution

---

## 2. Environment Variables Checklist

Configure these variables in your Vercel Project Settings (**Settings > Environment Variables**):

| Variable Name | Environment | Required | Description |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | Production, Preview | **Yes** | MongoDB Atlas connection string |
| `JWT_SECRET` | Production, Preview | **Yes** | 32+ character random string for signing admin tokens |
| `NEXT_PUBLIC_SITE_URL` | Production, Preview | **Yes** | Production canonical domain (e.g. `https://ishara.com.bd`) |
| `NEXT_PUBLIC_STORE_NAME` | All | Optional | Store brand name (Default: `Ishara`) |
| `NEXT_PUBLIC_STORE_PHONE`| All | Optional | Customer support phone (e.g. `+880 1711-223344`) |
| `NEXT_PUBLIC_META_PIXEL_ID`| Production | Optional | Meta/Facebook Pixel ID for event tracking |
| `CLOUDINARY_CLOUD_NAME` | Production | Optional | Cloudinary account name for product photos |
| `CLOUDINARY_API_KEY` | Production | Optional | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Production | Optional | Cloudinary API Secret |

> 💡 **Tip:** Generate a secure `JWT_SECRET` locally:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## 3. MongoDB Atlas Setup (Step-by-Step)

1. **Create an Atlas Account**: Sign up at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
2. **Deploy a Free/Shared Cluster**: Select the **M0 (Free)** tier or **M10 Dedicated** tier in the **AWS / Singapore (ap-southeast-1)** region for lowest latency from Bangladesh.
3. **Database Access**:
   - Go to **Database Access** > **Add New Database User**.
   - Create a user with **Password Authentication** and the role `Read and write to any database`.
4. **Network Access**:
   - Go to **Network Access** > **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) — required for Vercel's dynamic serverless IP pool.
5. **Get Connection String**:
   - Go to **Database** > **Connect** > **Drivers (Node.js)**.
   - Copy URI:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ishara?retryWrites=true&w=majority
     ```

---

## 4. Initial Database Seeding & Admin Setup

Before public launch, seed initial categories, products, and the initial Super Admin:

```bash
# 1. In your local terminal, set your production MongoDB URI:
export MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ishara?retryWrites=true&w=majority"
# (On Windows PowerShell):
# $env:MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ishara?retryWrites=true&w=majority"

# 2. Run the automated seed script:
npm run seed
```

### Initial Super Admin Credentials
- **Login URL**: `https://your-domain.com/admin/login`
- **Email**: `admin@ishara.com.bd`
- **Default Password**: `IsharaAdmin2026!`

> ⚠️ **CRITICAL SECURITY ACTION:**
> Log in immediately to the admin dashboard and change the default password from **Admin Settings**.

---

## 5. Vercel Deployment Guide

1. Push your repository to **GitHub** (`master` or `main` branch).
2. Log into [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your `ishara` GitHub repository.
4. Keep the default build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
5. Paste all **Environment Variables** from Section 2 into the Vercel dashboard.
6. Click **Deploy**.
7. In **Settings > Domains**, attach your custom domain (e.g. `ishara.com.bd` & `www.ishara.com.bd`) and update DNS records (CNAME / A record) as instructed by Vercel.

---

## 6. Automated Testing & Verification

Run the automated test suite locally before any release:

```bash
# Run unit & API integration tests
npm test

# Run code style & lint inspection
npm run lint

# Validate full production build
npm run build
```

---

## 7. Database Backup & Disaster Recovery

### Option A: MongoDB Atlas Automated Backups (Recommended)
- Enable **Cloud Backups** in MongoDB Atlas under Cluster Settings.
- Provides point-in-time recovery and automated daily snapshots.

### Option B: Manual Backup with `mongodump`
```bash
# Backup all collections
mongodump --uri="mongodb+srv://<user>:<password>@cluster0.mongodb.net/ishara" --out="./backup/$(date +%F)"

# Restore backup if needed
mongorestore --uri="mongodb+srv://<user>:<password>@cluster0.mongodb.net/ishara" --drop "./backup/2026-10-13/ishara"
```

---

## 8. Pre-Launch Go-Live Checklist

- [ ] `MONGODB_URI` and `JWT_SECRET` configured in Vercel.
- [ ] Initial Super Admin password changed.
- [ ] Custom domain DNS propagated with SSL active.
- [ ] Test order placed via COD checkout on mobile view.
- [ ] Admin received order notification and generated printable 80mm thermal invoice.
- [ ] Order consignment assigned to courier (`Steadfast` / `Pathao`).
- [ ] Meta Pixel ID configured and verified using *Meta Pixel Helper* Chrome extension.
- [ ] Robots.txt (`https://your-domain.com/robots.txt`) and Sitemap (`https://your-domain.com/sitemap.xml`) verified live.
