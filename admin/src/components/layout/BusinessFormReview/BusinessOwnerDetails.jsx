import React, { useEffect, useMemo, useState } from "react";

const titleCase = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : null);

const Row = ({ label, value }) => {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  )
    return null;
  return (
    <>
      <p className="base-text">{label}</p>
      <p className="base-text font-medium break-words">{value}</p>
    </>
  );
};

const Card = ({ title, children }) => (
  <section>
    <h3 className="mb-3 text-sm font-semibold tracking-wide base-text">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 p-4 rounded-xl border border-slate-200 bg-white">
      {children}
    </div>
  </section>
);

const Skeleton = () => (
  <div className="mt-8 space-y-6 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-slate-200 bg-white"
      >
        {[...Array(6)].map((__, j) => (
          <div key={j} className="h-4 rounded bg-slate-200" />
        ))}
      </div>
    ))}
  </div>
);

export default function BusinessOwnerDetails({ request_Id }) {
  const [ownerData, setOwnerData] = useState(null);
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
        )}/proprietor`;

        const res = await fetch(url, { cache: "no-store", signal: controller.signal });
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }
        const json = await res.json();
        setOwnerData(json?.data ?? null);
      } catch (err) {
        if (err?.name !== "AbortError") {
          setError(err?.message || "Failed to load");
          setOwnerData(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [request_Id, base]);

  if (isLoading || !ownerData) return <Skeleton />;

  if (error)
    return (
      <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm base-text">
        <p className="font-semibold">Couldn’t load proprietor details.</p>
        <p className="mt-1">{error}</p>
      </div>
    );


  const p = ownerData;

  return (
    <div className="mt-8 space-y-6">
      <Card title="Personal Details">
        <Row label="Honorific" value={titleCase(p.honorific)} />
        <Row label="Gender" value={p.gender} />
        <Row label="Date of Birth" value={formatDate(p.dateofbirth)} />
        <Row label="Name (with Initials)" value={p.namewithinitials} />
        <Row label="Full Name" value={p.fullname} />
        <Row label="Maiden Name" value={p.maidenname} />
      </Card>

      <Card title="Identification">
        <Row label="NIC" value={p.nic} />
        <Row label="Passport No." value={p.passportno} />
        <Row
          label="NIC Copy"
          value={
            p.niccopyurl ? (
              <a
                href={p.niccopyurl}
                target="_blank"
                rel="noreferrer"
                className="underline hover:decoration-slate-700 base-text"
              >
                View document
              </a>
            ) : null
          }
        />
      </Card>

      <Card title="Contact">
        <Row label="Mobile" value={p.mobileno} />
        <Row label="Fixed Line" value={p.fixedno} />
        <Row
          label="Email"
          value={
            p.email ? (
              <a href={`mailto:${p.email}`} className="underline base-text">
                {p.email}
              </a>
            ) : null
          }
        />
      </Card>

      <Card title="Address">
        <Row label="Address Line 1" value={p.addressline1} />
        <Row label="Address Line 2" value={p.addressline2} />
        <Row label="City" value={p.city} />
        <Row label="Postal Code" value={p.postalcode} />
        <Row label="GN Division" value={p.gndivision} />
        <Row label="DS Division" value={p.dsdivision} />
        <Row label="District" value={p.district} />
        <Row label="Province" value={p.province} />
      </Card>
    </div>
  );
}
