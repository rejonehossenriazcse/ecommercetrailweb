Build a premium, modern, scalable, fully responsive, full-stack e-commerce platform with a powerful Admin CMS, real-time inventory management, multi-payment support, advanced analytics, marketing pixel integrations, and high-conversion shopping features.

The platform must work seamlessly on desktop, tablet, and mobile browsers. Build the architecture API-first so that a future native mobile app, PWA, POS system, marketplace integration, and third-party services can use the same backend APIs.

The platform must not be a static storefront. All critical business features — including product management, CMS, customer accounts, cart, checkout, payments, orders, inventory, promotions, analytics, permissions, and integrations — must be fully functional.

IMPORTANT RULE:
Do not hardcode unnecessary content in the frontend. All content, design settings, homepage sections, menus, banners, products, categories, blog posts, offers, SEO settings, and footer/header content must be manageable from the Admin Dashboard/CMS.

Use an original, premium, clean, conversion-focused UI/UX. Do not copy any existing website’s branding, exact layout, images, or text.

---

TECHNOLOGY ARCHITECTURE

Use an API-first, headless commerce architecture.

Frontend:
- Next.js or React with TypeScript
- Tailwind CSS or scalable component-based design system
- Mobile-first responsive layout
- PWA-ready structure
- Server-side rendering and static generation where useful for SEO
- Image optimization, lazy loading, CDN-ready media
- WCAG 2.1 AA accessibility

Backend:
- Node.js with NestJS, Express, or another scalable framework
- REST API or GraphQL API
- PostgreSQL/MySQL for relational data
- Redis for caching, sessions, queues, rate limiting, and flash-sale traffic
- Object storage for media, invoices, and files
- Background job queue for emails, SMS, inventory sync, invoices, webhooks, and automation
- Webhook-based integration architecture

DevOps:
- Docker-ready environment
- CI/CD pipeline for staging and production
- Environment variables for API keys, secrets, analytics IDs, and payment keys
- Database migrations
- Automated backups and disaster recovery
- Logging, monitoring, audit logs, CDN, WAF, SSL, and vulnerability scanning

---

CUSTOMER STOREFRONT

Homepage:
Create a fully CMS-controlled homepage with drag-and-drop/reorderable sections.

Include possible sections:
- Hero slider/banner/image/video block
- Featured categories
- Trending products
- Best sellers
- New arrivals
- Flash sale with countdown timer
- Deal of the day
- Brand showcase
- Promotional banners
- Product collections
- Recently viewed products
- Personalized recommendations
- Testimonials
- User-generated content/social gallery
- Newsletter signup
- Trust/service benefits
- FAQ block
- Blog/articles block
- App download/PWA promotion
- Footer newsletter, payment methods, social links, legal links, dynamic footer menus

Every homepage section must be enabled/disabled, reordered, configured, and populated from the Admin CMS.

Header:
- Editable logo and favicon
- Multi-level navigation
- Category mega menu
- Search with autosuggest
- Account/login
- Wishlist
- Cart with live item count
- Currency selector
- Language selector
- Announcement bar
- Mobile menu
- Sticky header option

Product Listing Pages:
- Category, collection, search, brand, offer, and campaign pages
- Grid/list view
- Product badges: New, Sale, Best Seller, Limited Stock, Pre-order, Out of Stock
- Sorting by price, popularity, newest, rating, discount, relevance
- Filters: category, brand, price, color, size, rating, availability, attributes, custom properties
- Faceted navigation with URL-based filter state
- Pagination or infinite scroll
- SEO-friendly URLs
- Admin merchandising rules: pin, boost, hide, deprioritize

Product Details Page:
- Multiple images, zoom gallery
- Optional 360-degree view, video, AR/3D preview
- Product title, SKU, barcode, brand, category, stock status, price, discount, tax, delivery info
- Variable product options: size, color, model, capacity, custom attributes
- Dynamic variant pricing and stock
- Quantity selector
- Add to cart
- Buy now
- Wishlist
- Share buttons
- Estimated delivery
- Size guide/product guide
- Description, specifications, ingredients/materials, FAQ, warranty, delivery/return policy tabs
- Reviews and ratings
- Verified-purchase reviews
- Photo/video review upload
- Product Q&A
- Related products
- Cross-sell products
- Upsell products
- Recently viewed products
- Frequently bought together

---

CMS REQUIREMENTS

Page Builder:
Create a drag-and-drop page builder for:
- Homepage
- Landing pages
- Campaign pages
- About page
- Contact page
- Category pages
- Brand pages
- Custom static pages
- Policy pages
- Seasonal sale pages

Reusable blocks/widgets:
- Hero/banner
- Image + text
- Rich text editor
- CTA button
- Product carousel
- Product grid
- Category grid
- Video embed
- Image gallery
- Testimonial slider
- FAQ accordion
- Countdown timer
- Newsletter block
- Blog grid
- Brand logo carousel
- Divider/spacer
- HTML/embed block
- Social feed block
- Custom promotional block

Each block must have settings for title, subtitle, button text, button URL, background, gradient, image, video, visibility, responsive spacing, alignment, and scheduling.

Content Publishing:
- Draft, scheduled, published, archived, revision states
- Content versioning/history
- Preview before publishing
- Schedule publish/unpublish
- Rollback to previous version
- Per-page SEO configuration
- Multi-language content support
- Approval workflow where required

Media Library:
- Image/video upload
- Folders, search, filters
- Alt text and captions
- Automatic compression/optimization
- WebP/AVIF conversion where supported
- CDN-ready delivery
- Usage tracking
- Crop/resize support
- Replace media without breaking references

---

PRODUCT AND CATALOG MANAGEMENT

Product types:
- Simple
- Variable with variants
- Bundle/combo
- Digital/downloadable
- Subscription
- Gift card
- Pre-order
- Backorder
- Wholesale/B2B
- Service product if needed

Product fields:
- Name
- Short and long description
- Category
- Brand
- Tags
- SKU
- Barcode
- Cost price
- Selling price
- Sale price
- Tax class
- Weight and dimensions
- Variant-specific price, SKU, barcode, images, stock
- Images, videos, 360-degree media
- Attributes and custom fields
- Related/cross-sell/upsell products
- SEO meta title, description, slug, OG image, structured data
- Availability schedule
- Visibility status
- Featured product option
- Product badges
- Minimum/maximum purchase quantity
- Wholesale tier pricing
- Shipping class
- Warranty and return policy

Bulk operations:
- CSV/Excel import and export
- Bulk edit
- Bulk category assignment
- Bulk pricing updates
- Bulk stock updates
- Bulk image upload
- Bulk publish/unpublish
- Import validation report

---

INVENTORY AND WAREHOUSE MANAGEMENT

Build real-time inventory management that prevents overselling.

Include:
- Real-time stock tracking
- Multiple warehouses/locations
- Location-wise stock
- Reserved stock for active checkout/orders
- Available stock calculation
- Automatic stock deduction after successful order confirmation
- Restock after cancellation/return/refund based on rules
- Low-stock and out-of-stock alerts
- Backorder handling
- Pre-order handling
- Stock threshold configuration by product/variant
- Inventory adjustment with audit reason
- Stock transfer between warehouses
- Stock movement history
- Batch/lot number tracking
- Expiry date tracking where applicable
- Damaged/lost stock recording
- Supplier management
- Purchase order creation and receiving workflow
- Inventory valuation report
- Inventory forecasting/demand analysis
- Inventory sync with POS, marketplace, and external sales channels

---

CART, CHECKOUT, AND ORDERS

Cart:
- Persistent cart for logged-in users
- Guest cart
- Merge guest cart with account cart after login
- Update quantity
- Remove item
- Save for later
- Apply coupon
- Apply gift card/store credit
- Shipping estimate
- Tax estimate
- Cart upsell/cross-sell
- Stock validation before checkout
- Cart expiry and abandoned-cart tracking

Checkout:
- Fast, secure, mobile-optimized one-page checkout
- Guest checkout
- Account checkout
- Email/password login
- Phone OTP login
- Social login
- Address autocomplete and validation
- Multiple saved addresses
- Shipping method selection
- Real-time carrier rates
- Region-based delivery rules
- Tax calculation
- Coupon/gift card/store credit
- Multiple payment methods
- Order note
- Terms and privacy-policy acceptance
- Fraud/risk check before payment
- Payment failure/retry flow
- Order confirmation page
- Email/SMS/WhatsApp order confirmation
- Invoice/PDF generation

Order Management:
- Order ID and timeline
- Customer information
- Order items
- Billing/shipping address
- Payment status
- Fulfillment status
- Shipping status
- Tracking number
- Carrier information
- Internal notes
- Customer notes
- Invoice/PDF
- Packing slip
- Partial fulfillment
- Split shipment
- Order cancellation
- Full refund
- Partial refund
- Exchange/replacement
- Return/RMA workflow
- Return approval/rejection
- Return shipping tracking
- Restock returned items where appropriate
- Manual order creation
- CSV/Excel order export

---

PAYMENT GATEWAY

Build a flexible payment gateway architecture so new providers can be added without changing checkout core logic.

Support:
- Credit/debit cards
- Stripe
- PayPal
- Razorpay
- Regional/local gateways as required
- Apple Pay
- Google Pay
- Bank transfer
- Mobile financial services/local wallets
- Cash on delivery
- Buy now, pay later
- Gift cards
- Store credit
- Subscription/recurring billing
- Split payments where supported

Security:
- No raw card storage
- Payment tokenization
- PCI-DSS compliant design
- SSL/TLS enforced
- 3D Secure support
- OTP support where applicable
- Webhook verification
- Idempotency to prevent duplicate charges
- Fraud detection and risk scoring
- Admin refund and partial refund
- Payment transaction logs and audit trail

---

CUSTOMER ACCOUNTS

Include:
- Registration with email
- Email/password login
- Phone OTP login
- Social login
- Email verification
- Password reset
- Optional two-factor authentication
- Profile editing
- Saved addresses
- Saved payment methods using provider tokenization
- Wishlist
- Order history
- Order tracking
- Downloadable invoices
- Reorder previous order
- Return/exchange request
- Loyalty points balance
- Referral rewards
- Store credit balance
- Notification preferences
- Marketing consent preferences
- Account deletion/data export request for compliance

---

SEARCH AND RECOMMENDATIONS

Search:
- AI-powered search or search-engine integration
- Autosuggest
- Typo tolerance
- Synonym support
- Search by SKU/barcode
- Search by product name, brand, category, attributes
- Search analytics dashboard
- No-result search tracking
- Popular searches
- Recent searches
- Search merchandising rules

Recommendations:
- Recently viewed
- Frequently bought together
- Related products
- Similar products
- Personalized recommendations
- Trending products
- Best sellers
- Recommended for you
- Cart and checkout recommendations
- Manual recommendation rules from admin

---

PROMOTIONS, PRICING, AND LOYALTY

Discount engine:
- Coupon codes
- Automatic discounts
- Percentage/fixed discounts
- Buy X get Y
- Bundle discounts
- Category/product discounts
- Customer-specific discounts
- First-order discounts
- Free shipping discounts
- Flash sales
- Scheduled campaigns
- Minimum spend rules
- Maximum discount rules
- Usage limits
- Per-customer usage limits
- Stackable/non-stackable rules

Pricing:
- Regular price
- Sale price
- Variant pricing
- Scheduled price
- Multi-currency display
- Region-specific prices
- Wholesale pricing
- Customer-group pricing
- Quantity/tier pricing
- VAT/tax-inclusive/exclusive configuration

Loyalty and referral:
- Point earning rules
- Point redemption rules
- Point expiry
- Referral code generation
- Referral rewards
- Birthday rewards
- Loyalty tiers
- Store credit management
- Reward history

---

MARKETING PIXELS AND TRACKING

Create a configurable tracking center in the admin panel.

Integrations:
- Meta Pixel
- Meta Conversions API server-side tracking
- Google Analytics 4
- Google Tag Manager
- Google Ads conversion tracking
- TikTok Pixel
- Pinterest Tag
- Snapchat Pixel
- Optional server-side tagging
- UTM tracking
- Affiliate/referral tracking

E-commerce events:
- Page view
- View content/product view
- Search
- View category
- Add to cart
- Remove from cart
- Add to wishlist
- Initiate checkout
- Add payment info
- Purchase
- Refund
- Sign up
- Login
- Lead/newsletter signup
- Coupon applied
- Shipping selected

Implement browser-side and server-side event tracking where required, with event deduplication for Meta Pixel and Conversions API.

Consent management:
- Custom cookie-consent banner
- Accept all
- Reject non-essential
- Manage preferences
- Analytics consent
- Marketing consent
- Functional cookie consent
- Region-aware GDPR/CCPA settings
- Consent log storage
- Consent withdrawal option

---

CUSTOMER ENGAGEMENT

Support integration-ready modules for:
- Live chat
- AI chatbot
- WhatsApp support
- Email marketing platforms
- SMS marketing platforms
- Web push notifications
- Mobile push notifications
- Abandoned cart automation
- Back-in-stock notification
- Price-drop notification
- Order status notifications
- Review request automation
- Welcome email automation
- Post-purchase cross-sell automation

Compatible examples: Klaviyo, Mailchimp, Brevo, Twilio, WhatsApp Business API, Messenger.

---

REVIEWS AND USER-GENERATED CONTENT

Include:
- Star ratings
- Text reviews
- Verified-purchase badge
- Photo review upload
- Video review upload
- Review moderation
- Helpful/unhelpful voting
- Review filtering and sorting
- Product Q&A
- Admin answers
- UGC gallery
- Approval workflow before display
- Review schema markup for SEO

---

MULTI-CHANNEL AND MARKETPLACE

Build integration-ready synchronization for:
- Facebook Shop
- Instagram Shop
- TikTok Shop
- Amazon
- eBay
- Google Merchant Center
- POS system
- Marketplace channels
- Physical-store inventory
- Social commerce and shoppable content
- Live-selling support where applicable

Ensure product, inventory, price, order, and fulfillment data can synchronize reliably through APIs/webhooks/queues.

---

ADMIN DASHBOARD

Create a premium, responsive, easy-to-use Admin Dashboard.

Dashboard overview:
- Total sales
- Orders
- Revenue
- Average order value
- Conversion rate
- Top-selling products
- Low-stock products
- Customer growth
- Recent orders
- Sales by channel
- Sales by location
- Marketing performance
- Abandoned cart performance
- Revenue chart by date range

Admin modules:
- Dashboard analytics
- CMS/page builder
- Media library
- Product management
- Category management
- Brand management
- Attribute management
- Inventory and warehouse management
- Supplier and purchase order management
- Order management
- Refunds and returns
- Customer management
- Customer segments
- Promotions and coupons
- Gift cards
- Loyalty program
- Blog/article management
- Review moderation
- Menu management
- Theme and branding settings
- SEO settings
- Redirect management
- Payment gateway settings
- Shipping/carrier settings
- Tax settings
- Currency settings
- Language/translation management
- Email/SMS/WhatsApp template management
- Pixel/tracking settings
- Integration settings
- User roles and permissions
- Audit logs
- System settings
- Backup/export tools

---

ROLES AND PERMISSIONS

Implement granular RBAC permissions.

Super Admin:
Full system access, settings, users, integrations, payment configuration, security, and reports.

Store Manager:
Products, inventory, orders, promotions, customer management, and reports.

Content Editor:
CMS pages, blogs, media library, menus, SEO, and content scheduling.

Support Agent:
Customer lookup, order lookup, return requests, chat/support tools, limited refund permissions.

Warehouse Staff:
Inventory, stock adjustment, packing, fulfillment, shipping, and purchase orders.

Marketing Manager:
Campaigns, coupons, customer segments, pixels, analytics, email/SMS automation.

Customer:
Storefront, account, orders, wishlist, reviews, rewards, and returns.

Track every sensitive admin action in an audit log: user, action, date/time, IP where appropriate, old value, and new value.

---

REPORTING AND ANALYTICS

Build downloadable and filterable reports.

Sales reports:
- Revenue by day/week/month/year
- Order count
- Average order value
- Refund amount
- Discount amount
- Tax amount
- Shipping revenue
- Sales by product/category/brand/customer/location/channel/payment method

Customer reports:
- New vs returning customers
- Customer lifetime value
- Cohort analysis
- RFM analysis
- Segment performance
- Retention rate
- Top customers
- Repeat purchase rate

Inventory reports:
- Current stock
- Low-stock products
- Out-of-stock products
- Inventory valuation
- Inventory turnover
- Stock movement
- Warehouse-wise stock
- Dead stock
- Demand forecasting

Marketing reports:
- Traffic source
- Conversion by source
- UTM performance
- Campaign sales
- Coupon performance
- ROAS
- Meta conversion data
- Google Ads conversion data
- Abandoned-cart recovery rate
- Email/SMS campaign performance

Allow CSV, Excel, and PDF export where applicable.

---

SEO REQUIREMENTS

Implement:
- Clean customizable URLs
- Auto-generated sitemap.xml
- Configurable robots.txt
- Canonical URLs
- 301/302 redirect manager
- Meta title/description per page/product/category
- Open Graph and Twitter card tags
- Product schema
- Review schema
- Breadcrumb schema
- Organization schema
- FAQ schema
- Blog/article schema
- SEO-friendly pagination
- Image alt-text support
- Automated image optimization
- Core Web Vitals optimization
- Duplicate-content prevention
- Noindex settings for selected pages
- SEO preview in CMS

---

SECURITY AND COMPLIANCE

Implement:
- HTTPS/SSL enforced
- PCI-DSS compliant payment design
- No raw payment card storage
- Modern password hashing
- JWT/session security
- Refresh token rotation where applicable
- RBAC
- Multi-factor authentication for admins
- Admin login rate limiting
- CAPTCHA/anti-bot protection where needed
- CSRF protection
- XSS protection
- SQL injection protection
- API validation and sanitization
- Secure file upload validation
- WAF support
- Automated backups
- Disaster recovery procedures
- Vulnerability scanning
- Security audit logging
- GDPR/CCPA data export and deletion requests
- Privacy policy, cookie policy, terms, return policy, and shipping policy pages controlled from CMS

---

PERFORMANCE AND SCALABILITY

- Target page load time under 2–3 seconds
- Optimize Core Web Vitals: good LCP, INP, and CLS
- Use CDN for static assets and media
- Responsive image delivery and lazy loading
- Browser and server caching
- Redis cache for high-traffic pages/sessions where needed
- Database indexing and optimized queries
- Queue-based background processing
- Horizontal scaling during flash sales/traffic spikes
- Rate limiting and bot protection
- Graceful failure handling for third-party integrations
- Health-check endpoints and uptime monitoring

---

LOCALIZATION, CURRENCY, TAX, AND SHIPPING

Support:
- Multi-language content and translation management
- Multi-currency pricing/display
- Currency conversion configuration
- Country/region-based shipping
- Country/region-based tax rules
- VAT/GST handling
- Tax-inclusive/exclusive display
- Shipping zones
- Shipping methods
- Flat-rate shipping
- Free shipping rules
- Weight-based shipping
- Price-based shipping
- Real-time carrier rates
- Local delivery
- Store pickup
- Delivery date/time slot options where required

---

QUALITY ASSURANCE AND ACCEPTANCE CRITERIA

Before launch, test and verify:

- All pages are fully responsive on desktop, tablet, and mobile
- No unnecessary hardcoded storefront content
- Admin can manage pages, menus, banners, products, categories, blogs, SEO, promotions, inventory, users, and settings
- Product variant price, image, SKU, and stock update correctly
- Inventory deducts correctly after successful orders
- Cancelled/returned orders restore inventory correctly based on rules
- No overselling occurs across connected sales channels
- Cart, wishlist, checkout, order confirmation, payment, refund, return, and invoice workflows work end-to-end
- Payment webhooks are verified and duplicate-payment protection works
- Meta Pixel and Conversions API events are validated with test orders
- GA4 e-commerce events are validated using DebugView
- Core Web Vitals meet “good” thresholds where feasible
- SEO metadata, sitemap, schema markup, robots.txt, and canonical URLs work correctly
- WCAG 2.1 AA accessibility checks pass for core customer flows
- No critical/high security vulnerability remains before launch
- Admin actions are properly permission-controlled and auditable
- Automated backup and restore procedure is tested
- Error states, empty states, loading states, and mobile navigation are polished
- No lorem ipsum content or broken buttons at launch

---

FINAL DELIVERY REQUIREMENTS

Deliver:
- Fully functional storefront
- Fully functional Admin CMS dashboard
- Responsive design for desktop, tablet, and mobile
- Clean source code and project structure
- Database schema and migrations
- API documentation
- Environment variable documentation
- Deployment instructions
- Admin user creation instructions
- Payment gateway setup guide
- Pixel and analytics setup guide
- Backup and restore guide
- Staging test account credentials only
- No temporary email account for the owner account
- Owner/Super Admin account must be created using the client’s own email address
- Super Admin must be able to change email address and password later from secure account settings
- Full ownership of source code, database, hosting, domain, cloud accounts, analytics accounts, and payment accounts must remain with the client

Build this as a production-ready, scalable, secure, full-stack e-commerce platform — not a static demo website.