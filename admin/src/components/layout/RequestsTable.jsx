"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OrbitProgress } from "react-loading-indicators";

const ACTIVE_ROW_ID = "req-1003";

export default function RequestsTable() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goToRequest = (id) => {
    router.push(`/Request/${id}`);
  };

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

        const url = new URL("/api/admin/requests", base);
        url.searchParams.set("status", "inReview"); 

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
        }

        const json = await res.json();
        // your controller likely returns { data: [...] } via ok(res, data, message)
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

  const headers = [
    "Company Name",
    "Owner Name",
    "Request Date",
    "Status",
  ];

  return (
    <div className="rounded-2xl overflow-hidden bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-primary/10 text-left">
            {headers.map((h, i) => (
              <th
                key={h}
                className={[
                  "px-5 py-4 text-sm sm:text-base font-semibold text-base-text",
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
            <tr>
              <td colSpan={headers.length} className="px-5 py-6 text-base-text text-center">
                <OrbitProgress dense color="#4655c7" size="medium" text="" textColor="" />
              </td>
            </tr>
          )}

          {error && !loading && (
            <tr>
              <td colSpan={headers.length} className="px-5 py-6 text-red-600">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && requests.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="px-5 py-6 text-base-text">
                No requests found.
              </td>
            </tr>
          )}

          {requests.map((r) => {
            const isActive = r.id === ACTIVE_ROW_ID;
            return (
              <tr
                key={r.id}
                role="link"
                tabIndex={0}
                aria-label={`Open request ${r.id}`}
                onClick={() => goToRequest(r.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToRequest(r.id);
                  }
                }}
                className={[
                  "cursor-pointer align-top",
                  "border-b border-primary/20",
                  "hover:bg-primary/5 focus:bg-primary/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                ].join(" ")}
                style={
                  isActive
                    ? { boxShadow: "inset 0 -2px 0 0 rgb(var(--primary) / 1)" }
                    : undefined
                }
              >
                <td className="px-5 py-3 text-sm text-base-text">{r.companyName}</td>
                <td className="px-5 py-3 text-sm text-base-text border-l border-primary/20">
                  {r.ownerName}
                </td>

                <td className="px-5 py-3 text-sm text-base-text border-l border-primary/20 whitespace-nowrap">
                  {r.requestDate}
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
