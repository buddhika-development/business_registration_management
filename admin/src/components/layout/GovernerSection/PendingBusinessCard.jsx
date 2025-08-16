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

const Badge = ({ children, tone = "warn", className = "" }) => {
  const cn =
    tone === "success"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : tone === "error"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-amber-100 text-amber-700 border-amber-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cn} ${className}`}>
      {children}
    </span>
  );
};

const Chevron = ({ open }) => (
  <svg
    className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z" clipRule="evenodd" />
  </svg>
);

const isPresent = (v) =>
  !(v === null || v === undefined || (typeof v === "string" && v.trim() === ""));

const prettyDateTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const validityTone = (v) => (v === true ? "success" : v === false ? "error" : "warn");
const authenticityTone = (s) =>
  s === "verified" ? "success" : s === "rejected" ? "error" : "warn";

export default function PendingBusinessCard({
  business = {},  
  open = false,
  onToggle,
  onRequestFix,
  requesting = false,
}) {

  const docs = Array.isArray(business?.unapprovedDocuments) ? business.unapprovedDocuments : [];
  const docCount = docs.length;

  const missing = REQUIRED_FIELDS.filter((f) => !isPresent(business?.[f.key]));

  const onHeaderKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle?.();
    }
  };


  // Badge label/tone based on unapproved docs count
  const badgeTone = docCount === 0 ? "success" : "warn";
  const badgeLabel =
    docCount === 0 ? "No unapproved documents" : `${docCount} unapproved document${docCount > 1 ? "s" : ""}`;

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
              {business?.businessname || "Pending business"}
            </h2>
            <p className="mt-1 base-text">
              {business?.businessdescription || "No description provided yet."}
            </p>
            <p className="mt-1 text-sm base-text">
              <span className="font-semibold">Application No:</span>{" "}
              {business?.applicationno || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          
          {/* CHANGED: show number of unapproved documents */}
          <Badge tone={badgeTone}>{badgeLabel}</Badge>

          {onRequestFix && (
            <button
              onClick={onRequestFix}
              disabled={requesting}
              className={[
                "px-4 py-2 rounded-lg text-sm font-medium",
                requesting
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-primary text-white hover:opacity-90",
              ].join(" ")}
              aria-disabled={requesting}
            >
              {requesting ? "Sending..." : "Request Fix"}
            </button>
          )}
        </div>
      </div>

      {/* Collapsible details: checklist + unapproved documents */}
      <div
        className={[
          "px-5 pb-5 transition-all duration-200 overflow-hidden",
          open ? "max-h-[2200px]" : "max-h-0",
        ].join(" ")}
      >
        
        {/* Missing fields checklist */}
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {REQUIRED_FIELDS.map(({ key, label }) => {
            const present = isPresent(business?.[key]);
            return (
              <div
                key={key}
                className={[
                  "flex items-start gap-2 rounded-lg border p-3",
                  present ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50",
                ].join(" ")}
              >
                <div className={present ? "text-emerald-600" : "text-amber-600"}>•</div>
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

        {/* Unapproved Documents */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold base-text">
              Unapproved Documents{docCount ? ` (${docCount})` : ""}
            </h3>
            {!docCount && <Badge tone="success" className="ml-1">None</Badge>}
          </div>

          {docCount > 0 && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {docs.map((d) => (
                <div key={d?.id ?? Math.random()} className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="base-text font-semibold capitalize">
                        {d?.document_name?.replace(/_/g, " ") || "document"}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge tone={validityTone(d?.document_validity)}>
                          {d?.document_validity === true
                            ? "Valid"
                            : d?.document_validity === false
                            ? "Invalid"
                            : "Unknown"}
                        </Badge>
                        {d?.document_authenticity && (
                          <Badge tone={authenticityTone(d?.document_authenticity)}>
                            {`Authenticity: ${d.document_authenticity}`}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                      <div>
                        <dt className="text-xs base-text font-semibold">Application No</dt>
                        <dd className="text-sm base-text">{d?.applicationno || "-"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs base-text font-semibold">Created</dt>
                        <dd className="text-sm base-text">{prettyDateTime(d?.created_at)}</dd>
                      </div>
                      {d?.document_link && (
                        <div className="sm:col-span-2">
                          <dt className="text-xs base-text font-semibold">Link</dt>
                          <dd className="text-sm base-text">
                            <a href={d.document_link} target="_blank" rel="noreferrer" className="underline">
                              View document
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* /Unapproved Documents */}
      </div>
    </div>
  );
}
