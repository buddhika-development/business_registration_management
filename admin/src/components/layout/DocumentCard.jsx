"use client";

import React from "react";

const prettyDateTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const validityLabel = (v) => {
  if (v === true) return "Valid";
  if (v === false) return "Invalid";
  return "Unknown";
};

const validityStyles = (v) => {
  if (v === true) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (v === false) return "bg-red-100 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${className}`}
  >
    {children}
  </span>
);

export default function DocumentCard({ doc, onReminder, isSending }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Left: meta */}
        <div className="flex-1">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <dt className="text-sm font-semibold text-slate-700">Name</dt>
              <dd className="text-sm base-text">{doc.document_name || "-"}</dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-slate-700">
                Application No
              </dt>
              <dd className="text-sm base-text">{doc.applicationno || "-"}</dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-slate-700">Provider</dt>
              <dd className="text-sm base-text">
                {doc.document_provider_name || "-"}
                {doc.document_provider_mail
                  ? ` (${doc.document_provider_mail})`
                  : ""}
              </dd>
            </div>

            {doc.document_link && (
              <div>
                <dt className="text-sm font-semibold text-slate-700">Link</dt>
                <dd className="text-sm base-text">
                  <a
                    href={doc.document_link}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-primary hover:text-primary/80"
                  >
                    Open
                  </a>
                </dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-semibold text-slate-700">Uploaded</dt>
              <dd className="text-sm base-text">
                {prettyDateTime(doc.document_created_at)}
              </dd>
            </div>
          </dl>

          {/* Status badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className={validityStyles(doc.document_validity)}>
              {validityLabel(doc.document_validity)}
            </Badge>
            {doc.document_authenticity && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                {`Authenticity: ${doc.document_authenticity}`}
              </Badge>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="shrink-0 flex items-center">
          <button
            disabled={isSending}
            onClick={() => onReminder?.()}
            className={
              isSending
                ? "bg-slate-200 text-slate-500 cursor-not-allowed px-3 py-1.5 rounded-lg"
                : "bg-primary text-white px-3 py-1.5 rounded-lg hover:opacity-90"
            }
            aria-disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Reminder"}
          </button>
        </div>
      </div>
    </div>
  );
}
