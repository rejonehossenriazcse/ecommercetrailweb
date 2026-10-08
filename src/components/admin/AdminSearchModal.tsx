'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  LayoutDashboard,
  Compass,
  Menu as MenuIcon,
  Columns,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Globe,
  Package,
  Layers,
  Star,
  Warehouse,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  description: string;
  href: string;
  icon: any;
  keywords: string[];
}

const SEARCH_INDEX: SearchItem[] = [
  // Website & CMS
  {
    id: 'header-cms',
    title: 'Header & Navigation',
    category: 'Website / CMS',
    description: 'Controls top logo, announcement bar, navigation menus, and search visibility',
    href: '/admin/header',
    icon: MenuIcon,
    keywords: ['header', 'menu', 'logo', 'announcement', 'top bar', 'nav', 'navigation', 'sticky', 'favicon'],
  },
  {
    id: 'footer-cms',
    title: 'Footer Management',
    category: 'Website / CMS',
    description: 'Controls footer links, columns, contact info, social links, and payment icons',
    href: '/admin/footer',
    icon: Columns,
    keywords: ['footer', 'links', 'copyright', 'social', 'address', 'email', 'phone', 'columns', 'contact'],
  },
  {
    id: 'homepage-builder',
    title: 'Homepage Builder',
    category: 'Website / CMS',
    description: 'Reorder, enable/disable, and edit hero slider, category showcase, and deal sections',
    href: '/admin/cms',
    icon: Compass,
    keywords: ['homepage', 'hero', 'banner', 'slider', 'sections', 'builder', 'cms', 'flash sale', 'deal of the day'],
  },
  {
    id: 'custom-pages',
    title: 'Custom Pages',
    category: 'Website / CMS',
    description: 'Manage static pages like About Stride District, Culture, Terms, and Privacy',
    href: '/admin/pages',
    icon: FileText,
    keywords: ['pages', 'about', 'contact', 'terms', 'privacy', 'legal', 'policy', 'custom page'],
  },
  {
    id: 'blog-articles',
    title: 'Blog / Journal Articles',
    category: 'Website / CMS',
    description: 'Create and publish authentication guides, sneaker history, and sizing guides',
    href: '/admin/blog',
    icon: BookOpen,
    keywords: ['blog', 'journal', 'article', 'news', 'posts', 'editorial', 'story', 'legit check'],
  },
  {
    id: 'seo-settings',
    title: 'SEO & Social Cards',
    category: 'Website / CMS',
    description: 'Configure Google meta titles, descriptions, OpenGraph preview cards, and sitemaps',
    href: '/admin/seo',
    icon: Globe,
    keywords: ['seo', 'meta', 'google', 'search', 'opengraph', 'social', 'twitter', 'sitemap', 'keywords'],
  },
  {
    id: 'media-library',
    title: 'Media Library',
    category: 'Website / CMS',
    description: 'Manage product images, campaign assets, and banner photography',
    href: '/admin/media',
    icon: ImageIcon,
    keywords: ['media', 'images', 'photos', 'upload', 'pictures', 'assets', 'library'],
  },

  // Catalog
  {
    id: 'products-list',
    title: 'Products Catalog',
    category: 'Catalog',
    description: 'Add new items, manage pricing, SKUs, product descriptions, and variants',
    href: '/admin/products',
    icon: Package,
    keywords: ['products', 'item', 'goods', 'sku', 'price', 'pricing', 'sneakers', 'hoodies', 'kicks', 'catalog'],
  },
  {
    id: 'categories-list',
    title: 'Product Categories',
    category: 'Catalog',
    description: 'Organize catalog into sneakers, apparel, and streetwear accessories',
    href: '/admin/categories',
    icon: Layers,
    keywords: ['categories', 'category', 'taxonomy', 'sneakers', 'hoodies', 'tees', 'subcategories'],
  },
  {
    id: 'customer-reviews',
    title: 'Product Reviews',
    category: 'Catalog',
    description: 'Moderate customer ratings, approve feedback, and manage verified testimonials',
    href: '/admin/reviews',
    icon: Star,
    keywords: ['reviews', 'ratings', 'feedback', 'stars', 'testimonials', 'moderate'],
  },

  // Inventory
  {
    id: 'inventory-stock',
    title: 'Inventory & Stock Hubs',
    category: 'Inventory',
    description: 'Track multi-hub stock balances, low stock alerts, and warehouse allocations',
    href: '/admin/inventory',
    icon: Warehouse,
    keywords: ['inventory', 'stock', 'warehouse', 'allocation', 'quantity', 'units', 'low stock'],
  },

  // Sales & Orders
  {
    id: 'orders-list',
    title: 'Orders & Fulfillment',
    category: 'Sales & Orders',
    description: 'Review orders, fulfill packages, enter tracking numbers, and process refunds',
    href: '/admin/orders',
    icon: ShoppingBag,
    keywords: ['orders', 'order', 'fulfillment', 'shipment', 'tracking', 'dhl', 'fedex', 'refund', 'invoice'],
  },

  // Customers
  {
    id: 'customers-crm',
    title: 'Customer Accounts & CRM',
    category: 'Customers',
    description: 'View customer dossiers, VIP tiers, contact details, and purchase records',
    href: '/admin/customers',
    icon: Users,
    keywords: ['customers', 'users', 'crm', 'vip', 'patron', 'accounts', 'buyer'],
  },

  // Marketing
  {
    id: 'marketing-discounts',
    title: 'Coupons & Discounts',
    category: 'Marketing',
    description: 'Create promotional voucher codes, percentage discounts, and flash promotions',
    href: '/admin/marketing',
    icon: Tag,
    keywords: ['coupon', 'discount', 'promotion', 'voucher', 'code', 'sale', 'deal', 'STREET10', 'HYPE20'],
  },

  // Settings
  {
    id: 'store-settings',
    title: 'Store Settings & Payments',
    category: 'Settings',
    description: 'Configure store name, currency, Stripe, PayPal, tax rates, and shipping policies',
    href: '/admin/settings',
    icon: Settings,
    keywords: ['settings', 'stripe', 'paypal', 'payment', 'tax', 'shipping', 'currency', 'store name', 'admin email'],
  },

  // Guides
  {
    id: 'owner-guides',
    title: 'Store Owner Guides & Walkthroughs',
    category: 'Help & Onboarding',
    description: 'Step-by-step visual guides for non-technical store managers to run the store',
    href: '/admin/guide',
    icon: HelpCircle,
    keywords: ['help', 'guide', 'tutorial', 'how to', 'onboarding', 'instructions', 'faq', 'support'],
  },
];

interface AdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSearchModal({ isOpen, onClose }: AdminSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setQuery('');
      setSelectedIndex(0);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return SEARCH_INDEX;
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
      );
    });
  }, [query]);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex].href);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#14171d] border border-zinc-300/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-zinc-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search any setting, menu, banner, product, order, or guide..."
            className="flex-1 bg-transparent text-sm text-zinc-900 font-bold placeholder:text-zinc-800 font-semibold font-medium focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-800 font-semibold font-medium hover:text-zinc-900 font-bold p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-semibold border border-zinc-300">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-zinc-200/40">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-zinc-800 font-bold">No admin controls match &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-zinc-800 font-semibold font-medium">
                Try searching for &ldquo;logo&rdquo;, &ldquo;header&rdquo;, &ldquo;footer&rdquo;, &ldquo;banner&rdquo;, &ldquo;stripe&rdquo;, or &ldquo;discounts&rdquo;.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                    isSelected ? 'bg-zinc-100 text-white' : 'text-zinc-700 hover:bg-zinc-850'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected
                          ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                          : 'bg-zinc-100/80 text-zinc-600 border border-zinc-300/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 font-bold truncate">{item.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-zinc-750 text-amber-300/80 border border-zinc-300">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-800 font-semibold truncate mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-amber-400 translate-x-0.5' : 'text-zinc-600'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-3 bg-[#0f1115] border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-800 font-semibold font-medium font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <Link
            href="/admin/guide"
            onClick={onClose}
            className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-sans font-medium"
          >
            <span>Need help? Open Store Owner Guide</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
