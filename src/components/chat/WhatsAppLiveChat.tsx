'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  FiSend,
  FiX,
  FiMinus,
} from 'react-icons/fi';
import { RiCustomerService2Fill } from 'react-icons/ri';
import {
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useSyncChatUserMutation,
} from '@/redux/api/chatApi';
import { useGetMeQuery } from '@/redux/api/authApi';

const QUICK_CHIPS = [
  '📦 আমার অর্ডার কখন ডেলিভারি হবে?',
  '💻 টেক মাহমুদের প্রডাক্ট ওয়্যারেন্টি পলিসি কি?',
  '⚡ ঢাকা ও সারাদেশে ডেলিভারি চার্জ কত?',
  '💰 পেমেন্ট ও ইএমআই সুবিধা কিভাবে নিব?',
];

export default function WhatsAppLiveChat() {
  const { data: session } = useSession();
  const { data: meResponse } = useGetMeQuery(undefined, { skip: !session?.user });
  const userProfile = meResponse?.data;

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or restore session ID from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let stored = localStorage.getItem('techmahmud_chat_session');
      if (!stored) {
        stored = 'sb_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
        localStorage.setItem('techmahmud_chat_session', stored);
      }
      setSessionId(stored);
    }
  }, []);

  // Poll messages every 3.5s when open, or every 15s when closed to update unread badge
  const { data: chatData, isLoading } = useGetChatMessagesQuery(sessionId, {
    skip: !sessionId,
    pollingInterval: isOpen ? 3500 : 15000,
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [syncChatUser] = useSyncChatUserMutation();

  const messages = chatData?.data?.messages || [];
  const unreadCount = chatData?.data?.unreadByUser || 0;

  // Compute customer identity
  const rawFirstName =
    userProfile?.firstName ||
    (session?.user as any)?.firstName ||
    '';
  const rawLastName =
    userProfile?.lastName ||
    (session?.user as any)?.lastName ||
    '';
  const resolvedFullName =
    [rawFirstName, rawLastName].filter(Boolean).join(' ').trim() ||
    userProfile?.fullName ||
    (session?.user as any)?.name ||
    '';

  const customerPhone = userProfile?.phoneNumber || (session?.user as any)?.phoneNumber || '';
  const customerEmail = userProfile?.email || (session?.user as any)?.email || '';
  const userID = (session?.user as any)?.id || (session?.user as any)?._id || userProfile?._id || '';

  // Auto-sync customer identity to backend whenever user is logged in
  useEffect(() => {
    if (sessionId && (resolvedFullName || userID || customerEmail)) {
      syncChatUser({
        sessionId,
        customerName: resolvedFullName || undefined,
        customerPhone: customerPhone || undefined,
        customerEmail: customerEmail || undefined,
        userID: userID || undefined,
      }).catch(() => {});
    }
  }, [sessionId, resolvedFullName, userID, customerPhone, customerEmail, syncChatUser]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !sessionId || isSending) return;

    const pendingText = text;
    if (!textToSend) setInputText('');

    const customerName = resolvedFullName || 'Customer';

    try {
      await sendMessage({
        sessionId,
        text,
        customerName,
        customerPhone,
        customerEmail,
        userID,
      }).unwrap();
    } catch (err) {
      console.error('Failed to send message:', err);
      if (!textToSend) setInputText(pendingText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Trigger Button: Positioned above mobile bottom bar (bottom-[78px]) and bottom-6 on desktop; z-30 to stay behind cart drawer (z-50) */}
      <div className="fixed bottom-[78px] right-3.5 md:bottom-6 md:right-6 z-30">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="টেক মাহমুদ সাপোর্ট চ্যাট"
            style={{ backgroundColor: 'var(--color-primary, #FF5A5A)' }}
            className="group relative flex items-center justify-center p-3 md:pl-3.5 md:pr-4.5 md:py-2.5 rounded-full text-white shadow-xl hover:opacity-95 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
          >
            {/* Ambient Pulse Ring */}
            <span
              style={{ backgroundColor: 'var(--color-primary, #FF5A5A)' }}
              className="absolute -inset-1 rounded-full opacity-35 animate-ping group-hover:opacity-50"
            />

            {/* Support Headset Icon */}
            <div className="relative z-10 w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0 text-white">
              <RiCustomerService2Fill className="text-lg md:text-xl" />
            </div>

            {/* Label (hidden on mobile to keep bar clean, shown on desktop) */}
            <div className="hidden md:flex relative z-10 text-left flex-col ml-2">
              <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider leading-none">
                লাইভ সাপোর্ট
              </span>
              <span className="text-xs font-bold text-white leading-tight">
                সহায়তা দরকার?
              </span>
            </div>

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#081621] text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce z-20">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Floating In-Site Branded Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-[76px] right-2 left-2 sm:left-auto sm:bottom-6 sm:right-6 z-[999] w-[calc(100vw-16px)] sm:w-[380px] h-[520px] max-h-[78vh] sm:max-h-[85vh] flex flex-col bg-[#FAFBFB] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
          {/* Dynamic Theme Branded Header Strip */}
          <div
            style={{ backgroundColor: 'var(--color-primary, #FF5A5A)' }}
            className="px-4 py-3 sm:py-3.5 flex items-center justify-between text-white shadow-md flex-shrink-0"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              {/* Avatar with Online Dot */}
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white shadow-inner">
                  <RiCustomerService2Fill className="text-xl sm:text-2xl" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-white animate-pulse" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-white leading-tight truncate">
                    টেক মাহমুদ সাপোর্ট ডেস্ক
                  </h3>
                  <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white/30 flex-shrink-0">
                    অফিসিয়াল
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-white/90 font-medium mt-0.5">
                  {resolvedFullName ? (
                    <span className="flex items-center gap-1 truncate max-w-[190px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></span>
                      লগইন: {resolvedFullName}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></span>
                      অনলাইন • সরাসরি চ্যাট
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer"
                title="Minimize chat"
              >
                <FiMinus size={18} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer"
                title="Close chat"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body with Clean Fresh Pattern */}
          <div
            className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#f8fafc]"
            style={{
              backgroundImage: 'radial-gradient(#0000000a 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            {/* Welcome banner */}
            <div className="flex justify-center">
              <div
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--color-primary, #FF5A5A) 10%, white)',
                  borderColor: 'color-mix(in srgb, var(--color-primary, #FF5A5A) 30%, transparent)',
                  color: 'var(--color-primary, #FF5A5A)',
                }}
                className="border text-[11px] font-medium px-3 py-1.5 rounded-xl shadow-2xs text-center max-w-[92%]"
              >
                ⚡ টেক মাহমুদে স্বাগতম! আমাদের সাপোর্ট টিম সরাসরি আপনার সাথে সংযুক্ত রয়েছে।
              </div>
            </div>

            {/* Welcome greeting card */}
            <div className="flex items-start gap-2 max-w-[88%]">
              <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-xs shadow-xs border border-gray-200/80 text-xs leading-relaxed">
                <span
                  style={{ color: 'var(--color-primary, #FF5A5A)' }}
                  className="text-[11px] font-bold block mb-0.5"
                >
                  টেক মাহমুদ সাপোর্ট টিম
                </span>
                <p>
                  আসসালামু আলাইকুম! কোনো পণ্য, ডেলিভারি বা অর্ডার সংক্রান্ত সহায়তার প্রয়োজন হলে নিচে লিখুন।
                </p>
                <span className="text-[9px] text-gray-400 block text-right mt-1">
                  আজকে
                </span>
              </div>
            </div>

            {/* Quick question chips (visible if few or no messages) */}
            {messages.length === 0 && (
              <div className="pt-1 space-y-1.5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                  দ্রুত প্রশ্নসমূহ:
                </p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSending}
                      onClick={() => handleSend(chip)}
                      className="text-left text-xs bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl border border-gray-200/80 shadow-2xs font-medium transition-all cursor-pointer active:scale-[0.99]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages stream */}
            {messages.map((m, idx) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m._id || idx}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    style={
                      isUser
                        ? { backgroundColor: 'var(--color-primary, #FF5A5A)', color: '#ffffff' }
                        : undefined
                    }
                    className={`max-w-[85%] p-2.5 sm:p-3 rounded-2xl shadow-xs text-xs leading-relaxed relative ${
                      isUser
                        ? 'rounded-tr-xs shadow-md'
                        : 'bg-white text-gray-900 rounded-tl-xs border border-gray-200/80'
                    }`}
                  >
                    {!isUser && (
                      <span
                        style={{ color: 'var(--color-primary, #FF5A5A)' }}
                        className="text-[10px] font-bold block mb-0.5"
                      >
                        {m.senderName || 'টেক মাহমুদ সাপোর্ট'}
                      </span>
                    )}
                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                        isUser ? 'text-white/80' : 'text-gray-400'
                      }`}
                    >
                      <span>{formatMessageTime(m.createdAt)}</span>
                      {isUser && (
                        <span className="text-white font-bold">
                          ✓✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer Strip */}
          <div className="bg-white px-3 py-2.5 border-t border-gray-200 flex items-center gap-2 flex-shrink-0">
            <div className="flex-1 bg-gray-50 rounded-full border border-gray-200 focus-within:border-[var(--color-primary,#FF5A5A)] focus-within:ring-2 focus-within:ring-[var(--color-primary,#FF5A5A)]/20 px-3.5 py-2 flex items-center transition-all">
              <input
                type="text"
                placeholder="আপনার বার্তা লিখুন (Enter চাপুন)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-xs text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="button"
              disabled={!inputText.trim() || isSending}
              onClick={() => handleSend()}
              style={{ backgroundColor: 'var(--color-primary, #FF5A5A)' }}
              className="w-9 h-9 rounded-full hover:opacity-90 disabled:bg-gray-300 text-white flex items-center justify-center shadow-md transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95 shrink-0"
              title="বার্তা পাঠান"
            >
              <FiSend size={15} className={isSending ? 'animate-pulse' : ''} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
