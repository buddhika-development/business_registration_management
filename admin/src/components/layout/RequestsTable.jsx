"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OrbitProgress } from "react-loading-indicators";

const ACTIVE_ROW_ID = "req-1003";

// Skeleton rows
const TableSkeletonRow = ({ cols = 4 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td
        key={i}
        className={[
          "px-5 py-4",
          "border-b border-primary/20",
          i !== 0 ? "border-l border-primary/20" : "",
        ].join(" ")}
      >
        <div className="h-4 bg-slate-200 rounded w-2/3" />
      </td>
    ))}
  </tr>
);
const TableSkeletonBody = ({ rows = 6, cols = 4 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <TableSkeletonRow key={i} cols={cols} />
    ))}
  </>
);

export default function RequestsTable() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goToRequest = (id) => router.push(`/Request/${id}`);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
        const api = `${base.replace(/\/$/, "")}/api/admin/requests?status=inReview`;
        
        const res = await fetch(api, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
        }

        let json;
        try {
          json = await res.json();
        } catch {
          json = { data: [] };
        }
        const rows = Array.isArray(json) ? json : json.data || [];
        setRequests(rows);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, []);

  const headers = ["Company Name", "Owner Name", "Request Date", "Status"];

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "");
  console.log(requests)
  return (
    <div className="rounded-2xl overflow-hidden bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-primary/10 text-left">
            {headers.map((h, i) => (
              <th
                key={h}
                className={[
                  "px-5 py-4 text-sm sm:text-base font-semibold base-text",
                  i !== 0 ? "border-l border-primary/20" : "",
                ].join(" ")}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {loading && (
            <>
              <TableSkeletonBody rows={6} cols={headers.length} />
            </>
          )}

          {error && !loading && (
            <tr>
              <td colSpan={headers.length} className="px-5 py-6 text-red-600">
                {error}
              </td>
            </tr>
          )}

          {requests.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="px-5 py-6 base-text">
                No requests found.
              </td>
            </tr>
          )}

          {/* Data rows */}
          {!loading &&
            !error &&
            requests.map((r) => {
              const rowId = r.id ?? r.request_Id ?? r.requestId; // tolerate different APIs
              const isActive = rowId === ACTIVE_ROW_ID;
              return (
                <tr
                  key={rowId || Math.random()}
                  role="link"
                  tabIndex={0}
                  aria-label={`Open request ${rowId}`}
                  onClick={() => rowId && goToRequest(rowId)}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && rowId) {
                      e.preventDefault();
                      goToRequest(rowId);
                    }
                  }}
                  className={[
                    "cursor-pointer align-top",
                    "border-b border-primary/20",
                    "hover:bg-primary/5 focus:bg-primary/10",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  ].join(" ")}
                  style={isActive ? { boxShadow: "inset 0 -2px 0 0 rgb(var(--primary) / 1)" } : undefined}
                >
                  <td className="px-5 py-3 text-sm base-text">{r.companyName || r.businessName}</td>
                  <td className="px-5 py-3 text-sm base-text border-l border-primary/20">
                    {r.ownerName || r.proprietorName}
                  </td>
                  <td className="px-5 py-3 text-sm base-text border-l border-primary/20 whitespace-nowrap">
                    {formatDate(r.requestDate)}
                  </td>
                  <td className="px-5 py-3 text-sm border-l border-primary/20">
                    <span
                      className={
                        r.status === "Verified"
                          ? "text-green-600"
                          : r.status === "Rejected"
                          ? "text-red-600"
                          : "text-amber-600"
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
