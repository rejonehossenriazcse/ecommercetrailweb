'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Menu,
  Columns,
  Package,
  ShoppingBag,
  Warehouse,
  Tag,
  CreditCard,
  Globe,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';

interface GuideItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  steps: string[];
  destinationUrl: string;
  buttonText: string;
  icon: any;
}

const GUIDES: GuideItem[] = [
  {
    id: 'guide-logo',
    title: 'How to change the website logo & branding',
    category: 'Website & Branding',
    summary: 'Update the primary text logo or upload a custom brand mark displayed in the website header.',
    icon: Menu,
    destinationUrl: '/admin/header',
    buttonText: 'Go to Header Settings',
    steps: [
      'Navigate to "Header & Navigation" in the Website Content sidebar section.',
      'Under "Store Logo & Header Layout", locate "Logo Primary Text" and enter your brand name (e.g., STRIDE).',
      'Optional: Enter a subtitle (e.g., DISTRICT) or paste an image URL in "Custom Logo Image URL".',
      'Click the "Save & Publish Header" button at the top right.',
      'Check the live storefront to see your new logo immediately.',
    ],
  },
  {
    id: 'guide-header-menu',
    title: 'How to edit the top header navigation menu',
    category: 'Website & Branding',
    summary: 'Add, rename, reorder, or disable top-level navigation links and mega menu dropdowns.',
    icon: Menu,
    destinationUrl: '/admin/header',
    buttonText: 'Go to Header Menus',
    steps: [
      'Open the "Header & Navigation" page from the sidebar.',
      'Scroll to "Main Navigation Menu Links" on the right side.',
      'Click "Add Menu Item" to create a new link, or click the pencil icon next to an existing item to edit it.',
      'To change the order, use the Up and Down arrow buttons next to each item.',
      'To temporarily hide a menu item without deleting it, click the Eye icon.',
      'Click "Save & Publish Header" to apply your changes to the live site.',
    ],
  },
  {
    id: 'guide-footer',
    title: 'How to edit footer links, contact info & copyright',
    category: 'Website & Branding',
    summary: 'Customize the columns, customer service links, support email, phone, and copyright text.',
    icon: Columns,
    destinationUrl: '/admin/footer',
    buttonText: 'Go to Footer Management',
    steps: [
      'Click "Footer Management" under the Website Content sidebar group.',
      'Under "Footer Navigation Columns", click "Add Link" inside any column (e.g. Catalog, Culture, Concierge, Policies).',
      'Under "Store Contact Details", update your customer support email, phone number, and physical SoHo vault address.',
      'Under "Payment Method Trust Badges", toggle which payment cards (Apple Pay, Visa, Stripe, PayPal) are displayed.',
      'Click "Save & Publish Footer" at the top right to update the website immediately.',
    ],
  },
  {
    id: 'guide-product',
    title: 'How to add and publish a new product',
    category: 'Catalog & Inventory',
    summary: 'Create a new product with images, pricing, SKU code, inventory count, and category.',
    icon: Package,
    destinationUrl: '/admin/products',
    buttonText: 'Go to Products Catalog',
    steps: [
      'Click "Products" under the Catalog section in the left sidebar.',
      'Click the "+ Add New Product" button in the top right.',
      'Fill in the product name, SKU identifier, price, and category (e.g., Sneakers, Hoodies, Graphic Tees).',
      'Add one or more high-resolution product photography URLs in the Media section.',
      'Set initial warehouse stock quantity so customers can purchase the item.',
      'Set status to "Published" and click "Save Product".',
    ],
  },
  {
    id: 'guide-homepage-banners',
    title: 'How to customize and reorder homepage sections',
    category: 'Website & Branding',
    summary: 'Rearrange hero slides, flash sale countdowns, featured products, and promotional banners.',
    icon: Sparkles,
    destinationUrl: '/admin/cms',
    buttonText: 'Open Homepage Builder',
    steps: [
      'Click "Homepage Builder" under Website Content.',
      'Review the visual list of all 11 homepage sections (Hero Slider, Categories, Flash Sale, Best Sellers, etc.).',
      'Use the Up and Down arrow buttons to change the order in which sections appear.',
      'Click the "Enabled / Disabled" button to hide or show any section instantly.',
      'Click the pencil icon on any section to adjust its headline, subtitle, or desktop/mobile visibility.',
      'Click "Preview Live Homepage" to review your layout on the live site.',
    ],
  },
  {
    id: 'guide-coupons',
    title: 'How to create a discount coupon code',
    category: 'Marketing & Sales',
    summary: 'Set up percentage or fixed discount promo codes for campaigns and email subscribers.',
    icon: Tag,
    destinationUrl: '/admin/marketing',
    buttonText: 'Go to Coupons & Marketing',
    steps: [
      'Navigate to "Coupons & Discounts" under Operations in the sidebar.',
      'Click the "Create Promotion" button.',
      'Enter your promotional code (e.g., SUMMER20 or VIPCLUB).',
      'Choose the discount type: Percentage off (e.g., 20%) or Fixed dollar amount (e.g., $50 off).',
      'Set an optional minimum order requirement or expiration date.',
      'Click "Publish Voucher". Customers can now enter this code on the cart drawer and checkout screen.',
    ],
  },
  {
    id: 'guide-inventory',
    title: 'How to manage inventory and stock levels',
    category: 'Catalog & Inventory',
    summary: 'Monitor stock across regional warehouses and adjust quantities for incoming shipments.',
    icon: Warehouse,
    destinationUrl: '/admin/inventory',
    buttonText: 'Go to Inventory Hubs',
    steps: [
      'Click "Inventory & Stock" under the Operations section.',
      'View total available units, reserved customer carts, and low-stock alerts across regional hubs.',
      'Search for any product SKU to check its stock breakdown by warehouse (e.g., North America, Europe, Asia-Pacific).',
      'Click "Stock Adjustment" to manually add incoming shipment quantities.',
      'Items reaching zero stock automatically trigger "Out of Stock" labels on the storefront.',
    ],
  },
  {
    id: 'guide-orders',
    title: 'How to process, fulfill, and track an order',
    category: 'Sales & Fulfillment',
    summary: 'View new customer orders, enter DHL/FedEx tracking numbers, and complete shipments.',
    icon: ShoppingBag,
    destinationUrl: '/admin/orders',
    buttonText: 'Go to Orders & Fulfillment',
    steps: [
      'Click "Orders & Shipments" under Operations in the sidebar.',
      'Click on any order to review customer details, shipping address, and purchased items.',
      'When you pack the order, update fulfillment status from "Unfulfilled" to "Processing".',
      'Enter the courier name (DHL Express, FedEx, UPS) and the tracking number.',
      'Click "Complete & Dispatch". An automated tracking email is recorded in the customer account.',
    ],
  },
  {
    id: 'guide-seo',
    title: 'How to configure Google search (SEO) settings',
    category: 'Website & Branding',
    summary: 'Improve search rankings with meta titles, descriptions, and OpenGraph social preview images.',
    icon: Globe,
    destinationUrl: '/admin/seo',
    buttonText: 'Go to SEO Settings',
    steps: [
      'Navigate to "SEO Settings" under Website Content.',
      'In the "Store Meta Title" field, write your store name and primary keywords (up to 60 characters).',
      'In "Meta Description", enter an engaging summary (up to 160 characters).',
      'Review the "Live Google Search Result Preview" on the right to see exactly how it looks in search.',
      'Enter a "Social Share Image URL" (1200x630px) for Twitter, WhatsApp, and iMessage previews.',
      'Click "Save & Publish SEO".',
    ],
  },
  {
    id: 'guide-payments',
    title: 'How to connect Stripe & PayPal payment gateways',
    category: 'Payments & Settings',
    summary: 'Enable credit cards, Apple Pay, Google Pay, and PayPal Express Checkout.',
    icon: CreditCard,
    destinationUrl: '/admin/settings',
    buttonText: 'Go to Payment Settings',
    steps: [
      'Click "Store Settings" under System & Help in the sidebar.',
      'Select the "Payment Gateways" tab.',
      'To enable card payments and Apple Pay, turn on the "Stripe Gateway" toggle and enter your Stripe Publishable and Secret API keys.',
      'To enable PayPal, turn on the "PayPal Express" toggle and enter your PayPal Client ID.',
      'Click "Save System Configuration". Payment buttons will instantly activate on the checkout page.',
    ],
  },
  {
    id: 'guide-tracking',
    title: 'How to connect Meta Pixel & Google Analytics 4',
    category: 'Marketing & Sales',
    summary: 'Track purchase conversion events, page views, and ad campaign performance.',
    icon: BarChart3,
    destinationUrl: '/admin/marketing',
    buttonText: 'Go to Tracking Pixels',
    steps: [
      'Go to "Coupons & Discounts" (or "Store Settings") and open the Tracking & Pixels tab.',
      'Enter your Meta (Facebook) Pixel ID (e.g. 109827364519283).',
      'Enter your Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX).',
      'Optional: Enter your Google Tag Manager (GTM) Container ID or TikTok Pixel ID.',
      'Click "Save & Deploy Pixels". Event tracking (ViewContent, AddToCart, Purchase) will run automatically.',
    ],
  },
];

export default function AdminGuidePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openGuideId, setOpenGuideId] = useState<string>('guide-logo');

  const categories = ['all', 'Website & Branding', 'Catalog & Inventory', 'Sales & Fulfillment', 'Marketing & Sales', 'Payments & Settings'];

  const filteredGuides = GUIDES.filter((guide) => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      guide.title.toLowerCase().includes(q) ||
      guide.summary.toLowerCase().includes(q) ||
      guide.steps.some((s) => s.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Banner */}
      <FrontendMappingBanner
        title="Store Owner Help & Walkthroughs"
        badge="Self-Service Help Center"
        description="Clear, non-technical instructions to help store managers change logos, edit menus, add products, fulfill orders, and configure settings without needing developer assistance."
        controlsWhat="Self-help documentation and quick links for all administrative workflows."
        previewUrl="/"
        breadcrumbs={[{ label: 'System & Help' }, { label: 'Store Owner Guides' }]}
      />

      {/* Filter and Search Bar */}
      <div className="bg-[#14171d] border border-zinc-200 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-800 font-semibold font-medium absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides (e.g. logo, menu, product, coupon, order, stripe)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 font-bold placeholder:text-zinc-800 font-semibold font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors capitalize ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-850 text-zinc-600 hover:text-white hover:bg-zinc-100'
                }`}
              >
                {cat === 'all' ? 'All Guides' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Guides List */}
        <div className="space-y-3 pt-2">
          {filteredGuides.length === 0 ? (
            <div className="py-12 text-center text-zinc-800 font-semibold space-y-2">
              <p className="text-sm font-semibold">No guides match your search term.</p>
              <p className="text-xs text-zinc-800 font-semibold font-medium">Try clearing the search or category filter.</p>
            </div>
          ) : (
            filteredGuides.map((guide) => {
              const Icon = guide.icon;
              const isOpen = openGuideId === guide.id;

              return (
                <div
                  key={guide.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-zinc-50/90 border-amber-400/40 shadow-lg'
                      : 'bg-zinc-50/50 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {/* Header / Toggle button */}
                  <button
                    onClick={() => setOpenGuideId(isOpen ? '' : guide.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          isOpen
                            ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-zinc-900 font-bold">{guide.title}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-zinc-100 text-zinc-800 font-semibold border border-zinc-300">
                            {guide.category}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-800 font-semibold mt-1 line-clamp-1">{guide.summary}</p>
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-zinc-800 font-semibold font-medium hover:text-zinc-900 font-bold transition-colors shrink-0">
                      {isOpen ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Expanded Step-by-Step Instructions */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 border-t border-zinc-200/80 space-y-4 animate-in fade-in duration-150">
                      <div className="space-y-2.5">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                          Step-by-Step Instructions:
                        </span>
                        <div className="space-y-2 text-xs text-zinc-800 font-bold">
                          {guide.steps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <span className="w-5 h-5 rounded-full bg-zinc-100 text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 border border-zinc-300 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed flex-1 pt-0.5">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Direct Navigation Button */}
                      <div className="pt-2 flex items-center justify-between border-t border-zinc-200/60 flex-wrap gap-2">
                        <span className="text-[11px] text-zinc-800 font-semibold font-medium font-mono">
                          Ready to make this change?
                        </span>
                        <Link
                          href={guide.destinationUrl}
                          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                          <span>{guide.buttonText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
