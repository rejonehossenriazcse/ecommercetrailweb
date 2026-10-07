'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ProductVariant, Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import ProductGallery from '@/components/product/ProductGallery';
import ProductReviews from '@/components/product/ProductReviews';
import ProductQA from '@/components/product/ProductQA';
import FrequentlyBoughtTogether from '@/components/product/FrequentlyBoughtTogether';
import SizeGuideModal from '@/components/product/SizeGuideModal';
import ProductCard from '@/components/product/ProductCard';
import { trackEcommerceEvent } from '@/lib/tracking';
import {
  Star,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  ShoppingBag,
  Zap,
  CheckCircle,
  Clock,
  ArrowRight,
  Flame,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    addToast,
    addRecentlyViewed,
  } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'materials' | 'warranty' | 'reviews'>('desc');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [deliveryZip, setDeliveryZip] = useState('10001');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('Friday, 2-Day Air Express');
  const [isShareCopied, setIsShareCopied] = useState(false);

  // Fetch product from backend
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/v1/products/${slug}`);
        const data = await res.json();
        
        if (data.success && data.data) {
          setProduct(data.data);
          // Fetch related products
          const relRes = await fetch(`/api/v1/products?category=${data.data.categorySlug}`);
          const relData = await relRes.json();
          if (relData.success) {
            setRelatedProducts(relData.data.filter((p: Product) => p.id !== data.data.id));
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product data:', err);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchProductData();
  }, [slug]);

  // Initialize options and track recently viewed
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      const defaults: { [key: string]: string } = {};
      product.options.forEach((opt) => {
        if (opt.values.length > 0) defaults[opt.name] = opt.values[0];
      });
      setSelectedOptions(defaults);
      setQuantity(1);

      trackEcommerceEvent('ViewContent', {
        contentId: product.id,
        contentName: product.name,
        contentType: 'product',
        value: product.price,
        currency: 'USD',
        category: product.category,
      });
    }
  }, [product, addRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Authenticating Drop...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-2 uppercase">Grail Not Found</h2>
          <p className="text-sm text-zinc-400 mb-6">The requested drop could not be located in the District Vault.</p>
          <Link href="/shop" className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors">
            Return to Drops
          </Link>
        </div>
      </div>
    );
  }

  const currentVariant: ProductVariant | undefined = product.variants.find((v) => {
    return Object.entries(selectedOptions).every(
      ([key, val]) => v.selectedOptions[key] === val
    );
  });

  const activePrice = currentVariant?.price ?? product.price;
  const activeCompareAt = currentVariant?.compareAtPrice ?? product.compareAtPrice;
  const activeStock = currentVariant?.stock ?? product.stock;
  const isWishlisted = isInWishlist(product.id);

  const discountPercent = activeCompareAt
    ? Math.round(((activeCompareAt - activePrice) / activeCompareAt) * 100)
    : 0;

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions, currentVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedOptions, currentVariant);
    router.push('/checkout');
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsShareCopied(true);
      addToast('Product URL copied to clipboard!', 'info');
      setTimeout(() => setIsShareCopied(false), 3000);
    }
  };

  const handleCalculateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryZip) return;
    setEstimatedDeliveryDate('Friday, 2-Day Priority Air Transit');
    addToast(`Delivery options updated for Zip ${deliveryZip}`, 'info');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs font-mono text-zinc-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-orange-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-orange-400 transition-colors">
            Drops
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.categorySlug}`}
            className="hover:text-orange-400 transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-white font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Gallery Stage */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
              badges={product.badges}
            />
          </div>

          {/* Right Column: Details & Buying Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Brand & Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Link
                  href={`/shop?brand=${encodeURIComponent(product.brand)}`}
                  className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {product.brand}
                </Link>
                <span className="text-[11px] font-mono text-zinc-500">SKU: {currentVariant?.sku || product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight uppercase">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-800'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">{product.rating.toFixed(1)}</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-zinc-400 hover:text-orange-400 underline underline-offset-4 cursor-pointer"
                >
                  ({product.reviewCount} customer reviews)
                </button>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">
                  {formatPrice(activePrice)}
                </span>
                {activeCompareAt && (
                  <span className="text-base text-zinc-500 line-through">
                    {formatPrice(activeCompareAt)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-black uppercase tracking-wider">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                {activeStock > 0 ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Verified In Stock — Ships within 24 Hours
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold">Sold Out — Next Drop Pending</span>
                )}
                {activeStock <= 8 && activeStock > 0 && (
                  <span className="text-orange-400 font-bold bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-md text-[10px]">
                    Only {activeStock} pairs remaining
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Variant Options Selector */}
            <div className="space-y-4 pt-2">
              {product.options.map((opt) => (
                <div key={opt.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-300 uppercase tracking-wider">
                      Select {opt.name}: <span className="font-mono text-orange-400 font-bold">{selectedOptions[opt.name]}</span>
                    </span>

                    {(opt.name === 'Size') && (
                      <button
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white underline cursor-pointer"
                      >
                        <Ruler className="w-3 h-3 text-orange-400" />
                        <span>Sizing Guide</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {opt.values.map((val) => {
                      const isSelected = selectedOptions[opt.name] === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleOptionChange(opt.name, val)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                              : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity Selector & Action CTAs */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-zinc-800 rounded-xl bg-zinc-900 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer text-sm"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(activeStock, quantity + 1))}
                    disabled={quantity >= activeStock}
                    className="w-10 h-10 flex items-center justify-center font-bold text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer text-sm disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  disabled={activeStock === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{activeStock > 0 ? 'Add to Bag' : 'Out of Stock'}</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={activeStock === 0}
                className="w-full py-4 px-6 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-orange-500 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-orange-400 fill-current" />
                <span>Instant Express Checkout</span>
              </button>
            </div>

            {/* Delivery Schedule Estimator */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-orange-400" />
                  <span>Insured Express Shipping</span>
                </span>
                <span className="font-mono text-emerald-400 font-semibold">Tracked Courier</span>
              </div>

              <form onSubmit={handleCalculateDelivery} className="flex gap-2">
                <input
                  type="text"
                  value={deliveryZip}
                  onChange={(e) => setDeliveryZip(e.target.value)}
                  placeholder="Enter Postal Code"
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Estimate
                </button>
              </form>

              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Arrival: <strong className="text-white">{estimatedDeliveryDate}</strong></span>
              </div>
            </div>

            {/* Share and Authenticity Badges */}
            <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-zinc-500" />
                <span>Share:</span>
                <button
                  onClick={handleCopyLink}
                  className="hover:text-orange-400 font-semibold underline cursor-pointer ml-1"
                >
                  {isShareCopied ? 'Link Copied!' : 'Copy Link'}
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>100% Legit Check Guarantee</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Information Section */}
        <div className="mt-16 pt-12 border-t border-zinc-800">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto border-b border-zinc-800 pb-3">
            {[
              { id: 'desc', label: 'Story & Drop Details' },
              { id: 'specs', label: 'Tech Specifications' },
              { id: 'materials', label: 'Authenticity & Legit Check' },
              { id: 'warranty', label: 'Worldwide Shipping & Returns' },
              { id: 'reviews', label: `Customer Reviews (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'desc' && (
              <div className="max-w-3xl space-y-4 text-sm text-zinc-300 leading-relaxed">
                <h3 className="text-xl font-black uppercase text-white tracking-tight">
                  Design Narrative & Cultural Roots
                </h3>
                <p>{product.description}</p>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-1.5">
                  <span className="font-bold text-white uppercase font-mono">District Highlights:</span>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    <li>Individually verified and authenticated by District Vault specialists.</li>
                    <li>Ships in original factory packaging with verified RFID hangtag.</li>
                    <li>Climate-controlled storage preserves rubber sole longevity and leather suppleness.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-3xl">
                <h3 className="text-xl font-black uppercase text-white tracking-tight mb-4">
                  Drop Specifications
                </h3>
                <div className="rounded-2xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800 text-xs bg-zinc-900">
                  {product.specifications?.map((spec, i) => (
                    <div key={i} className="grid grid-cols-3 p-3.5 hover:bg-zinc-850">
                      <span className="font-bold text-zinc-400">{spec.label}</span>
                      <span className="col-span-2 text-white font-mono">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="max-w-3xl space-y-4 text-xs text-zinc-300 leading-relaxed">
                <h3 className="text-xl font-black uppercase text-white tracking-tight mb-2">
                  Legit Check & Quality Standards
                </h3>
                <p>
                  Every single item at Stride District undergoes a strict multi-point authentication inspection by sneaker veterans. We inspect stitching density, UV-light tags, box labels, font spacing, and material smell before any item leaves our vault.
                </p>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-orange-500 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">100% Authentic or 200% Money Back</h4>
                    <p className="text-[11px] text-zinc-400">Never worry about fakes. Guaranteed original or full double refund.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div className="max-w-3xl space-y-4 text-xs text-zinc-300 leading-relaxed">
                <h3 className="text-xl font-black uppercase text-white tracking-tight">
                  Shipping & Return Policy
                </h3>
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <h4 className="text-sm font-bold text-white uppercase">Complimentary Insured Shipping</h4>
                  <p>All orders over $150 qualify for free tracked express transit. Signature required upon delivery.</p>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <h4 className="text-sm font-bold text-white uppercase">14-Day Hassle-Free Returns</h4>
                  <p>Unworn items with original tags and packaging intact may be returned within 14 calendar days of receipt.</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ProductReviews product={product} />
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
                  You May Also Like
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1 uppercase">
                  More in {product.category}
                </h3>
              </div>
              <Link
                href={`/shop?category=${product.categorySlug}`}
                className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1.5"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Size Guide Modal */}
        <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      </div>
    </div>
  );
}
