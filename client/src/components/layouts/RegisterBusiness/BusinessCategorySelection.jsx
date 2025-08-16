"use client";
import React, { useState } from "react";
import Title from "@/components/ui/Title/Title";
import NiceSelect from "@/components/ui/NiceSelect";

/**
 * Props:
 *  - onNext({ type, category })
 *  - onUnsupported?({ type, category })   // optional: show separate screen/modal
 *
 * UI stays exactly like your mock.
 */
const SUPPORTED_TYPE = "sole";

const BusinessCategorySelection = ({ onNext, onUnsupported }) => {
  const [type, setType] = useState(SUPPORTED_TYPE);
  const [category, setCategory] = useState("food");

  const handleNext = () => {

    if (type === SUPPORTED_TYPE) {
      onNext?.({ type, category });
      return;
    }
    // If parent provided a handler, use it; else fallback to alert.
    if (onUnsupported) onUnsupported({ type, category });
    else alert(`"${type}" form is not implemented yet. Please choose "${SUPPORTED_TYPE}".`);
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-5">
        <Title className="text-center font-extrabold text-3xl md:text-4xl">
          <span className="block">Let’s&nbsp;make your</span>
          <span className="block text-primary">Business Legal</span>
        </Title>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-base-text">Type of Business :</label>
          <NiceSelect value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Solo Proprietary">Solo Proprietary</option>
            <option value="Partnership">Partnership</option>
            <option value="Private Limited">Private Limited</option>
            <option value="Public Limited">Public Limited</option>
          </NiceSelect>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-base-text">Category :</label>
          <NiceSelect value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Food">Food</option>
            <option value="Retail">Retail</option>
            <option value="Services">Services</option>
            <option value="Manufacturing">Manufacturing</option>
          </NiceSelect>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="w-full inline-flex items-center justify-center rounded-[16px] bg-[var(--primary)] px-6 py-3 font-semibold text-white tracking-wide transition hover:opacity-90 hover:shadow-md focus-visible:outline-none"
        >
          Next
        </button>

        {/* Optional hint so users know what's supported */}
        <p className="text-center text-xs text-base-text/60">
          Only <span className="font-semibold">Solo Proprietary</span> is supported right now.
        </p>
      </div>
    </section>
  );
};

export default BusinessCategorySelection;
