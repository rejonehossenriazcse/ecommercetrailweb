export type UserRole =
  | 'super_admin'
  | 'store_manager'
  | 'content_editor'
  | 'support_agent'
  | 'warehouse_staff'
  | 'marketing_manager'
  | 'customer';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogRecord {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string; // e.g. "PRODUCT_UPDATE", "STOCK_ADJUSTMENT", "COUPON_CREATED", "SETTINGS_SAVED"
  entity: string; // e.g. "Product", "Inventory", "Order", "Settings"
  entityId?: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface WarehouseRecord {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  isDefault: boolean;
  totalCapacity: number;
}

export interface WarehouseStockRecord {
  id: string;
  warehouseId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  reserved: number; // In active carts or pending payment
  available: number; // quantity - reserved
}

export interface StockMovementRecord {
  id: string;
  productId: string;
  variantId?: string;
  warehouseId: string;
  changeQuantity: number;
  newQuantity: number;
  reason: 'PURCHASE_RECEIPT' | 'ORDER_FULFILLMENT' | 'CUSTOMER_RETURN' | 'MANUAL_ADJUSTMENT' | 'DAMAGED';
  referenceId?: string;
  performedBy: string;
  timestamp: string;
}

export interface OrderItemRecord {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
  selectedOptions?: { [key: string]: string };
}

export interface OrderRecord {
  id: string;
  orderNumber: string; // e.g. "AUR-2026-9042"
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  paymentMethod: string; // "Stripe", "PayPal", "Apple Pay", "COD"
  fulfillmentStatus: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled';
  currency: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  trackingNumber?: string;
  carrier?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItemRecord[];
  returnStatus?: 'none' | 'requested' | 'approved' | 'rejected' | 'completed';
  returnReason?: string;
  customerNotes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CMSSectionRecord {
  id: string;
  page: 'home' | 'about' | 'lookbook';
  type:
    | 'hero_slider'
    | 'featured_categories'
    | 'flash_sale'
    | 'product_grid'
    | 'deal_of_the_day'
    | 'promotional_banners'
    | 'brand_showcase'
    | 'testimonials'
    | 'social_gallery'
    | 'blog_section'
    | 'app_download';
  title: string;
  subtitle?: string;
  order: number;
  isEnabled: boolean;
  settings: Record<string, any>;
}

export interface HeaderNavLink {
  id: string;
  label: string;
  url: string;
  isMegaMenu?: boolean;
  badge?: string;
  isEnabled: boolean;
}

export interface HeaderSettings {
  logoText: string;
  logoSubtitle: string;
  logoImageUrl: string;
  faviconUrl: string;
  layout: 'standard' | 'centered' | 'minimal';
  stickyHeader: boolean;
  announcementText: string;
  announcementCoupon: string;
  announcementLink: string;
  announcementBgColor: string;
  announcementEnabled: boolean;
  showSearch: boolean;
  showAccount: boolean;
  showWishlist: boolean;
  showCart: boolean;
  showCurrencySelector: boolean;
  showLanguageSelector: boolean;
  ctaButtonText: string;
  ctaButtonLink: string;
  ctaButtonEnabled: boolean;
  navLinks: HeaderNavLink[];
}

export interface FooterColumnLink {
  label: string;
  url: string;
  badge?: string;
}

export interface FooterColumn {
  title: string;
  links: FooterColumnLink[];
}

export interface FooterSocialLink {
  platform: string;
  url: string;
  isEnabled: boolean;
}

export interface FooterSettings {
  layout: 'five_columns' | 'four_columns' | 'minimal';
  brandName: string;
  brandDescription: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterEnabled: boolean;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  copyrightText: string;
  socialLinks: FooterSocialLink[];
  paymentBadges: string[];
  columns: FooterColumn[];
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  twitterHandle: string;
  robotsDirective: string;
  sitemapUrl: string;
}

export interface SystemSettingsRecord {
  general: {
    storeName: string;
    supportEmail: string;
    contactPhone: string;
    defaultCurrency: string;
    defaultLanguage: string;
    taxRatePercent: number;
    freeShippingThreshold: number;
    announcementText?: string;
    announcementCoupon?: string;
    announcementEnabled?: boolean;
  };
  header?: HeaderSettings;
  footer?: FooterSettings;
  seo?: SEOSettings;
  superAdmin: {
    email: string;
    updatedAt: string;
  };
  payments: {
    stripeEnabled: boolean;
    stripePublishableKey: string;
    stripeSecretKeyConfigured: boolean;
    paypalEnabled: boolean;
    paypalClientId: string;
    applePayEnabled: boolean;
    googlePayEnabled: boolean;
    codEnabled: boolean;
  };
  tracking: {
    metaPixelId: string;
    conversionsApiTokenConfigured: boolean;
    ga4MeasurementId: string;
    gtmContainerId: string;
    tiktokPixelId: string;
    serverSideTaggingEnabled: boolean;
  };
  shipping: {
    standardRate: number;
    expressRate: number;
    carriers: string[];
    allowedCountries: string[];
  };
}

export interface CustomerRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  storeCredit: number;
  status: 'active' | 'suspended';
  defaultShippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: string;
}

export interface MediaAssetRecord {
  id: string;
  name: string;
  url: string;
  folder: 'Products' | 'Banners' | 'Editorial' | 'Lookbook' | 'Brand';
  sizeBytes: number;
  mimeType: string;
  dimensions?: string;
  altText: string;
  usageCount: number;
  uploadedAt: string;
}

export interface ReviewRecord {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CustomPageRecord {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  category: 'company' | 'policy' | 'campaign' | 'support';
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  status: 'published' | 'draft';
  updatedAt: string;
}

export interface BlogPostRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  tags: string[];
  status: 'published' | 'draft';
}

export interface PromotionRecord {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  minSpend: number;
  description: string;
  usageCount: number;
  usageLimit?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ContactInquiryRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  orderNumber?: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface NewsletterSubscriberRecord {
  id: string;
  email: string;
  source: string;
  subscribedAt: string;
  welcomeCouponIssued?: string;
}

