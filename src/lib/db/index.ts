import {
  UserRecord,
  OrderRecord,
  WarehouseRecord,
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
import {
  SEED_USERS,
  SEED_WAREHOUSES,
  SEED_ORDERS,
  SEED_CMS_SECTIONS,
  SEED_SETTINGS,
  SEED_AUDIT_LOGS,
  SEED_CUSTOMERS,
  SEED_MEDIA_ASSETS,
  SEED_REVIEWS,
  SEED_PAGES,
  SEED_BLOGS,
  SEED_PROMOTIONS,
  SEED_INQUIRIES,
  SEED_SUBSCRIBERS,
} from './seed';
import { PRODUCTS, CATEGORIES, BRANDS } from '@/data/mockData';
import { Product } from '@/types';

export interface ProductQueryFilters {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  tag?: string;
  badge?: string;
  inStockOnly?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductQueryResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  facets: {
    availableBrands: { name: string; count: number }[];
    availableCategories: { slug: string; name: string; count: number }[];
    minPrice: number;
    maxPrice: number;
  };
}

// Global in-memory singleton state for development and server execution
class DatabaseManager {
  private users: UserRecord[] = [...SEED_USERS];
  private products: Product[] = [...PRODUCTS];
  private categories = [...CATEGORIES];
  private brands = [...BRANDS];
  private orders: OrderRecord[] = [...SEED_ORDERS];
  private warehouses: WarehouseRecord[] = [...SEED_WAREHOUSES];
  private cmsSections: CMSSectionRecord[] = [...SEED_CMS_SECTIONS];
  private settings: SystemSettingsRecord = { ...SEED_SETTINGS };
  private auditLogs: AuditLogRecord[] = [...SEED_AUDIT_LOGS];
  private customers: CustomerRecord[] = [...SEED_CUSTOMERS];
  private mediaAssets: MediaAssetRecord[] = [...SEED_MEDIA_ASSETS];
  private reviews: ReviewRecord[] = [...SEED_REVIEWS];
  private pages: CustomPageRecord[] = [...SEED_PAGES];
  private blogs: BlogPostRecord[] = [...SEED_BLOGS];
  private promotions: PromotionRecord[] = [...SEED_PROMOTIONS];
  private inquiries: ContactInquiryRecord[] = [...SEED_INQUIRIES];
  private subscribers: NewsletterSubscriberRecord[] = [...SEED_SUBSCRIBERS];

  // ================= USERS & AUTH =================
  public async getUsers(): Promise<UserRecord[]> {
    return this.users.map(({ passwordHash, ...rest }) => rest as UserRecord);
  }

  public async getUserByEmail(email: string): Promise<UserRecord | undefined> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public async getUserById(id: string): Promise<UserRecord | undefined> {
    return this.users.find((u) => u.id === id);
  }

  public async updateUserEmail(id: string, newEmail: string, performedBy: string): Promise<boolean> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return false;
    const oldEmail = user.email;
    user.email = newEmail;
    user.updatedAt = new Date().toISOString();
    if (user.role === 'super_admin') {
      this.settings.superAdmin.email = newEmail;
      this.settings.superAdmin.updatedAt = new Date().toISOString();
    }
    await this.addAuditLog(
      id,
      performedBy,
      user.role,
      'USER_EMAIL_UPDATE',
      'User',
      `Changed Super Admin email from ${oldEmail} to ${newEmail}`
    );
    return true;
  }

  public async updateUserPassword(id: string, newPasswordHash: string, performedBy: string): Promise<boolean> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return false;
    user.passwordHash = newPasswordHash;
    user.updatedAt = new Date().toISOString();
    await this.addAuditLog(
      id,
      performedBy,
      user.role,
      'USER_PASSWORD_UPDATE',
      'User',
      'Updated account authentication password'
    );
    return true;
  }

  // ================= PRODUCTS & CATEGORIES =================
  public async getCategories() {
    return this.categories;
  }

  public async getBrands() {
    return this.brands;
  }

  public resetToSeed(): void {
    this.users = [...SEED_USERS];
    this.products = [...PRODUCTS];
    this.categories = [...CATEGORIES];
    this.brands = [...BRANDS];
    this.orders = [...SEED_ORDERS];
    this.warehouses = [...SEED_WAREHOUSES];
    this.cmsSections = [...SEED_CMS_SECTIONS];
    this.settings = { ...SEED_SETTINGS };
    this.auditLogs = [...SEED_AUDIT_LOGS];
    this.customers = [...SEED_CUSTOMERS];
    this.mediaAssets = [...SEED_MEDIA_ASSETS];
    this.reviews = [...SEED_REVIEWS];
    this.pages = [...SEED_PAGES];
    this.blogs = [...SEED_BLOGS];
    this.promotions = [...SEED_PROMOTIONS];
    this.inquiries = [...SEED_INQUIRIES];
    this.subscribers = [...SEED_SUBSCRIBERS];
  }

  public async getProducts(): Promise<Product[]> {
    return this.products;
  }

  public async queryProducts(filters: ProductQueryFilters = {}): Promise<ProductQueryResult> {
    let result = [...this.products];

    // Filter by Category
    if (filters.category && filters.category !== 'all') {
      const cat = filters.category.toLowerCase();
      result = result.filter(
        (p) => p.categorySlug.toLowerCase() === cat || p.category.toLowerCase() === cat
      );
    }

    // Filter by Brand
    if (filters.brand && filters.brand !== 'all') {
      const br = filters.brand.toLowerCase();
      result = result.filter((p) => p.brand.toLowerCase() === br);
    }

    // Filter by Search Query
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Filter by Tag
    if (filters.tag) {
      const tagLower = filters.tag.toLowerCase();
      result = result.filter((p) => p.tags?.some((t) => t.toLowerCase() === tagLower));
    }

    // Filter by Badge
    if (filters.badge) {
      const badgeLower = filters.badge.toLowerCase();
      result = result.filter((p) => p.badges?.some((b) => b.toLowerCase() === badgeLower));
    }

    // Filter by Stock
    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Filter by Price Range
    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    // Extract facets from the filtered set
    const brandCounts: Record<string, number> = {};
    const categoryCounts: Record<string, { name: string; count: number }> = {};
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    for (const p of result) {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      if (!categoryCounts[p.categorySlug]) {
        categoryCounts[p.categorySlug] = { name: p.category, count: 0 };
      }
      categoryCounts[p.categorySlug].count++;
      if (p.price < minPrice) minPrice = p.price;
      if (p.price > maxPrice) maxPrice = p.price;
    }

    const availableBrands = Object.entries(brandCounts).map(([name, count]) => ({ name, count }));
    const availableCategories = Object.entries(categoryCounts).map(([slug, data]) => ({
      slug,
      name: data.name,
      count: data.count,
    }));

    // Sorting
    const sort = filters.sort || 'newest';
    if (sort === 'price-low' || sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high' || sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount') {
      result.sort((a, b) => {
        const discA = a.compareAtPrice ? a.compareAtPrice - a.price : 0;
        const discB = b.compareAtPrice ? b.compareAtPrice - b.price : 0;
        return discB - discA;
      });
    } else if (sort === 'popular' || sort === 'trending') {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      // Default: newest
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    // Pagination
    const total = result.length;
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, Math.min(100, filters.limit || 24));
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = result.slice(startIndex, startIndex + limit);

    return {
      products: paginatedProducts,
      total,
      page,
      limit,
      totalPages,
      facets: {
        availableBrands,
        availableCategories,
        minPrice: minPrice === Infinity ? 0 : minPrice,
        maxPrice: maxPrice === -Infinity ? 0 : maxPrice,
      },
    };
  }

  public async getProductBySlug(slug: string): Promise<Product | undefined> {
    return this.products.find((p) => p.slug === slug);
  }

  public async getProductById(id: string): Promise<Product | undefined> {
    return this.products.find((p) => p.id === id);
  }

  public async createProduct(product: Product, performedBy: string): Promise<Product> {
    this.products.unshift(product);
    await this.addAuditLog(
      'admin',
      performedBy,
      'super_admin',
      'PRODUCT_CREATED',
      'Product',
      `Created product: ${product.name} (SKU: ${product.sku})`
    );
    return product;
  }

  public async updateProduct(id: string, updates: Partial<Product>, performedBy: string): Promise<Product | null> {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates };
    await this.addAuditLog(
      'admin',
      performedBy,
      'super_admin',
      'PRODUCT_UPDATED',
      'Product',
      `Updated product: ${this.products[idx].name} (ID: ${id})`
    );
    return this.products[idx];
  }

  public async deleteProduct(id: string, performedBy: string): Promise<boolean> {
    const product = this.products.find((p) => p.id === id);
    if (!product) return false;
    this.products = this.products.filter((p) => p.id !== id);
    await this.addAuditLog(
      'admin',
      performedBy,
      'super_admin',
      'PRODUCT_DELETED',
      'Product',
      `Deleted product: ${product.name} (SKU: ${product.sku})`
    );
    return true;
  }

  // ================= ORDERS =================
  public async getOrders(): Promise<OrderRecord[]> {
    return this.orders;
  }

  public async createOrder(order: OrderRecord): Promise<OrderRecord> {
    this.orders.unshift(order);
    return order;
  }

  public async getOrderById(id: string): Promise<OrderRecord | undefined> {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public async updateOrderStatus(
    orderId: string,
    status: OrderRecord['status'],
    fulfillmentStatus: OrderRecord['fulfillmentStatus'],
    carrier: string | undefined,
    trackingNumber: string | undefined,
    performedBy: string
  ): Promise<OrderRecord | null> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;
    const oldStatus = order.status;
    order.status = status;
    order.fulfillmentStatus = fulfillmentStatus;
    if (carrier) order.carrier = carrier;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();

    await this.addAuditLog(
      'admin',
      performedBy,
      'store_manager',
      'ORDER_STATUS_UPDATE',
      'Order',
      `Order ${order.orderNumber} status changed from ${oldStatus} to ${status}`
    );
    return order;
  }

  public async processRefund(
    orderId: string,
    amount: number,
    reason: string,
    restock: boolean = true,
    performedBy: string = 'Executive Admin'
  ): Promise<OrderRecord | null> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;
    const isFull = amount >= order.total;
    order.paymentStatus = isFull ? 'refunded' : 'partially_refunded';
    if (isFull) {
      order.status = 'refunded';
    }
    order.internalNotes = `${order.internalNotes || ''} | ${isFull ? 'Full' : 'Partial'} Refund $${amount.toFixed(2)}: ${reason}`;
    order.updatedAt = new Date().toISOString();

    if (restock) {
      order.items.forEach((item) => {
        const prod = this.products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stock += item.quantity;
          if (prod.stock > 5) prod.stockStatus = 'in_stock';
          else if (prod.stock > 0) prod.stockStatus = 'low_stock';
        }
      });
    }

    await this.addAuditLog(
      'admin',
      performedBy,
      'super_admin',
      'ORDER_REFUND',
      'Order',
      `Processed ${isFull ? 'full' : 'partial'} refund of $${amount.toFixed(2)} for order ${order.orderNumber}. Restock: ${restock ? 'YES' : 'NO'}. Reason: ${reason}`
    );
    return order;
  }

  public async cancelOrder(
    orderId: string,
    reason: string,
    performedBy: string = 'Executive Admin'
  ): Promise<OrderRecord | null> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;
    order.status = 'cancelled';
    order.internalNotes = `${order.internalNotes || ''} | Cancelled: ${reason}`;
    order.updatedAt = new Date().toISOString();

    // Restock all items
    order.items.forEach((item) => {
      const prod = this.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock += item.quantity;
        if (prod.stock > 5) prod.stockStatus = 'in_stock';
        else if (prod.stock > 0) prod.stockStatus = 'low_stock';
      }
    });

    await this.addAuditLog(
      'admin',
      performedBy,
      'super_admin',
      'ORDER_CANCEL',
      'Order',
      `Cancelled order ${order.orderNumber}. Inventory restored to stock. Reason: ${reason}`
    );
    return order;
  }

  public async updateReturnStatus(
    orderId: string,
    returnStatus: 'requested' | 'approved' | 'rejected' | 'completed',
    reason: string,
    performedBy: string = 'Executive Admin'
  ): Promise<OrderRecord | null> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;
    order.returnStatus = returnStatus;
    if (reason) order.returnReason = reason;
    order.updatedAt = new Date().toISOString();

    if (returnStatus === 'approved') {
      order.paymentStatus = 'refunded';
      order.status = 'refunded';
      // Restock items
      order.items.forEach((item) => {
        const prod = this.products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stock += item.quantity;
          if (prod.stock > 5) prod.stockStatus = 'in_stock';
          else if (prod.stock > 0) prod.stockStatus = 'low_stock';
        }
      });
    }

    await this.addAuditLog(
      'admin',
      performedBy,
      'super_admin',
      'RETURN_RMA_UPDATE',
      'Order',
      `RMA Return for order ${order.orderNumber} set to ${returnStatus}. Note: ${reason}`
    );
    return order;
  }

  // ================= INVENTORY & WAREHOUSES =================
  public async getWarehouses(): Promise<WarehouseRecord[]> {
    return this.warehouses;
  }

  public async adjustStock(
    productId: string,
    changeQty: number,
    reason: string,
    performedBy: string
  ): Promise<Product | null> {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return null;
    const oldStock = product.stock;
    product.stock = Math.max(0, product.stock + changeQty);
    if (product.stock === 0) product.stockStatus = 'out_of_stock';
    else if (product.stock <= 5) product.stockStatus = 'low_stock';
    else product.stockStatus = 'in_stock';

    await this.addAuditLog(
      'admin',
      performedBy,
      'warehouse_staff',
      'STOCK_ADJUSTMENT',
      'Inventory',
      `Adjusted ${product.name} stock: ${oldStock} -> ${product.stock} (${changeQty > 0 ? '+' : ''}${changeQty}). Reason: ${reason}`
    );
    return product;
  }

  // ================= CMS SECTIONS =================
  public async getCMSSections(page: string = 'home'): Promise<CMSSectionRecord[]> {
    if (!this.cmsSections || this.cmsSections.length === 0) {
      this.cmsSections = JSON.parse(JSON.stringify(SEED_CMS_SECTIONS));
    } else {
      // Ensure seed defaults (e.g. streetwear copy, hero ads, badges) are available
      this.cmsSections = this.cmsSections.map((sec) => {
        const seedSec = SEED_CMS_SECTIONS.find((s) => s.id === sec.id);
        if (seedSec) {
          return {
            ...sec,
            title: sec.title || seedSec.title,
            subtitle: sec.subtitle || seedSec.subtitle,
            settings: {
              ...seedSec.settings,
              ...sec.settings,
            },
          };
        }
        return sec;
      });
    }

    return this.cmsSections
      .filter((s) => !page || s.page === page)
      .sort((a, b) => a.order - b.order);
  }

  public async resetCMSSections(performedBy: string): Promise<CMSSectionRecord[]> {
    this.cmsSections = JSON.parse(JSON.stringify(SEED_CMS_SECTIONS));
    await this.addAuditLog(
      'admin',
      performedBy,
      'content_editor',
      'CMS_RESET_DEFAULTS',
      'CMS',
      'Reset homepage CMS sections to factory default Stride District streetwear layout'
    );
    return this.cmsSections;
  }

  public async updateCMSSections(sections: CMSSectionRecord[], performedBy: string): Promise<CMSSectionRecord[]> {
    this.cmsSections = sections;
    await this.addAuditLog(
      'admin',
      performedBy,
      'content_editor',
      'CMS_PAGE_BUILDER_UPDATE',
      'CMS',
      'Reordered and updated homepage CMS layout blocks'
    );
    return this.cmsSections;
  }

  public async toggleCMSSection(sectionId: string, performedBy: string): Promise<CMSSectionRecord | null> {
    const sec = this.cmsSections.find((s) => s.id === sectionId);
    if (!sec) return null;
    sec.isEnabled = !sec.isEnabled;
    await this.addAuditLog(
      'admin',
      performedBy,
      'content_editor',
      'CMS_SECTION_TOGGLE',
      'CMS',
      `Toggled section ${sec.title} -> ${sec.isEnabled ? 'Enabled' : 'Disabled'}`
    );
    return sec;
  }

  // ================= CUSTOMERS & CRM =================
  public async getCustomers(): Promise<CustomerRecord[]> {
    return this.customers;
  }

  public async createCustomer(
    customer: Omit<CustomerRecord, "totalOrders" | "totalSpent" | "loyaltyPoints" | "storeCredit" | "createdAt" | "status" | "tier" | "addresses">,
    actor: string
  ): Promise<CustomerRecord> {
    const newCustomer: CustomerRecord = {
      ...customer,
      userId: customer.id, // Or however you map it
      status: 'active',
      tier: 'Bronze',
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      storeCredit: 0,
      addresses: [],
      createdAt: new Date().toISOString(),
      defaultShippingAddress: {
        id: 'addr-temp',
        title: 'Home',
        recipientName: customer.name,
        street: '123 Test St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
        phone: customer.phone || '',
        isDefaultShipping: true,
        isDefaultBilling: true,
      },
      defaultBillingAddress: {
        id: 'addr-temp-2',
        title: 'Home',
        recipientName: customer.name,
        street: '123 Test St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
        phone: customer.phone || '',
        isDefaultShipping: true,
        isDefaultBilling: true,
      }
    };
    this.customers.push(newCustomer);
    
    await this.logAudit(
      'CUSTOMER_REGISTER',
      'Customer',
      `Registered new customer ${newCustomer.email}`,
      actor
    );
    return newCustomer;
  }

  public async getCustomerById(id: string): Promise<CustomerRecord | undefined> {
    return this.customers.find((c) => c.id === id || c.userId === id);
  }

  public async updateCustomer(
    id: string,
    updates: Partial<CustomerRecord>,
    performedBy: string
  ): Promise<CustomerRecord | null> {
    const idx = this.customers.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.customers[idx] = { ...this.customers[idx], ...updates };
    await this.addAuditLog(
      'admin',
      performedBy,
      'store_manager',
      'CUSTOMER_ACCOUNT_UPDATE',
      'Customer',
      `Updated customer ${this.customers[idx].name} profile or balances`
    );
    return this.customers[idx];
  }

  // ================= MEDIA LIBRARY =================
  public async getMediaAssets(folder?: string): Promise<MediaAssetRecord[]> {
    if (!folder || folder === 'All') return this.mediaAssets;
    return this.mediaAssets.filter((a) => a.folder.toLowerCase() === folder.toLowerCase());
  }

  public async addMediaAsset(asset: MediaAssetRecord, performedBy: string): Promise<MediaAssetRecord> {
    this.mediaAssets.unshift(asset);
    await this.addAuditLog(
      'admin',
      performedBy,
      'content_editor',
      'MEDIA_ASSET_UPLOAD',
      'Media',
      `Uploaded asset: ${asset.name} (${asset.folder})`
    );
    return asset;
  }

  public async deleteMediaAsset(id: string, performedBy: string): Promise<boolean> {
    const idx = this.mediaAssets.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    const removed = this.mediaAssets.splice(idx, 1)[0];
    await this.addAuditLog(
      'admin',
      performedBy,
      'content_editor',
      'MEDIA_ASSET_DELETE',
      'Media',
      `Deleted media asset: ${removed.name}`
    );
    return true;
  }

  // ================= PRODUCT REVIEWS =================
  public async getReviews(status?: string, productId?: string): Promise<ReviewRecord[]> {
    return this.reviews.filter((r) => {
      const matchesStatus = !status || status === 'all' || r.status === status;
      const matchesProduct = !productId || r.productId === productId;
      return matchesStatus && matchesProduct;
    });
  }

  public async updateReviewStatus(
    id: string,
    status: 'approved' | 'rejected',
    performedBy: string
  ): Promise<ReviewRecord | null> {
    const review = this.reviews.find((r) => r.id === id);
    if (!review) return null;
    review.status = status;
    await this.addAuditLog(
      'admin',
      performedBy,
      'content_editor',
      'REVIEW_MODERATION',
      'Review',
      `Moderated review for ${review.productName} -> ${status.toUpperCase()}`
    );
    return review;
  }

  public async addReview(review: ReviewRecord): Promise<ReviewRecord> {
    this.reviews.unshift(review);
    return review;
  }

  // ================= SETTINGS =================
  public async getSettings(): Promise<SystemSettingsRecord> {
    return this.settings;
  }

  public async updateSettings(updates: Partial<SystemSettingsRecord>, performedBy: string): Promise<SystemSettingsRecord> {
    this.settings = { ...this.settings, ...updates };
    await this.addAuditLog(
      'admin',
      performedBy,
      'super_admin',
      'SETTINGS_UPDATED',
      'Settings',
      'Updated platform configuration, payment gateways, or tracking pixels'
    );
    return this.settings;
  }

  // ================= AUDIT LOGS =================
  public async getAuditLogs(): Promise<AuditLogRecord[]> {
    return this.auditLogs.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public async addAuditLog(
    userId: string,
    userName: string,
    role: any,
    action: string,
    entity: string,
    details: string,
    ipAddress?: string
  ): Promise<AuditLogRecord> {
    const record: AuditLogRecord = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      userName,
      role,
      action,
      entity,
      details,
      ipAddress: ipAddress || '127.0.0.1',
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(record);
    return record;
  }

  // ================= CUSTOM PAGES & CMS =================
  public async getPages(): Promise<CustomPageRecord[]> {
    return this.pages;
  }

  public async getPageBySlug(slug: string): Promise<CustomPageRecord | undefined> {
    return this.pages.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  }

  public async createPage(data: Omit<CustomPageRecord, 'id' | 'updatedAt'>, performedBy: string): Promise<CustomPageRecord> {
    const newPage: CustomPageRecord = {
      ...data,
      id: `page-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    this.pages.push(newPage);
    await this.addAuditLog('admin', performedBy, 'content_editor', 'PAGE_CREATE', 'Page', `Created custom page "${newPage.title}" (${newPage.slug})`);
    return newPage;
  }

  public async updatePage(id: string, updates: Partial<CustomPageRecord>, performedBy: string): Promise<CustomPageRecord | null> {
    const page = this.pages.find((p) => p.id === id || p.slug === id);
    if (!page) return null;
    Object.assign(page, updates, { updatedAt: new Date().toISOString() });
    await this.addAuditLog('admin', performedBy, 'content_editor', 'PAGE_UPDATE', 'Page', `Updated custom page "${page.title}" (${page.slug})`);
    return page;
  }

  public async deletePage(id: string, performedBy: string): Promise<boolean> {
    const idx = this.pages.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    const removed = this.pages.splice(idx, 1)[0];
    await this.addAuditLog('admin', performedBy, 'content_editor', 'PAGE_DELETE', 'Page', `Deleted custom page "${removed.title}" (${removed.slug})`);
    return true;
  }

  // ================= BLOGS & EDITORIAL DISPATCHES =================
  public async getBlogs(): Promise<BlogPostRecord[]> {
    return this.blogs;
  }

  public async getBlogBySlug(slug: string): Promise<BlogPostRecord | undefined> {
    return this.blogs.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
  }

  public async createBlog(data: Omit<BlogPostRecord, 'id'>, performedBy: string): Promise<BlogPostRecord> {
    const newBlog: BlogPostRecord = {
      ...data,
      id: `blog-${Date.now()}`,
    };
    this.blogs.unshift(newBlog);
    await this.addAuditLog('admin', performedBy, 'content_editor', 'BLOG_CREATE', 'Blog', `Published dispatch "${newBlog.title}"`);
    return newBlog;
  }

  public async updateBlog(id: string, updates: Partial<BlogPostRecord>, performedBy: string): Promise<BlogPostRecord | null> {
    const blog = this.blogs.find((b) => b.id === id || b.slug === id);
    if (!blog) return null;
    Object.assign(blog, updates);
    await this.addAuditLog('admin', performedBy, 'content_editor', 'BLOG_UPDATE', 'Blog', `Updated dispatch "${blog.title}"`);
    return blog;
  }

  public async deleteBlog(id: string, performedBy: string): Promise<boolean> {
    const idx = this.blogs.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    const removed = this.blogs.splice(idx, 1)[0];
    await this.addAuditLog('admin', performedBy, 'content_editor', 'BLOG_DELETE', 'Blog', `Deleted dispatch "${removed.title}"`);
    return true;
  }

  // ================= PROMOTIONS & MARKETING =================
  public async getPromotions(): Promise<PromotionRecord[]> {
    return this.promotions;
  }

  public async getPromotionByCode(code: string): Promise<PromotionRecord | undefined> {
    return this.promotions.find((p) => p.code.toUpperCase() === code.toUpperCase() && p.isActive);
  }

  public async createPromotion(data: Omit<PromotionRecord, 'id' | 'usageCount'>, performedBy: string): Promise<PromotionRecord> {
    const newPromo: PromotionRecord = {
      ...data,
      id: `promo-${Date.now()}`,
      code: data.code.toUpperCase(),
      usageCount: 0,
    };
    this.promotions.unshift(newPromo);
    await this.addAuditLog('admin', performedBy, 'store_manager', 'PROMO_CREATE', 'Promotion', `Created promotion code ${newPromo.code} (${newPromo.type})`);
    return newPromo;
  }

  public async deletePromotion(id: string, performedBy: string): Promise<boolean> {
    const idx = this.promotions.findIndex((p) => p.id === id || p.code === id);
    if (idx === -1) return false;
    const removed = this.promotions.splice(idx, 1)[0];
    await this.addAuditLog('admin', performedBy, 'store_manager', 'PROMO_DELETE', 'Promotion', `Removed promotion ${removed.code}`);
    return true;
  }

  // ================= CONCIERGE INQUIRIES & ENGAGEMENT =================
  public async getInquiries(): Promise<ContactInquiryRecord[]> {
    return this.inquiries;
  }

  public async createInquiry(data: Omit<ContactInquiryRecord, 'id' | 'createdAt' | 'status'>): Promise<ContactInquiryRecord> {
    const inquiry: ContactInquiryRecord = {
      ...data,
      id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    this.inquiries.unshift(inquiry);
    return inquiry;
  }

  public async updateInquiryStatus(id: string, status: ContactInquiryRecord['status'], performedBy: string): Promise<ContactInquiryRecord | null> {
    const inquiry = this.inquiries.find((i) => i.id === id);
    if (!inquiry) return null;
    inquiry.status = status;
    await this.addAuditLog('admin', performedBy, 'store_manager', 'INQUIRY_STATUS', 'Inquiry', `Inquiry ${inquiry.id} set to ${status}`);
    return inquiry;
  }

  // ================= NEWSLETTER SUBSCRIBERS =================
  public async getSubscribers(): Promise<NewsletterSubscriberRecord[]> {
    return this.subscribers;
  }

  public async addSubscriber(email: string, source: string = 'Storefront'): Promise<{ success: boolean; message: string; couponCode?: string }> {
    const existing = this.subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: true, message: 'You are already registered for Stride District drop alerts.', couponCode: 'STREET10' };
    }
    const newSub: NewsletterSubscriberRecord = {
      id: `sub-${Date.now()}`,
      email: email.toLowerCase(),
      source,
      subscribedAt: new Date().toISOString(),
      welcomeCouponIssued: 'STREET10',
    };
    this.subscribers.unshift(newSub);
    return { success: true, message: 'Welcome to Stride District. Your 10% privilege code is STREET10', couponCode: 'STREET10' };
  }

  // ================= ANALYTICS OVERVIEW =================
  public async getAnalyticsOverview() {
    const totalRevenue = this.orders.reduce((sum, o) => (o.paymentStatus === 'paid' ? sum + o.total : sum), 0);
    const orderCount = this.orders.length;
    const aov = orderCount > 0 ? totalRevenue / orderCount : 0;
    const conversionRate = 3.84; // %
    const customerCount = 1420;

    const lowStockProducts = this.products.filter((p) => p.stock <= 10);
    const topSellingProducts = this.products.slice(0, 4);

    const revenueByDate = [
      { date: 'Sep 28', revenue: 1420 },
      { date: 'Sep 29', revenue: 2180 },
      { date: 'Sep 30', revenue: 1890 },
      { date: 'Oct 01', revenue: 3200 },
      { date: 'Oct 02', revenue: 2650 },
      { date: 'Oct 03', revenue: 4190 },
      { date: 'Oct 04', revenue: 1994 },
    ];

    const salesByChannel = [
      { channel: 'Storefront Direct', percentage: 68 },
      { channel: 'Mobile PWA', percentage: 18 },
      { channel: 'Instagram / Social', percentage: 9 },
      { channel: 'B2B / Concierge', percentage: 5 },
    ];

    return {
      totalRevenue,
      orderCount,
      aov,
      conversionRate,
      customerCount,
      lowStockProducts,
      topSellingProducts,
      recentOrders: this.orders.slice(0, 5),
      revenueByDate,
      salesByChannel,
      abandonedCartRate: 21.4,
    };
  }
}

// Global persistence across Next.js dev server reloads
const DB_SEED_VERSION = 'stride-district-v3';
const globalForDb = globalThis as unknown as { dbManager?: DatabaseManager; dbSeedVersion?: string };
if (!globalForDb.dbManager || globalForDb.dbSeedVersion !== DB_SEED_VERSION || typeof (globalForDb.dbManager as any).resetCMSSections !== 'function') {
  globalForDb.dbManager = new DatabaseManager();
  globalForDb.dbSeedVersion = DB_SEED_VERSION;
}
export const db = globalForDb.dbManager;
