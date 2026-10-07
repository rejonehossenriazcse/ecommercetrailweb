# AURA Studios &mdash; Enterprise Headless Commerce Architecture & Operations Manual

---

## 1. System Architecture Overview

**AURA Studios** is a full-stack, headless e-commerce platform built with Next.js App Router, TypeScript, TailwindCSS v4, React Server/Client Components, and a file-backed atomic database engine with audit logging.

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  +---------------------------+  +---------------------------+  +---------------+  |
|  |     Storefront Web UI     |  |     Mobile Navigation     |  | PWA Manifest  |  |
|  +---------------------------+  +---------------------------+  +---------------+  |
|  |       Cart Drawer         |  |   QuickView & Search      |  | Concierge Chat|  |
|  +---------------------------+  +---------------------------+  +---------------+  |
+-----------------------------------------|-----------------------------------------+
                                          | REST / JSON / HTTP
+-----------------------------------------v-----------------------------------------+
|                                APPLICATION API LAYER                              |
|  +-------------------+  +-------------------+  +-------------------+  +---------+ |
|  | /api/v1/products  |  |  /api/v1/orders   |  | /api/v1/customers |  | /api/cms| |
|  +-------------------+  +-------------------+  +-------------------+  +---------+ |
|  | /api/v1/tracking  |  |  /api/v1/feeds    |  | /api/v1/promotions|  | /health | |
|  +-------------------+  +-------------------+  +-------------------+  +---------+ |
+-----------------------------------------|-----------------------------------------+
                                          |
+-----------------------------------------v-----------------------------------------+
|                          PERSISTENCE & SECURITY SERVICES                          |
|  +-------------------------------------+  +-------------------------------------+ |
|  | DatabaseManager (data/database.json)|  | Security Audit Log (db.auditLogs)   | |
|  +-------------------------------------+  +-------------------------------------+ |
|  | Multi-Warehouse Inventory Stock Sync|  | JWT Session & Role-Based Access Ctrl| |
|  +-------------------------------------+  +-------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

---

## 2. Environment Variables & Secret Configuration

Create a `.env.local` file in the root directory for production deployments:

```bash
# Server & App Environment
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://aurastudios.com
PORT=3000

# Authentication & Session Security
JWT_SECRET=aura_enterprise_jwt_secret_key_prod_2026_super_secure_vault
ADMIN_SESSION_COOKIE=aura_admin_token

# Payment Gateway Integrations
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Marketing Pixels & Conversions API
NEXT_PUBLIC_META_PIXEL_ID=109827364519283
META_CONVERSIONS_API_TOKEN=EAAO8ZCeR29sample_live_capi_token
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-AURA2026EXP
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-AURA99
NEXT_PUBLIC_TIKTOK_PIXEL_ID=C89AURA_TK

# Email & SMS Marketing Automation
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 3. Production Deployment Guide

### Option A: Vercel (Recommended)
1. Push repository to GitHub or GitLab.
2. In the Vercel dashboard, click **"Add New Project"** and select the repository.
3. Configure the environment variables listed in Section 2 above.
4. Set Build Command: `npm run build` and Output Directory: `.next`.
5. Deploy. The platform will automatically provision Edge CDN caching and HTTPS SSL certificates.

### Option B: Docker Containerized Deployment
A standard production Dockerfile can be built using:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src/data ./src/data
EXPOSE 3000
CMD ["npm", "start"]
```

### Option C: Ubuntu VPS with PM2 & NGINX
```bash
# 1. Clone and install dependencies
git clone <repo-url> /var/www/aura-studios
cd /var/www/aura-studios
npm ci

# 2. Build the production Next.js bundle
npm run build

# 3. Start cluster mode with PM2
pm2 start npm --name "aura-studios" -- start
pm2 save
pm2 startup

# 4. Configure Nginx reverse proxy with SSL via Certbot:
server {
    server_name aurastudios.com www.aurastudios.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 4. Admin Credentials & Settings Management

### Default Super Admin Credentials
* **Portal URL**: `http://localhost:3000/admin/login` (or `/admin`)
* **Email**: `admin@aurastudios.com`
* **Password**: `Admin2026!`

> **Security Mandate**: The Super Admin can modify the root email address, password, store metadata, currency, and VAT rates at any time via the **Admin Settings Portal** (`/admin/settings`). All credential changes write directly to database storage and generate a cryptographically signed audit log.

### Default VIP Demo Patron Account
* **Sign-in URL**: `http://localhost:3000/login`
* **Email**: `marcus.vance@collector.com`
* **Password**: `Patron2026!` (or 1-click VIP Quick Fill button on login page)

---

## 5. Complete API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | System health, memory RSS/heap, Node version, and DB status |
| `/api/v1/products` | `GET`, `POST` | Catalog list, filtering, and product authoring |
| `/api/v1/categories` | `GET` | Catalog category disciplines and hierarchy |
| `/api/v1/orders` | `GET`, `POST` | Order placement with inventory deduction & list queries |
| `/api/v1/orders/[id]` | `GET`, `PUT` | Single order lookup, fulfillment dispatch, waybill, and RMA return approval |
| `/api/v1/customers` | `GET` | VIP patron roster with lifetime order metrics and tiers |
| `/api/v1/customers/export` | `POST` | GDPR Art. 20 & CCPA legal data export dossier (.JSON) |
| `/api/v1/customers/delete` | `POST` | GDPR Art. 17 cryptographic erasure with safety phrase |
| `/api/v1/promotions` | `GET`, `POST` | Promotional vouchers (`WELCOME10`, `VIPLIVING`) |
| `/api/v1/cms` | `GET`, `PUT` | Visual homepage layout widgets and section reordering |
| `/api/v1/pages` | `GET`, `POST` | Custom policy & manifesto pages (`/about`, `/privacy`, `/terms`) |
| `/api/v1/blogs` | `GET`, `POST` | Editorial Journal articles and publication dates |
| `/api/v1/contact` | `GET`, `POST` | Private concierge inquiries dispatch |
| `/api/v1/newsletter` | `GET`, `POST` | Newsletter subscriptions and welcome voucher issuance |
| `/api/v1/inventory` | `GET`, `PUT` | Multi-hub warehouse stock reallocations |
| `/api/v1/tracking/capi`| `POST` | Meta Conversions API (CAPI) deduplicated server attribution |
| `/api/v1/feeds/google-shopping` | `GET` | Real-time Google Merchant Center RSS 2.0 XML feed |
| `/api/v1/feeds/facebook-catalog`| `GET` | Real-time Meta Instagram/Facebook Catalog CSV feed |

---

## 6. Payment Gateway Setup Guide

1. **Stripe Integration**:
   - In Stripe Dashboard, navigate to **Developers > API Keys**.
   - Copy Secret Key to `STRIPE_SECRET_KEY` and Publishable Key to `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
   - In **Webhooks**, create an endpoint pointing to `https://aurastudios.com/api/v1/webhooks/stripe` listening for `payment_intent.succeeded` and `charge.refunded`.

2. **PayPal Express**:
   - In PayPal Developer Dashboard, generate a REST App.
   - Insert Client ID and Secret into `/admin/settings` or environment variables.

3. **Apple Pay / Device Vault**:
   - Configure Domain Association file under `.well-known/apple-developer-merchantid-domain-association`.
   - Verified domains allow native 1-click Touch ID/Face ID Apple Pay popups.

4. **Cash on Delivery (COD) / Studio Pickup**:
   - Enabled by default in `/admin/settings` with optional metropolitan surcharge.

---

## 7. Marketing Pixels & Conversions API Setup

1. **Meta Pixel & CAPI (Conversions API)**:
   - Navigate to `/admin/marketing`.
   - Enter your **Meta Pixel ID** and **Meta CAPI System User Token**.
   - Events (`ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`) automatically emit client-side `fbq('track')` and trigger server-side `POST /api/v1/tracking/capi` with identical `eventId` for zero duplicate attribution.

2. **Google Analytics 4 & Tag Manager**:
   - Enter Measurement ID (e.g., `G-XXXXXXXXXX`) or GTM Container ID (`GTM-XXXXXX`).
   - Standard Google Enhanced E-Commerce dataLayer payloads are pushed on every acquisition event.

3. **Consent Management (GDPR/CCPA)**:
   - The platform includes a compliant Cookie Consent banner. If a visitor declines "Marketing" cookies, `trackEcommerceEvent` automatically suppresses pixel beacons.

---

## 8. Backup & Disaster Recovery Procedures

1. **Automated Database Backups**:
   - All state is persisted in `src/data/database.json`.
   - To back up, run:
     ```bash
     cp src/data/database.json backups/database_$(date +%Y%m%d_%H%M%S).json
     ```
2. **Restoration**:
   - To restore a previous snapshot:
     ```bash
     cp backups/database_YYYYMMDD_HHMMSS.json src/data/database.json
     ```
   - Restart the server process (`pm2 reload aura-studios`).
3. **Audit Log Inspection**:
   - Every administrative modification, refund, status change, and GDPR request is recorded permanently in `auditLogs` with actor identity, action type, and timestamps.

---

*Manual compiled for AURA Studios International SA &mdash; All Rights Reserved 2026.*
