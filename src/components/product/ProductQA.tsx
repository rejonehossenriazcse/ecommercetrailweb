'use client';

import React, { useState } from 'react';
import { Product, ProductQA as ProductQAType } from '@/types';
import { PRODUCT_QAS } from '@/data/mockData';
import { useStore } from '@/context/StoreContext';
import { HelpCircle, MessageSquare, Plus, CheckCircle2, X } from 'lucide-react';

interface ProductQAProps {
  product: Product;
}

export default function ProductQA({ product }: ProductQAProps) {
  const { addToast } = useStore();
  const initialQAs: ProductQAType[] = PRODUCT_QAS[product.id] || [
    {
      id: 'qa-def-1',
      productId: product.id,
      question: 'Is this product covered by global warranty when traveling internationally?',
      askedBy: 'Marcus V.',
      date: 'September 22, 2026',
      answer:
        'Yes! All Stride District items include our 100% Authenticity Guarantee. Every pair is physically inspected, UV verified, and shipped double-boxed.',
      answeredBy: 'Stride Concierge Team',
      answeredDate: 'September 22, 2026',
    },
  ];

  const [qaList, setQaList] = useState<ProductQAType[]>(initialQAs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [askerName, setAskerName] = useState('');

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !askerName.trim()) return;

    const newQA: ProductQAType = {
      id: `qa-${Date.now()}`,
      productId: product.id,
      question: questionText,
      askedBy: askerName,
      date: 'Just now',
      answer:
        'Thank you for your question. A sneaker & sizing specialist from our concierge team will review and answer shortly.',
      answeredBy: 'Stride Concierge Desk',
      answeredDate: 'Pending verification',
    };

    setQaList([newQA, ...qaList]);
    setIsModalOpen(false);
    setQuestionText('');
    setAskerName('');
    addToast('Question submitted to Stride Concierge!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <div>
          <h4 className="text-base font-bold text-zinc-900">
            Community & Technical Q&A ({qaList.length})
          </h4>
          <p className="text-xs text-zinc-800 font-semibold font-medium mt-0.5">
            Direct inquiries answered by our industrial design and acoustic engineering teams.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-zinc-50 hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ask Question</span>
        </button>
      </div>

      <div className="space-y-6 divide-y divide-zinc-100">
        {qaList.map((item) => (
          <div key={item.id} className="pt-4 first:pt-0 space-y-3">
            {/* Question */}
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 font-bold text-xs flex items-center justify-center shrink-0">
                Q
              </span>
              <div>
                <h5 className="text-sm font-semibold text-zinc-900">{item.question}</h5>
                <span className="text-[11px] text-zinc-800 font-semibold">
                  Asked by {item.askedBy} • {item.date}
                </span>
              </div>
            </div>

            {/* Answer */}
            {item.answer && (
              <div className="flex items-start gap-3 pl-9">
                <span className="w-6 h-6 rounded-full bg-zinc-50 text-zinc-900 font-bold font-bold text-xs flex items-center justify-center shrink-0">
                  A
                </span>
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex-1">
                  <p className="text-xs text-zinc-800 font-bold leading-relaxed">{item.answer}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-800 font-semibold font-medium font-medium mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Answered by {item.answeredBy}</span>
                    <span>•</span>
                    <span>{item.answeredDate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="text-base font-bold text-zinc-900">Ask the Engineering Team</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-zinc-800 font-semibold hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAskQuestion} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-bold text-zinc-800 font-bold block mb-1">Your Name</label>
                <input
                  type="text"
                  value={askerName}
                  onChange={(e) => setAskerName(e.target.value)}
                  placeholder="e.g. David Ross"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 font-bold block mb-1">Your Question</label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={4}
                  placeholder="Inquire about battery cycle longevity, compatibility, materials, or warranty..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-zinc-800 font-semibold hover:text-zinc-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-zinc-50 text-white font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
