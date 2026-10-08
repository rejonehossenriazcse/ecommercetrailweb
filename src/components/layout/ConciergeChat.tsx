'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  X,
  Send,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Flame,
  Zap,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface ChatMessage {
  id: string;
  sender: 'concierge' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  recommendations?: any[];
}

export default function ConciergeChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'track' | 'alerts'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'concierge',
      text: "Yo! I'm KAI, your streetwear concierge at Stride District. I can help you track orders, or even recommend the best products based on what you're looking for! What's on your mind?",
      timestamp: 'Just now',
      quickReplies: [
        'Recommend me something',
        'Show me some Jordans',
        'Check Order Delivery Status',
        'How do I use code STREET10?',
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Order Tracker State
  const [orderQuery, setOrderQuery] = useState('');
  const [orderResult, setOrderResult] = useState<any>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Drop Alert State
  const [alertEmail, setAlertEmail] = useState('');
  const [alertProduct, setAlertProduct] = useState('Air Jordan 4 Military Black');
  const [alertSuccess, setAlertSuccess] = useState(false);

  const { addToast } = useStore();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const json = await res.json();
      
      if (json.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `c-${Date.now()}`,
            sender: 'concierge',
            text: json.data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickReplies: json.data.quickReplies,
            recommendations: json.data.recommendations,
          },
        ]);
      } else {
        throw new Error('Failed');
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          sender: 'concierge',
          text: "My neural network is experiencing a slight delay. Please try asking again in a moment.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: ['Check Order Delivery Status', 'How do I use code STREET10?'],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    if (reply === 'Check Order Delivery Status' || reply === 'Open Order Tracker') {
      setActiveMode('track');
    } else {
      handleSendMessage(reply);
    }
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setOrderLoading(true);
    setOrderError('');
    setOrderResult(null);

    try {
      const res = await fetch('/api/v1/orders');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const found = json.data.find(
          (o: any) =>
            o.id.toLowerCase() === orderQuery.trim().toLowerCase() ||
            o.orderNumber.toLowerCase() === orderQuery.trim().toLowerCase() ||
            (o.trackingNumber && o.trackingNumber.toLowerCase() === orderQuery.trim().toLowerCase())
        );

        if (found) {
          setOrderResult(found);
        } else {
          setOrderError(`No registered shipment found for "${orderQuery.trim()}". Please check your Order ID.`);
        }
      }
    } catch {
      setOrderError('Tracking server currently syncing. Please retry in a moment.');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleSubscribeAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail.trim()) return;
    setAlertSuccess(true);
    addToast(`Drop alert set for ${alertProduct}! We'll ping ${alertEmail}`, 'success');
  };

  if (pathname === '/admin' || pathname?.startsWith('/admin/')) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-zinc-50 text-zinc-950 border border-zinc-300 shadow-[0_4px_20px_rgba(0,0,0,0.8)] hover:scale-105 hover:border-orange-500 transition-all cursor-pointer group"
          aria-label="Open Streetwear Concierge"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
          </span>
          <Flame className="w-4 h-4 text-orange-600 font-bold group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950">
            District Concierge
          </span>
        </button>
      )}

      {/* Floating Concierge Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[390px] sm:max-w-[420px] h-[580px] bg-white text-zinc-950 rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center font-black text-black text-base italic shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                  K
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-200"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>KAI</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-600 font-bold font-bold">
                    Vault Concierge
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-800 font-semibold">Online • Avg reply time: Instant</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-zinc-800 font-semibold hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-zinc-200 bg-zinc-50/60 text-xs font-mono">
            <button
              onClick={() => setActiveMode('chat')}
              className={`flex-1 py-2.5 text-center font-bold uppercase transition-colors ${
                activeMode === 'chat'
                  ? 'text-orange-400 border-b-2 border-orange-500 bg-zinc-50'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Live Chat
            </button>
            <button
              onClick={() => setActiveMode('track')}
              className={`flex-1 py-2.5 text-center font-bold uppercase transition-colors ${
                activeMode === 'track'
                  ? 'text-orange-400 border-b-2 border-orange-500 bg-zinc-50'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Track Order
            </button>
            <button
              onClick={() => setActiveMode('alerts')}
              className={`flex-1 py-2.5 text-center font-bold uppercase transition-colors ${
                activeMode === 'alerts'
                  ? 'text-orange-400 border-b-2 border-orange-500 bg-zinc-50'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Drop Alerts
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeMode === 'chat' && (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-orange-500 text-zinc-950 rounded-br-none shadow-md font-medium'
                          : 'bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-zinc-800 font-semibold font-medium font-mono mt-1 px-1">
                      {msg.timestamp}
                    </span>

                    {/* AI Product Recommendations */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2 w-full max-w-[95%]">
                        {msg.recommendations.map((prod) => (
                          <div key={prod.id} className="flex gap-3 bg-white p-2 rounded-xl shadow-sm border border-zinc-200 cursor-pointer hover:border-orange-500 transition-colors" onClick={() => window.location.href = `/product/${prod.slug}`}>
                            <div className="w-14 h-14 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                              <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover mix-blend-multiply" />
                            </div>
                            <div className="flex flex-col justify-center overflow-hidden">
                              <h4 className="text-[11px] font-bold text-zinc-950 truncate leading-tight">{prod.name}</h4>
                              <span className="text-[10px] text-zinc-600 font-medium truncate mt-0.5">{prod.category}</span>
                              <span className="text-xs font-black text-orange-600 font-bold mt-1">${prod.price.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Replies */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[90%]">
                        {msg.quickReplies.map((qr) => (
                          <button
                            key={qr}
                            onClick={() => handleQuickReply(qr)}
                            className="text-[11px] px-3 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-850 border border-zinc-300 text-zinc-800 font-bold hover:text-orange-600 font-bold transition-colors text-left cursor-pointer"
                          >
                            {qr}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 w-16">
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </>
            )}

            {/* ORDER TRACKING MODE */}
            {activeMode === 'track' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-600 font-bold font-mono uppercase">
                    <Truck className="w-4 h-4" />
                    <span>Real-Time Express Tracking</span>
                  </div>
                  <p className="text-xs text-zinc-800 font-semibold">
                    Enter your Order ID (e.g. ORD-2026-...) or tracking number to view carrier dispatch status.
                  </p>
                  <form onSubmit={handleTrackOrder} className="flex gap-2">
                    <input
                      type="text"
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      placeholder="ORD-..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-zinc-300 text-zinc-950 focus:outline-none focus:border-orange-500 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      disabled={orderLoading}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-zinc-950 text-xs font-bold uppercase rounded-xl transition-colors"
                    >
                      {orderLoading ? 'Searching...' : 'Track'}
                    </button>
                  </form>
                </div>

                {orderError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    {orderError}
                  </div>
                )}

                {orderResult && (
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                      <span className="font-bold text-zinc-950 font-mono">{orderResult.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase text-[10px] font-bold">
                        {orderResult.status}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-zinc-800 font-bold">
                      <p><strong>Customer:</strong> {orderResult.customerName}</p>
                      <p><strong>Total:</strong> ${orderResult.total.toFixed(2)}</p>
                      <p><strong>Tracking:</strong> <span className="font-mono text-orange-600 font-bold">{orderResult.trackingNumber || 'DHL-EXP-482910'}</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DROP ALERTS MODE */}
            {activeMode === 'alerts' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-600 font-bold font-mono uppercase">
                    <Zap className="w-4 h-4" />
                    <span>VIP Drop Notification</span>
                  </div>
                  <p className="text-xs text-zinc-800 font-semibold">
                    Get pinged 15 minutes before shock drops and limited restocks hit the District Vault.
                  </p>

                  {alertSuccess ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Alert registered! You're on the priority notification list.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribeAlert} className="space-y-3">
                      <div>
                        <label className="text-[11px] text-zinc-800 font-semibold block mb-1">Target Drop:</label>
                        <select
                          value={alertProduct}
                          onChange={(e) => setAlertProduct(e.target.value)}
                          className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-950"
                        >
                          <option>Air Jordan 4 Retro Military Black</option>
                          <option>Travis Scott x AJ1 Reverse Mocha</option>
                          <option>Supreme Box Logo Heavyweight Hoodie</option>
                          <option>Yeezy Slide Bone Restock</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-800 font-semibold block mb-1">Your Email:</label>
                        <input
                          type="email"
                          required
                          value={alertEmail}
                          onChange={(e) => setAlertEmail(e.target.value)}
                          placeholder="your-email@domain.com"
                          className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-950"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold uppercase rounded-xl text-xs transition-colors"
                      >
                        Notify Me on Drop
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bottom */}
          {activeMode === 'chat' && (
            <div className="p-3 bg-zinc-50 border-t border-zinc-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask KAI about sizing, drops, legit checks..."
                  className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-950 placeholder:text-zinc-800 font-semibold font-medium focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-zinc-950 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>
      )}
    </>
  );
}
