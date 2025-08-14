// layouts/RegisterBusiness/DocumentsSubmission.jsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Section from "@/components/documents/Section";
import FileCard from "@/components/documents/FileCard";
import {
  IconInfoDot as InfoDot,
  IconTag as Tag,
  IconHome as Home,
} from "@/components/ui/icons/icons";

/**
 * Props:
 *  - initial
 *  - onBack()
 *  - onSubmit(payload)
 *  - appNo?: string
 *  - category?: string
 *  - ownershipType?: "owned" | "leased" | "consent"
 */
const btnOutline =
  "px-6 py-3 rounded-[16px] border font-semibold transition hover:bg-indigo-50 hover:border-primary hover:text-primary";

export default function DocumentsSubmission({
  onBack,
  onSubmit,
  initial,
  appNo,
  category,
  ownershipType,
}) {
  const rootRef = useRef(null);

  const [form, setForm] = useState({
    applicationNo: initial?.applicationNo ?? appNo ?? "",
    gnCertificates: initial?.gnCertificates || null,
    affidavit: initial?.affidavit || null,
    ownerNicCopy: initial?.ownerNicCopy || null,
    propertyNicCopy: initial?.propertyNicCopy || null,
    varipanamAssessmentNotice: initial?.varipanamAssessmentNotice || null,
    leaseAgreement: initial?.leaseAgreement || null,
    otherAuthority1: initial?.otherAuthority1 || null, // PHI (Food only)
  });

  // track which fields user interacted with (for inline error reveal)
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!form.applicationNo && appNo) {
      setForm((p) => ({ ...p, applicationNo: appNo }));
    }
  }, [appNo]);

  const isFood = useMemo(() => (category || "").toLowerCase() === "food", [category]);
  const isLeased = useMemo(() => (ownershipType || "").toLowerCase() === "leased", [ownershipType]);

  // clear values & errors when a conditional field becomes hidden
  useEffect(() => {
    if (!isLeased && (form.leaseAgreement || errors.leaseAgreement)) {
      setForm((p) => ({ ...p, leaseAgreement: null }));
      setErrors((e) => {
        const { leaseAgreement, ...rest } = e || {};
        return rest;
      });
    }
  }, [isLeased]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isFood && (form.otherAuthority1 || errors.otherAuthority1)) {
      setForm((p) => ({ ...p, otherAuthority1: null }));
      setErrors((e) => {
        const { otherAuthority1, ...rest } = e || {};
        return rest;
      });
    }
  }, [isFood]); // eslint-disable-line react-hooks/exhaustive-deps

  const setFile = (key, file) => {
    setForm((p) => ({ ...p, [key]: file }));
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: "" })); // clear error on change
  };

  const clearFile = (key) => {
    setForm((p) => ({ ...p, [key]: null }));
    setTouched((t) => ({ ...t, [key]: true }));
    // keep/compute error on submit
  };

  const requiredEntries = [
    { key: "gnCertificates", label: "GN Certificate", visible: true },
    { key: "affidavit", label: "Affidavit", visible: true },
    { key: "ownerNicCopy", label: "Owner NIC Copy", visible: true },
    { key: "propertyNicCopy", label: "Property Owner NIC Copy", visible: true },
    { key: "varipanamAssessmentNotice", label: "Varipanam Assessment Notice", visible: true },
    { key: "leaseAgreement", label: "Lease Agreement", visible: isLeased },
    { key: "otherAuthority1", label: "PHI Certificate (Food Business)", visible: isFood },
  ];

  const validate = (state = form) => {
    const next = {};
    requiredEntries.forEach(({ key, visible }) => {
      if (visible && !state[key]) next[key] = "This file is required.";
    });
    return next;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);

      // scroll to first error for better UX
      try {
        const firstKey = Object.keys(nextErrors)[0];
        const node = rootRef.current?.querySelector(`[data-doc-key="${firstKey}"]`);
        node?.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch { /* ignore */ }

      return;
    }

    onSubmit({
      applicationNo: form.applicationNo,
      gnCertificates: form.gnCertificates,
      affidavit: form.affidavit,
      ownerNicCopy: form.ownerNicCopy,
      propertyNicCopy: form.propertyNicCopy,
      varipanamAssessmentNotice: form.varipanamAssessmentNotice,
      leaseAgreement: isLeased ? form.leaseAgreement : null,
      otherAuthority1: isFood ? form.otherAuthority1 : null,
    });
  };

  const chip = "flex items-center gap-2 rounded-xl bg-indigo-50/80 px-3 py-2 text-sm border border-transparent";

  // helper to decide whether to show error under a field
  const errFor = (key) => {
    const msg = errors[key];
    if (!msg) return "";
    return (submitted || touched[key]) ? msg : "";
  };

  return (
    <section ref={rootRef} className="min-h-[calc(100vh-80px)] py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Heading */}
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Upload the required <span className="text-primary">Documents</span>
          </h1>
          <p className="text-sm text-base-text/70 mt-2">
            Accepted: <strong>PDF only</strong> · Max size <strong>10MB</strong> per file.
          </p>
        </header>

        {/* Summary chips */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className={chip}>
            <InfoDot />
            <div className="truncate">
              <span className="font-medium">Application No:</span>{" "}
              <span className="text-base-text/80">
                {form.applicationNo || "Auto-generated"}
              </span>
            </div>
          </div>
          <div className={chip}>
            <Tag />
            <div className="truncate">
              <span className="font-medium">Category:</span>{" "}
              <span className="text-base-text/80">{category || "—"}</span>
            </div>
          </div>
          <div className={chip}>
            <Home />
            <div className="truncate">
              <span className="font-medium">Ownership:</span>{" "}
              <span className="text-base-text/80">{ownershipType || "—"}</span>
            </div>
          </div>
        </div>

        {/* Groups */}
        <Section title="Identity & Legal">
          <div className="grid md:grid-cols-2 gap-5">
            <div data-doc-key="gnCertificates">
              <FileCard
                required
                label="GN Certificate"
                hint="Grama Niladhari certificate"
                value={form.gnCertificates}
                error={errFor("gnCertificates")}
                onChange={(f) => setFile("gnCertificates", f)}
                onClear={() => clearFile("gnCertificates")}
              />
            </div>
            <div data-doc-key="affidavit">
              <FileCard
                required
                label="Affidavit"
                hint="Signed affidavit"
                value={form.affidavit}
                error={errFor("affidavit")}
                onChange={(f) => setFile("affidavit", f)}
                onClear={() => clearFile("affidavit")}
              />
            </div>
            <div data-doc-key="ownerNicCopy">
              <FileCard
                required
                label="Owner NIC Copy"
                hint="Front/back in one file"
                value={form.ownerNicCopy}
                error={errFor("ownerNicCopy")}
                onChange={(f) => setFile("ownerNicCopy", f)}
                onClear={() => clearFile("ownerNicCopy")}
              />
            </div>
            <div data-doc-key="propertyNicCopy">
              <FileCard
                required
                label="Property Owner NIC Copy"
                hint="If premises not owned by applicant"
                value={form.propertyNicCopy}
                error={errFor("propertyNicCopy")}
                onChange={(f) => setFile("propertyNicCopy", f)}
                onClear={() => clearFile("propertyNicCopy")}
              />
            </div>
          </div>
        </Section>

        <Section title="Local Authority">
          <div className="grid md:grid-cols-2 gap-5">
            <div data-doc-key="varipanamAssessmentNotice">
              <FileCard
                required
                label="Varipanam Assessment Notice"
                hint="Latest assessment/billing notice"
                value={form.varipanamAssessmentNotice}
                error={errFor("varipanamAssessmentNotice")}
                onChange={(f) => setFile("varipanamAssessmentNotice", f)}
                onClear={() => clearFile("varipanamAssessmentNotice")}
              />
            </div>
            {isFood && (
              <div data-doc-key="otherAuthority1">
                <FileCard
                  required
                  label="PHI Certificate (Food Business)"
                  hint="Public Health Inspector certificate"
                  value={form.otherAuthority1}
                  error={errFor("otherAuthority1")}
                  onChange={(f) => setFile("otherAuthority1", f)}
                  onClear={() => clearFile("otherAuthority1")}
                />
              </div>
            )}
          </div>
        </Section>

        
            {isLeased && (
              <Section  title="Business Licensing" >
              <div data-doc-key="leaseAgreement">
                <FileCard
                  required
                  label="Lease Agreement"
                  hint="Complete, signed agreement"
                  value={form.leaseAgreement}
                  error={errFor("leaseAgreement")}
                  onChange={(f) => setFile("leaseAgreement", f)}
                  onClear={() => clearFile("leaseAgreement")}
                />
              </div>
              </Section>
             
            )}
        

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <button type="button" onClick={onBack} className={btnOutline}>
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-3 rounded-[16px] bg-[var(--primary)] text-white font-semibold hover:opacity-90 hover:shadow-md transition"
          >
            Next: Preview
          </button>
        </div>
      </div>
    </section>
  );
}
