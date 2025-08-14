"use client";
import React from "react";
import Title from "@/components/ui/Title/Title";

/**
 * Props:
 *  - selectedType: string
 *  - onBack: () => void
 */
const btnOutline =
  "px-6 py-3 rounded-[16px] border font-semibold transition hover:bg-indigo-50 hover:border-primary hover:text-primary";

export default function UnsupportedBusinessType({ selectedType, onBack }) {
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="max-w-lg w-full space-y-5 text-center">
        <Title className="font-extrabold text-3xl md:text-4xl">
          <span className="block">Not implemented yet</span>
          <span className="block text-primary">{selectedType}</span>
        </Title>

        <p className="text-base text-base-text/80">
          The form for <span className="font-semibold">{selectedType}</span> isn’t available yet.
          Please go back and choose <span className="font-semibold">Solo Proprietary</span> to continue.
        </p>

        <div className="flex items-center justify-center">
          <button type="button" className={btnOutline} onClick={onBack}>
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
}
