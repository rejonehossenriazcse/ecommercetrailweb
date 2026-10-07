import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import StoreLayout from '@/components/layout/StoreLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'STRIDE DISTRICT | Hype Sneakers, Streetwear & Culture Drops',
  description:
    'Official flagship destination for limited sneaker releases, heavyweight hoodies, vintage graphic tees, and streetwear culture. 100% verified authentic with express worldwide shipping.',
  keywords: [
    'Stride District',
    'Streetwear',
    'Air Jordan 1',
    'Nike Dunks',
    'Yeezy Slides',
    'Stussy Hoodie',
    'Supreme Box Logo',
    'Essentials Fear of God',
    'Sneaker Drops',
    'Hype Fashion',
  ],
  authors: [{ name: 'Stride District Atelier' }],
  openGraph: {
    title: 'STRIDE DISTRICT | Streetwear & Sneaker Drops',
    description:
      'Curated grails, heavyweight streetwear, and limited drops engineered for movement and culture.',
    url: 'https://stridedistrict.com',
    siteName: 'Stride District',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Stride District Lookbook',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STRIDE DISTRICT | Streetwear & Sneaker Drops',
    description:
      'Exclusive kicks and streetwear for the culture. Built for movement. 100% verified authentic.',
    images: ['https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth dark`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500 selection:text-white">
        <StoreProvider>
          <StoreLayout>{children}</StoreLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
