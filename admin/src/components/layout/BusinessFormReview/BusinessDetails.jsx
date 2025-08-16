'use client'

import React, { useEffect, useMemo, useState } from 'react'
import MainTitle from "@/components/ui/Titles/MainTitle";
import { OrbitProgress } from "react-loading-indicators";

// Helpers
const formatMoney = (n) => (typeof n === "number" ? n.toLocaleString() : n);
const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "");

// Minimal row (skips null/empty)
const Row = ({ label, value }) => {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  ) return null;

  return (
    <>
      <p className="base-text font-semibold">{label}</p>
      <p className="base-text break-words">{value}</p>
    </>
  );
};

// Skeleton UI
const SkeletonBar = ({ className = "" }) => (
  <div className={`h-4 rounded bg-slate-200 ${className}`} />
);

const SkeletonRows = ({ rows = 8 }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-8">
    {Array.from({ length: rows }).map((_, i) => (
      <React.Fragment key={i}>
        <SkeletonBar className="w-32" />
        <SkeletonBar className="w-48" />
      </React.Fragment>
    ))}
  </div>
);

export default function BusinessDetails({ request_Id }) {
  const [businessData, setBusinessData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const base = useMemo(
    () => process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000",
    []
  );

  useEffect(() => {
    if (!request_Id) return;
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const decodedId = decodeURIComponent(request_Id);
        const res = await fetch(
          `${base}/api/admin/business/${encodeURIComponent(decodedId)}`,
          { cache: "no-store", signal: controller.signal }
        );

        // (Optional) log: console.log("API URL:", `${base}/api/admin/business/${encodeURIComponent(decodedId)}`);

        if (!res.ok) {
          throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }

        const json = await res.json();
        setBusinessData(json.data ?? null);
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.error("Fetch Error:", err);
          setError(err?.message || "Failed to load");
          setBusinessData(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [request_Id, base]);

  return (
    <div className="mt-8">
      <MainTitle title="Business Details" />

      {/* Error state */}
      {error && !isLoading && (
        <div className="p-4 text-sm rounded-lg border border-red-200 bg-red-50 base-text">
          <p className="font-semibold">Error</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Skeleton rows (content placeholder) */}
      {isLoading && (
        <div className="animate-pulse">
          <SkeletonRows rows={8} />
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && businessData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-8">
          <Row label="Business Name:" value={businessData.businessname} />
          <Row label="Business Type:" value={businessData.businesstype} />
          <Row label="Business Category:" value={businessData.businesscategory} />
          <Row label="Description:" value={businessData.businessdescription} />
          <Row label="Products/Services:" value={businessData.productservices} />
          <Row label="Initial Capital:" value={formatMoney(businessData.initialcapital)} />
          <Row label="Annual Turnover:" value={formatMoney(businessData.annualturnover)} />
          <Row label="Commencement Date:" value={formatDate(businessData.commencementdate)} />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && !businessData && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 base-text">
          No business details found.
        </div>
      )}
    </div>
  );
}
