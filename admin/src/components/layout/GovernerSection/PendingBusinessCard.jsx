"use client";

import React from "react";

const REQUIRED_FIELDS = [
  { key: "proprietornic",       label: "Proprietor NIC" },
  { key: "businesstype",        label: "Business Type" },
  { key: "businesscategory",    label: "Business Category" },
  { key: "businessname",        label: "Business Name" },
  { key: "businessdescription", label: "Description" },
  { key: "productservices",     label: "Products/Services" },
  { key: "initialcapital",      label: "Initial Capital" },
  { key: "annualturnover",      label: "Annual Turnover" },
  { key: "commencementdate",    label: "Commencement Date" },
  { key: "gncertificateurl",    label: "GN Certificate URL" },
];

const Badge = ({ children, tone = "warn" }) => {
  const cn =
    tone === "success"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : tone === "error"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-amber-100 text-amber-700 border-amber-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cn}`}>
      {children}
    </span>
  );
};

const Chevron = ({ open }) => (
  <svg
    className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
  >
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z" clipRule="evenodd" />
  </svg>
);

const isPresent = (v) =>
  !(v === null || v === undefined || (typeof v === "string" && v.trim() === ""));

export default function PendingBusinessCard({
  business,          // pending item
  open = false,      // expanded?
  onToggle,          // toggle details
  onRequestFix,      // optional: callback to notify requester
  requesting = false // loading state for request-fix
}) {
  const missing = REQUIRED_FIELDS.filter(f => !isPresent(business[f.key]));
  const missingCount = missing.length;

  // keyboard support for the header control
  const onHeaderKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle?.();
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      {/* Header row (NOT a <button> to avoid nested button issues) */}
      <div className="w-full p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onClick={onToggle}
          onKeyDown={onHeaderKeyDown}
          className="flex items-start gap-3 flex-1 hover:bg-primary/5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 p-2 -m-2"
        >
          <Chevron open={open} />
          <div>
            <h2 className="text-xl font-semibold base-text">
              {business.businessname || "Pending business"}
            </h2>
            <p className="mt-1 base-text">
              {business.businessdescription || "No description provided yet."}
            </p>
            <p className="mt-1 text-sm base-text">
              <span className="font-semibold">Application No:</span> {business.applicationno}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone={missingCount === 0 ? "success" : "warn"}>
            {missingCount === 0 ? "Complete" : `Missing ${missingCount} field${missingCount > 1 ? "s" : ""}`}
          </Badge>

          {/* Optional action to request fixes */}
          {onRequestFix && (
            <button
              onClick={onRequestFix}
              disabled={requesting}
              className={[
                "px-4 py-2 rounded-lg text-sm font-medium",
                requesting ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-primary text-white hover:opacity-90",
              ].join(" ")}
              aria-disabled={requesting}
            >
              {requesting ? "Sending..." : "Request Fix"}
            </button>
          )}
        </div>
      </div>

      {/* Collapsible details: checklist of required fields */}
      <div
        className={[
          "px-5 pb-5 transition-all duration-200 overflow-hidden",
          open ? "max-h-[1200px]" : "max-h-0"
        ].join(" ")}
      >
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {REQUIRED_FIELDS.map(({ key, label }) => {
            const present = isPresent(business[key]);
            return (
              <div
                key={key}
                className={[
                  "flex items-start gap-2 rounded-lg border p-3",
                  present ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"
                ].join(" ")}
              >
                <div className={present ? "text-emerald-600" : "text-amber-600"}>
                  {present ? "✔" : "•"}
                </div>
                <div className="flex-1">
                  <p className="base-text font-semibold">{label}</p>
                  <p className="base-text text-sm break-words">
                    {present
                      ? (key === "gncertificateurl"
                          ? <a href={business[key]} target="_blank" rel="noreferrer" className="underline">View document</a>
                          : String(business[key]))
                      : "Missing"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
