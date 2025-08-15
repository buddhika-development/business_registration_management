'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Send, Loader2 } from 'lucide-react';
import Image from 'next/image';

/**
 * Renders a chat dialog. Bot messages are HTML (from backend, sanitized server-side).
 * User messages are plain text.
 */
export default function ChatDialog({
  open,
  onClose,
  primaryClass = 'bg-indigo-600',
  onSend,
  messages = [],
  loading = false,
}) {
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Auto-scroll to bottom on new messages or when loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, loading]);

  const onBackdropClick = (e) => {
    if (panelRef.current && !panelRef.current.contains(e.target)) onClose?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    onSend?.(text);
    setInput('');
  };

  if (!mounted || !open) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
        onMouseDown={onBackdropClick}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed bottom-5 right-5 z-50 w-[94vw] max-w-2xl">
        <div
          ref={panelRef}
          className="overflow-hidden rounded-2xl bg-white shadow-2xl h-[600px]"
          role="dialog"
          aria-modal="true"
          aria-label="Chat window"
        >
          {/* ============================================ */}
          {/* Header section */}
          {/* ============================================ */}
          <div className={`relative h-12 ${primaryClass}`}>
            <button
              onClick={onClose}
              aria-label="Close chat"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-1 hover:bg-white/30"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col h-[calc(100%-3rem)]">
            {/* ===================================== */}
            {/* show the messages */}
            {/* ===================================== */}
            <div className="mb-3 flex-1 overflow-y-auto pr-1">
              {messages.map((m) =>
                m.role === 'bot' ? (
                  <div key={m.id} className="mb-3 flex items-start gap-4">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-white">
                      <Image
                        src={"/logo/government-logo.png"}
                        width={32}
                        height={32}
                        alt="government logo"
                        className="mt-2"
                      />
                    </div>
                    <div
                      className="max-w-[75%] rounded-xl bg-primary/6 text-base-text px-5 py-4 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: m.text }}
                    />
                  </div>
                ) : (
                  <div key={m.id} className="mb-3 flex items-start justify-end gap-4">
                    <div className="max-w-[75%] rounded-xl bg-primary/20 px-5 py-3 text-sm leading-relaxed">
                      {m.text}
                    </div>
                    <div className="grid h-[30px] w-[30px] place-items-center rounded-full bg-primary/20 mt-2">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                )
              )}

              {/* ===================================== */}
              {/* Typing / Loading bubble (bot) */}
              {/* ===================================== */}
              {loading && (
                <div className="mb-3 flex items-start gap-4">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-white">
                    <Image
                      src={"/logo/government-logo.png"}
                      width={32}
                      height={32}
                      alt="government logo"
                      className="mt-2"
                    />
                  </div>
                  <div className="max-w-[75%] rounded-xl bg-primary/6 text-base-text px-5 py-4 text-sm leading-relaxed">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                </div>
              )}

              {/* scroll anchor */}
              <div ref={scrollRef} />
            </div>

            {/* =================================== */}
            {/* user query input section */}
            {/* =================================== */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                disabled={loading}
                className="flex-1 rounded-full border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={loading}
                className={`grid h-10 w-10 place-items-center rounded-full text-white ${primaryClass} hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
