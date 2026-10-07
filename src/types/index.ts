export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order' | 'backorder';

export type ProductBadge = 'New' | 'New Drop' | 'Sale' | 'Best Seller' | 'Limited Stock' | 'Pre-order' | 'Trending';

export interface ProductVariantOption {
  name: string; // e.g. "Color", "Size"
  values: string[]; // e.g. ["Midnight Black", "Titanium Silver"], ["S", "M", "L", "XL"]
}

export interface ProductVariant {
  id: string;
  sku: string;
  barcode?: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string;
  selectedOptions: { [key: string]: string }; // { "Color": "Midnight Black", "Size": "M" }
}

export interface ProductSpecification {
  group?: string;
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  images?: string[];
}

export interface ProductQA {
  id: string;
  productId: string;
  question: string;
  askedBy: string;
  date: string;
  answer?: string;
  answeredBy?: string;
  answeredDate?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  tags: string[];
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  stockStatus: StockStatus;
  lowStockThreshold?: number;
  badges: ProductBadge[];
  rating: number;
  reviewCount: number;
  images: string[];
  thumbnail: string;
  shortDescription: string;
  description: string;
  options: ProductVariantOption[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  weightKg?: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  dealOfTheDay?: boolean;
  frequentlyBoughtTogetherIds?: string[];
  relatedProductIds?: string[];
  upsellProductIds?: string[];
  warrantyInfo?: string;
  returnPolicy?: string;
  materials?: string[];
  careInstructions?: string[];
  wholesalePriceTiers?: { minQty: number; price: number }[];
  type?: 'simple' | 'variable' | 'bundle' | 'digital' | 'subscription' | 'gift_card' | 'service';
  digitalFileUrl?: string;
  subscriptionInterval?: 'monthly' | 'quarterly' | 'annual';
  videoUrl?: string;
  arModelUrl?: string;
  view360Urls?: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  icon?: string;
  itemCount: number;
  isFeatured?: boolean;
  subcategories?: { id: string; name: string; slug: string; itemCount: number }[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
  productCount: number;
  isFeatured?: boolean;
}

export interface CartItem {
  id: string; // unique item id (composite: productId + variantId)
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxStock: number;
  selectedOptions?: { [key: string]: string };
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  maxDiscount?: number;
  description: string;
}

export interface Currency {
  code: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  symbol: string;
  rate: number; // multiplier relative to USD
  name: string;
}

export interface Language {
  code: 'en' | 'es' | 'fr' | 'de';
  name: string;
  flag: string;
}

export interface BlogPost {
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
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  rating: number;
  quote: string;
  verifiedBuyer: boolean;
  productPurchased?: string;
}

export interface SocialPost {
  id: string;
  username: string;
  handle: string;
  userAvatar: string;
  image: string;
  likes: number;
  caption: string;
  taggedProductId?: string;
}

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl: string;
  tagline: string;
  stats?: { label: string; value: string }[];
}

export interface FilterState {
  category: string;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  colors: string[];
  sizes: string[];
  minRating: number;
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest' | 'rating' | 'discount';
}

export interface Address {
  id: string;
  title: string; // e.g. "Home", "Office", "Studio"
  recipientName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  storeCredit: number;
  referralCode: string;
  addresses: Address[];
  createdAt: string;
}

