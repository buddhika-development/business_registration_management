// components/ui/NiceSelect.jsx
"use client";
import React from "react";

export default function NiceSelect({ value, onChange, children, className = "", disabled, placeholder }) {
  return (
    <div className={`relative ${disabled ? "opacity-70" : ""}`}>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={[
          "w-full rounded-xl bg-indigo-100 px-4 py-3 pr-10",
          "text-base-text/80 outline-none border border-transparent",
          "hover:bg-indigo-50",
          "focus:bg-indigo-30 focus:border-primary focus:ring-2 focus:ring-primary/20",
          "appearance-none transition",
          className,
        ].join(" ")}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      {/* Chevron */}
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary"
        width="18" height="18" viewBox="0 0 24 24"
      >
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
