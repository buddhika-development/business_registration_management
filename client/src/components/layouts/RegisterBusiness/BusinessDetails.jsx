"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import NiceSelect from "@/components/ui/NiceSelect";
import {
  PROVINCES,
  DISTRICTS_BY_PROVINCE
} from "@/lib/sl-geo";
import {DS_DIVISIONS_BY_DISTRICT,} from "@/lib/ds-divisions-by-district";

const btnOutline =
  "px-6 py-3 rounded-[16px] border font-semibold transition hover:bg-indigo-50 hover:border-primary hover:text-primary";

/** Normalize any incoming shape (handles older lowercase keys) */
function normalizeInitial(src = {}) {
  const s = src || {};
  const norm = (v) => (v ?? "").toString().trim();

  const pa = s.PremisesAddress || s.premisesAddress || {};
  const po = s.PropertyOwner || s.propertyOwner || {};
  const le = s.Lease || s.lease || {};

  return {
    ...s,
    ApplicationNo: s.ApplicationNo ?? s.applicationNo ?? "",
    PremisesAddress: {
      AddressLine1: norm(pa.AddressLine1 ?? pa.addressLine1),
      AddressLine2: norm(pa.AddressLine2 ?? pa.addressLine2),
      City:         norm(pa.City         ?? pa.city),
      PostalCode:   norm(pa.PostalCode   ?? pa.postalCode),
      GnDivision:   norm(pa.GnDivision   ?? pa.gnDivision),
      DsDivision:   norm(pa.DsDivision   ?? pa.dsDivision),
      District:     norm(pa.District     ?? pa.district),
      Province:     norm(pa.Province     ?? pa.province),
    },
    PropertyOwner: {
      Name: norm(po.Name ?? po.name),
      Nic:  norm(po.Nic  ?? po.nic),
    },
    Lease: {
      ValidUntil: norm(le.ValidUntil ?? le.validUntil),
    },
  };
}

export default function BusinessDetails({ onBack, onNext, initial, appNo }) {
  const [form, setForm] = useState({
    ApplicationNo: appNo || "",
    BusinessName: "",
    CommencementDate: "",
    BusinessDescription: "",
    ProductServices: "",
    InitialCapital: "",
    AnnualTurnover: "",
    PremisesType: "shop",
    PremisesAddress: {
      AddressLine1: "", AddressLine2: "", City: "", PostalCode: "",
      GnDivision: "", DsDivision: "", District: "", Province: "",
    },
    OwnershipType: "owned",
    PropertyOwner: { Name: "", Nic: "" },
    Lease: { ValidUntil: "" },
    DeedNo: "",
    TradeLicenseNo: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const rootRef = useRef(null);
  const isInitializedRef = useRef(false);
  const isHydratingRef = useRef(false);

  // hydrate with normalization + appNo
  useEffect(() => {
    const src = normalizeInitial(initial);
    isHydratingRef.current = true;

    setForm(prev => ({
      ...prev,
      ...src,
      ApplicationNo: appNo ?? src.ApplicationNo ?? prev.ApplicationNo,
      PremisesAddress: { ...(prev.PremisesAddress || {}), ...(src.PremisesAddress || {}) },
      PropertyOwner:  { ...(prev.PropertyOwner  || {}), ...(src.PropertyOwner  || {}) },
      Lease:          { ...(prev.Lease          || {}), ...(src.Lease          || {}) },
    }));

    setTimeout(() => {
      isHydratingRef.current = false;
      isInitializedRef.current = true;
    }, 0);
  }, [initial, appNo]);

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setAddr  = (k, v) => setForm(p => ({ ...p, PremisesAddress: { ...(p.PremisesAddress ?? {}), [k]: v } }));
  const setOwner = (k, v) => setForm(p => ({ ...p, PropertyOwner:  { ...(p.PropertyOwner  ?? {}), [k]: v } }));
  const setLease = (k, v) => setForm(p => ({ ...p, Lease:          { ...(p.Lease          ?? {}), [k]: v } }));
  const markTouched = (key) => setTouched(t => ({ ...t, [key]: true }));

  // Current address pieces
  const addr = form.PremisesAddress ?? {
    AddressLine1: "", AddressLine2: "", City: "", PostalCode: "",
    GnDivision: "", DsDivision: "", District: "", Province: "",
  };
  const currentProvince = addr.Province || "";
  const currentDistrict = addr.District || "";
  const currentDS       = addr.DsDivision || "";

  // District options (by province) – tolerant to preserved value during hydration
  const districtBaseOptions = useMemo(
    () => DISTRICTS_BY_PROVINCE[currentProvince] || [],
    [currentProvince]
  );
  const availableDistricts = useMemo(() => {
    return currentDistrict && !districtBaseOptions.includes(currentDistrict)
      ? [currentDistrict, ...districtBaseOptions]
      : districtBaseOptions;
  }, [currentDistrict, districtBaseOptions]);

  // DS options (by district) – tolerant
  const dsBaseOptions = useMemo(
    () => DS_DIVISIONS_BY_DISTRICT[currentDistrict] || [],
    [currentDistrict]
  );
  const availableDS = useMemo(() => {
    return currentDS && !dsBaseOptions.includes(currentDS)
      ? [currentDS, ...dsBaseOptions]
      : dsBaseOptions;
  }, [currentDS, dsBaseOptions]);

  // Clear dependent fields only on user changes (not hydration)
  useEffect(() => {
    if (!isInitializedRef.current || isHydratingRef.current) return;

    // Province change -> maybe clear District
    if (!currentProvince) {
      setAddr("District", "");
      setAddr("DsDivision", ""); // also clear DS if province cleared
      return;
    }
    if (currentDistrict && !districtBaseOptions.includes(currentDistrict)) {
      setAddr("District", "");
      setAddr("DsDivision", "");
    }
  }, [currentProvince, currentDistrict, districtBaseOptions]);

  useEffect(() => {
    if (!isInitializedRef.current || isHydratingRef.current) return;

    // District change -> maybe clear DS
    if (!currentDistrict) {
      setAddr("DsDivision", "");
      return;
    }
    if (currentDS && !dsBaseOptions.includes(currentDS)) {
      setAddr("DsDivision", "");
    }
  }, [currentDistrict, currentDS, dsBaseOptions]);

  // Helpers for selects (also clear related inline errors)
  const handleProvinceChange = (newProvince) => {
    setAddr("Province", newProvince);
    markTouched("PremisesAddress.Province");
    setErrors(prev => { const n = { ...prev }; delete n["PremisesAddress.Province"]; return n; });
  };
  const handleDistrictChange = (newDistrict) => {
    setAddr("District", newDistrict);
    markTouched("PremisesAddress.District");
    setErrors(prev => { const n = { ...prev }; delete n["PremisesAddress.District"]; return n; });
  };
  const handleDSChange = (newDS) => {
    setAddr("DsDivision", newDS);
    markTouched("PremisesAddress.DsDivision");
    setErrors(prev => { const n = { ...prev }; delete n["PremisesAddress.DsDivision"]; return n; });
  };

  // --- validation ---
  const isBlank = (v) => !(v ?? "").toString().trim();
  const isNumber = (v) => !Number.isNaN(Number(v));

  const validateAll = (state = form) => {
    const e = {};
    const a = state.PremisesAddress ?? {};
    const owner = state.PropertyOwner ?? {};
    const lease = state.Lease ?? {};

    if (isBlank(state.BusinessName)) e["BusinessName"] = "Business Name is required.";
    if (!state.CommencementDate)     e["CommencementDate"] = "Date of commencement is required.";

    if (isBlank(a.AddressLine1)) e["PremisesAddress.AddressLine1"] = "Address Line 1 is required.";
    if (isBlank(a.City))         e["PremisesAddress.City"] = "City is required.";
    if (isBlank(a.PostalCode))   e["PremisesAddress.PostalCode"] = "Postal Code is required.";
    if (isBlank(a.Province))     e["PremisesAddress.Province"] = "Province is required.";
    if (isBlank(a.District))     e["PremisesAddress.District"] = "District is required.";
    if (isBlank(a.DsDivision))   e["PremisesAddress.DsDivision"] = "DS Division is required.";
    if (isBlank(a.GnDivision))   e["PremisesAddress.GnDivision"] = "GN Division is required.";

    // Cross-field validity
    if (a.Province && a.District) {
      const provinceDistricts = DISTRICTS_BY_PROVINCE[a.Province] || [];
      if (!provinceDistricts.includes(a.District)) {
        e["PremisesAddress.District"] = "Selected district is not valid for the chosen province.";
      }
    }
    if (a.District && a.DsDivision) {
      const dsList = DS_DIVISIONS_BY_DISTRICT[a.District] || [];
      if (!dsList.includes(a.DsDivision)) {
        e["PremisesAddress.DsDivision"] = "Selected DS Division is not valid for the chosen district.";
      }
    }

    if (state.OwnershipType === "leased" && !lease.ValidUntil)
      e["Lease.ValidUntil"] = "Lease valid-until date is required.";

    if (state.OwnershipType === "consent") {
      if (isBlank(owner.Name)) e["PropertyOwner.Name"] = "Owner name is required for consent.";
      if (isBlank(owner.Nic))  e["PropertyOwner.Nic"]  = "Owner NIC is required for consent.";
    }

    if (!isBlank(state.InitialCapital) && !isNumber(state.InitialCapital))
      e["InitialCapital"] = "Initial Capital must be a number.";
    if (!isBlank(state.AnnualTurnover) && !isNumber(state.AnnualTurnover))
      e["AnnualTurnover"] = "Annual Turnover must be a number.";

    if (isBlank(state.DeedNo))         e["DeedNo"] = "Deed no is required.";
    if (isBlank(state.TradeLicenseNo)) e["TradeLicenseNo"] = "Trade License No is required.";

    return e;
  };

  const errFor = (key) => {
    const msg = errors[key];
    if (!msg) return "";
    return (submitted || touched[key]) ? msg : "";
  };

  const handleNext = () => {
    setSubmitted(true);
    const nextErrors = validateAll();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      try {
        const firstKey = Object.keys(nextErrors)[0];
        const node = rootRef.current?.querySelector(
          `[data-err-key="${firstKey.replace(/"/g, '\\"')}"]`
        );
        node?.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch {}
      return;
    }

    onNext({
      ApplicationNo:   form.ApplicationNo,
      BusinessName:    form.BusinessName,
      CommencementDate:form.CommencementDate,
      BusinessDescription: form.BusinessDescription,
      ProductServices: form.ProductServices,
      InitialCapital:  form.InitialCapital,
      AnnualTurnover:  form.AnnualTurnover,
      PremisesType:    form.PremisesType,
      PremisesAddress: { ...(form.PremisesAddress ?? {}) },
      OwnershipType:   form.OwnershipType,
      PropertyOwner:   { ...(form.PropertyOwner ?? {}) },
      Lease:           { ...(form.Lease ?? {}) },
      DeedNo:          form.DeedNo,
      TradeLicenseNo:  form.TradeLicenseNo,
    });
  };

  const input =
    "w-full rounded-xl bg-indigo-50/80 px-4 py-3 text-base-text/80 outline-none border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition";
  const label = "block text-sm font-semibold text-base-text";
  const hintErr = "mt-1 text-xs text-red-600";

  const isDistrictValidForProvince =
    !currentDistrict || !currentProvince || availableDistricts.includes(currentDistrict);

  const isDSValidForDistrict =
    !currentDS || !currentDistrict || availableDS.includes(currentDS);

  return (
    <section ref={rootRef} className="min-h-[calc(100vh-80px)] py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-8">
          <span>Let's Know about the </span>
          <span className="text-primary">Business</span>
        </h1>

        <div className="grid grid-cols-1 gap-5 md:gap-6">
          {/* App No (read-only, not required) */}
          <div>
            <label className={label}>Application No (auto) :</label>
            <input className={`${input} disabled:opacity-70`} value={form.ApplicationNo} readOnly placeholder="Auto-generated" />
          </div>

          {/* Top row */}
          <div className="grid md:grid-cols-2 gap-5">
            <div data-err-key="BusinessName">
              <label className={label}>Business Name :</label>
              <input
                className={input}
                placeholder="Fresh Brew Cafe"
                value={form.BusinessName}
                onChange={(e) => setField("BusinessName", e.target.value)}
                onBlur={() => markTouched("BusinessName")}
              />
              {errFor("BusinessName") && <p className={hintErr}>{errFor("BusinessName")}</p>}
            </div>
            <div data-err-key="CommencementDate">
              <label className={label}>Date of commencement of business :</label>
              <input
                type="date"
                className={input}
                value={form.CommencementDate}
                onChange={(e) => setField("CommencementDate", e.target.value)}
                onBlur={() => markTouched("CommencementDate")}
              />
              {errFor("CommencementDate") && <p className={hintErr}>{errFor("CommencementDate")}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={label}>Business Description :</label>
            <input
              className={input}
              placeholder="Short description"
              value={form.BusinessDescription}
              onChange={(e) => setField("BusinessDescription", e.target.value)}
            />
          </div>

          {/* Products/Services */}
          <div>
            <label className={label}>Products / Services :</label>
            <input
              className={input}
              placeholder="e.g., Coffee, Snacks, Catering"
              value={form.ProductServices}
              onChange={(e) => setField("ProductServices", e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="grid md:grid-cols-2 gap-5">
            <div data-err-key="PremisesAddress.AddressLine1">
              <label className={label}>Address line 1 :</label>
              <input
                className={input}
                value={addr.AddressLine1}
                onChange={(e) => setAddr("AddressLine1", e.target.value)}
                onBlur={() => markTouched("PremisesAddress.AddressLine1")}
              />
              {errFor("PremisesAddress.AddressLine1") && <p className={hintErr}>{errFor("PremisesAddress.AddressLine1")}</p>}
            </div>
            <div>
              <label className={label}>Address line 2 :</label>
              <input
                className={input}
                value={addr.AddressLine2}
                onChange={(e) => setAddr("AddressLine2", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div data-err-key="PremisesAddress.City">
              <label className={label}>City :</label>
              <input
                className={input}
                value={addr.City}
                onChange={(e) => setAddr("City", e.target.value)}
                onBlur={() => markTouched("PremisesAddress.City")}
              />
              {errFor("PremisesAddress.City") && <p className={hintErr}>{errFor("PremisesAddress.City")}</p>}
            </div>
            <div data-err-key="PremisesAddress.PostalCode">
              <label className={label}>Postal Code :</label>
              <input
                className={input}
                value={addr.PostalCode}
                onChange={(e) => setAddr("PostalCode", e.target.value)}
                onBlur={() => markTouched("PremisesAddress.PostalCode")}
              />
              {errFor("PremisesAddress.PostalCode") && <p className={hintErr}>{errFor("PremisesAddress.PostalCode")}</p>}
            </div>
            <div data-err-key="PremisesAddress.Province">
              <label className={label}>Province :</label>
              <NiceSelect
                value={addr.Province}
                onChange={(e) => handleProvinceChange(e.target.value)}
                onBlur={() => markTouched("PremisesAddress.Province")}
                placeholder="Select province"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </NiceSelect>
              {errFor("PremisesAddress.Province") && <p className={hintErr}>{errFor("PremisesAddress.Province")}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div data-err-key="PremisesAddress.District">
              <label className={label}>District :</label>
              <NiceSelect
                value={addr.District}
                onChange={(e) => handleDistrictChange(e.target.value)}
                onBlur={() => markTouched("PremisesAddress.District")}
                placeholder={currentProvince ? "Select district" : "Select province first"}
                disabled={!currentProvince}
                className={(!isDistrictValidForProvince && currentDistrict && !isHydratingRef.current) ? "border-red-300 bg-red-50" : ""}
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
                {currentDistrict && !districtBaseOptions.includes(currentDistrict) && (
                  <option key={currentDistrict} value={currentDistrict} disabled style={{ color: "#999" }}>
                    {currentDistrict} (Invalid for {currentProvince})
                  </option>
                )}
              </NiceSelect>
              {errFor("PremisesAddress.District") && <p className={hintErr}>{errFor("PremisesAddress.District")}</p>}
              {!isDistrictValidForProvince && currentDistrict && !isHydratingRef.current && (
                <p className={hintErr}>"{currentDistrict}" is not available for "{currentProvince}". Please select a valid district.</p>
              )}
            </div>

            <div data-err-key="PremisesAddress.DsDivision">
              <label className={label}>DS Division :</label>
              <NiceSelect
                value={addr.DsDivision}
                onChange={(e) => handleDSChange(e.target.value)}
                onBlur={() => markTouched("PremisesAddress.DsDivision")}
                placeholder={currentDistrict ? "Select DS division" : "Select district first"}
                disabled={!currentDistrict}
                className={(!isDSValidForDistrict && currentDS && !isHydratingRef.current) ? "border-red-300 bg-red-50" : ""}
              >
                {availableDS.map((ds) => (
                  <option key={ds} value={ds}>{ds}</option>
                ))}
                {currentDS && !dsBaseOptions.includes(currentDS) && (
                  <option key={currentDS} value={currentDS} disabled style={{ color: "#999" }}>
                    {currentDS} (Invalid for {currentDistrict})
                  </option>
                )}
              </NiceSelect>
              {errFor("PremisesAddress.DsDivision") && <p className={hintErr}>{errFor("PremisesAddress.DsDivision")}</p>}
              {!isDSValidForDistrict && currentDS && !isHydratingRef.current && (
                <p className={hintErr}>"{currentDS}" is not available for "{currentDistrict}". Please select a valid DS division.</p>
              )}
            </div>

            <div data-err-key="PremisesAddress.GnDivision">
              <label className={label}>GN Division :</label>
              <input
                className={input}
                value={addr.GnDivision}
                onChange={(e) => setAddr("GnDivision", e.target.value)}
                onBlur={() => markTouched("PremisesAddress.GnDivision")}
              />
              {errFor("PremisesAddress.GnDivision") && <p className={hintErr}>{errFor("PremisesAddress.GnDivision")}</p>}
            </div>
          </div>

          {/* Premises Type */}
          <div>
            <label className={label}>Premises Type :</label>
            <NiceSelect
              value={form.PremisesType}
              onChange={(e) => setField("PremisesType", e.target.value)}
            >
              <option value="shop">Shop</option>
              <option value="office">Office</option>
              <option value="warehouse">Warehouse</option>
              <option value="branch">Branch</option>
              <option value="factory">Factory</option>
              <option value="other">Other</option>
            </NiceSelect>
          </div>

          {/* Ownership Type */}
          <div>
            <label className={label}>Ownership Type :</label>
            <div className="flex items-center gap-6 mt-2">
              {["owned", "leased", "consent"].map((v) => (
                <label key={v} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    className="accent-[var(--primary)]"
                    name="OwnershipType"
                    value={v}
                    checked={form.OwnershipType === v}
                    onChange={(e) => {
                      const next = e.target.value;
                      setField("OwnershipType", next);
                      setErrors((old) => {
                        const n = { ...old };
                        if (next !== "leased") delete n["Lease.ValidUntil"];
                        if (next !== "consent") { delete n["PropertyOwner.Name"]; delete n["PropertyOwner.Nic"]; }
                        return n;
                      });
                    }}
                  />
                  <span className="capitalize">{v}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Conditional fields */}
          {form.OwnershipType === "leased" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div data-err-key="Lease.ValidUntil">
                <label className={label}>Lease valid until :</label>
                <input
                  type="date"
                  className={input}
                  value={form.Lease?.ValidUntil || ""}
                  onChange={(e) => setLease("ValidUntil", e.target.value)}
                  onBlur={() => markTouched("Lease.ValidUntil")}
                />
                {errFor("Lease.ValidUntil") && <p className={hintErr}>{errFor("Lease.ValidUntil")}</p>}
              </div>
              <div>
                <label className={label}>Landlord / Property owner name (optional):</label>
                <input
                  className={input}
                  value={form.PropertyOwner?.Name || ""}
                  onChange={(e) => setOwner("Name", e.target.value)}
                />
              </div>
            </div>
          )}

          {form.OwnershipType === "consent" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div data-err-key="PropertyOwner.Name">
                <label className={label}>Property Owner Name :</label>
                <input
                  className={input}
                  value={form.PropertyOwner?.Name || ""}
                  onChange={(e) => setOwner("Name", e.target.value)}
                  onBlur={() => markTouched("PropertyOwner.Name")}
                />
                {errFor("PropertyOwner.Name") && <p className={hintErr}>{errFor("PropertyOwner.Name")}</p>}
              </div>
              <div data-err-key="PropertyOwner.Nic">
                <label className={label}>Property Owner NIC :</label>
                <input
                  className={input}
                  value={form.PropertyOwner?.Nic || ""}
                  onChange={(e) => setOwner("Nic", e.target.value)}
                  onBlur={() => markTouched("PropertyOwner.Nic")}
                />
                {errFor("PropertyOwner.Nic") && <p className={hintErr}>{errFor("PropertyOwner.Nic")}</p>}
              </div>
            </div>
          )}

          {/* Numbers */}
          <div className="grid md:grid-cols-2 gap-5">
            <div data-err-key="InitialCapital">
              <label className={label}>Initial Capital (Rs.) :</label>
              <input
                className={input}
                placeholder="100000.00"
                value={form.InitialCapital}
                onChange={(e) => setField("InitialCapital", e.target.value)}
                onBlur={() => markTouched("InitialCapital")}
              />
              {errFor("InitialCapital") && <p className={hintErr}>{errFor("InitialCapital")}</p>}
            </div>
            <div data-err-key="AnnualTurnover">
              <label className={label}>Annual Turnover (Rs.) :</label>
              <input
                className={input}
                placeholder="500000.00"
                value={form.AnnualTurnover}
                onChange={(e) => setField("AnnualTurnover", e.target.value)}
                onBlur={() => markTouched("AnnualTurnover")}
              />
              {errFor("AnnualTurnover") && <p className={hintErr}>{errFor("AnnualTurnover")}</p>}
            </div>
          </div>

          {/* Deed & Trade License */}
          <div className="grid md:grid-cols-2 gap-5">
            <div data-err-key="DeedNo">
              <label className={label}>Deed No :</label>
              <input
                className={input}
                value={form.DeedNo}
                onChange={(e) => setField("DeedNo", e.target.value)}
                onBlur={() => markTouched("DeedNo")}
              />
              {errFor("DeedNo") && <p className={hintErr}>{errFor("DeedNo")}</p>}
            </div>
            <div data-err-key="TradeLicenseNo">
              <label className={label}>Trade License No :</label>
              <input
                className={input}
                value={form.TradeLicenseNo}
                onChange={(e) => setField("TradeLicenseNo", e.target.value)}
                onBlur={() => markTouched("TradeLicenseNo")}
              />
              {errFor("TradeLicenseNo") && <p className={hintErr}>{errFor("TradeLicenseNo")}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <button type="button" onClick={onBack} className={btnOutline}>Back</button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-[16px] bg-[var(--primary)] text-white font-semibold transition hover:opacity-90 hover:shadow-md"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
