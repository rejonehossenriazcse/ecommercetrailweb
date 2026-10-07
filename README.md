# AURA STUDIOS — Headless Production E-Commerce Platform

A production-ready, API-first headless luxury e-commerce platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **JSON Web Token (JWT) RBAC Authentication**.

---

## 🌟 Architecture Overview

- **Headless Commerce Architecture**: Clean separation between presentation layer and headless REST API v1.
- **Dynamic CMS Engine**: Storefront homepage sections, layouts, and banners are 100% manageable via the Admin CMS without hardcoded content.
- **Multi-Warehouse Inventory System**: Real-time stock reservation, low-stock alerts, and audit-tracked manual stock adjustments across Copenhagen, Zurich, and Tokyo fulfillment hubs.
- **Security & RBAC**: 7-tier Role-Based Access Control (`super_admin`, `store_manager`, `content_editor`, `support_agent`, `warehouse_staff`, `marketing_manager`, `customer`) with Bcrypt password hashing and JWT sessions.
- **Localization & Currencies**: Live conversion across USD ($), EUR (€), GBP (£), CAD ($), and AUD ($), plus multi-language scaffolding.

---

## 🔑 Super Admin Credentials

The platform comes pre-seeded with an Executive Super Admin account.

- **Admin Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@aurastudios.com`
- **Master Password**: `Admin2026!`

> **Security Note**: As specified in Requirement #9, the Super Admin can safely update both the account email address and password at any time via the **[Admin Settings & Security](http://localhost:3000/admin/settings)** portal. All modifications are logged in the cryptographically stamped audit trail.

---

## 🖥️ Storefront & Admin URLs

| Module | Route | Description |
|---|---|---|
| **Storefront Home** | `/` | Dynamic CMS-controlled homepage with hero slider, flash drops, and ateliers |
| **Catalog / Shop** | `/shop` | Faceted search, price filters, category filters, and grid/list views |
| **Product Detail** | `/product/[slug]` | High-res gallery, variable variant selection, stock checks, and reviews |
| **Shopping Cart** | `/cart` | Dynamic cart calculation, tax estimation, and coupon redemption |
| **Wishlist** | `/wishlist` | Saved-for-later items synced with client state |
| **Patron Sign In** | `/login` | High-end customer login with 1-click VIP evaluation access |
| **Patron Registration** | `/register` | Customer sign-up with immediate 100 welcome loyalty points |
| **Customer Account Portal** | `/account` | Patron dossier, order history, live parcel tracking, 1-click re-order, printable tax invoices, RMA returns, address book, and loyalty tiers |
| **Public Consignment Tracking** | `/track` | Real-time parcel tracking by order number and email without authentication |
| **One-Page Checkout** | `/checkout` | Fast multi-step checkout with multi-address selector, shipping tiers, store credit deduction, and Stripe card simulator |
| **Order Confirmation** | `/checkout/success/[id]` | Post-purchase confirmation, live carrier tracking timeline, and printable tax invoice |
| **Admin Overview** | `/admin` | Executive KPI ribbon, 7D/30D/90D revenue analytics, and order feed |
| **Product Management** | `/admin/products` | Catalog table, product creation modal, pricing, and stock controls |
| **Taxonomy & Categories**| `/admin/categories` | Discipline hierarchy and subcategory management |
| **Multi-Hub Inventory** | `/admin/inventory` | Real-time stock allocations across Copenhagen, Zurich, and Tokyo hubs |
| **Orders & Fulfillment** | `/admin/orders` | Order dossiers, carrier tracking (DHL, FedEx, UPS), and RMA refunds |
| **Customers & CRM** | `/admin/customers` | Patron lifetime value (LTV), VIP tier progression, and store credit |
| **CMS Visual Builder** | `/admin/cms` | Reorder, enable/disable, and configure storefront homepage sections |
| **Media Library** | `/admin/media` | Edge CDN asset storage with WebP compression and alt-text SEO tagging |
| **Review Moderation** | `/admin/reviews` | Customer feedback auditing, verified buyer badge, and approval flow |
| **Marketing & Pixels** | `/admin/marketing` | Coupon voucher generator, Meta Pixel, GA4, GTM, and CAPI setup |
| **Settings & Security** | `/admin/settings` | Root Super Admin credential updater, payment toggles, and audit logs |

---

## 🔌 Headless REST API (v1)

All endpoints accept and return JSON with standard HTTP response codes (`200`, `201`, `400`, `404`, `500`).

### Authentication & Security
- `POST /api/v1/auth/login` — Authenticate credentials and issue JWT session token
- `GET  /api/v1/auth/me` — Verify session and return user profile + permissions
- `GET  /api/v1/audit-logs` — Retrieve security audit trail logs

### Catalog & Merchandising
- `GET  /api/v1/products` — List catalog products with pagination, category, and search query
- `POST /api/v1/products` — Create new product with variant pricing and warehouse stock
- `GET  /api/v1/products/[id]` — Retrieve full product details by ID or slug
- `PUT  /api/v1/products/[id]` — Update product details, badges, or price
- `DELETE /api/v1/products/[id]` — Remove product from active catalog

### Multi-Warehouse Inventory
- `POST /api/v1/inventory/adjust` — Make audited stock adjustments with reason tracking (`PURCHASE_RECEIPT`, `MANUAL_ADJUSTMENT`, `DAMAGED`, `CUSTOMER_RETURN`)

### Orders & Fulfillment
- `GET  /api/v1/orders` — List orders with status and payment filters
- `POST /api/v1/orders` — Submit new order and decrement reserved warehouse stock
- `GET  /api/v1/orders/[id]` — Retrieve full order dossier
- `PUT  /api/v1/orders/[id]` — Update fulfillment state, attach carrier tracking number, or issue refund

### Customers & CRM
- `GET  /api/v1/customers` — List registered customers, VIP tiers, and lifetime spend
- `PUT  /api/v1/customers/[id]` — Adjust loyalty points, grant store credit, or toggle account status

### Media & Assets
- `GET  /api/v1/media` — List digital assets filtered by folder taxonomy
- `POST /api/v1/media` — Register and upload new media asset with alt text
- `DELETE /api/v1/media/[id]` — Remove media asset

### Reviews & Social Proof
- `GET  /api/v1/reviews` — Retrieve product reviews filtered by status (`pending`, `approved`, `rejected`)
- `POST /api/v1/reviews` — Submit new review from storefront
- `PUT  /api/v1/reviews/[id]` — Approve or reject review

### CMS & Global Settings
- `GET  /api/v1/cms/sections` — Fetch active homepage section layout and configuration
- `PUT  /api/v1/cms/sections` — Reorder and update section visibility and titles
- `GET  /api/v1/settings` — Read system configuration, payment gateway credentials, and pixel tags
- `PUT  /api/v1/settings` — Save system configuration and update Super Admin credentials

---

## 🚀 Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) for the Storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin Dashboard.

3. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```
