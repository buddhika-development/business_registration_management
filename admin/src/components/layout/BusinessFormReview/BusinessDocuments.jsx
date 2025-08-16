'use client';

import { DocumentSkeletonList } from '@/components/skeleton/BusinessDocumentSkeleton';
import React, { useEffect, useState, useMemo } from 'react';
import { OrbitProgress } from 'react-loading-indicators';
import { DocumentCard } from '../DocumentCard';

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
        const url = `${base}/api/admin/business/${encodeURIComponent(decodedId)}/documents-with-providers`;

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
          {documents.map((doc, index) => (
            <DocumentCard
              key={index}
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
