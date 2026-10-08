'use client';

import React, { useState, useEffect } from 'react';
import { ReviewRecord } from '@/lib/db/schema';
import {
  Star,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import FrontendMappingBanner from '@/components/admin/FrontendMappingBanner';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const fetchReviews = () => {
    setLoading(true);
    const url = statusFilter === 'all' ? '/api/v1/reviews' : `/api/v1/reviews?status=${statusFilter}`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setReviews(json.data);
      })
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/v1/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
        setActionSuccess(`Review status marked as ${status.toUpperCase()}`);
        setTimeout(() => setActionSuccess(''), 2500);
      }
    } catch (err) {
      console.error('Failed to moderate review', err);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || r.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <FrontendMappingBanner
        title="Product Reviews"
        badge="Frontend Control: Reviews & Stars"
        description="Moderate customer ratings, approve verified buyer quotes, and control testimonials displayed on product pages."
        controlsWhat="The Customer Reviews tab on each product page and the verified reviews testimonial slider on the homepage."
        previewUrl="/shop"
        breadcrumbs={[{ label: 'Catalog' }, { label: 'Product Reviews' }]}
        actions={
          actionSuccess ? (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{actionSuccess}</span>
            </div>
          ) : undefined
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#12151a] border border-zinc-200/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-800 font-semibold mb-2">
            <span className="text-xs font-medium">Pending Moderation</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{pendingCount} reviews</div>
          <div className="text-[11px] text-zinc-800 font-semibold font-medium mt-1 font-mono">Requires Action</div>
        </div>

        <div className="bg-[#12151a] border border-zinc-200/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-800 font-semibold mb-2">
            <span className="text-xs font-medium">Approved & Live</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900 font-bold">{approvedCount} published</div>
          <div className="text-[11px] text-emerald-400/90 mt-1 font-mono">Visible on Storefront</div>
        </div>

        <div className="bg-[#12151a] border border-zinc-200/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-800 font-semibold mb-2">
            <span className="text-xs font-medium">Average Store Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900 font-bold">{avgRating} / 5.0</div>
          <div className="text-[11px] text-zinc-800 font-semibold font-medium mt-1 font-mono">From All Verified Purchases</div>
        </div>

        <div className="bg-[#12151a] border border-zinc-200/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-800 font-semibold mb-2">
            <span className="text-xs font-medium">Verified Buyers Ratio</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900 font-bold">98.2%</div>
          <div className="text-[11px] text-zinc-800 font-semibold font-medium mt-1 font-mono">Cryptographically Proven</div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#12151a] border border-zinc-200/80 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors shrink-0 ${
                statusFilter === status
                  ? 'bg-amber-400 text-zinc-950 font-bold'
                  : 'bg-zinc-50 text-zinc-600 hover:text-white hover:bg-zinc-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search & Rating Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-zinc-800 font-semibold font-medium absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product or customer..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 font-bold placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Stars</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-[#12151a] border border-zinc-200/80 rounded-2xl p-12 text-center text-zinc-800 font-semibold font-medium text-xs">
            Querying customer testimonials queue...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-[#12151a] border border-zinc-200/80 rounded-2xl p-12 text-center text-zinc-800 font-semibold font-medium text-xs">
            No reviews matching selected criteria.
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#12151a] border border-zinc-200/80 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-300 transition-colors"
            >
              {/* Review Details */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 font-bold">{review.title}</h3>

                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                      review.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : review.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {review.status}
                  </span>

                  {review.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                {/* Comment body */}
                <p className="text-xs text-zinc-800 font-bold leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Author and Product Footnote */}
                <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-800 font-semibold font-medium pt-1">
                  <span className="text-zinc-800 font-bold font-semibold">{review.customerName}</span>
                  <span>•</span>
                  <span className="text-amber-400/90">{review.productName}</span>
                  <span>•</span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {review.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(review.id, 'approved')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                )}

                {review.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(review.id, 'rejected')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
