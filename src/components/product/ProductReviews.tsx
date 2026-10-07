'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product, ProductReview } from '@/types';
import { useStore } from '@/context/StoreContext';
import { Star, CheckCircle, ThumbsUp, Plus, X, Flame } from 'lucide-react';

interface ProductReviewsProps {
  product: Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const { addToast, customer } = useStore();
  const initialReviews: ProductReview[] = [
    {
      id: 'rev-default-1',
      productId: product.id,
      customerName: 'Marcus T.',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      title: '100% Authentic — Shipped Insanely Fast',
      comment: 'Materials are top-tier. Box was double-boxed with vault authentication tag intact. Definitely copping again from Stride District.',
      date: 'October 2, 2026',
      verifiedPurchase: true,
      helpfulCount: 24,
    },
    {
      id: 'rev-default-2',
      productId: product.id,
      customerName: 'Devon K.',
      rating: 5,
      title: 'Fits True to Size, Unbelievable Quality',
      comment: 'The stitching and cut on this are crazy good. Worth every dollar.',
      date: 'September 29, 2026',
      verifiedPurchase: true,
      helpfulCount: 18,
    },
  ];

  const [reviewsList, setReviewsList] = useState<ProductReview[]>(initialReviews);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<{ [id: string]: boolean }>({});

  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState(customer?.name || '');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleVoteHelpful = (id: string) => {
    if (helpfulVotes[id]) return;
    setHelpfulVotes((prev) => ({ ...prev, [id]: true }));
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    addToast('Thanks for your feedback!', 'success');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const reviewerName = newName.trim() || customer?.name || 'District Collector';
    if (!reviewerName || !newTitle.trim() || !newComment.trim()) {
      addToast('Please complete all review fields.', 'warning');
      return;
    }

    const created: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      customerName: reviewerName,
      rating: newRating,
      title: newTitle,
      comment: newComment,
      date: 'Just now',
      verifiedPurchase: true,
      helpfulCount: 0,
    };

    setReviewsList([created, ...reviewsList]);
    setIsWriteModalOpen(false);
    setNewTitle('');
    setNewComment('');

    addToast('Your review has been verified and published!', 'success');
  };

  const totalReviews = reviewsList.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviewsList.filter((r) => r.rating === star).length;
    return {
      star,
      count,
      percent: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
    };
  });

  return (
    <div className="space-y-10 text-white">
      {/* Overview & Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-800">
        {/* Rating Score */}
        <div className="md:col-span-4 text-center md:border-r border-zinc-800 md:pr-8">
          <div className="text-5xl font-black text-white tracking-tight">
            {product.rating.toFixed(1)}
          </div>
          <div className="flex justify-center text-amber-400 my-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-800'
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-zinc-400">
            Based on {totalReviews} verified collector reviews
          </p>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="mt-4 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Distribution Bars */}
        <div className="md:col-span-8 space-y-2">
          {ratingCounts.map((item) => (
            <div key={item.star} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-bold text-zinc-400 flex items-center gap-1">
                {item.star} <Star className="w-3 h-3 text-amber-400 fill-current" />
              </span>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <span className="w-10 text-right font-mono text-zinc-500 text-[11px]">
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h4 className="text-base font-black uppercase text-white">
          Collector Feedback ({reviewsList.length})
        </h4>

        <div className="divide-y divide-zinc-800/80">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="py-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-orange-400">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-bold text-white">{rev.customerName}</h5>
                      {rev.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">{rev.date}</span>
                  </div>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-zinc-800'}`}
                    />
                  ))}
                </div>
              </div>

              <h6 className="text-sm font-bold text-white">{rev.title}</h6>
              <p className="text-xs text-zinc-300 leading-relaxed">{rev.comment}</p>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
                <span>Was this review helpful?</span>
                <button
                  onClick={() => handleVoteHelpful(rev.id)}
                  disabled={helpfulVotes[rev.id]}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  <ThumbsUp className="w-3 h-3 text-orange-400" />
                  <span>Yes ({rev.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-black uppercase text-white">Write Your Review</h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Rating:
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Your Name:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jordan V."
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Review Headline:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Sum up your experience in one sentence"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Detailed Feedback:
                </label>
                <textarea
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="How did it fit? Material quality? Packaging condition?"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
