'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function FloatingChatButton({ 
  className = '',
  label = 'Open chat',
}) {

  
  const handleClick = () => {
      console.log('Chat button clicked');
    };
    
    return (
        <button
        type="button"
        className={`chat-floating-btn ${className}`}
        onClick={handleClick}
        aria-label={label}
    >
        <MessageCircle aria-hidden="true" className="h-6 w-6" />
        <span className="sr-only">{label}</span>
    </button>
  )
}
