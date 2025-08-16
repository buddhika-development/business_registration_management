'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { OrbitProgress } from 'react-loading-indicators';

/* ----------------------------- Helpers ----------------------------- */
const formatDateTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const validityLabel = (v) => {
  if (v === true) return 'Valid';
  if (v === false) return 'Invalid';
  return 'Unknown';
};

const validityStyles = (v) => {
  if (v === true) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (v === false) return 'bg-red-100 text-red-700 border-red-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

/* ----------------------------- Skeleton ---------------------------- */
const SkeletonBar = ({ className = '' }) => (
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

/* ------------------------------- UI -------------------------------- */
const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${className}`}>
    {children}
  </span>
);

/* --------------------------- DocumentCard --------------------------- */
const DocumentCard = ({ doc, onReminder, isSending }) => {
  const isInvalid = doc.document_validity === false;
  const isPending = String(doc.document_authenticity || '').trim().toLowerCase() === 'pending';

  // Show Reminder if invalid OR (pending and not invalid).
  // If both are true, invalid wins (still shows, but reason = 'invalid').
  const showReminder = isInvalid || (isPending && !isInvalid);
  const reminderReason = isInvalid ? 'invalid' : (isPending ? 'pending' : '');

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* File "icon" */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg border border-slate-200 grid place-items-center">
          <span className="text-xs base-text uppercase">
            {(doc.document_name || 'doc').slice(0, 3)}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          <p className="base-text">
            <span className="font-semibold">Name:</span> {doc.document_name}
          </p>
          <p className="base-text">
            <span className="font-semibold">Application No:</span> {doc.applicationno}
          </p>
          <p className="base-text">
            <span className="font-semibold">Created:</span> {formatDateTime(doc.created_at)}
          </p>
          <p className="base-text">
            <span className="font-semibold">Authenticity:</span>{' '}
            {doc.document_authenticity || '—'}
          </p>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Badge className={validityStyles(doc.document_validity)}>
            {validityLabel(doc.document_validity)}
          </Badge>

          {showReminder && (
            <button
              type="button"
              onClick={() => onReminder?.(doc, reminderReason)}
              disabled={isSending}
              className={[
                'ml-1 inline-flex items-center px-3 py-1.5 rounded-lg text-sm',
                // Slightly different accent when invalid vs pending (optional)
                isInvalid
                  ? 'border border-red-300 bg-red-50 hover:bg-red-100 text-red-800'
                  : 'border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800',
                isSending ? 'opacity-70 cursor-not-allowed' : '',
              ].join(' ')}
              aria-disabled={isSending}
            >
              {isSending ? 'Sending…' : 'Reminder'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ------------------------- Main: Documents -------------------------- */
const BusinessDocuments = ({ request_Id }) => {
  const [documents, setDocuments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingId, setSendingId] = useState(null); // track which doc is sending

  const base = useMemo(
    () => (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000').replace(/\/$/, ''),
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
        const url = `${base}/api/admin/business/${encodeURIComponent(decodedId)}/documents`;

        const res = await fetch(url, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }
        const json = await res.json();
        setDocuments(json?.data ?? []);
      } catch (err) {
        if (err?.name !== 'AbortError') {
          setError(err?.message || 'Failed to load');
          setDocuments([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [request_Id, base]);

  const handleReminder = async (doc, reason = 'pending') => {
    try {
      setSendingId(doc.id);
      const res = await fetch(
        `${base}/api/admin/documents/${encodeURIComponent(doc.id)}/reminder`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId: doc.id,
            applicationno: doc.applicationno,
            document_name: doc.document_name,
            reason, // 'invalid' or 'pending' (optional)
          }),
        }
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Failed to send reminder (${res.status}): ${txt || res.statusText}`);
      }
      alert('Reminder sent.');
    } catch (e) {
      alert(e?.message || 'Failed to send reminder.');
    } finally {
      setSendingId(null);
    }
  };

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
      {!isLoading && !error && Array.isArray(documents) && documents.length > 0 && (
        <div className="mt-6 space-y-3">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onReminder={handleReminder}
              isSending={sendingId === doc.id}
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && Array.isArray(documents) && documents.length === 0 && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 base-text">
          No documents found.
        </div>
      )}
    </div>
  );
};

export default BusinessDocuments;
