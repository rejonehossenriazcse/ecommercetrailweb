import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import AnimatedSection from '@/components/home/AnimatedSection';
import { 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  CheckCircle2, 
  RefreshCcw, 
  Lock,
  ArrowRight,
  Flame,
  Sparkles,
  Smartphone,
  QrCode,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { SEED_CMS_SECTIONS } from '@/lib/db/seed';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, categories, cmsSectionsRaw, blogs] = await Promise.all([
    db.getProducts(),
    db.getCategories(),
    db.getCMSSections('home'),
    db.getBlogs(),
  ]);

  const cmsSections = cmsSectionsRaw && cmsSectionsRaw.length > 0 ? cmsSectionsRaw : SEED_CMS_SECTIONS;
  const activeSections = cmsSections.filter((s) => s.isEnabled !== false).sort((a, b) => a.order - b.order);

  const newArrivals = products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const featuredCategories = categories.filter((c) => c.isFeatured);

  return (
    <div className="w-full bg-white font-sans selection:bg-orange-500 selection:text-white">
      {activeSections.map((sec, index) => {
        // 1. HERO SLIDER & AD BANNER
        if (sec.type === 'hero_slider') {
          const settings = sec.settings || {};
          const showAd = settings.showAdBanner !== false;
          const showTrust = settings.showTrustBadges !== false;
          const showWatermark = settings.showWatermark !== false;

          return (
            <React.Fragment key={sec.id || `hero-${index}`}>
              {/* Optional Hero Ads / Announcement Bar */}
              {showAd && (
                <div 
                  className="w-full py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 relative z-30 shadow-md border-b border-black/20 text-zinc-950"
                  style={{ backgroundColor: settings.adBgColor || '#f97316' }}
                >
                  <span className="bg-black text-amber-400 px-2.5 py-0.5 rounded text-[10px] font-black tracking-widest uppercase shadow-sm">
                    {settings.adBadgeText || '🔥 HOT DROP'}
                  </span>
                  <span className="font-extrabold tracking-tight text-center">
                    {settings.adText || 'MIDNIGHT DROP IS LIVE: 20% OFF SELECT GRAILS WITH CODE: CULTURE20 | FREE EXPRESS SHIPPING OVER $150'}
                  </span>
                  <Link 
                    href={settings.adLinkUrl || '/shop?filter=sale'} 
                    className="inline-flex items-center gap-1 font-black text-zinc-950 hover:text-zinc-900 font-bold underline underline-offset-2 transition-colors shrink-0"
                  >
                    {settings.adLinkText || 'Shop Shock Drop'} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Main Hero Showcase */}
              <section className="relative w-full min-h-[85vh] md:min-h-[90vh] flex items-center bg-[#0a0a0a] overflow-hidden border-b border-zinc-200">
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                  <img 
                    src={settings.backgroundImage || "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=2000&auto=format&fit=crop"} 
                    alt="Hero Background" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <AnimatedSection className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 md:pt-20 pb-24 md:pb-20">
                  <div className="max-w-2xl">
                    <h2 className="text-lime-400 font-serif italic text-2xl md:text-3xl mb-2 tracking-wide">
                      {settings.tagline || '@OWN THE STREETS'}
                    </h2>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-6">
                      {settings.titleLine1 || 'BUILT FOR'} <br />
                      <span className="text-orange-500">{settings.titleHighlight || 'MOVEMENT'}</span>
                    </h1>
                    <p className="text-zinc-300 font-medium text-lg md:text-xl max-w-md mb-8 leading-snug">
                      {settings.description || 'Exclusive sneakers and streetwear for the culture. For the bold. For you.'}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        href={settings.primaryBtnLink || '/shop?sort=newest'}
                        className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-sm"
                      >
                        {settings.primaryBtnText || 'Shop New Arrivals'} <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={settings.secondaryBtnLink || '/shop'}
                        className="px-8 py-4 border-2 border-white hover:bg-white hover:text-black text-white font-bold text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-sm"
                      >
                        {settings.secondaryBtnText || 'Explore Looks'} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>

                {/* Floating Brand Watermark */}
                {showWatermark && (
                  <AnimatedSection delay={0.3} className="absolute top-1/4 right-10 z-20 hidden lg:block opacity-30 transform rotate-12 pointer-events-none select-none">
                    <h2 className="text-8xl font-black text-transparent uppercase leading-none whitespace-pre-line" style={{ WebkitTextStroke: '2px white' }}>
                      {settings.watermarkText || 'STRIDE\nDISTRICT'}
                    </h2>
                  </AnimatedSection>
                )}

                {/* Trust Badges Bar */}
                {showTrust && (
                  <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-r from-black via-black/80 to-transparent py-5 border-t border-zinc-200/60">
                    <AnimatedSection delay={0.4} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-6 sm:gap-10 text-white">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-orange-500 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider">{settings.badge1Title || '100% Authentic'}</h4>
                          <p className="text-[10px] text-zinc-400 font-medium">{settings.badge1Sub || 'Guaranteed'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <RefreshCcw className="w-6 h-6 text-orange-500 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider">{settings.badge2Title || 'Easy Returns'}</h4>
                          <p className="text-[10px] text-zinc-400 font-medium">{settings.badge2Sub || '14-Day Policy'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Lock className="w-6 h-6 text-orange-500 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider">{settings.badge3Title || 'Secure Checkout'}</h4>
                          <p className="text-[10px] text-zinc-400 font-medium">{settings.badge3Sub || 'Shop with Confidence'}</p>
                        </div>
                      </div>
                    </AnimatedSection>
                  </div>
                )}
              </section>
            </React.Fragment>
          );
        }

        // 2. FEATURED CATEGORIES
        if (sec.type === 'featured_categories') {
          const count = sec.settings?.itemsCount || 4;
          const displayCategories = featuredCategories.slice(0, count);

          return (
            <section key={sec.id || `categories-${index}`} className="bg-zinc-100 py-16 md:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="flex justify-between items-end mb-10">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-zinc-950 uppercase tracking-tight">
                      {sec.title || 'Shop By Category'}
                    </h2>
                    {sec.subtitle && (
                      <p className="text-xs md:text-sm text-zinc-800 font-semibold mt-1">{sec.subtitle}</p>
                    )}
                    <div className="w-20 h-1 bg-orange-500 mt-2"></div>
                  </div>
                  <Link 
                    href={sec.settings?.viewAllLink || '/shop'} 
                    className="text-xs font-bold uppercase tracking-widest text-zinc-800 font-semibold hover:text-orange-500 flex items-center gap-1 transition-colors"
                  >
                    {sec.settings?.viewAllText || 'View All Categories'} <ArrowRight className="w-3 h-3" />
                  </Link>
                </AnimatedSection>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {displayCategories.map((cat, i) => (
                    <AnimatedSection key={cat.id} delay={i * 0.1}>
                      <Link href={`/shop?category=${cat.slug}`} className="group relative h-80 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col justify-end p-6">
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 group-hover:bg-black transition-colors">
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                        <div className="relative z-20 text-white">
                          <h3 className="text-2xl font-black uppercase mb-1">{cat.name}</h3>
                          <span className="text-orange-500 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                            Shop Now <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </Link>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // 3. PRODUCT GRID / NEW ARRIVALS
        if (sec.type === 'product_grid') {
          const count = sec.settings?.itemsCount || 5;
          const displayArrivals = newArrivals.slice(0, count);

          return (
            <section key={sec.id || `products-${index}`} className="bg-white py-16 md:py-24 border-y border-zinc-200">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="flex justify-between items-end mb-10">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-zinc-950 uppercase tracking-tight">
                      {sec.title || 'New Arrivals'}
                    </h2>
                    {sec.subtitle && (
                      <p className="text-xs md:text-sm text-zinc-800 font-semibold mt-1">{sec.subtitle}</p>
                    )}
                    <div className="w-20 h-1 bg-orange-500 mt-2"></div>
                  </div>
                  <Link 
                    href={sec.settings?.viewAllLink || '/shop?sort=newest'} 
                    className="text-xs font-bold uppercase tracking-widest text-zinc-800 font-semibold hover:text-zinc-900 font-bold flex items-center gap-1 transition-colors"
                  >
                    {sec.settings?.viewAllText || 'View All'} <ArrowRight className="w-3 h-3" />
                  </Link>
                </AnimatedSection>

                <div className="relative">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-hidden">
                    {displayArrivals.map((prod, i) => (
                      <AnimatedSection key={prod.id} delay={i * 0.1} className={`group flex flex-col bg-zinc-50 rounded-sm overflow-hidden ${i > 1 ? 'hidden md:flex' : ''} ${i > 2 ? 'lg:flex' : ''}`}>
                        <Link href={`/product/${prod.slug}`} className="relative aspect-square bg-[#222] p-6 flex items-center justify-center overflow-hidden cursor-pointer">
                          {prod.badges?.[0] && (
                            <span className="absolute top-3 left-3 bg-lime-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase z-10">{prod.badges[0]}</span>
                          )}
                          <div className="absolute top-3 right-3 text-zinc-800 font-semibold hover:text-white z-10">
                            <Heart className="w-5 h-5" />
                          </div>
                          <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover mix-blend-screen group-hover:scale-110 transition-transform duration-500" />
                        </Link>
                        <div className="p-4 flex-1 flex flex-col">
                          <Link href={`/product/${prod.slug}`}>
                            <h4 className="text-zinc-900 font-semibold text-sm mb-1 leading-tight line-clamp-2 hover:text-orange-500 transition-colors">{prod.name}</h4>
                          </Link>
                          <div className="mt-auto pt-3 flex items-center justify-between">
                            <span className="text-zinc-950 font-bold">${prod.price.toFixed(2)}</span>
                            {prod.compareAtPrice && (
                              <span className="text-zinc-800 font-semibold font-medium line-through text-xs">${prod.compareAtPrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // 4. PROMOTIONAL BANNER / FLASH SALE
        if (sec.type === 'promotional_banners' || sec.type === 'flash_sale') {
          const settings = sec.settings || {};
          const bgColor = settings.bgColor || '#f97316';

          return (
            <AnimatedSection key={sec.id || `promo-${index}`}>
              <section 
                className="relative w-full overflow-hidden py-16 md:py-24"
                style={{ backgroundColor: bgColor }}
              >
                <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-paper.png")' }}></div>
                <div className="absolute top-0 right-0 h-full w-1/3 bg-black/10 blur-3xl transform skew-x-12"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="flex items-center gap-6">
                    <h3 className="text-yellow-300 font-serif italic text-3xl md:text-5xl transform -rotate-6 shadow-black drop-shadow-md">
                      {settings.tagline || 'LIMITED TIME\nONLY'}
                    </h3>
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-black uppercase tracking-tighter leading-none">
                      {settings.heading || 'UP TO 40% OFF'}
                    </h2>
                  </div>
                  
                  <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
                    <h3 className="text-zinc-900 font-bold font-black italic text-3xl md:text-4xl uppercase tracking-widest" style={{ WebkitTextStroke: '1px black' }}>
                      {settings.subtitle || 'ON SELECT STYLES'}
                    </h3>
                    <Link 
                      href={settings.btnLink || '/shop?filter=sale'}
                      className="px-10 py-4 border-2 border-black hover:bg-black hover:text-white text-black font-black text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-sm bg-transparent"
                    >
                      {settings.btnText || 'Shop The Sale'} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {settings.showSmileWatermark !== false && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block opacity-80 mix-blend-screen pointer-events-none select-none">
                      <div className="w-48 h-48 rounded-full border-[10px] border-lime-400 flex items-center justify-center relative shadow-[0_0_30px_rgba(163,230,53,0.6)] animate-pulse">
                        <div className="absolute top-10 left-8 text-lime-400 font-black text-6xl">X</div>
                        <div className="absolute top-10 right-8 text-lime-400 font-black text-6xl">X</div>
                        <div className="absolute bottom-8 w-24 h-12 border-b-[8px] border-lime-400 rounded-b-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </AnimatedSection>
          );
        }

        // 5. SOCIAL GALLERY & CULTURE SECTION
        if (sec.type === 'social_gallery') {
          const settings = sec.settings || {};
          const galleryImages = settings.images && Array.isArray(settings.images) && settings.images.length > 0
            ? settings.images
            : [
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1521566652839-697aa473761a?q=80&w=400&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?q=80&w=400&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=400&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop',
              ];

          return (
            <section key={sec.id || `social-${index}`} className="bg-white py-16 md:py-24 text-zinc-950 border-b border-zinc-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 items-center">
                  
                  <AnimatedSection className="lg:col-span-4 pr-10">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6">
                      {settings.headingLine1 || 'MORE THAN\nA BRAND.'}<br/>
                      <span className="text-orange-500">{settings.headingHighlight || "IT'S A CULTURE."}</span>
                    </h2>
                    <p className="text-zinc-800 font-semibold text-sm md:text-base mb-8 leading-relaxed">
                      {settings.description || 'Stride District is built on passion, creativity, and community. Tag us in your fits #StrideDistrict to be featured.'}
                    </p>
                    <Link 
                      href={settings.btnLink || '/community'}
                      className="inline-flex px-8 py-4 border border-zinc-600 hover:border-white text-zinc-950 font-bold text-xs uppercase tracking-widest transition-colors items-center justify-center gap-2 rounded-sm"
                    >
                      {settings.btnText || 'Join The District'} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </AnimatedSection>

                  <AnimatedSection delay={0.2} className="lg:col-span-8 relative">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {galleryImages.map((imgUrl: string, idx: number) => (
                        <img 
                          key={idx}
                          src={imgUrl} 
                          alt={`Community fit ${idx + 1}`} 
                          className={`w-full h-[300px] md:h-[400px] object-cover rounded-sm filter grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer ${idx > 1 ? 'hidden md:block' : ''}`}
                        />
                      ))}
                    </div>
                  </AnimatedSection>

                </div>
              </div>
            </section>
          );
        }

        // 6. TESTIMONIALS
        if (sec.type === 'testimonials') {
          return (
            <section key={sec.id || `testimonials-${index}`} className="bg-zinc-100 py-16 md:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="mb-12">
                  <h2 className="text-3xl md:text-4xl font-black text-zinc-950 uppercase tracking-tight">
                    {sec.title || 'What Our Customers Say'}
                  </h2>
                  {sec.subtitle && (
                    <p className="text-xs md:text-sm text-zinc-800 font-semibold mt-1">{sec.subtitle}</p>
                  )}
                  <div className="w-20 h-1 bg-orange-500 mt-4"></div>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Jordan T.', 'Mike L.', 'Alyssa R.'].map((name, i) => (
                    <AnimatedSection key={i} delay={i * 0.1}>
                      <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
                        <div className="text-orange-500 font-serif text-6xl leading-none opacity-40 mb-2">"</div>
                        <p className="text-zinc-800 font-bold font-medium italic mb-6 min-h-[80px]">
                          {i === 0 ? "Fast shipping, authentic products, and fire streetwear. Stride District never misses!" :
                            i === 1 ? "The quality is top-tier and the fits hit different. My new go-to store for everything street." :
                            "Love the community and the drops. Stride District is more than a store, it's a vibe."}
                        </p>
                        <div className="flex text-orange-500 mb-4">
                          {[1,2,3,4,5].map(s => <Star key={s} fill="currentColor" className="w-4 h-4" />)}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                            <img src={`https://randomuser.me/api/portraits/${i === 2 ? 'women' : 'men'}/${32 + i * 12}.jpg`} alt={name} className="w-full h-full object-cover"/>
                          </div>
                          <span className="font-black text-zinc-900 uppercase text-xs tracking-wider">{name}</span>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // 7. BRAND SHOWCASE ROW
        if (sec.type === 'brand_showcase') {
          const rawBrands = sec.settings?.brands || 'NIKE, JORDAN, adidas, NB, Supreme, stussy, ESSENTIALS, Dickies';
          const brandList = typeof rawBrands === 'string' 
            ? rawBrands.split(',').map(b => b.trim()).filter(Boolean)
            : ['NIKE', 'JORDAN', 'adidas', 'NB', 'Supreme', 'stussy', 'ESSENTIALS', 'Dickies'];

          return (
            <section key={sec.id || `brands-${index}`} className="bg-white py-10 border-t border-zinc-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                  {brandList.map((brandName, idx) => {
                    const isSupreme = brandName.toLowerCase() === 'supreme';
                    return (
                      <span 
                        key={idx} 
                        className={`font-black text-xl md:text-2xl tracking-tighter ${
                          isSupreme 
                            ? 'bg-red-600 text-white px-2.5 py-0.5 italic font-sans' 
                            : 'text-zinc-900 hover:text-orange-500 transition-colors'
                        }`}
                      >
                        {brandName}
                      </span>
                    );
                  })}
                </AnimatedSection>
              </div>
            </section>
          );
        }

        // 8. DROP OF THE DAY SPOTLIGHT (Optional dynamic support)
        if (sec.type === 'deal_of_the_day') {
          const spotlightProduct = products[0];
          if (!spotlightProduct) return null;

          return (
            <section key={sec.id || `deal-${index}`} className="bg-zinc-50 py-16 md:py-20 border-y border-zinc-200 text-zinc-900 font-bold">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-black/60 border border-zinc-200 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between">
                  <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 font-bold border border-orange-500/20 text-xs font-bold uppercase tracking-wider mb-4">
                      <Flame className="w-3.5 h-3.5 text-orange-600 font-bold" /> {sec.title || 'Drop of the Day Spotlight'}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3">
                      {spotlightProduct.name}
                    </h3>
                    <p className="text-zinc-800 font-semibold text-sm mb-6 leading-relaxed">
                      {spotlightProduct.description}
                    </p>
                    <div className="flex items-baseline gap-4 mb-6">
                      <span className="text-3xl font-black text-zinc-900 font-bold">${spotlightProduct.price.toFixed(2)}</span>
                      {spotlightProduct.compareAtPrice && (
                        <span className="text-zinc-800 font-semibold font-medium line-through text-lg">${spotlightProduct.compareAtPrice.toFixed(2)}</span>
                      )}
                      <span className="bg-lime-400 text-black text-xs font-black px-2 py-0.5 rounded">AUTHENTICATED</span>
                    </div>
                    <Link 
                      href={`/product/${spotlightProduct.slug}`}
                      className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 rounded-sm transition-colors"
                    >
                      Cop Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="w-full md:w-80 aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden flex items-center justify-center p-6 border border-zinc-200">
                    <img src={spotlightProduct.images[0]} alt={spotlightProduct.name} className="w-full h-full object-cover mix-blend-screen" />
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // 9. BLOG JOURNAL (Optional dynamic support)
        if (sec.type === 'blog_section') {
          const displayBlogs = blogs.slice(0, 3);
          return (
            <section key={sec.id || `blog-${index}`} className="bg-white py-16 md:py-24 border-b border-zinc-200 text-zinc-950">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                      {sec.title || 'Culture, Legit Check & Drop Journal'}
                    </h2>
                    <p className="text-xs md:text-sm text-zinc-800 font-semibold mt-1">Sneaker authentications and streetwear editorials</p>
                    <div className="w-20 h-1 bg-orange-500 mt-2"></div>
                  </div>
                  <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-zinc-800 font-semibold hover:text-zinc-900 font-bold flex items-center gap-1">
                    View Journal <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {displayBlogs.map((b) => (
                    <Link key={b.id} href={`/blog/${b.slug}`} className="group bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden flex flex-col">
                      <div className="h-48 overflow-hidden bg-zinc-100">
                        <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-orange-600 font-bold mb-2">{b.category}</span>
                        <h3 className="text-lg font-bold group-hover:text-orange-500 transition-colors line-clamp-2 mb-2">{b.title}</h3>
                        <p className="text-xs text-zinc-800 font-semibold line-clamp-2 mt-auto">{b.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // 10. APP DOWNLOAD / VIP BANNER
        if (sec.type === 'app_download') {
          return (
            <section key={sec.id || `app-${index}`} className="bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-50 py-12 border-b border-zinc-200 text-zinc-950">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 font-bold">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight">{sec.title || 'Download Stride District VIP'}</h4>
                    <p className="text-xs text-zinc-800 font-semibold">Instant shock drop notifications & priority deadstock access</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-zinc-300">
                    <QrCode className="w-4 h-4 text-amber-400" /> Scan QR Code
                  </button>
                  <Link href="/shop" className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider">
                    Join VIP Club
                  </Link>
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
