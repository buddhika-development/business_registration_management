'use client';

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatDialog from './ChatDialog';

/** Normalize whatever the backend returns into a string of HTML */
function extractReplyTextFromResponseData(data) {
  const r = (data && Object.prototype.hasOwnProperty.call(data, 'reply')) ? data.reply : data;

  if (typeof r === 'string') return r;

  if (Array.isArray(r)) {
    for (const item of r) {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        if (typeof item.content === 'string') return item.content;
        if (typeof item.text === 'string') return item.text;
        if (typeof item.message === 'string') return item.message;
      }
    }
    try { return JSON.stringify(r); } catch { return String(r); }
  }

  if (r && typeof r === 'object') {
    if (typeof r.content === 'string') return r.content;
    if (typeof r.text === 'string') return r.text;
    if (typeof r.message === 'string') return r.message;
    if (Array.isArray(r.choices) && r.choices.length > 0) {
      const ch = r.choices[0];
      const maybe =
        (ch && ch.message && typeof ch.message.content === 'string' && ch.message.content) ||
        (typeof ch.text === 'string' && ch.text);
      if (maybe) return maybe;
    }
    try { return JSON.stringify(r); } catch { return String(r); }
  }

  return String(r ?? '');
}

export default function FloatingChatButton({
  className = '',
  label = 'Open chat',
  primaryClass = 'bg-indigo-600',
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'b1',
      role: 'bot',
      text:
        '<p>Welcome! I can help with Sri Lankan business registration. What do you need?</p>',
    },
  ]);

  const handleSend = async (text) => {
    const userMsg = { id: crypto.randomUUID(), role: 'user', text };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const form = new FormData();
      form.append('query', text);
      form.append('history', JSON.stringify(nextMessages)); 
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        body: form,
      });

      let replyText = '';
      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await res.json();
        replyText = extractReplyTextFromResponseData(data);
      } else {
        replyText = await res.text();
      }

      if (typeof replyText !== 'string') {
        try { replyText = JSON.stringify(replyText); } catch { replyText = String(replyText); }
      }

      const botMsg = { id: crypto.randomUUID(), role: 'bot', text: replyText };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'bot',
          text: '<p>Sorry, I could not reach the server. Please try again.</p>',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ======================================== */}
      {/* floating button */}
      {/* ======================================== */}
      <button
        type="button"
        className={`chat-floating-btn ${className}`}
        onClick={() => setOpen(true)}
        aria-label={label}
      >
        <MessageCircle aria-hidden="true" className="h-6 w-6" />
        <span className="sr-only">{label}</span>
      </button>

      <ChatDialog
        open={open}
        onClose={() => setOpen(false)}
        primaryClass={primaryClass}
        messages={messages}
        onSend={handleSend}
        loading={loading}
      />
    </>
  );
}
