"use client";

import React, { useEffect, useMemo, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import BusinessCard from "./BusinessCard";

// Simple skeleton card
const SkeletonBar = ({ w = "w-40" }) => <div className={`h-4 rounded bg-slate-200 ${w}`} />;
const BusinessSkeletonCard = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
    <div className="flex justify-between gap-3">
      <div className="flex-1">
        <SkeletonBar w="w-64" />
        <div className="mt-2"><SkeletonBar w="w-80" /></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-16 rounded bg-slate-200" />
        <div className="h-9 w-24 rounded bg-slate-200" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonBar key={i} w={i % 2 ? "w-56" : "w-40"} />
      ))}
    </div>
  </div>
);

export default function ApprovedRequests() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [busyKey, setBusyKey] = useState(null);
  const [openKey, setOpenKey] = useState(null);

  const base = useMemo(
    () => (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/$/, ""),
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`${base}/api/admin/business/valid`, {
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Fetch failed (${res.status})`);
        }
        const json = await res.json();
        const data = Array.isArray(json) ? json : json?.data || [];
        setRows(data);
      } catch (e) {
        if (e?.name !== "AbortError") setErr(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [base]);

  const approve = async (applicationno) => {
    setBusyKey(applicationno);
    setErr(null);
    try {
      const res = await fetch(`${base}/api/admin/business/${encodeURIComponent(applicationno)}/approve`, {
        method: "POST",
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Approve failed (${res.status})`);
      }
      // optimistic update
      setRows((prev) =>
        prev.map((b) =>
          b.applicationno === applicationno ? { ...b, applicationstatus: "Verified" } : b
        )
      );
    } catch (e) {
      setErr(e?.message || "Approve failed");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="space-y-4">
      {loading && (
        <div className="p-2 flex justify-center">
          <OrbitProgress dense color="#4655c7" size="medium" />
        </div>
      )}

      {err && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm base-text">{err}</div>
      )}

      {loading && (
        <div className="space-y-4">
          <BusinessSkeletonCard />
          <BusinessSkeletonCard />
        </div>
      )}

      {!loading && !err && rows.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 base-text">
          No valid businesses found.
        </div>
      )}

      {!loading &&
        !err &&
        rows.map((b) => {
          const approving = busyKey === b.applicationno;
          const open = openKey === b.applicationno;

          return (
            <BusinessCard
              key={b.applicationno}
              business={b}
              open={open}
              approving={approving}
              onToggle={() => setOpenKey((k) => (k === b.applicationno ? null : b.applicationno))}
              // onApprove={() => approve(b.applicationno)}
            />
          );
        })}
    </div>
  );
}
