// components/documents/Section.jsx
import React from "react";
import { IconSection as SectionIcon } from "@/components/ui/icons/icons";

export default function Section({ title, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-transparent bg-white/70 shadow-sm p-5 md:p-6 space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <SectionIcon />
        <h2 className="text-lg font-semibold text-base-text">{title}</h2>
      </div>
      {children}
    </section>
  );
}
