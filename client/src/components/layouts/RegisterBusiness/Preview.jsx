"use client";
import React from "react";
import {
    IconInfoDot as InfoDot,
    IconTag as Tag,
    IconHome as Home,
    IconSection as SectionIcon,
  } from "@/components/ui/icons/icons";
  

/**
 * Props:
 *  - data: { category, business, owner, documents }
 *  - onBack(): go to previous step
 *  - onConfirm(): final submit
 */

const btnOutline =
  "px-6 py-3 rounded-[16px] border font-semibold transition hover:bg-indigo-50 hover:border-primary hover:text-primary";

export default function Preview({ data, onBack, onConfirm }) {
  const chip  = "flex items-center gap-2 rounded-xl bg-indigo-50/80 px-3 py-2 text-sm border border-transparent";
  const row   = "grid md:grid-cols-2 gap-3";

  return (
    <section className="min-h-[calc(100vh-80px)] py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Heading */}
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Review your <span className="text-primary">Submission</span>
          </h1>
          <p className="text-sm text-base-text/70 mt-2">
            Please confirm everything looks correct before submitting.
          </p>
        </header>

        {/* Summary chips */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className={chip}>
            <InfoDot />
            <div className="truncate">
              <span className="font-medium">Application No:</span>{" "}
              <span className="text-base-text/80">
                {data?.business?.ApplicationNo || data?.owner?.applicationNo || "—"}
              </span>
            </div>
          </div>
          <div className={chip}>
            <Tag />
            <div className="truncate">
              <span className="font-medium">Category:</span>{" "}
              <span className="text-base-text/80">
                {data?.category?.category || "—"}
              </span>
            </div>
          </div>
          <div className={chip}>
            <Home />
            <div className="truncate">
              <span className="font-medium">Ownership:</span>{" "}
              <span className="text-base-text/80">
                {data?.business?.OwnershipType || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Business */}
        <Card title="Business Details">
          <div className={row}>
            <Item label="Business Name" value={data?.business?.BusinessName} />
            <Item label="Commencement Date" value={data?.business?.CommencementDate} />
          </div>
          <div className={row}>
            <Item label="Description" value={data?.business?.BusinessDescription} />
            <Item label="Products / Services" value={data?.business?.ProductServices} />
          </div>
          <div className={row}>
            <Item label="Initial Capital (Rs.)" value={data?.business?.InitialCapital} />
            <Item label="Annual Turnover (Rs.)" value={data?.business?.AnnualTurnover} />
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            <Item
              label="Address"
              value={[
                data?.business?.PremisesAddress?.AddressLine1,
                data?.business?.PremisesAddress?.AddressLine2,
                [data?.business?.PremisesAddress?.City, data?.business?.PremisesAddress?.PostalCode].filter(Boolean).join(" "),
                [data?.business?.PremisesAddress?.District, data?.business?.PremisesAddress?.Province].filter(Boolean).join(", "),
              ].filter(Boolean).join(", ")}
            />
            <Item label="Premises Type" value={data?.business?.PremisesType} />
          </div>
        </Card>

        {/* Owner */}
        <Card title="Owner Details">
          <div className={row}>
            <Item label="Full Name" value={data?.owner?.fullName} />
            <Item label="Name with Initials" value={data?.owner?.nameWithInitials} />
          </div>
          <div className={row}>
            <Item label="NIC" value={data?.owner?.nic} />
            <Item label="Passport No" value={data?.owner?.passportNo} />
          </div>
          <div className={row}>
            <Item label="Date of Birth" value={data?.owner?.dateOfBirth} />
            <Item label="Gender" value={data?.owner?.gender} />
          </div>
          <div className={row}>
            <Item
              label="Residential Address"
              value={[
                data?.owner?.residentialAddress?.addressLine1,
                data?.owner?.residentialAddress?.addressLine2,
                [data?.owner?.residentialAddress?.city, data?.owner?.residentialAddress?.postalCode].filter(Boolean).join(" "),
                [data?.owner?.residentialAddress?.district, data?.owner?.residentialAddress?.province].filter(Boolean).join(", "),
              ].filter(Boolean).join(", ")}
            />
            <Item
              label="Contact"
              value={[data?.owner?.mobileNo, data?.owner?.email].filter(Boolean).join(" / ")}
            />
          </div>
        </Card>

        {/* Documents */}
        <Card title="Documents">
          <div className="grid md:grid-cols-2 gap-3">
            <Item label="GN Certificate" value={data?.documents?.gnCertificates} />
            <Item label="Affidavit" value={data?.documents?.affidavit} />
            <Item label="Owner NIC Copy" value={data?.documents?.ownerNicCopy} />
            <Item label="Property Owner NIC Copy" value={data?.documents?.propertyNicCopy} />
            <Item label="Varipanam Assessment Notice" value={data?.documents?.varipanamAssessmentNotice} />
            {data?.business?.OwnershipType?.toLowerCase() === "leased" && (
              <Item label="Lease Agreement" value={data?.documents?.leaseAgreement} />
            )}
            <Item label="Trade License Document" value={data?.documents?.tradeLicenseDoc} />
            {data?.category?.category?.toLowerCase() === "food" && (
              <Item label="PHI Certificate (Food Business)" value={data?.documents?.otherAuthority1} />
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <button type="button" onClick={onBack} className={btnOutline}>
            Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-3 rounded-[16px] bg-[var(--primary)] text-white font-semibold transition hover:opacity-90 hover:shadow-md"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </section>
  );
}

/* subcomponents to match theme */
function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-primary/10 bg-white/70 shadow-sm p-5 md:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <SectionIcon />
        <h2 className="text-lg font-semibold text-base-text">
          <span className="px-2 py-1 rounded-lg bg-indigo-50/60">{title}</span>
        </h2>
      </div>
      {children}
    </section>
  );
}

/** Safely coerce any value (including File objects) to a display string */
function toDisplay(value) {
  if (value === null || typeof value === "undefined" || value === "") return "—";
  // Handle File or { name: "..." } objects
  if (typeof File !== "undefined" && value instanceof File) return value.name || "—";
  if (typeof value === "object" && "name" in value) return value.name || "—";
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}

function Item({ label, value }) {
  return (
    <div>
      <div className="text-sm font-semibold text-base-text">{label}</div>
      <div className="mt-1 break-words text-base-text/80">{toDisplay(value)}</div>
    </div>
  );
}

