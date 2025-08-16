'use client'

import React, { useEffect, useState, useMemo } from "react";
import { OrbitProgress } from "react-loading-indicators";

// Helpers
const formatDateTime = (iso) => {
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

// Skeleton
const SkeletonBar = ({ className = "" }) => (
  <div className={`h-4 rounded bg-slate-200 ${className}`} />
);

const DocumentSkeletonList = ({ rows = 4 }) => (
  <div className="mt-6 space-y-3 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-200" />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <SkeletonBar className="w-40" />
            <SkeletonBar className="w-24" />
            <SkeletonBar className="w-64" />
            <SkeletonBar className="w-32" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Badge
const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${className}`}
  >
    {children}
  </span>
);

// Single doc
const DocumentCard = ({ doc }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* File "icon" */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg border border-slate-200 grid place-items-center">
        <span className="text-xs base-text uppercase">
          {(doc.document_name || "doc").slice(0, 3)}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
        <p className="base-text">
          <span className="font-semibold">Name:</span> {doc.document_name}
        </p>
        <p className="base-text">
          <span className="font-semibold">Application No:</span>{" "}
          {doc.applicationno}
        </p>
        <p className="base-text">
          <span className="font-semibold">Created:</span>{" "}
          {formatDateTime(doc.created_at)}
        </p>
        <p className="base-text">
          <span className="font-semibold">Validity:</span>{" "}
          {validityLabel(doc.document_validity)}
        </p>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <Badge className={validityStyles(doc.document_validity)}>
          {validityLabel(doc.document_validity)}
        </Badge>
        {doc.document_link && (
          <a
            href={doc.document_link}
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 base-text text-sm"
          >
            View
          </a>
        )}
      </div>
    </div>
  </div>
);

// Main component
const BusinessDocuments = ({ request_Id }) => {
  const [documents, setDocuments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const base = useMemo(
    () => process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000",
    []
  );

  useEffect(() => {
    if (!request_Id) return;

    const controller = new AbortController();

    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const decodedId = decodeURIComponent(request_Id);
        const url = `${base}/api/admin/business/${encodeURIComponent(
          decodedId
        )}/documents`;

        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }
        const json = await res.json();
        setDocuments(json?.data ?? []);
      } catch (err) {
        if (err?.name !== "AbortError") {
          setError(err?.message || "Failed to load");
          setDocuments([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [request_Id, base]);

  return (
    <div className="mt-8">
      {/* Spinner */}
      {isLoading && (
        <div className="p-4 flex justify-center w-full">
          <OrbitProgress dense color="#4655c7" size="medium" />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="p-4 text-sm rounded-lg border border-red-200 bg-red-50 base-text">
          <p className="font-semibold">Error</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Skeletons */}
      {isLoading && <DocumentSkeletonList rows={3} />}

      {/* Documents */}
      {!isLoading && !error && documents && documents.length > 0 && (
        <div className="mt-6 space-y-3">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && documents && documents.length === 0 && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 base-text">
          No documents found.
        </div>
      )}
    </div>
  );
};

export default BusinessDocuments;
