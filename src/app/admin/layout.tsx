'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Warehouse,
  ShoppingBag,
  Users,
  Compass,
  Tag,
  Settings,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Image as ImageIcon,
  Star,
  BarChart3,
  Search,
  BookOpen,
  FileText,
  Globe,
  Columns,
  Menu as MenuIcon,
  HelpCircle,
} from 'lucide-react';
import AdminSearchModal from '@/components/admin/AdminSearchModal';

const ADMIN_NAV_GROUPS = [
  {
    title: 'Dashboard',
    items: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Website Content',
    items: [
      { label: 'Homepage Builder', href: '/admin/cms', icon: Compass },
      { label: 'Header & Navigation', href: '/admin/header', icon: MenuIcon },
      { label: 'Footer Management', href: '/admin/footer', icon: Columns },
      { label: 'Custom Pages', href: '/admin/pages', icon: FileText },
      { label: 'Blog / Articles', href: '/admin/blog', icon: BookOpen },
      { label: 'SEO Settings', href: '/admin/seo', icon: Globe },
      { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Categories', href: '/admin/categories', icon: Layers },
      { label: 'Product Reviews', href: '/admin/reviews', icon: Star },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Inventory & Stock', href: '/admin/inventory', icon: Warehouse },
      { label: 'Orders & Shipments', href: '/admin/orders', icon: ShoppingBag },
      { label: 'Customer Accounts', href: '/admin/customers', icon: Users },
      { label: 'Coupons & Discounts', href: '/admin/marketing', icon: Tag },
    ],
  },
  {
    title: 'System & Help',
    items: [
      { label: 'Store Settings', href: '/admin/settings', icon: Settings },
      { label: 'Store Owner Guides', href: '/admin/guide', icon: HelpCircle },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Keyboard Shortcut for Search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Allow standalone fullscreen for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem('stride_admin_token');
    localStorage.removeItem('aura_admin_token');
    document.cookie = 'stride_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'aura_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin/login';
  };

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return 'Storefront Overview';
    const sub = segments[1];
    switch (sub) {
      case 'cms':
        return 'Homepage Builder';
      case 'header':
        return 'Header & Navigation';
      case 'footer':
        return 'Footer Management';
      case 'pages':
        return 'Custom Pages';
      case 'blog':
        return 'Blog / Articles';
      case 'seo':
        return 'SEO & Social Cards';
      case 'media':
        return 'Media Library';
      case 'products':
        return 'Products Catalog';
      case 'categories':
        return 'Product Categories';
      case 'reviews':
        return 'Customer Reviews';
      case 'inventory':
        return 'Inventory & Hubs';
      case 'orders':
        return 'Orders & Fulfillment';
      case 'customers':
        return 'Customer Accounts';
      case 'marketing':
        return 'Coupons & Discounts';
      case 'settings':
        return 'Store Settings';
      case 'guide':
        return 'Store Owner Guides';
      case 'reports':
        return 'Reports & Analytics';
      default:
        return sub.charAt(0).toUpperCase() + sub.slice(1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0f12] text-zinc-900 flex flex-col md:flex-row antialiased font-sans">
      {/* Search Modal */}
      <AdminSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-64 bg-[#12151a] border-r border-zinc-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand header */}
          <div className="p-5 border-b border-zinc-200/60 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-black font-black flex items-center justify-center text-base italic shadow-[0_0_12px_rgba(249,115,22,0.4)] transform -rotate-3 shrink-0">
                S
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono font-black text-sm tracking-wider text-zinc-900 font-bold">
                    STRIDE
                  </span>
                  <span className="font-mono font-black text-sm tracking-wider text-orange-500">
                    DISTRICT
                  </span>
                  <span className="text-[10px] text-zinc-800 font-semibold font-medium font-normal">CMS</span>
                </div>
                <span className="text-[9px] text-orange-600 font-bold font-mono tracking-widest uppercase">
                  Hype & Drops Control
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-zinc-800 font-semibold hover:text-zinc-900 font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Trigger in Sidebar */}
          <div className="px-3 pt-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-100 text-xs text-zinc-800 font-semibold hover:text-zinc-800 border border-zinc-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Search admin...</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 font-semibold border border-zinc-300">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
            {ADMIN_NAV_GROUPS.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-800 font-semibold font-medium px-3 py-1">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-zinc-100 text-white font-bold shadow-sm border border-zinc-300/50'
                          : 'text-zinc-600 hover:bg-zinc-100/50 hover:text-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer with live store link and Super Admin info */}
          <div className="p-4 border-t border-zinc-200/60 bg-[#0f1115] space-y-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-100/60 hover:bg-zinc-100 text-zinc-800 font-bold hover:text-zinc-900 font-bold text-xs font-semibold transition-colors border border-zinc-300/40"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>View Live Website</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Live
              </span>
            </Link>

            <div className="flex items-center gap-3 px-2 pt-1">
              <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-300 flex items-center justify-center font-bold text-xs text-amber-400 shrink-0">
                SA
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-zinc-900 font-bold truncate flex items-center gap-1">
                  <span>Store Admin</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[10px] text-zinc-800 font-semibold font-medium truncate font-mono">
                  Full Store Control
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out of Admin"
                className="p-1.5 text-zinc-800 font-semibold font-medium hover:text-rose-400 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-[#12151a]/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-zinc-800 font-semibold hover:text-zinc-900 font-bold rounded-lg hover:bg-zinc-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-800 font-semibold">
              <Link href="/admin" className="text-zinc-800 font-semibold font-medium hover:text-zinc-800 font-bold">
                Admin
              </Link>
              <span>/</span>
              <span className="text-zinc-900 font-bold font-semibold">{getPageTitle()}</span>
            </div>
          </div>

          {/* Search Bar in Header */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-100 border border-zinc-300 text-xs text-zinc-800 font-semibold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Search settings, menus, products, orders, guides...</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 font-semibold border border-zinc-300">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Header Status & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-zinc-800 font-semibold hover:text-zinc-900 font-bold hover:bg-zinc-100 rounded-xl"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href="/admin/guide"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 text-xs font-semibold border border-amber-400/20 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Help & Guides</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-800 font-bold hover:text-zinc-900 font-bold text-xs font-semibold border border-zinc-300 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Admin Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
