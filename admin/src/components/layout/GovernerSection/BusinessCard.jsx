"use client";

import MainTitle from "@/components/ui/Titles/MainTitle";
import React, { useMemo, useState } from "react";

const money = (n) => (typeof n === "number" ? n.toLocaleString() : n ?? "");
const dateFmt = (iso) => (iso ? new Date(iso).toLocaleDateString() : "");

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
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z"
      clipRule="evenodd"
    />
  </svg>
);

export default function BusinessCard({
  business,
  open = false,
  onToggle,
}) {
  // local status so we can update UI after approve
  const [status, setStatus] = useState(business.applicationstatus || "inReview");
  const [approving, setApproving] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const isVerified = status === "Verified";
  const canApprove = !isVerified && !approving;

  const base = useMemo(
    () => (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/$/, ""),
    []
  );

  // keyboard support for the header "button"
  const onHeaderKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle?.();
    }
  };

  const handleApprove = async () => {
    if (!canApprove) return;
    setApproving(true);
    setErrMsg(null);
    try {
      const res = await fetch(`${base}/api/admin/status-change/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ applicationNo: business.applicationno }), // <-- exact field name
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Approve failed (${res.status})`);
      }

      // If backend returns JSON, you can read it:
      // const data = await res.json();

      // Optimistically mark as verified for UI
      setStatus("Verified");
    } catch (e) {
      setErrMsg(e?.message || "Failed to approve");
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="mb-5">
        <MainTitle title={"Approved Authentication"} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        {/* Header row */}
        <div className="w-full p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          {/* Clickable toggle area */}
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
              <h2 className="text-xl font-semibold base-text">{business.businessname}</h2>
              <p className="mt-1 base-text">{business.businessdescription}</p>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            <Badge tone={isVerified ? "success" : "warn"}>
              {isVerified ? "Verified" : "In Review"}
            </Badge>
            <button
              onClick={handleApprove}
              disabled={!canApprove}
              className={[
                "px-4 py-2 rounded-lg text-sm font-medium",
                canApprove ? "bg-primary text-white hover:opacity-90" : "bg-slate-200 text-slate-500 cursor-not-allowed",
              ].join(" ")}
              aria-disabled={!canApprove}
            >
              {approving ? "Approving..." : "Approve"}
            </button>
          </div>
        </div>

        {/* Error message */}
        {errMsg && (
          <div className="px-5 pb-3">
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm base-text">
              {errMsg}
            </div>
          </div>
        )}

        {/* Collapsible details */}
        <div
          className={[
            "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 px-5",
            "transition-all duration-200 overflow-hidden",
            open ? "max-h-[1000px] py-5" : "max-h-0 py-0",
          ].join(" ")}
        >
          <p className="base-text font-semibold">Application No:</p>
          <p className="base-text">{business.applicationno}</p>

          <p className="base-text font-semibold">Proprietor NIC:</p>
          <p className="base-text">{business.proprietornic}</p>

          <p className="base-text font-semibold">Business Type:</p>
          <p className="base-text">{business.businesstype}</p>

          <p className="base-text font-semibold">Business Category:</p>
          <p className="base-text">{business.businesscategory}</p>

          <p className="base-text font-semibold">Products/Services:</p>
          <p className="base-text">{business.productservices}</p>

          <p className="base-text font-semibold">Initial Capital:</p>
          <p className="base-text">{money(business.initialcapital)}</p>

          <p className="base-text font-semibold">Annual Turnover:</p>
          <p className="base-text">{money(business.annualturnover)}</p>

          <p className="base-text font-semibold">Commencement Date:</p>
          <p className="base-text">{dateFmt(business.commencementdate)}</p>

          <p className="base-text font-semibold">GN Certificate:</p>
          <p className="base-text">
            {business.gncertificateurl ? (
              <a
                href={business.gncertificateurl}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                View document
              </a>
            ) : (
              "-"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
