import {
  UserRecord,
  WarehouseRecord,
  OrderRecord,
  CMSSectionRecord,
  SystemSettingsRecord,
  AuditLogRecord,
  CustomerRecord,
  MediaAssetRecord,
  ReviewRecord,
  CustomPageRecord,
  BlogPostRecord,
  PromotionRecord,
  ContactInquiryRecord,
  NewsletterSubscriberRecord,
} from './schema';
import { PRODUCTS } from '@/data/mockData';

// Default hashed passwords (pre-hashed with bcrypt for 'Admin2026!' and 'User2026!')
export const SEED_USERS: UserRecord[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@stridedistrict.com',
    passwordHash: '$2a$10$7c0KqGfWc96oWzIhzrE14ObK3Jk1y4f8uQoXUj8yT7/x8m3zJ7U2S', // 'Admin2026!'
    role: 'super_admin',
    firstName: 'District',
    lastName: 'Admin',
    phone: '+1 212 555 0199',
    isVerified: true,
    twoFactorEnabled: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-04T00:00:00Z',
  },
  {
    id: 'usr-mgr-2',
    email: 'manager@stridedistrict.com',
    passwordHash: '$2a$10$7c0KqGfWc96oWzIhzrE14ObK3Jk1y4f8uQoXUj8yT7/x8m3zJ7U2S',
    role: 'store_manager',
    firstName: 'Marcus',
    lastName: 'Chen',
    phone: '+1 212 555 0184',
    isVerified: true,
    twoFactorEnabled: false,
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z',
  },
  {
    id: 'usr-edit-3',
    email: 'editor@stridedistrict.com',
    passwordHash: '$2a$10$7c0KqGfWc96oWzIhzrE14ObK3Jk1y4f8uQoXUj8yT7/x8m3zJ7U2S',
    role: 'content_editor',
    firstName: 'Chloe',
    lastName: 'Vaughn',
    isVerified: true,
    twoFactorEnabled: false,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-08-14T00:00:00Z',
  },
  {
    id: 'usr-cust-4',
    email: 'marcus.vance@streetwear.io',
    passwordHash: '$2a$10$7c0KqGfWc96oWzIhzrE14ObK3Jk1y4f8uQoXUj8yT7/x8m3zJ7U2S',
    role: 'customer',
    firstName: 'Marcus',
    lastName: 'Vance',
    phone: '+1 415 555 0192',
    isVerified: true,
    twoFactorEnabled: false,
    createdAt: '2026-05-10T14:20:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
];

export const SEED_WAREHOUSES: WarehouseRecord[] = [
  {
    id: 'wh-nyc',
    name: 'NYC SoHo Flagship Hub',
    code: 'US-NYC-01',
    address: '540 Broadway',
    city: 'New York',
    country: 'United States',
    isDefault: true,
    totalCapacity: 25000,
  },
  {
    id: 'wh-tyo',
    name: 'Tokyo Harajuku Vault',
    code: 'JP-TYO-02',
    address: '4-28-16 Jingumae, Shibuya',
    city: 'Tokyo',
    country: 'Japan',
    isDefault: false,
    totalCapacity: 18000,
  },
  {
    id: 'wh-lon',
    name: 'London Shoreditch Depot',
    code: 'UK-LON-03',
    address: '15 Redchurch Street',
    city: 'London',
    country: 'United Kingdom',
    isDefault: false,
    totalCapacity: 14000,
  },
];

export const SEED_ORDERS: OrderRecord[] = [
  {
    id: 'ord-9042',
    orderNumber: 'STRIDE-2026-9042',
    customerId: 'usr-cust-4',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@streetwear.io',
    customerPhone: '+1 415 555 0192',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Apple Pay',
    fulfillmentStatus: 'fulfilled',
    currency: 'USD',
    subtotal: 180.00,
    discount: 18.00,
    shipping: 0,
    tax: 12.96,
    total: 174.96,
    couponCode: 'STREET10',
    carrier: 'UPS Worldwide Express',
    trackingNumber: 'UPS-1Z9999999999999999',
    shippingAddress: {
      street: '742 Montgomery Street, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94111',
      country: 'United States',
    },
    billingAddress: {
      street: '742 Montgomery Street, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94111',
      country: 'United States',
    },
    items: [
      {
        id: 'item-1',
        productId: 'prod-001',
        name: "Air Jordan 1 Retro High OG 'Chicago Lost & Found'",
        sku: 'DZ5485-612',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
        price: 180.00,
        quantity: 1,
        total: 180.00,
        selectedOptions: { Size: 'US 10.5', Condition: 'Brand New (Deadstock)' },
      },
    ],
    internalNotes: 'VIP Collector. Verified Deadstock with multi-point authentication and UV tag.',
    createdAt: '2026-10-01T15:30:00Z',
    updatedAt: '2026-10-03T18:00:00Z',
  },
  {
    id: 'ord-9043',
    orderNumber: 'STRIDE-2026-9043',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@hypemag.com',
    customerPhone: '+49 30 1928374',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Stripe Credit Card',
    fulfillmentStatus: 'partially_fulfilled',
    currency: 'USD',
    subtotal: 283.00,
    discount: 0,
    shipping: 0,
    tax: 22.64,
    total: 305.64,
    carrier: 'DHL Express Priority',
    trackingNumber: 'DHL-8829104821',
    shippingAddress: {
      street: 'Friedrichstraße 120',
      city: 'Berlin',
      state: 'Berlin',
      zip: '10117',
      country: 'Germany',
    },
    billingAddress: {
      street: 'Friedrichstraße 120',
      city: 'Berlin',
      state: 'Berlin',
      zip: '10117',
      country: 'Germany',
    },
    items: [
      {
        id: 'item-2',
        productId: 'prod-002',
        name: "Nike Dunk Low Retro 'Panda'",
        sku: 'DD1391-100',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
        price: 115.00,
        quantity: 1,
        total: 115.00,
        selectedOptions: { Size: 'US 8.5' },
      },
      {
        id: 'item-3',
        productId: 'prod-006',
        name: "Supreme Box Logo Hooded Sweatshirt 'Heather Grey'",
        sku: 'SUP-BOGO-GRY-23',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
        price: 168.00,
        quantity: 1,
        total: 168.00,
        selectedOptions: { Size: 'L', Color: 'Heather Grey' },
      },
    ],
    internalNotes: 'Dispatched from SoHo Hub. Authentic streetwear packaging with NFC seal.',
    createdAt: '2026-10-03T11:15:00Z',
    updatedAt: '2026-10-03T14:30:00Z',
  },
  {
    id: 'ord-9044',
    orderNumber: 'STRIDE-2026-9044',
    customerName: 'Kenji Takahashi',
    customerEmail: 'kenji.takahashi@tokyofits.jp',
    customerPhone: '+81 90 2839 1029',
    status: 'pending',
    paymentStatus: 'paid',
    paymentMethod: 'PayPal Express',
    fulfillmentStatus: 'unfulfilled',
    currency: 'USD',
    subtotal: 1500.00,
    discount: 50.00,
    shipping: 0,
    tax: 116.00,
    total: 1566.00,
    couponCode: 'HYPE20',
    shippingAddress: {
      street: '2-11-3 Minami-Aoyama',
      city: 'Minato-ku, Tokyo',
      state: 'Tokyo',
      zip: '107-0062',
      country: 'Japan',
    },
    billingAddress: {
      street: '2-11-3 Minami-Aoyama',
      city: 'Minato-ku, Tokyo',
      state: 'Tokyo',
      zip: '107-0062',
      country: 'Japan',
    },
    items: [
      {
        id: 'item-4',
        productId: 'prod-004',
        name: "Travis Scott x Air Jordan 1 Low 'Reverse Mocha'",
        sku: 'DM7866-162',
        image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80',
        price: 1500.00,
        quantity: 1,
        total: 1500.00,
        selectedOptions: { Size: 'US 9.5', Laces: 'Pink Extra Set Included' },
      },
    ],
    internalNotes: 'High-value grail order. Full physical authentication and blacklight inspection certified.',
    createdAt: '2026-10-04T00:20:00Z',
    updatedAt: '2026-10-04T00:25:00Z',
  },
];

export const SEED_CMS_SECTIONS: CMSSectionRecord[] = [
  {
    id: 'sec-hero',
    page: 'home',
    type: 'hero_slider',
    title: 'Hero Showcase & Drops',
    subtitle: 'Exclusive sneakers and streetwear for the culture',
    order: 1,
    isEnabled: true,
    settings: {
      deviceVisibility: 'all',
      // Ads / Announcement Bar in Hero Section
      showAdBanner: true,
      adBadgeText: '🔥 HOT DROP',
      adText: 'MIDNIGHT DROP: 20% OFF SELECT GRAILS WITH CODE: CULTURE20 | FREE EXPRESS SHIPPING OVER $150',
      adLinkText: 'Shop Shock Drop',
      adLinkUrl: '/shop?filter=sale',
      adBgColor: '#f97316',
      // Main Hero Copy
      tagline: '@OWN THE STREETS',
      titleLine1: 'BUILT FOR',
      titleHighlight: 'MOVEMENT',
      description: 'Exclusive sneakers and streetwear for the culture. For the bold. For you.',
      primaryBtnText: 'Shop New Arrivals',
      primaryBtnLink: '/shop?sort=newest',
      secondaryBtnText: 'Explore Looks',
      secondaryBtnLink: '/shop',
      backgroundImage: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=2000&auto=format&fit=crop',
      watermarkText: 'STRIDE DISTRICT',
      showWatermark: true,
      // Trust Badges at Hero Bottom
      showTrustBadges: true,
      badge1Title: '100% Authentic',
      badge1Sub: 'Guaranteed',
      badge2Title: 'Easy Returns',
      badge2Sub: '14-Day Policy',
      badge3Title: 'Secure Checkout',
      badge3Sub: 'Shop with Confidence',
    },
  },
  {
    id: 'sec-categories',
    page: 'home',
    type: 'featured_categories',
    title: 'Shop By Category',
    subtitle: 'Sneakers, Hoodies, Tees, Outerwear, Headwear & Accessories',
    order: 2,
    isEnabled: true,
    settings: {
      deviceVisibility: 'all',
      viewAllText: 'View All Categories',
      viewAllLink: '/shop',
      itemsCount: 4,
    },
  },
  {
    id: 'sec-products',
    page: 'home',
    type: 'product_grid',
    title: 'New Arrivals',
    subtitle: 'Trending Heat & Verified Drops',
    order: 3,
    isEnabled: true,
    settings: {
      deviceVisibility: 'all',
      viewAllText: 'View All',
      viewAllLink: '/shop?sort=newest',
      itemsCount: 5,
    },
  },
  {
    id: 'sec-banners',
    page: 'home',
    type: 'promotional_banners',
    title: 'Limited Time Shock Drop (Up to 40% Off)',
    subtitle: 'Streetwear Discount & Clearance Banner',
    order: 4,
    isEnabled: true,
    settings: {
      deviceVisibility: 'all',
      tagline: 'LIMITED TIME ONLY',
      heading: 'UP TO 40% OFF',
      subtitle: 'ON SELECT STYLES',
      btnText: 'Shop The Sale',
      btnLink: '/shop?filter=sale',
      bgColor: '#f97316',
      showSmileWatermark: true,
    },
  },
  {
    id: 'sec-social',
    page: 'home',
    type: 'social_gallery',
    title: "MORE THAN A BRAND. IT'S A CULTURE.",
    subtitle: 'Community Fits & Streetwear Culture',
    order: 5,
    isEnabled: true,
    settings: {
      deviceVisibility: 'all',
      headingLine1: 'MORE THAN A BRAND.',
      headingHighlight: "IT'S A CULTURE.",
      description: 'Stride District is built on passion, creativity, and community. Tag us in your fits #StrideDistrict to be featured.',
      hashtag: '#StrideDistrict',
      btnText: 'Join The District',
      btnLink: '/community',
      images: [
        'https://images.unsplash.com/photo-1512353087810-254cb3617d12?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1521566652839-697aa473761a?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=400&auto=format&fit=crop',
      ],
    },
  },
  {
    id: 'sec-testimonials',
    page: 'home',
    type: 'testimonials',
    title: 'What Our Customers Say',
    subtitle: 'Collector Verification & Legit Reviews',
    order: 6,
    isEnabled: true,
    settings: {
      deviceVisibility: 'all',
      showStars: true,
    },
  },
  {
    id: 'sec-brands',
    page: 'home',
    type: 'brand_showcase',
    title: 'Featured Hype Brands & Designers',
    subtitle: 'Official & Verified Streetwear Labels',
    order: 7,
    isEnabled: true,
    settings: {
      deviceVisibility: 'all',
      brands: 'NIKE, JORDAN, adidas, NB, Supreme, stussy, ESSENTIALS, Dickies',
    },
  },
  {
    id: 'sec-flash',
    page: 'home',
    type: 'flash_sale',
    title: 'Midnight Shock Drop Archive',
    subtitle: 'Limited Drop Archive with Live Countdown',
    order: 8,
    isEnabled: false,
    settings: {
      deviceVisibility: 'all',
      showTimer: true,
      hoursLeft: 14,
      tag: 'Limited Drop Archive',
    },
  },
  {
    id: 'sec-deal',
    page: 'home',
    type: 'deal_of_the_day',
    title: 'Drop of the Day Spotlight',
    subtitle: 'Spotlight feature on single hype product',
    order: 9,
    isEnabled: false,
    settings: {
      deviceVisibility: 'all',
      featuredProductId: 'prod-001',
      allocatedStock: 50,
      claimedCount: 38,
    },
  },
  {
    id: 'sec-blog',
    page: 'home',
    type: 'blog_section',
    title: 'Culture, Legit Check & Drop Journal',
    subtitle: 'Authentication guides and streetwear editorial',
    order: 10,
    isEnabled: false,
    settings: {
      deviceVisibility: 'all',
      showReadingTime: true,
    },
  },
  {
    id: 'sec-pwa',
    page: 'home',
    type: 'app_download',
    title: 'VIP Drop Club / Mobile App Banner',
    subtitle: 'Exclusive mobile drop notifications',
    order: 11,
    isEnabled: false,
    settings: {
      deviceVisibility: 'all',
      showQrCode: true,
    },
  },
];

export const SEED_SETTINGS: SystemSettingsRecord = {
  general: {
    storeName: 'STRIDE DISTRICT Flagship',
    supportEmail: 'concierge@stridedistrict.com',
    contactPhone: '+1 212 555 0199',
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
    taxRatePercent: 8,
    freeShippingThreshold: 150,
    announcementText: 'DROP ALERT: Free Insured Express Transit on Orders Over $150 • USE CODE: STREET10',
    announcementCoupon: 'STREET10',
    announcementEnabled: true,
  },
  superAdmin: {
    email: 'admin@stridedistrict.com',
    updatedAt: '2026-10-04T00:00:00Z',
  },
  payments: {
    stripeEnabled: true,
    stripePublishableKey: 'pk_live_stride_sample_51O2kQ8aJ',
    stripeSecretKeyConfigured: true,
    paypalEnabled: true,
    paypalClientId: 'AX_stride_live_client_sample_098',
    applePayEnabled: true,
    googlePayEnabled: true,
    codEnabled: false,
  },
  tracking: {
    metaPixelId: '109827364519283',
    conversionsApiTokenConfigured: true,
    ga4MeasurementId: 'G-STRIDE2026EXP',
    gtmContainerId: 'GTM-STRIDE01',
    tiktokPixelId: 'C89STRIDE_TK',
    serverSideTaggingEnabled: true,
  },
  shipping: {
    standardRate: 15,
    expressRate: 25,
    carriers: ['UPS Worldwide Express', 'DHL Express Priority', 'FedEx International Priority'],
    allowedCountries: ['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'AU', 'KR', 'SG'],
  },
  header: {
    logoText: 'STRIDE',
    logoSubtitle: 'DISTRICT',
    logoImageUrl: '',
    faviconUrl: '/favicon.ico',
    layout: 'standard',
    stickyHeader: true,
    announcementText: 'DROP ALERT: Free Insured Express Transit on Orders Over $150 • USE CODE: STREET10',
    announcementCoupon: 'STREET10',
    announcementLink: '/shop',
    announcementBgColor: '#09090b',
    announcementEnabled: true,
    showSearch: true,
    showAccount: true,
    showWishlist: true,
    showCart: true,
    showCurrencySelector: true,
    showLanguageSelector: true,
    ctaButtonText: 'Shop All Heat',
    ctaButtonLink: '/shop',
    ctaButtonEnabled: true,
    navLinks: [
      { id: 'nav-1', label: 'All Products', url: '/shop', isEnabled: true },
      { id: 'nav-2', label: 'Categories', url: '/shop', isMegaMenu: true, isEnabled: true },
      { id: 'nav-3', label: 'New Arrivals', url: '/shop?filter=new', badge: 'New Drop', isEnabled: true },
      { id: 'nav-4', label: 'Flash Deals', url: '/shop?filter=sale', badge: 'Sale', isEnabled: true },
      { id: 'nav-5', label: 'Journal', url: '/blog', isEnabled: true },
      { id: 'nav-6', label: 'Authenticity', url: '/about', isEnabled: true },
      { id: 'nav-7', label: 'Concierge', url: '/contact', isEnabled: true },
    ],
  },
  footer: {
    layout: 'five_columns',
    brandName: 'STRIDE DISTRICT',
    brandDescription: 'The premier global destination for verified authentic sneakers, iconic streetwear grails, and contemporary youth culture.',
    newsletterTitle: 'Never miss a shock drop or vault release.',
    newsletterSubtitle: 'Join over 120,000 collectors and stylists. Get instant drop SMS alerts, early access, and 10% off your first grail.',
    newsletterEnabled: true,
    contactEmail: 'concierge@stridedistrict.com',
    contactPhone: '+1 212 555 0199',
    contactAddress: '540 Broadway, SoHo, New York, NY 10012',
    copyrightText: '© 2026 STRIDE DISTRICT INC. ALL RIGHTS RESERVED. 100% VERIFIED AUTHENTIC GRAILS.',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com', isEnabled: true },
      { platform: 'Twitter', url: 'https://twitter.com', isEnabled: true },
      { platform: 'LinkedIn', url: 'https://linkedin.com', isEnabled: true },
      { platform: 'YouTube', url: 'https://youtube.com', isEnabled: true },
    ],
    paymentBadges: ['Apple Pay', 'Google Pay', 'Visa', 'Mastercard', 'Amex', 'PayPal', 'Stripe', 'Klarna'],
    columns: [
      {
        title: 'Catalog',
        links: [
          { label: 'Sneakers & Grails', url: '/shop?category=sneakers' },
          { label: 'Hoodies & Sweats', url: '/shop?category=hoodies' },
          { label: 'Graphic Tees', url: '/shop?category=t-shirts' },
          { label: 'Technical Outerwear', url: '/shop?category=outerwear' },
          { label: 'Headwear & Accessories', url: '/shop?category=accessories' },
          { label: 'Vault Archive Sale', url: '/shop?filter=sale', badge: 'Sale' },
        ],
      },
      {
        title: 'Culture',
        links: [
          { label: '100% Authenticity Guarantee', url: '/about' },
          { label: 'Stride Drop Journal', url: '/blog' },
          { label: 'Multi-Point Inspection Lab', url: '/about' },
          { label: 'Circular Packaging & Resell', url: '/sustainability' },
          { label: 'Press & Collaborations', url: '/contact' },
        ],
      },
      {
        title: 'Concierge',
        links: [
          { label: 'Order Management', url: '/account' },
          { label: 'Real-Time Parcel Tracking', url: '/track' },
          { label: 'Initiate Return (RMA)', url: '/account' },
          { label: 'Sizing & Legit Check FAQ', url: '/faq' },
          { label: '24/7 Streetwear Concierge', url: '/contact' },
        ],
      },
      {
        title: 'Policies',
        links: [
          { label: 'Privacy Charter (GDPR/CCPA)', url: '/privacy' },
          { label: 'Terms of Service', url: '/terms' },
          { label: 'Shipping & Transit Policy', url: '/shipping-policy' },
          { label: 'Deadstock Return Protocol', url: '/refund-policy' },
          { label: 'Buyer Protection Guarantee', url: '/terms' },
        ],
      },
    ],
  },
  seo: {
    metaTitle: 'STRIDE DISTRICT | Verified Authentic Sneaker Drops & Streetwear Culture',
    metaDescription: 'Discover 100% verified authentic Air Jordans, Dunks, Supreme box logos, Travis Scott collaborations, and premier streetwear.',
    metaKeywords: 'streetwear, sneakers, air jordan 1, travis scott, supreme, essentials hoodie, yeezy, nike dunk, authentic grails',
    ogImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
    twitterHandle: '@stridedistrict',
    robotsDirective: 'index, follow',
    sitemapUrl: '/sitemap.xml',
  },
};

export const SEED_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'log-001',
    userId: 'usr-admin-1',
    userName: 'District Admin',
    role: 'super_admin',
    action: 'SYSTEM_INITIALIZATION',
    entity: 'System',
    details: 'System initialized with Stride District headless commerce architecture, 256-bit encryption, and multi-hub inventory routing.',
    ipAddress: '127.0.0.1',
    timestamp: '2026-10-04T01:45:00Z',
  },
  {
    id: 'log-002',
    userId: 'usr-admin-1',
    userName: 'District Admin',
    role: 'super_admin',
    action: 'SETTINGS_UPDATE',
    entity: 'Payments',
    details: 'Verified Stripe, PayPal, Apple Pay, and Google Pay payment tokenization configurations.',
    ipAddress: '127.0.0.1',
    timestamp: '2026-10-04T01:50:00Z',
  },
  {
    id: 'log-003',
    userId: 'usr-mgr-2',
    userName: 'Marcus Chen',
    role: 'store_manager',
    action: 'STOCK_VERIFICATION',
    entity: 'Inventory',
    details: 'Synchronized deadstock sneaker allocations across New York SoHo, Tokyo Harajuku, and London hubs.',
    ipAddress: '192.168.1.45',
    timestamp: '2026-10-04T02:00:00Z',
  },
];

export const SEED_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-001',
    userId: 'usr-cust-4',
    name: 'Marcus Vance',
    email: 'marcus.vance@streetwear.io',
    phone: '+1 415 555 0192',
    tier: 'Platinum',
    totalOrders: 6,
    totalSpent: 4280.50,
    loyaltyPoints: 1250,
    storeCredit: 150.00,
    status: 'active',
    defaultShippingAddress: {
      street: '742 Montgomery Street, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94111',
      country: 'United States',
    },
    createdAt: '2026-02-14T10:00:00Z',
  },
  {
    id: 'cust-002',
    userId: 'usr-cust-5',
    name: 'Elena Rostova',
    email: 'elena.rostova@hypemag.com',
    phone: '+49 30 1928374',
    tier: 'Gold',
    totalOrders: 4,
    totalSpent: 2640.00,
    loyaltyPoints: 780,
    storeCredit: 50.00,
    status: 'active',
    defaultShippingAddress: {
      street: 'Friedrichstraße 120',
      city: 'Berlin',
      state: 'Berlin',
      zip: '10117',
      country: 'Germany',
    },
    createdAt: '2026-03-22T14:20:00Z',
  },
  {
    id: 'cust-003',
    userId: 'usr-cust-6',
    name: 'Kenji Takahashi',
    email: 'kenji.takahashi@tokyofits.jp',
    phone: '+81 90 2839 1029',
    tier: 'Silver',
    totalOrders: 3,
    totalSpent: 1390.00,
    loyaltyPoints: 420,
    storeCredit: 0.00,
    status: 'active',
    defaultShippingAddress: {
      street: '2-11-3 Minami-Aoyama',
      city: 'Minato-ku, Tokyo',
      state: 'Tokyo',
      zip: '107-0062',
      country: 'Japan',
    },
    createdAt: '2026-04-10T09:15:00Z',
  },
  {
    id: 'cust-004',
    userId: 'usr-cust-7',
    name: 'Chloe Vaughn',
    email: 'chloe.vaughn@sohostyle.com',
    phone: '+1 212 555 0143',
    tier: 'Bronze',
    totalOrders: 1,
    totalSpent: 280.00,
    loyaltyPoints: 100,
    storeCredit: 0.00,
    status: 'active',
    defaultShippingAddress: {
      street: '120 Spring St, Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10012',
      country: 'United States',
    },
    createdAt: '2026-08-01T12:00:00Z',
  },
];

export const SEED_MEDIA_ASSETS: MediaAssetRecord[] = [
  {
    id: 'med-001',
    name: 'air-jordan-1-chicago-lost-found.webp',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
    folder: 'Products',
    sizeBytes: 215000,
    mimeType: 'image/webp',
    dimensions: '1920x1080',
    altText: "Air Jordan 1 Retro High OG 'Chicago Lost & Found' lateral view",
    usageCount: 6,
    uploadedAt: '2026-09-15T08:00:00Z',
  },
  {
    id: 'med-002',
    name: 'nike-dunk-low-panda.webp',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85',
    folder: 'Products',
    sizeBytes: 198000,
    mimeType: 'image/webp',
    dimensions: '1800x1200',
    altText: "Nike Dunk Low Retro 'Panda' monochrome close-up",
    usageCount: 4,
    uploadedAt: '2026-09-18T11:20:00Z',
  },
  {
    id: 'med-003',
    name: 'travis-scott-reverse-mocha.webp',
    url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=85',
    folder: 'Products',
    sizeBytes: 245000,
    mimeType: 'image/webp',
    dimensions: '1600x1000',
    altText: "Travis Scott x Air Jordan 1 Low 'Reverse Mocha' detailed view",
    usageCount: 5,
    uploadedAt: '2026-09-20T14:40:00Z',
  },
  {
    id: 'med-004',
    name: 'supreme-box-logo-hoodie.webp',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1600&q=85',
    folder: 'Banners',
    sizeBytes: 380000,
    mimeType: 'image/webp',
    dimensions: '2560x1440',
    altText: "Supreme Box Logo Heather Grey editorial banner",
    usageCount: 4,
    uploadedAt: '2026-09-25T16:15:00Z',
  },
  {
    id: 'med-005',
    name: 'streetwear-lookbook-fall.webp',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85',
    folder: 'Brand',
    sizeBytes: 410000,
    mimeType: 'image/webp',
    dimensions: '2400x1350',
    altText: 'Stride District SoHo flagship editorial photoshoot',
    usageCount: 3,
    uploadedAt: '2026-09-28T10:00:00Z',
  },
];

export const SEED_REVIEWS: ReviewRecord[] = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    productName: "Air Jordan 1 Retro High OG 'Chicago Lost & Found'",
    customerName: 'Henrik M.',
    customerEmail: 'henrik.m@kicks.dk',
    rating: 5,
    title: 'Flawless Grails, 100% Authentic',
    comment: 'The leather cracking and vintage yellowed midsole are 100% true to retail. Passed physical legit check and UV inspection with flying colors.',
    isVerified: true,
    status: 'approved',
    createdAt: '2026-09-28T14:30:00Z',
  },
  {
    id: 'rev-002',
    productId: 'prod-002',
    productName: "Nike Dunk Low Retro 'Panda'",
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@streetwear.io',
    rating: 5,
    title: 'Everyday staple, pristine deadstock condition',
    comment: 'Fast 2-day delivery from the SoHo hub. Box was double-boxed with zero dents. Fits true to size.',
    isVerified: true,
    status: 'approved',
    createdAt: '2026-10-01T17:15:00Z',
  },
  {
    id: 'rev-003',
    productId: 'prod-006',
    productName: "Supreme Box Logo Hooded Sweatshirt 'Heather Grey'",
    customerName: 'Julian C.',
    customerEmail: 'julian.c@streetstyle.ch',
    rating: 5,
    title: 'Heavyweight fleece, flawless embroidery',
    comment: '450 GSM heavyweight cotton. The box logo stitching is razor sharp and the red bogo pop is iconic.',
    isVerified: true,
    status: 'approved',
    createdAt: '2026-10-02T19:00:00Z',
  },
  {
    id: 'rev-004',
    productId: 'prod-008',
    productName: "Fear of God Essentials Oversized Hoodie 'Oatmeal'",
    customerName: 'Astrid V.',
    customerEmail: 'astrid.v@nordicdrip.no',
    rating: 5,
    title: 'Coziest hoodie in the rotation',
    comment: 'Super soft fleece lining and perfect relaxed streetwear drape. Sized down one size for the ideal relaxed fit.',
    isVerified: true,
    status: 'approved',
    createdAt: '2026-10-03T21:40:00Z',
  },
];

export const SEED_PAGES: CustomPageRecord[] = [
  {
    id: 'page-about',
    slug: 'about',
    title: 'The Culture of Authenticity',
    subtitle: 'Where verified deadstock provenance meets contemporary streetwear culture.',
    category: 'company',
    metaTitle: 'About Stride District — 100% Verified Streetwear & Grails',
    metaDescription: 'Discover our multi-point authenticity inspection process, global warehouse hubs, and commitment to the culture.',
    status: 'published',
    updatedAt: '2026-10-01T12:00:00Z',
    content: `### Our DNA
Founded on the belief that acquiring rare grails and limited footwear should never be plagued by counterfeit anxiety, Stride District operates as the premier global marketplace for verified authentic streetwear.

### Multi-Point Legit Check Protocol
Every single pair of sneakers, hoodie, and collector accessory that enters our fulfillment vaults undergoes rigorous physical inspection by veteran authenticators:
1. **Typography & Font Weight**: Box label typography, UPC barcodes, and interior size tags analyzed against verified production master archives.
2. **Ultraviolet (UV) Inspection**: Blacklight inspection checks for invisible factory glue stamps, restitch patterns, and counterfeit glow signatures.
3. **Materials & Grain**: Genuine leather grain density, tongue padding thickness, and swoosh cut symmetry.
4. **Olfactory Verification**: Scent profiling to eliminate toxic industrial counterfeit glues.

### Global Hubs
- **SoHo Flagship Vault (540 Broadway, New York)**: North American intake, authentication lab, and courier dispatch.
- **Harajuku Facility (Shibuya, Tokyo)**: Asian exclusive drops, Japanese streetwear curation, and transpacific logistics.
- **Shoreditch Depot (London, UK)**: European fulfillment and luxury streetwear archives.

### Zero Counterfeit Guarantee
We maintain a strict zero-tolerance policy. If any item purchased through Stride District fails third-party legitimacy verification, we guarantee a 200% money-back refund.`,
  },
  {
    id: 'page-contact',
    slug: 'contact',
    title: 'Streetwear Concierge & Private Client Relations',
    subtitle: 'Direct line to our personal shoppers, authentication specialists, and logistics desk.',
    category: 'support',
    metaTitle: 'Contact Concierge — Stride District',
    metaDescription: 'Get in touch with the Stride District Concierge for grail sourcing, sizing questions, and order inquiries.',
    status: 'published',
    updatedAt: '2026-10-01T12:00:00Z',
    content: `### Global Concierge Desks

#### New York SoHo Hub
- **Address**: 540 Broadway, New York, NY 10012
- **Hours**: Monday – Saturday, 10:00 – 19:00 EST
- **Email**: concierge@stridedistrict.com
- **Phone**: +1 212 555 0199

#### Tokyo Harajuku Vault
- **Address**: 4-28-16 Jingumae, Shibuya-ku, Tokyo 150-0001
- **Hours**: Tuesday – Sunday, 11:00 – 20:00 JST
- **Phone**: +81 3 5555 0188

#### Grail Sourcing & VIP Stylist Services
Searching for an elusive Friends & Family release or archival collaborative piece? Our VIP Sourcing team works directly with trusted consignors worldwide to locate deadstock sizes on demand.`,
  },
  {
    id: 'page-faq',
    slug: 'faq',
    title: 'Frequently Asked Questions & Drop Protocols',
    subtitle: 'Everything you need to know about authentication, shipping speeds, sizing, and returns.',
    category: 'support',
    metaTitle: 'FAQ & Protocols — Stride District',
    metaDescription: 'Find answers regarding verified deadstock conditions, express shipping, sizing advice, and return procedures.',
    status: 'published',
    updatedAt: '2026-10-01T12:00:00Z',
    content: `### 1. What does "Deadstock (DS)" mean?
Deadstock means the sneaker or garment is 100% brand new, unworn, unlaced, and includes its original box, tissue paper, and all accessories (such as extra laces or hangtags).

### 2. How are sneakers packaged and shipped?
Every order is double-boxed with reinforced corrugated cardboard and shock-absorbent cushioning. We apply a tamper-evident Stride District verified holographic seal. We ship worldwide via UPS Worldwide Express, DHL Express, and FedEx Priority.

### 3. How do I choose my size?
- **Air Jordan 1s & Nike Dunks**: Run true to size (TTS). If you have wider feet, we suggest going up half a size.
- **Adidas Yeezy 350 V2**: Fit snug around the toebox; we recommend ordering half a size up.
- **Fear of God Essentials & Supreme**: Cut with an oversized, relaxed silhouette. Order your normal size for an oversized look, or size down one size for a tailored fit.

### 4. What is your return policy?
We offer a 14-day return window on all items provided the tamper-evident Stride District security tag remains attached and intact.`,
  },
  {
    id: 'page-sustainability',
    slug: 'sustainability',
    title: 'Circular Streetwear & Deadstock Archive',
    subtitle: 'Promoting circular fashion, sustainable packaging, and zero plastic waste.',
    category: 'company',
    metaTitle: 'Sustainability & Circularity — Stride District',
    metaDescription: 'Learn how Stride District reduces packaging waste and champions long-lasting, heirloom streetwear quality.',
    status: 'published',
    updatedAt: '2026-10-01T12:00:00Z',
    content: `### 100% Recycled & Biodegradable Packaging
All outer shipping boxes and packing tape used across our New York and London depots are manufactured from 100% post-consumer recycled paper and water-activated vegetable adhesive.

### Extending Garment Lifespans
The most sustainable sneaker or hoodie is one crafted with heavyweight fabrics and durable materials that circulate for years rather than ending in landfills. By authenticating and reselling grails, we keep high-grade fashion in active circulation.`,
  },
  {
    id: 'page-privacy',
    slug: 'privacy',
    title: 'Privacy Charter & Customer Data Protection',
    subtitle: 'Zero data brokerage, military-grade encryption, and strict GDPR compliance.',
    category: 'policy',
    metaTitle: 'Privacy Policy — Stride District',
    metaDescription: 'Our commitment to customer privacy, payment security, and data protection.',
    status: 'published',
    updatedAt: '2026-10-01T12:00:00Z',
    content: `### Customer Privacy First
Stride District never sells, rents, or monetizes personal customer data, browsing history, or payment records to third-party ad brokers.

### Payment Tokenization
We do not store raw credit card numbers or CVV codes. All payments are processed through PCI-DSS Level 1 compliant infrastructure (Stripe, PayPal, Apple Pay) with 256-bit TLS encryption.`,
  },
  {
    id: 'page-terms',
    slug: 'terms',
    title: 'Terms of Service & Buyer Protection',
    subtitle: 'The legal agreement governing purchases, authentication guarantees, and customer rights.',
    category: 'policy',
    metaTitle: 'Terms of Service — Stride District',
    metaDescription: 'Official terms and conditions governing purchases and guarantees from Stride District Inc.',
    status: 'published',
    updatedAt: '2026-10-01T12:00:00Z',
    content: `### 1. The Stride Authenticity Guarantee
By placing an order on Stride District, you are protected by our 100% Authenticity Guarantee. Every item has passed rigorous physical inspection before shipment.

### 2. Pricing and Stock
All prices are listed in USD or your selected local currency. In rare instances of concurrent flash drop checkout collisions, refunds are issued immediately.

### 3. Governing Law
These terms are governed by the laws of the State of New York, United States.`,
  },
];

export const SEED_BLOGS: BlogPostRecord[] = [
  {
    id: 'blog-01',
    slug: 'the-definitive-legit-check-guide-jordan-1',
    title: 'The Definitive Legit Check Guide: Spotting Fake Air Jordan 1s in 2026',
    excerpt: 'Inside our authentication laboratory: how we detect high-tier replicas using UV inspection, stitching gauges, and box typography.',
    content: `With counterfeit sneaker factories adopting 3D laser-scanned molds and premium synthetic leathers, differentiating authentic retail Air Jordan 1s from "super reps" requires scientific precision.

### 1. The Hourglass Heel Shape
When viewed directly from behind, an authentic Air Jordan 1 features a distinct hourglass silhouette that pinches at the ankle and flares outward at the heel cup. Replicas frequently appear boxy or cylindrical.

### 2. The Wings Logo Debossing & Sheen
On genuine pairs, the Air Jordan Wings logo is deeply debossed with crisp, razor-sharp lettering. The letters 'R' and 'D' must connect seamlessly at the bottom. Replicas often exhibit sloppy stamping or incorrect matte finishes.

### 3. Blacklight (UV) Verification
Under 365nm UV light, replica pairs frequently reveal glowing invisible guide markings from the factory cutting process. Authentic Nike retail production employs strict UV inspection to ensure no chalk or glue residue remains visible.`,
    category: 'Authentication Lab',
    coverImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
    author: {
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'Head of Authenticity',
    },
    publishedAt: 'October 2, 2026',
    readTimeMinutes: 6,
    tags: ['Sneakers', 'Authentication', 'Legit Check', 'Air Jordan'],
    status: 'published',
  },
  {
    id: 'blog-02',
    slug: 'travis-scott-sneaker-legacy',
    title: 'How Travis Scott Redefined the Modern Sneaker Collab Landscape',
    excerpt: 'From backwards Swooshes to earthy earth-tone palettes: dissecting the cultural phenomenon of Cactus Jack footwear.',
    content: `Since the 2019 debut of the Air Jordan 1 High OG with its subversive backward Swoosh, Travis Scott has cemented himself as the most commercially impactful footwear collaborator of the modern streetwear era.

### The Backward Swoosh Signature
Flipping Nike's most sacred intellectual property was previously unheard of. Cactus Jack turned an intentional design rebellion into one of the most recognizable cultural motifs in sneaker history.

### Nuanced Materials & Color Stories
From mocha suedes to sail overlays and vibrant crimson accents, Scott's releases celebrate utilitarian vintage workwear aesthetics that harmonize effortlessly with contemporary oversized fits.`,
    category: 'Culture & Grails',
    coverImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80',
    author: {
      name: 'Chloe Vaughn',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      role: 'Fashion & Culture Editor',
    },
    publishedAt: 'September 28, 2026',
    readTimeMinutes: 7,
    tags: ['Travis Scott', 'Culture', 'Nike', 'Hype'],
    status: 'published',
  },
  {
    id: 'blog-03',
    slug: 'streetwear-sizing-guide-2026',
    title: 'Streetwear Sizing 101: True to Size vs. Oversized Fit Guide for 2026',
    excerpt: 'A complete breakdown of hoodie, tee, and sneaker fit profiles across Supreme, Fear of God Essentials, Stussy, and Nike.',
    content: `Navigating streetwear fits can be confusing: while some brands design tailored cuts, others embrace dropped shoulders, boxy chests, and heavyweight draping.

### 1. Fear of God Essentials
- **Cut**: Heavily oversized with elongated sleeves and relaxed torso.
- **Recommendation**: Size down one full size for a classic relaxed fit. Keep your usual size only if you prefer an exaggerated streetwear drape.

### 2. Supreme Box Logo Hoodies
- **Cut**: Heavyweight 450 GSM crossgrain fleece with structured ribbing.
- **Recommendation**: Fits true to size with a comfortable boxy chest. For a relaxed skate fit, consider sizing up one size.

### 3. Nike Dunks & Jordan 1s
- **Cut**: Standard medium width.
- **Recommendation**: Stay true to size (TTS). Half-size up if you prefer wearing thick crew socks or have wider feet.`,
    category: 'Style & Guides',
    coverImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80',
    author: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
      role: 'Senior Stylist',
    },
    publishedAt: 'September 20, 2026',
    readTimeMinutes: 5,
    tags: ['Sizing', 'Styling', 'Streetwear', 'Essentials'],
    status: 'published',
  },
];

export const SEED_PROMOTIONS: PromotionRecord[] = [
  {
    id: 'promo-01',
    code: 'STREET10',
    type: 'percentage',
    value: 10,
    minSpend: 100,
    description: '10% drop discount on orders over $100',
    usageCount: 142,
    usageLimit: 1000,
    startDate: '2026-01-01T00:00:00Z',
    endDate: '2026-12-31T23:59:59Z',
    isActive: true,
  },
  {
    id: 'promo-02',
    code: 'HYPE20',
    type: 'percentage',
    value: 20,
    minSpend: 250,
    description: '20% collector reward for hype drop orders exceeding $250',
    usageCount: 89,
    usageLimit: 500,
    startDate: '2026-03-01T00:00:00Z',
    endDate: '2026-12-31T23:59:59Z',
    isActive: true,
  },
  {
    id: 'promo-03',
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 25,
    minSpend: 150,
    description: 'Complimentary priority express transit on orders over $150',
    usageCount: 204,
    startDate: '2026-01-01T00:00:00Z',
    endDate: '2026-12-31T23:59:59Z',
    isActive: true,
  },
];

export const SEED_INQUIRIES: ContactInquiryRecord[] = [
  {
    id: 'inq-01',
    name: 'Helena Vance',
    email: 'helena.vance@streetfits.com',
    phone: '+1 415 555 0192',
    subject: 'Jordan 1 Chicago Lost & Found Legit Check Certificate',
    message: 'Could you please confirm whether the physical UV verification paperwork is included in the shoe box for order STRIDE-2026-9042?',
    status: 'new',
    createdAt: '2026-10-03T14:20:00Z',
  },
  {
    id: 'inq-02',
    name: 'Laurent Mercier',
    email: 'l.mercier@parissneakers.fr',
    subject: 'VIP Grail Sourcing Request — Travis Scott Fragment Low',
    message: 'Requesting concierge assistance to source a deadstock pair of Travis Scott x Fragment Jordan 1 Lows in US Size 10 with verified provenance.',
    status: 'in_progress',
    createdAt: '2026-10-02T11:00:00Z',
  },
];

export const SEED_SUBSCRIBERS: NewsletterSubscriberRecord[] = [
  {
    id: 'sub-01',
    email: 'marcus.vance@streetwear.io',
    source: 'Footer Bar',
    subscribedAt: '2026-09-15T08:30:00Z',
    welcomeCouponIssued: 'STREET10',
  },
  {
    id: 'sub-02',
    email: 'elena.rostova@hypemag.com',
    source: 'Drop Modal',
    subscribedAt: '2026-09-22T16:45:00Z',
    welcomeCouponIssued: 'STREET10',
  },
];
