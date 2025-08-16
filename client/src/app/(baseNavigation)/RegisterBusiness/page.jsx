"use client";
import React, { useEffect, useState } from "react";
import BusinessCategorySelection from "@/components/layouts/RegisterBusiness/BusinessCategorySelection";
import UnsupportedBusinessType from "@/components/layouts/RegisterBusiness/UnsupportedBusinessType";
import BusinessDetails from "@/components/layouts/RegisterBusiness/BusinessDetails";
import OwnerDetails from "@/components/layouts/RegisterBusiness/OwnerDetails";
import DocumentsSubmission from "@/components/layouts/RegisterBusiness/DocumentsSubmission";
import Preview from "@/components/layouts/RegisterBusiness/Preview";
import { useRequireAuth } from '@/hooks/useRequireAuth';

const STORAGE_KEY = "rb-wizard-v1";

// Normalize older/saved business objects that may have lower-case address keys
function migrateBusiness(b) {
  if (!b) return b;
  const pa = b.PremisesAddress || b.premisesAddress || {};
  return {
    ...b,
    PremisesAddress: {
      AddressLine1: pa.AddressLine1 ?? pa.addressLine1 ?? "",
      AddressLine2: pa.AddressLine2 ?? pa.addressLine2 ?? "",
      City: pa.City ?? pa.city ?? "",
      PostalCode: pa.PostalCode ?? pa.postalCode ?? "",
      GnDivision: pa.GnDivision ?? pa.gnDivision ?? "",
      DsDivision: pa.DsDivision ?? pa.dsDivision ?? "",
      District: pa.District ?? pa.district ?? "",
      Province: pa.Province ?? pa.province ?? "",
    },
  };
}

export default function Page() {
  const [step, setStep] = useState(1);
  const [unsupported, setUnsupported] = useState(null); // { type, category } | null
  const { status } = useRequireAuth();

  if (status !== 'authenticated') {
    // while checking/refreshing, you can render a skeleton
    return <div className="p-8">Checking session…</div>;
  }
  // single source of truth
  const [form, setForm] = useState({
    category: { type: "", category: "" },
    business: null,
    owner: null,
    documents: null, // keep actual File objects here (not saved to localStorage)
  });

  // load draft on mount (files cannot be restored)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      setForm({
        category: saved.category || { type: "", category: "" },
        business: migrateBusiness(saved.business) || null,
        owner: saved.owner || null,
        documents: null,
      });
      if (saved.step) setStep(saved.step);
    } catch {
      // ignore parse errors
    }
  }, []);

  // save draft (convert File -> {name})
  useEffect(() => {
    const toJSON = (v) => {
      if (typeof File !== "undefined" && v instanceof File) return { name: v.name };
      if (v && typeof v === "object") {
        const out = Array.isArray(v) ? [] : {};
        for (const k in v) out[k] = toJSON(v[k]);
        return out;
      }
      return v;
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toJSON({ ...form, step })));
    } catch {
      // storage might be full or unavailable
    }
  }, [form, step]);

  // app number (create once)
  const ensureAppNo = () => {
    const existing = form.business?.ApplicationNo || form.owner?.applicationNo;
    if (existing) return existing;
    const ts = Date.now().toString().slice(-6);
    const rnd = Math.floor(Math.random() * 900) + 100;
    return `APP-${ts}${rnd}`;
  };

  return (
    <div className="p-6">
      {/* Step 1 — Category */}
      {step === 1 && !unsupported && (
        <BusinessCategorySelection
          onNext={({ type, category }) => {
            const appNo = ensureAppNo();
            setForm((p) => ({
              ...p,
              category: { type, category },
              business: { ...(p.business || {}), ApplicationNo: appNo },
              owner: { ...(p.owner || {}), applicationNo: appNo },
            }));
            setStep(2);
          }}
          onUnsupported={({ type, category }) => setUnsupported({ type, category })}
        />
      )}

      {/* Step 1a — Unsupported type */}
      {step === 1 && unsupported && (
        <UnsupportedBusinessType
          selectedType={unsupported.type}
          onBack={() => setUnsupported(null)}
        />
      )}

      {/* Step 2 — Business */}
      {step === 2 && (
        <BusinessDetails
          appNo={form.business?.ApplicationNo}
          initial={form.business || {}}
          onBack={() => setStep(1)}
          onNext={(values) => {
            const appNo = values.ApplicationNo || ensureAppNo();
            setForm((p) => ({
              ...p,
              business: { ...values, ApplicationNo: appNo },
              owner: { ...(p.owner || {}), applicationNo: appNo },
            }));
            setStep(3);
          }}
        />
      )}

      {/* Step 3 — Owner */}
      {step === 3 && (
        <OwnerDetails
          appNo={form.business?.ApplicationNo || form.owner?.applicationNo}
          initial={form.owner || {}}
          onBack={() => setStep(2)}
          onNext={(values) => {
            setForm((p) => ({ ...p, owner: values }));
            setStep(4);
          }}
        />
      )}

      {/* Step 4 — Documents */}
      {step === 4 && (
        <DocumentsSubmission
          appNo={form.business?.ApplicationNo || form.owner?.applicationNo}
          initial={form.documents || {}}
          category={form.category?.category}
          ownershipType={form.business?.OwnershipType}
          onBack={() => setStep(3)}
          onSubmit={(values) => {
            setForm((p) => ({ ...p, documents: values }));
            setStep(5);
          }}
        />
      )}

      {/* Step 5 — Preview */}
      {step === 5 && (
        <Preview
          data={form}
          onBack={() => setStep(4)}
          onConfirm={() => {
            const fileToName = (v) =>
              typeof File !== "undefined" && v instanceof File
                ? v.name
                : v && typeof v === "object" && "name" in v
                  ? v.name
                  : v ?? null;

            const mapFiles = (obj) => {
              if (!obj) return obj;
              const out = {};
              for (const k in obj) out[k] = fileToName(obj[k]);
              return out;
            };

            const payload = {
              category: form.category,
              business: form.business,
              owner: form.owner,
              documents: mapFiles(form.documents),
            };

            console.log("FINAL PAYLOAD →", payload);
            alert("Submitted! (check console)");
          }}
        />
      )}
    </div>
  );
}
