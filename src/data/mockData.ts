import { Product, Category, Brand, BlogPost, Testimonial, SocialPost, HeroSlide, Coupon, Currency, Language } from '@/types';

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1.0, name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound (GBP)' },
];

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'STREET10', type: 'percentage', value: 10, minSpend: 50, description: '10% off your first streetwear pickup' },
  { code: 'HYPE20', type: 'percentage', value: 20, minSpend: 200, maxDiscount: 50, description: '20% off hype drops on orders over $200' },
  { code: 'FREESHIP', type: 'fixed', value: 15, minSpend: 100, description: 'Free express shipping on orders over $100' },
];

export const CATEGORIES: Category[] = [
  {
    id: 'cat-sneakers',
    name: 'Sneakers',
    slug: 'sneakers',
    description: 'Exclusive kicks, retro grails, and limited hype releases.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
    itemCount: 7,
    isFeatured: true,
    subcategories: [
      { id: 'sub-high', name: 'High-Tops', slug: 'high-tops', itemCount: 3 },
      { id: 'sub-low', name: 'Low-Tops & Dunks', slug: 'low-tops', itemCount: 3 },
      { id: 'sub-slides', name: 'Slides & Foam', slug: 'slides', itemCount: 1 }
    ]
  },
  {
    id: 'cat-hoodies',
    name: 'Hoodies & Fleece',
    slug: 'hoodies',
    description: 'Heavyweight french terry, oversized fits, and iconic streetwear drops.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    itemCount: 5,
    isFeatured: true,
    subcategories: [
      { id: 'sub-hoodies', name: 'Pullover Hoodies', slug: 'pullover-hoodies', itemCount: 4 },
      { id: 'sub-crew', name: 'Crewnecks & Zip', slug: 'crewnecks', itemCount: 1 }
    ]
  },
  {
    id: 'cat-tees',
    name: 'T-Shirts & Tops',
    slug: 't-shirts',
    description: 'Vintage-washed graphics, drop-shoulder silhouettes, and heavy cotton tees.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
    itemCount: 4,
    isFeatured: true,
    subcategories: [
      { id: 'sub-graphic', name: 'Graphic Tees', slug: 'graphic-tees', itemCount: 3 },
      { id: 'sub-basics', name: 'Heavyweight Basics', slug: 'basics', itemCount: 1 }
    ]
  },
  {
    id: 'cat-acc',
    name: 'Accessories & Carry',
    slug: 'accessories',
    description: 'Tactical crossbody bags, beanies, caps, and lifestyle gear to seal the fit.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
    itemCount: 4,
    isFeatured: true,
    subcategories: [
      { id: 'sub-headwear', name: 'Headwear & Beanies', slug: 'headwear', itemCount: 2 },
      { id: 'sub-bags', name: 'Bags & Utility', slug: 'bags', itemCount: 2 }
    ]
  }
];

export const BRANDS: Brand[] = [
  { id: 'b-jordan', name: 'Jordan', slug: 'jordan', logo: '', description: 'Flight and legacy.', productCount: 4 },
  { id: 'b-nike', name: 'Nike', slug: 'nike', logo: '', description: 'Just Do It.', productCount: 3 },
  { id: 'b-adidas', name: 'Adidas', slug: 'adidas', logo: '', description: 'Three Stripes culture.', productCount: 2 },
  { id: 'b-newbalance', name: 'New Balance', slug: 'new-balance', logo: '', description: 'Fearlessly Independent.', productCount: 2 },
  { id: 'b-supreme', name: 'Supreme', slug: 'supreme', logo: '', description: 'New York skate & street titan.', productCount: 3 },
  { id: 'b-stussy', name: 'Stussy', slug: 'stussy', logo: '', description: 'Laguna Beach streetwear pioneer.', productCount: 3 },
  { id: 'b-essentials', name: 'Essentials', slug: 'essentials', logo: '', description: 'Jerry Lorenzo Fear of God essentials.', productCount: 2 },
  { id: 'b-offwhite', name: 'Off-White', slug: 'off-white', logo: '', description: 'Defining the grey area between black and white.', productCount: 1 }
];

export const PRODUCTS: Product[] = [
  // 1. JORDAN 1 SHADOW 2.0
  {
    id: 'prod-001',
    name: 'Air Jordan 1 Retro High OG "Shadow 2.0"',
    slug: 'air-jordan-1-retro-high-og-shadow-2-0',
    description: 'The Air Jordan 1 Retro High OG Shadow 2.0 delivers a modern reimagining of the original 1985 classic. Built with premium smooth black leather, soft light smoke grey nubuck overlays, and the signature perforated toe box for breathability. Finished with the vintage Nike Air tongue tab and high-traction rubber cupsole.',
    shortDescription: 'Classic high-top silhouette in Black and Smoke Grey premium leather.',
    price: 180,
    compareAtPrice: 220,
    category: 'Sneakers',
    categorySlug: 'sneakers',
    brand: 'Jordan',
    sku: 'AJ1-SHADOW2',
    tags: ['sneakers', 'jordan', 'high-top', 'retro', 'streetwear'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Colorway', value: 'Black/Light Smoke Grey-White' },
      { label: 'Upper Material', value: 'Full Grain Leather & Nubuck' },
      { label: 'Release Date', value: '2021-05-15' },
      { label: 'Authenticity', value: '100% District Vault Verified' }
    ],
    rating: 4.9,
    reviewCount: 342,
    stock: 15,
    options: [
      { name: 'Size', values: ['US 8', 'US 9', 'US 10', 'US 11'] },
      { name: 'Color', values: ['Black/Grey'] }
    ],
    variants: [
      { id: 'v1', sku: 'AJ1-SHADOW2-8', title: 'US 8 / Black/Grey', price: 180, stock: 4, selectedOptions: { 'Size': 'US 8', 'Color': 'Black/Grey' } },
      { id: 'v2', sku: 'AJ1-SHADOW2-9', title: 'US 9 / Black/Grey', price: 180, stock: 6, selectedOptions: { 'Size': 'US 9', 'Color': 'Black/Grey' } },
      { id: 'v3', sku: 'AJ1-SHADOW2-10', title: 'US 10 / Black/Grey', price: 180, stock: 3, selectedOptions: { 'Size': 'US 10', 'Color': 'Black/Grey' } },
      { id: 'v4', sku: 'AJ1-SHADOW2-11', title: 'US 11 / Black/Grey', price: 180, stock: 2, selectedOptions: { 'Size': 'US 11', 'Color': 'Black/Grey' } }
    ],
    badges: ['New', 'Trending'],
    isFeatured: true,
    createdAt: new Date().toISOString()
  },

  // 2. NIKE DUNK LOW PANDA
  {
    id: 'prod-002',
    name: 'Nike Dunk Low Retro "Panda Black & White"',
    slug: 'nike-dunk-low-retro-panda',
    description: 'The Nike Dunk Low Retro Panda is an absolute streetwear essential. Crisp white leather base with bold pitch-black overlays, clean white midsole, and timeless padded collar providing casual comfort with basketball heritage.',
    shortDescription: 'The definitive monochrome street staple. Crisp leather, low profile.',
    price: 115,
    compareAtPrice: 140,
    category: 'Sneakers',
    categorySlug: 'sneakers',
    brand: 'Nike',
    sku: 'DUNK-PANDA-01',
    tags: ['sneakers', 'nike', 'dunk', 'low-top', 'panda'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Colorway', value: 'White/Black' },
      { label: 'Silhouette', value: 'Low-Top Dunk' },
      { label: 'Sole', value: 'Dunk Heritage Pivot Circle' },
      { label: 'Authenticity', value: '100% District Verified' }
    ],
    rating: 4.8,
    reviewCount: 489,
    stock: 24,
    options: [
      { name: 'Size', values: ['US 8', 'US 9', 'US 10', 'US 11'] },
      { name: 'Color', values: ['Black/White'] }
    ],
    variants: [
      { id: 'v5', sku: 'DUNK-PANDA-8', title: 'US 8 / Black/White', price: 115, stock: 6, selectedOptions: { 'Size': 'US 8', 'Color': 'Black/White' } },
      { id: 'v6', sku: 'DUNK-PANDA-9', title: 'US 9 / Black/White', price: 115, stock: 8, selectedOptions: { 'Size': 'US 9', 'Color': 'Black/White' } },
      { id: 'v7', sku: 'DUNK-PANDA-10', title: 'US 10 / Black/White', price: 115, stock: 7, selectedOptions: { 'Size': 'US 10', 'Color': 'Black/White' } },
      { id: 'v8', sku: 'DUNK-PANDA-11', title: 'US 11 / Black/White', price: 115, stock: 3, selectedOptions: { 'Size': 'US 11', 'Color': 'Black/White' } }
    ],
    badges: ['Best Seller'],
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },

  // 3. YEEZY SLIDE BONE
  {
    id: 'prod-003',
    name: 'Yeezy Slide "Bone 2026 Restock"',
    slug: 'yeezy-slide-bone',
    description: 'The Yeezy Slide Bone provides ultra-cushioned comfort in an eye-catching minimalist silhouette. Crafted with single-piece injected EVA foam, seamless ergonomic footbed, and serrated deep-groove rubber outsole for grip.',
    shortDescription: 'Ultra-cushioned molded EVA foam slide in signature Bone tone.',
    price: 70,
    compareAtPrice: 95,
    category: 'Sneakers',
    categorySlug: 'sneakers',
    brand: 'Adidas',
    sku: 'YZY-SLIDE-BONE',
    tags: ['slides', 'adidas', 'yeezy', 'comfort'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Colorway', value: 'Bone/Bone/Bone' },
      { label: 'Material', value: '100% Injected EVA Foam' },
      { label: 'Outsole', value: 'Serrated Tread Pattern' }
    ],
    rating: 4.6,
    reviewCount: 215,
    stock: 35,
    options: [
      { name: 'Size', values: ['US 8', 'US 9', 'US 10', 'US 11'] },
      { name: 'Color', values: ['Bone'] }
    ],
    variants: [
      { id: 'v9', sku: 'YZY-BONE-8', title: 'US 8 / Bone', price: 70, stock: 10, selectedOptions: { 'Size': 'US 8', 'Color': 'Bone' } },
      { id: 'v10', sku: 'YZY-BONE-9', title: 'US 9 / Bone', price: 70, stock: 15, selectedOptions: { 'Size': 'US 9', 'Color': 'Bone' } },
      { id: 'v11', sku: 'YZY-BONE-10', title: 'US 10 / Bone', price: 70, stock: 10, selectedOptions: { 'Size': 'US 10', 'Color': 'Bone' } }
    ],
    badges: ['Best Seller'],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },

  // 4. NEW BALANCE 9060 BLACK CASTLEROCK
  {
    id: 'prod-004',
    name: 'New Balance 9060 "Black Castlerock"',
    slug: 'new-balance-9060-black-castlerock',
    description: 'The New Balance 9060 is a futuristic reinterpretation of the legendary 99X series combined with Y2K tech runner aesthetics. Featuring wavy sculpted ABZORB and SBS midsole pods, premium mesh base with suede overlays, and translucent CR motion control device.',
    shortDescription: 'Futuristic chunky runner with ABZORB dual-density pods and premium pigskin.',
    price: 150,
    compareAtPrice: 175,
    category: 'Sneakers',
    categorySlug: 'sneakers',
    brand: 'New Balance',
    sku: 'NB-9060-BLK',
    tags: ['sneakers', 'new balance', 'chunky', 'lifestyle'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618354691438-25bc04584c23?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Colorway', value: 'Black/Castlerock/Grey' },
      { label: 'Midsole', value: 'ABZORB & SBS Cushioning' },
      { label: 'Heel Device', value: 'Translucent CR Clip' }
    ],
    rating: 4.8,
    reviewCount: 94,
    stock: 18,
    options: [
      { name: 'Size', values: ['US 8', 'US 9', 'US 10', 'US 11'] },
      { name: 'Color', values: ['Black'] }
    ],
    variants: [
      { id: 'v12', sku: 'NB-9060-8', title: 'US 8 / Black', price: 150, stock: 5, selectedOptions: { 'Size': 'US 8', 'Color': 'Black' } },
      { id: 'v13', sku: 'NB-9060-9', title: 'US 9 / Black', price: 150, stock: 7, selectedOptions: { 'Size': 'US 9', 'Color': 'Black' } },
      { id: 'v14', sku: 'NB-9060-10', title: 'US 10 / Black', price: 150, stock: 6, selectedOptions: { 'Size': 'US 10', 'Color': 'Black' } }
    ],
    badges: ['Trending'],
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },

  // 5. AIR JORDAN 4 RETRO MILITARY BLACK
  {
    id: 'prod-005',
    name: 'Air Jordan 4 Retro "Military Black"',
    slug: 'air-jordan-4-retro-military-black',
    description: 'The Air Jordan 4 Military Black features clean white smooth leather accented with grey suede mudguard overlays and black TPU wings and heel counter. The visible Air-Sole unit in the heel and classic herringbone outsole make this one of the most sought-after silhouettes in recent history.',
    shortDescription: 'Grail-status high-top with signature TPU wings and visible Air-Sole unit.',
    price: 310,
    compareAtPrice: 380,
    category: 'Sneakers',
    categorySlug: 'sneakers',
    brand: 'Jordan',
    sku: 'AJ4-MILITARY-BLK',
    tags: ['sneakers', 'jordan', 'aj4', 'hype', 'grail'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Colorway', value: 'White/Black-Neutral Grey' },
      { label: 'Air Cushioning', value: 'Encapsulated Forefoot & Exposed Heel Air' },
      { label: 'Lacing', value: 'Floating Eyestay TPU Wings' }
    ],
    rating: 5.0,
    reviewCount: 520,
    stock: 9,
    options: [
      { name: 'Size', values: ['US 8', 'US 9', 'US 10', 'US 11'] },
      { name: 'Color', values: ['White/Black'] }
    ],
    variants: [
      { id: 'v15', sku: 'AJ4-MB-9', title: 'US 9 / White/Black', price: 310, stock: 4, selectedOptions: { 'Size': 'US 9', 'Color': 'White/Black' } },
      { id: 'v16', sku: 'AJ4-MB-10', title: 'US 10 / White/Black', price: 310, stock: 5, selectedOptions: { 'Size': 'US 10', 'Color': 'White/Black' } }
    ],
    badges: ['New', 'Trending'],
    isFeatured: true,
    createdAt: new Date().toISOString()
  },

  // 6. STUSSY WORLD TOUR HOODIE
  {
    id: 'prod-006',
    name: 'Stussy World Tour Heavyweight Hoodie "Black"',
    slug: 'stussy-world-tour-hoodie-black',
    description: 'The legendary Stussy World Tour pullover hoodie pays homage to the iconic streetwear capitals: London, Paris, Los Angeles, New York, Tokyo. Made with custom 400GSM cotton fleece, fleece-lined hood with adjustable drawstrings, and kangaroo front pocket.',
    shortDescription: 'Heavyweight 400GSM cotton fleece featuring world tour typography screenprint.',
    price: 120,
    compareAtPrice: 145,
    category: 'Hoodies',
    categorySlug: 'hoodies',
    brand: 'Stussy',
    sku: 'STUSSY-WT-HOODIE',
    tags: ['hoodie', 'stussy', 'apparel', 'streetwear', 'fleece'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Weight', value: '400 GSM Heavyweight Terry' },
      { label: 'Fit', value: 'Relaxed Streetwear Fit' },
      { label: 'Composition', value: '80% Cotton / 20% Polyester' }
    ],
    rating: 4.9,
    reviewCount: 168,
    stock: 22,
    options: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['Black'] }
    ],
    variants: [
      { id: 'v17', sku: 'STU-WT-M', title: 'M / Black', price: 120, stock: 8, selectedOptions: { 'Size': 'M', 'Color': 'Black' } },
      { id: 'v18', sku: 'STU-WT-L', title: 'L / Black', price: 120, stock: 10, selectedOptions: { 'Size': 'L', 'Color': 'Black' } },
      { id: 'v19', sku: 'STU-WT-XL', title: 'XL / Black', price: 120, stock: 4, selectedOptions: { 'Size': 'XL', 'Color': 'Black' } }
    ],
    badges: ['New', 'Trending'],
    isFeatured: true,
    createdAt: new Date().toISOString()
  },

  // 7. FEAR OF GOD ESSENTIALS HOODIE SAND
  {
    id: 'prod-007',
    name: 'Fear of God Essentials Fleece Hoodie "Sand Taupe"',
    slug: 'fog-essentials-hoodie-sand',
    description: 'Designed by Jerry Lorenzo, the Essentials hoodie is engineered with a voluminous drape, signature dropped shoulders, rubberized Essentials back label, and high-density chest branding in a subtle earthy Sand tone.',
    shortDescription: 'Signature oversized drop-shoulder hoodie in heavyweight brushed fleece.',
    price: 95,
    compareAtPrice: 120,
    category: 'Hoodies',
    categorySlug: 'hoodies',
    brand: 'Essentials',
    sku: 'FOG-HOODIE-SAND',
    tags: ['hoodie', 'essentials', 'fog', 'streetwear', 'fleece'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Fit', value: 'Oversized Boxy Silhouette' },
      { label: 'Material', value: '80% Cotton / 20% Fleece' },
      { label: 'Branding', value: 'Rubberized High-Density 3D Logo' }
    ],
    rating: 4.7,
    reviewCount: 384,
    stock: 45,
    options: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['Sand'] }
    ],
    variants: [
      { id: 'v20', sku: 'FOG-SAND-S', title: 'S / Sand', price: 95, stock: 10, selectedOptions: { 'Size': 'S', 'Color': 'Sand' } },
      { id: 'v21', sku: 'FOG-SAND-M', title: 'M / Sand', price: 95, stock: 20, selectedOptions: { 'Size': 'M', 'Color': 'Sand' } },
      { id: 'v22', sku: 'FOG-SAND-L', title: 'L / Sand', price: 95, stock: 15, selectedOptions: { 'Size': 'L', 'Color': 'Sand' } }
    ],
    badges: ['Best Seller'],
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },

  // 8. SUPREME BOX LOGO HOODIE
  {
    id: 'prod-008',
    name: 'Supreme Box Logo Heavyweight Hoodie "Heather Grey"',
    slug: 'supreme-box-logo-hoodie-grey',
    description: 'The Holy Grail of New York skate culture. Supreme Cross Grain cotton pullover fleece featuring the iconic embroidered Red Box Logo across the chest. Built to withstand decades of wear.',
    shortDescription: 'The undisputed grail. Heavyweight cross-grain fleece with embroidered Box Logo.',
    price: 240,
    compareAtPrice: 320,
    category: 'Hoodies',
    categorySlug: 'hoodies',
    brand: 'Supreme',
    sku: 'SUP-BOGO-HGREY',
    tags: ['hoodie', 'supreme', 'bogo', 'hype', 'grail'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Embroidery', value: 'Direct High-Stitch Red Bogo' },
      { label: 'Weave', value: 'Heavyweight Crossgrain Cotton' },
      { label: 'Origin', value: 'Made in Canada' }
    ],
    rating: 5.0,
    reviewCount: 412,
    stock: 6,
    options: [
      { name: 'Size', values: ['M', 'L', 'XL'] },
      { name: 'Color', values: ['Heather Grey'] }
    ],
    variants: [
      { id: 'v23', sku: 'SUP-BOGO-M', title: 'M / Heather Grey', price: 240, stock: 2, selectedOptions: { 'Size': 'M', 'Color': 'Heather Grey' } },
      { id: 'v24', sku: 'SUP-BOGO-L', title: 'L / Heather Grey', price: 240, stock: 3, selectedOptions: { 'Size': 'L', 'Color': 'Heather Grey' } },
      { id: 'v25', sku: 'SUP-BOGO-XL', title: 'XL / Heather Grey', price: 240, stock: 1, selectedOptions: { 'Size': 'XL', 'Color': 'Heather Grey' } }
    ],
    badges: ['Trending', 'Limited Stock'],
    isFeatured: true,
    createdAt: new Date().toISOString()
  },

  // 9. OFF-WHITE CARAVAGGIO ARROWS HOODIE
  {
    id: 'prod-009',
    name: 'Off-White Caravaggio Arrows Graphic Hoodie',
    slug: 'off-white-caravaggio-arrows-hoodie',
    description: 'Virgil Abloh luxury streetwear masterwork fusing classic Renaissance oil paintings with signature industrial diagonals. Printed on Portuguese loopback cotton with dip-dyed drawstrings.',
    shortDescription: 'Portuguese loopback cotton with high-def Caravaggio painting and back arrows.',
    price: 390,
    compareAtPrice: 470,
    category: 'Hoodies',
    categorySlug: 'hoodies',
    brand: 'Off-White',
    sku: 'OW-CARAV-09',
    tags: ['hoodie', 'off-white', 'luxury', 'streetwear'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Origin', value: 'Made in Portugal' },
      { label: 'Material', value: '100% French Terry Cotton' },
      { label: 'Hardware', value: 'Silver-Tone Diag Eyelets' }
    ],
    rating: 4.8,
    reviewCount: 78,
    stock: 8,
    options: [
      { name: 'Size', values: ['S', 'M', 'L'] },
      { name: 'Color', values: ['Black'] }
    ],
    variants: [
      { id: 'v26', sku: 'OW-HOOD-M', title: 'M / Black', price: 390, stock: 4, selectedOptions: { 'Size': 'M', 'Color': 'Black' } },
      { id: 'v27', sku: 'OW-HOOD-L', title: 'L / Black', price: 390, stock: 4, selectedOptions: { 'Size': 'L', 'Color': 'Black' } }
    ],
    badges: ['New'],
    createdAt: new Date().toISOString()
  },

  // 10. STUSSY BASIC PIGMENT TEE
  {
    id: 'prod-010',
    name: 'Stussy Basic Pigment Dyed Tee "Faded Moss"',
    slug: 'stussy-basic-pigment-dyed-tee-moss',
    description: 'Cut from heavyweight 220GSM combed cotton jersey and pigment-dyed for an authentic sun-faded vintage feel. Hand-screened signature Stussy hand-drawn logo on left chest and enlarged on back.',
    shortDescription: 'Vintage wash pigment-dyed tee with classic Stussy hand-drawn signature.',
    price: 48,
    compareAtPrice: 60,
    category: 'T-Shirts',
    categorySlug: 't-shirts',
    brand: 'Stussy',
    sku: 'STUSSY-TEE-MOSS',
    tags: ['t-shirts', 'stussy', 'tees', 'vintage-wash'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Fabric', value: '220GSM Pre-Shrunk Cotton' },
      { label: 'Dye Technique', value: 'Pigment Washed & Distressed' },
      { label: 'Fit', value: 'Classic Boxy Street Fit' }
    ],
    rating: 4.8,
    reviewCount: 220,
    stock: 40,
    options: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['Faded Moss'] }
    ],
    variants: [
      { id: 'v28', sku: 'STU-TEE-M', title: 'M / Faded Moss', price: 48, stock: 15, selectedOptions: { 'Size': 'M', 'Color': 'Faded Moss' } },
      { id: 'v29', sku: 'STU-TEE-L', title: 'L / Faded Moss', price: 48, stock: 15, selectedOptions: { 'Size': 'L', 'Color': 'Faded Moss' } },
      { id: 'v30', sku: 'STU-TEE-XL', title: 'XL / Faded Moss', price: 48, stock: 10, selectedOptions: { 'Size': 'XL', 'Color': 'Faded Moss' } }
    ],
    badges: ['Trending'],
    isFeatured: true,
    createdAt: new Date().toISOString()
  },

  // 11. SUPREME MOTION LOGO TEE
  {
    id: 'prod-011',
    name: 'Supreme Motion Logo Streetwear Tee "White"',
    slug: 'supreme-motion-logo-tee-white',
    description: 'Inspired by the opening credits of Goodfellas, the Supreme Motion Logo tee is one of the most celebrated graphics in Supreme history. Printed on all-cotton pre-shrunk classic jersey.',
    shortDescription: 'Cinematic blur typography screen-printed on heavy white cotton.',
    price: 68,
    compareAtPrice: 85,
    category: 'T-Shirts',
    categorySlug: 't-shirts',
    brand: 'Supreme',
    sku: 'SUP-MOTION-TEE',
    tags: ['t-shirts', 'supreme', 'tees', 'skate', 'hype'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Weight', value: '100% Combed Heavy Cotton' },
      { label: 'Neckline', value: 'Ribbed Crewneck Collar' },
      { label: 'Origin', value: 'Made in USA' }
    ],
    rating: 4.9,
    reviewCount: 155,
    stock: 14,
    options: [
      { name: 'Size', values: ['M', 'L', 'XL'] },
      { name: 'Color', values: ['White'] }
    ],
    variants: [
      { id: 'v31', sku: 'SUP-MOT-M', title: 'M / White', price: 68, stock: 6, selectedOptions: { 'Size': 'M', 'Color': 'White' } },
      { id: 'v32', sku: 'SUP-MOT-L', title: 'L / White', price: 68, stock: 5, selectedOptions: { 'Size': 'L', 'Color': 'White' } },
      { id: 'v33', sku: 'SUP-MOT-XL', title: 'XL / White', price: 68, stock: 3, selectedOptions: { 'Size': 'XL', 'Color': 'White' } }
    ],
    badges: ['New Drop', 'Limited Stock'],
    createdAt: new Date().toISOString()
  },

  // 12. FOG ESSENTIALS RELAXED 1977 TEE
  {
    id: 'prod-012',
    name: 'Fear of God Essentials 1977 Relaxed Tee "Washed Iron"',
    slug: 'fog-essentials-1977-relaxed-tee-iron',
    description: 'The Essentials 1977 tee features a velvet flocking graphic referencing Jerry Lorenzo birth year. Designed with an effortless drop-shoulder relaxed cut and ribbed collar.',
    shortDescription: 'Relaxed drop-shoulder silhouette with velvet flocking 1977 graphic.',
    price: 55,
    compareAtPrice: 70,
    category: 'T-Shirts',
    categorySlug: 't-shirts',
    brand: 'Essentials',
    sku: 'FOG-1977-TEE-IRON',
    tags: ['t-shirts', 'essentials', 'fog', 'basics'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Fit', value: 'Dropped Shoulder Oversized' },
      { label: 'Graphic', value: 'Velvet Textured Flocking' },
      { label: 'Material', value: '100% Cotton Jersey' }
    ],
    rating: 4.6,
    reviewCount: 310,
    stock: 30,
    options: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['Washed Iron'] }
    ],
    variants: [
      { id: 'v34', sku: 'FOG-1977-M', title: 'M / Washed Iron', price: 55, stock: 12, selectedOptions: { 'Size': 'M', 'Color': 'Washed Iron' } },
      { id: 'v35', sku: 'FOG-1977-L', title: 'L / Washed Iron', price: 55, stock: 12, selectedOptions: { 'Size': 'L', 'Color': 'Washed Iron' } }
    ],
    badges: ['Best Seller'],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },

  // 13. NIKE ACG HEAVY POCKET TEE
  {
    id: 'prod-013',
    name: 'Nike ACG Heavyweight Pocket Tee "Summit White"',
    slug: 'nike-acg-heavyweight-pocket-tee',
    description: 'Engineered by Nike All Conditions Gear. Made with at least 75% organic cotton fibers, loose roomy cut, utility chest pocket, and embroidered ACG triangle logo.',
    shortDescription: 'Rugged heavyweight organic cotton tee with ACG triangular embroidery.',
    price: 45,
    compareAtPrice: 55,
    category: 'T-Shirts',
    categorySlug: 't-shirts',
    brand: 'Nike',
    sku: 'NIKE-ACG-TEE',
    tags: ['t-shirts', 'nike', 'acg', 'outdoors', 'pocket-tee'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Sub-label', value: 'Nike All Conditions Gear' },
      { label: 'Pocket', value: 'Reinforced Left Chest Pocket' },
      { label: 'Material', value: '240GSM Heavyweight Knit' }
    ],
    rating: 4.7,
    reviewCount: 96,
    stock: 25,
    options: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['Summit White'] }
    ],
    variants: [
      { id: 'v36', sku: 'ACG-TEE-M', title: 'M / Summit White', price: 45, stock: 10, selectedOptions: { 'Size': 'M', 'Color': 'Summit White' } },
      { id: 'v37', sku: 'ACG-TEE-L', title: 'L / Summit White', price: 45, stock: 15, selectedOptions: { 'Size': 'L', 'Color': 'Summit White' } }
    ],
    badges: [],
    createdAt: new Date().toISOString()
  },

  // 14. SUPREME CORDURA CROSSBODY BAG
  {
    id: 'prod-014',
    name: 'Supreme Cordura Tactical Crossbody Shoulder Bag',
    slug: 'supreme-cordura-tactical-crossbody-bag',
    description: 'Water-resistant Cordura recycled nylon ripstop with embossed Supreme logo lining. Main zipper compartment with interior mesh organizer, front zip pocket, and adjustable webbing shoulder strap.',
    shortDescription: 'Weather-resistant Cordura nylon ripstop with woven Supreme box logo label.',
    price: 88,
    compareAtPrice: 110,
    category: 'Accessories',
    categorySlug: 'accessories',
    brand: 'Supreme',
    sku: 'SUP-CORDURA-BAG',
    tags: ['accessories', 'supreme', 'bag', 'carry', 'cordura'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Fabric', value: '500D Cordura Nylon Ripstop' },
      { label: 'Capacity', value: '2.5 Liters' },
      { label: 'Zippers', value: 'YKK Aquaguard Sealed Zips' }
    ],
    rating: 4.9,
    reviewCount: 230,
    stock: 12,
    options: [
      { name: 'Size', values: ['One Size'] },
      { name: 'Color', values: ['Black'] }
    ],
    variants: [
      { id: 'v38', sku: 'SUP-BAG-BLK', title: 'One Size / Black', price: 88, stock: 12, selectedOptions: { 'Size': 'One Size', 'Color': 'Black' } }
    ],
    badges: ['Best Seller', 'Trending'],
    isFeatured: true,
    createdAt: new Date().toISOString()
  },

  // 15. STUSSY STOCK BIG LOGO BEANIE
  {
    id: 'prod-015',
    name: 'Stussy Stock Big Logo Knit Beanie "Black"',
    slug: 'stussy-stock-big-logo-beanie-black',
    description: 'Soft acrylic rib-knit foldover cuff beanie featuring the bold Stussy Stock script embroidery wrapped around the crown. Keeps heat in while elevating your streetwear silhouette.',
    shortDescription: 'Chunky rib knit beanie with contrast Stussy script embroidery.',
    price: 42,
    compareAtPrice: 50,
    category: 'Accessories',
    categorySlug: 'accessories',
    brand: 'Stussy',
    sku: 'STU-BEANIE-BLK',
    tags: ['accessories', 'stussy', 'beanie', 'headwear'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Knit', value: '100% Hypoallergenic Acrylic' },
      { label: 'Cuff', value: '3-Inch Foldover Double Rib' },
      { label: 'Fit', value: 'One Size Fits All' }
    ],
    rating: 4.7,
    reviewCount: 140,
    stock: 28,
    options: [
      { name: 'Size', values: ['One Size'] },
      { name: 'Color', values: ['Black'] }
    ],
    variants: [
      { id: 'v39', sku: 'STU-BEANIE-OS', title: 'One Size / Black', price: 42, stock: 28, selectedOptions: { 'Size': 'One Size', 'Color': 'Black' } }
    ],
    badges: ['Trending'],
    createdAt: new Date().toISOString()
  },

  // 16. JORDAN RETRO HERITAGE CAP
  {
    id: 'prod-016',
    name: 'Jordan Jumpman Heritage86 Washed Strapback "Obsidian"',
    slug: 'jordan-jumpman-heritage86-strapback',
    description: 'Unstructured low-profile 6-panel cap crafted from washed twill cotton for an authentic worn-in drape. Metal Jumpman ingot hardware emblem on the front and adjustable antique brass closure.',
    shortDescription: 'Washed twill 6-panel strapback with metallic Jumpman emblem.',
    price: 36,
    compareAtPrice: 45,
    category: 'Accessories',
    categorySlug: 'accessories',
    brand: 'Jordan',
    sku: 'JDN-H86-CAP',
    tags: ['accessories', 'jordan', 'cap', 'headwear'],
    stockStatus: 'in_stock',
    thumbnail: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Crown', value: 'Unstructured 6-Panel' },
      { label: 'Hardware', value: 'Metallic Jumpman Ingot' },
      { label: 'Closure', value: 'Adjustable Fabric Strap & Clasp' }
    ],
    rating: 4.8,
    reviewCount: 88,
    stock: 20,
    options: [
      { name: 'Size', values: ['One Size'] },
      { name: 'Color', values: ['Obsidian'] }
    ],
    variants: [
      { id: 'v40', sku: 'JDN-CAP-OS', title: 'One Size / Obsidian', price: 36, stock: 20, selectedOptions: { 'Size': 'One Size', 'Color': 'Obsidian' } }
    ],
    badges: [],
    createdAt: new Date().toISOString()
  }
];

export const HERO_SLIDES: HeroSlide[] = [];
export const BLOG_POSTS: BlogPost[] = [];
export const TESTIMONIALS: Testimonial[] = [];
export const SOCIAL_POSTS: SocialPost[] = [];
export const PRODUCT_QAS: { [id: string]: any[] } = {};
export const REVIEWS: { [id: string]: any[] } = {};

// Recalculate item counts dynamically
CATEGORIES.forEach(cat => {
  cat.itemCount = PRODUCTS.filter(p => p.categorySlug === cat.slug).length;
});
BRANDS.forEach(brand => {
  brand.productCount = PRODUCTS.filter(p => p.brand.toLowerCase() === brand.name.toLowerCase() || p.brand.toLowerCase() === brand.slug.toLowerCase()).length;
});
