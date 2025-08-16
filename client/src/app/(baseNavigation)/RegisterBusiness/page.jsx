"use client";
import React, { useEffect, useState } from "react";
import BusinessCategorySelection from "@/components/layouts/RegisterBusiness/BusinessCategorySelection";
import UnsupportedBusinessType from "@/components/layouts/RegisterBusiness/UnsupportedBusinessType";
import BusinessDetails from "@/components/layouts/RegisterBusiness/BusinessDetails";
import OwnerDetails from "@/components/layouts/RegisterBusiness/OwnerDetails";
import DocumentsSubmission from "@/components/layouts/RegisterBusiness/DocumentsSubmission";
import Preview from "@/components/layouts/RegisterBusiness/Preview";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { notify, extractMsg } from "@/lib/notify";
import { postStep1, postStep2, postStep3, postStep4 } from "@/lib/registrationApi";
import { mapStep1, mapStep2, mapStep3, mapStep4Files } from "@/lib/registrationMappers";

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
  // ⚠️ All hooks go first (no early return before them)
  const { status } = useRequireAuth();

  const [step, setStep] = useState(1);
  const [unsupported, setUnsupported] = useState(null); // { type, category } | null

  // single source of truth
  const [form, setForm] = useState({
    category: { type: "", category: "" }, // step 1
    business: null,                       // step 2
    owner: null,                          // step 3
    documents: null,                      // step 4 (File objects, not saved)
    applicationNo: "",                    // comes from step 1 backend
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
        applicationNo: saved.applicationNo || "",
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

  // ---- STEP HANDLERS (call backend, keep UI intact) ----

  // STEP 1 → /api/client/step1-business
  async function handleStep1Next({ type, category }) {
    try {
      const payload = mapStep1({ businessType: type, businessCategory: category });
      // console.log("[Step1] payload →", payload);
      const res = await postStep1(payload);
      if (!res?.data?.ok) {
        throw new Error(res?.data?.errors?.message || "Step 1 failed");
      }
      const appNo =
        res?.data?.data?.ApplicationNo ||
        res?.data?.data?.applicationNo ||
        "";
      if (!appNo) throw new Error("No ApplicationNo returned from server.");

      setForm((p) => ({
        ...p,
        category: { type, category },
        applicationNo: appNo,
        business: { ...(p.business || {}), ApplicationNo: appNo },
        owner: { ...(p.owner || {}), applicationNo: appNo },
      }));
      setUnsupported(null);
      notify.success(res?.data?.message || "Step 1 completed");
      setStep(2);
    } catch (e) {
      notify.error(extractMsg(e, "Step 1 error"));
    }
  }

  // STEP 2 → /api/client/step2-BusinessDetails
  async function handleStep2Next(values) {
    try {
      const appNo = form.applicationNo || values.ApplicationNo;
      const payload = mapStep2({
        applicationNo: appNo,
        business: values,
        premisesType: values?.PremisesType,
      });
      // console.log("[Step2] payload →", payload);
      const res = await postStep2(payload);
      if (!res?.data?.ok) {
        throw new Error(res?.data?.errors?.message || "Step 2 failed");
      }
      setForm((p) => ({
        ...p,
        business: { ...values, ApplicationNo: appNo },
        owner: { ...(p.owner || {}), applicationNo: appNo },
      }));
      notify.success(res?.data?.message || "Step 2 saved");
      setStep(3);
    } catch (e) {
      notify.error(extractMsg(e, "Step 2 error"));
    }
  }

  // STEP 3 → /api/client/step3-contacts
  async function handleStep3Next(values) {
    try {
      const appNo = form.applicationNo || form.business?.ApplicationNo || values?.ApplicationNo;
      const payload = mapStep3(appNo, values);
      // console.log("[Step3] payload →", payload);
      const res = await postStep3(payload);
      if (!res?.data?.ok) {
        throw new Error(res?.data?.errors?.message || "Step 3 failed");
      }
      setForm((p) => ({ ...p, owner: values }));
      notify.success(res?.data?.message || "Proprietor details saved");
      setStep(4);
    } catch (e) {
      notify.error(extractMsg(e, "Step 3 error"));
    }
  }

  // STEP 4 → /api/client/step4-businessDetails (multipart)
  async function handleStep4Submit(values) {
    try {
      const appNo = form.applicationNo || form.business?.ApplicationNo || form.owner?.applicationNo || "";
      if (!appNo) throw new Error("Missing application number for documents upload.");

      const files = mapStep4Files(values);
      // console.log("[Step4] files →", files);
      const res = await postStep4({ applicationNo: appNo, files });
      if (!res?.data?.ok) {
        throw new Error(res?.data?.errors?.message || "Step 4 failed");
      }
      notify.success(res?.data?.message || "Documents uploaded");
      setForm((p) => ({ ...p, documents: values }));
      setStep(5); // Preview
    } catch (e) {
      notify.error(extractMsg(e, "Step 4 error"));
    }
  }

  // ✅ Only now do the conditional render (after hooks have run)
  if (status !== "authenticated") {
    return <div className="p-8">Checking session…</div>;
  }

  // ---- RENDER STEPS (UI unchanged) ----
  return (
    <div className="p-6">
      {/* Step 1 — Category */}
      {step === 1 && !unsupported && (
        <BusinessCategorySelection
          onNext={handleStep1Next}
          onSubmit={handleStep1Next}                 // alias safety
          onContinue={handleStep1Next}               // alias safety
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
          appNo={form.applicationNo || form.business?.ApplicationNo}
          initial={form.business || {}}
          onBack={() => setStep(1)}
          onNext={handleStep2Next}
          onSubmit={handleStep2Next}                 // alias safety
        />
      )}

      {/* Step 3 — Owner */}
      {step === 3 && (
        <OwnerDetails
          appNo={form.applicationNo || form.business?.ApplicationNo || form.owner?.applicationNo}
          initial={form.owner || {}}
          onBack={() => setStep(2)}
          onNext={handleStep3Next}
        />
      )}

      {/* Step 4 — Documents */}
      {step === 4 && (
        <DocumentsSubmission
          appNo={form.applicationNo || form.business?.ApplicationNo || form.owner?.applicationNo}
          initial={form.documents || {}}
          category={form.category?.category}
          ownershipType={form.business?.OwnershipType}
          onBack={() => setStep(3)}
          onSubmit={handleStep4Submit}
        />
      )}

      {/* Step 5 — Preview */}
      {step === 5 && (
        <Preview
          data={form}
          onBack={() => setStep(4)}
          onConfirm={() => {
            // keep your preview confirmation behavior
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