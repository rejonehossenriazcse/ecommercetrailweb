'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import CartDrawer from '@/components/layout/CartDrawer';
import SearchModal from '@/components/layout/SearchModal';
import QuickViewModal from '@/components/layout/QuickViewModal';
import ToastContainer from '@/components/layout/ToastContainer';
import CookieConsent from '@/components/layout/CookieConsent';
import ConciergeChat from '@/components/layout/ConciergeChat';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname?.startsWith('/admin/');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <ToastContainer />
      <CookieConsent />
      <ConciergeChat />
    </>
  );
}
