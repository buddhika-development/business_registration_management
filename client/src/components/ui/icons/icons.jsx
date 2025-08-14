"use client";
import React from "react";

/** Generic icon props */
const def = (v, d) => (typeof v === "undefined" ? d : v);

/** Info dot */
export function IconInfoDot({ size, className, ...props }) {
  const s = def(size, 18);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className={className || "text-primary"} {...props}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".12" />
      <path d="M12 8.5a1 1 0 110-2 1 1 0 010 2zm-1 2.5h2v6h-2v-6z" fill="currentColor" />
    </svg>
  );
}

/** Tag */
export function IconTag({ size, className, strokeWidth, ...props }) {
  const s = def(size, 18);
  const sw = def(strokeWidth, 1.5);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className={className || "text-primary"} {...props}>
      <path
        d="M21 7l-9-4-9 4v2l9 4 9-4V7zM3 13l9 4 9-4M3 17l9 4 9-4"
        fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

/** Home */
export function IconHome({ size, className, strokeWidth, ...props }) {
  const s = def(size, 18);
  const sw = def(strokeWidth, 1.5);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className={className || "text-primary"} {...props}>
      <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z" fill="currentColor" opacity=".12" />
      <path d="M3 11l9-7 9 7" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

/** Section (three lines) */
export function IconSection({ size, className, strokeWidth, ...props }) {
  const s = def(size, 18);
  const sw = def(strokeWidth, 1.5);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className={className || "text-primary"} {...props}>
      <path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

/** Upload */
export function IconUpload({ size, className, strokeWidth, ...props }) {
  const s = def(size, 36);
  const sw = def(strokeWidth, 1.5);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className={className || "text-primary"} {...props}>
      <path d="M12 16V7m0 0l-3 3m3-3l3 3" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
      <path d="M6 16v2a2 2 0 002 2h8a2 2 0 002-2v-2" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}
