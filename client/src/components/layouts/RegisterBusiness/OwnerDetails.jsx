"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import NiceSelect from "@/components/ui/NiceSelect";
import {
  PROVINCES,
  DISTRICTS_BY_PROVINCE
} from "@/lib/sl-geo";
import { DS_DIVISIONS_BY_DISTRICT, } from "@/lib/ds-divisions-by-district";

const btnOutline =
  "px-6 py-3 rounded-[16px] border font-semibold transition hover:bg-indigo-50 hover:border-primary hover:text-primary";

const OwnerDetails = ({ onBack, onNext, initial, appNo }) => {
  const emptyAddr = {
    addressLine1: "", addressLine2: "", city: "", postalCode: "",
    gsDivision: "", dsDivision: "", district: "", province: ""
  };

  const [form, setForm] = useState({
    applicationNo: initial?.applicationNo ?? appNo ?? "",
    fullName: initial?.fullName || "",
    nameWithInitials: initial?.nameWithInitials || "",
    maidenName: initial?.maidenName || "",
    honorific: initial?.honorific || "Mr.",
    nic: initial?.nic || "",
    passportNo: initial?.passportNo || "",
    dateOfBirth: initial?.dateOfBirth || "",
    gender: initial?.gender || "",
    residentialAddress: { ...emptyAddr, ...(initial?.residentialAddress || {}) },
    mobileNo: initial?.mobileNo || "",
    fixedNo: initial?.fixedNo || "",
    email: initial?.email || "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!form.applicationNo && appNo) setForm(p => ({ ...p, applicationNo: appNo }));
  }, [appNo, form.applicationNo]);

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setAddr = (k, v) => setForm(p => ({ ...p, residentialAddress: { ...p.residentialAddress, [k]: v } }));
  const markTouched = (key) => setTouched(t => ({ ...t, [key]: true }));
  const clearError = (key) => setErrors(e => { const n = { ...e }; delete n[key]; return n; });

  // --- dependent Province -> District (tolerant) ---
  const currentProvince = (form.residentialAddress.province || "").trim();
  const persistedDistrict = (form.residentialAddress.district || "").trim();

  const baseDistrictOptions = useMemo(
    () => DISTRICTS_BY_PROVINCE[currentProvince] || [],
    [currentProvince]
  );

  // keep restored district even if not in list briefly (hydration)
  const districtOptions = useMemo(() => {
    return persistedDistrict && !baseDistrictOptions.includes(persistedDistrict)
      ? [persistedDistrict, ...baseDistrictOptions]
      : baseDistrictOptions;
  }, [persistedDistrict, baseDistrictOptions]);

  // on province change after mount, clear district
  const provinceMountedRef = useRef(false);
  useEffect(() => {
    if (!provinceMountedRef.current) {
      provinceMountedRef.current = true;
      return;
    }
    if (!currentProvince) setAddr("district", "");
  }, [currentProvince]); // stable deps

  // --- dependent District -> DS Division (new) ---
  const currentDistrict = (form.residentialAddress.district || "").trim();
  const persistedDS = (form.residentialAddress.dsDivision || "").trim();

  const baseDSOptions = useMemo(
    () => DS_DIVISIONS_BY_DISTRICT[currentDistrict] || [],
    [currentDistrict]
  );

  // keep restored ds even if not in list briefly (hydration)
  const dsOptions = useMemo(() => {
    return persistedDS && !baseDSOptions.includes(persistedDS)
      ? [persistedDS, ...baseDSOptions]
      : baseDSOptions;
  }, [persistedDS, baseDSOptions]);

  // on district change after mount, clear dsDivision
  const districtMountedRef = useRef(false);
  useEffect(() => {
    if (!districtMountedRef.current) {
      districtMountedRef.current = true;
      return;
    }
    if (!currentDistrict) setAddr("dsDivision", "");
    else if (persistedDS && !baseDSOptions.includes(persistedDS)) {
      setAddr("dsDivision", "");
    }
  }, [currentDistrict, baseDSOptions, persistedDS]);

  // --- validation ---
  const isBlank = (v) => !(v ?? "").toString().trim();

  const validate = () => {
    const e = {};
    const addr = form.residentialAddress || {};

    if (isBlank(form.fullName)) e["fullName"] = "Full name is required";
    if (isBlank(form.nameWithInitials)) e["nameWithInitials"] = "Name with initials is required";
    if (!form.dateOfBirth) e["dateOfBirth"] = "Date of birth is required";
    if (isBlank(form.nic) && isBlank(form.passportNo))
      e["identity"] = "Provide either NIC or Passport No.";

    if (isBlank(addr.addressLine1)) e["residentialAddress.addressLine1"] = "Address Line 1 is required";
    if (isBlank(addr.city)) e["residentialAddress.city"] = "City is required";
    if (isBlank(addr.postalCode)) e["residentialAddress.postalCode"] = "Postal Code is required";
    if (isBlank(addr.province)) e["residentialAddress.province"] = "Province is required";
    if (isBlank(addr.district)) e["residentialAddress.district"] = "District is required";
    if (isBlank(addr.dsDivision)) e["residentialAddress.dsDivision"] = "DS Division is required";
    if (isBlank(addr.gsDivision)) e["residentialAddress.gsDivision"] = "GS Division is required";

    if (isBlank(form.mobileNo)) e["mobileNo"] = "Mobile No is required";
    if (form.mobileNo && !/^\d{9,10}$/.test(String(form.mobileNo))) e["mobileNo"] = "Mobile No should be 9–10 digits";
    if (form.fixedNo && !/^\d{9,10}$/.test(String(form.fixedNo))) e["fixedNo"] = "Fixed No should be 9–10 digits";

    if (isBlank(form.email)) e["email"] = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e["email"] = "Email format looks invalid";

    // Cross-validation for DS vs District
    if (addr.district && addr.dsDivision) {
      const validDS = DS_DIVISIONS_BY_DISTRICT[addr.district] || [];
      if (!validDS.includes(addr.dsDivision)) {
        e["residentialAddress.dsDivision"] = "Selected DS Division is not valid for the chosen district";
      }
    }

    return e;
  };

  const errFor = (key) => {
    const msg = errors[key];
    if (!msg) return "";
    return (submitted || touched[key]) ? msg : "";
  };

  const handleNext = () => {
    setSubmitted(true);
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // No alerts — just scroll to the first invalid field
      try {
        const firstKey = Object.keys(validationErrors)[0];
        const node = rootRef.current?.querySelector(
          `[data-err-key="${firstKey.replace(/"/g, '\\"')}"]`
        );
        node?.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch { }
      return;
    }

    onNext({
      applicationNo: form.applicationNo || "",
      fullName: form.fullName,
      nameWithInitials: form.nameWithInitials,
      maidenName: form.maidenName,
      honorific: form.honorific,
      nic: form.nic,
      passportNo: form.passportNo,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      residentialAddress: { ...form.residentialAddress },
      mobileNo: form.mobileNo,
      fixedNo: form.fixedNo,
      email: form.email,
    });
  };

  const handleProvinceChange = (newProvince) => {
    setAddr("province", newProvince);
    markTouched("residentialAddress.province");
    clearError("residentialAddress.province");
  };
  const handleDistrictChange = (newDistrict) => {
    setAddr("district", newDistrict);
    markTouched("residentialAddress.district");
    clearError("residentialAddress.district");
  };
  const handleDSChange = (newDS) => {
    setAddr("dsDivision", newDS);
    markTouched("residentialAddress.dsDivision");
    clearError("residentialAddress.dsDivision");
  };
  const handleNicChange = (v) => {
    setField("nic", v);
    if (v || form.passportNo) setErrors(e => { const n = { ...e }; delete n.identity; return n; });
  };
  const handlePassportChange = (v) => {
    setField("passportNo", v);
    if (v || form.nic) setErrors(e => { const n = { ...e }; delete n.identity; return n; });
  };

  const input =
    "w-full rounded-xl bg-indigo-50/80 px-4 py-3 text-base-text/80 outline-none border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition";
  const label = "block text-sm font-semibold text-base-text";
  const hintErr = "mt-1 text-xs text-red-600";

  return (
    <section ref={rootRef} className="min-h-[calc(100vh-80px)] py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-8">
          <span>Tell us about the </span>
          <span className="text-primary">Owner</span>
        </h1>

        <div className="grid grid-cols-1 gap-5 md:gap-6">
          {/* Honorific + App No */}
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-1">
              <label className={label}>Honorific :</label>
              <NiceSelect value={form.honorific} onChange={(e) => setField("honorific", e.target.value)}>
                {["Mr.", "Mrs.", "Miss", "Ms.", "Rev."].map(h => (<option key={h} value={h}>{h}</option>))}
              </NiceSelect>
            </div>
            <div className="md:col-span-2">
              <label className={label}>Application No (auto) :</label>
              <input className={`${input} disabled:opacity-70`} value={form.applicationNo} readOnly placeholder="Auto-generated" />
            </div>
          </div>

          {/* Names */}
          <div data-err-key="fullName">
            <label className={label}>Full Name :</label>
            <input
              className={input}
              value={form.fullName}
              onChange={(e) => { setField("fullName", e.target.value); clearError("fullName"); }}
              onBlur={() => markTouched("fullName")}
            />
            {errFor("fullName") && <p className={hintErr}>{errFor("fullName")}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div data-err-key="nameWithInitials">
              <label className={label}>Name with Initials :</label>
              <input
                className={input}
                value={form.nameWithInitials}
                onChange={(e) => { setField("nameWithInitials", e.target.value); clearError("nameWithInitials"); }}
                onBlur={() => markTouched("nameWithInitials")}
              />
              {errFor("nameWithInitials") && <p className={hintErr}>{errFor("nameWithInitials")}</p>}
            </div>
            <div>
              <label className={label}>Maiden Name (optional) :</label>
              <input className={input} value={form.maidenName} onChange={(e) => setField("maidenName", e.target.value)} />
            </div>
          </div>

          {/* Identity */}
          <div className="grid md:grid-cols-3 gap-5">
            <div data-err-key="identity">
              <label className={label}>NIC :</label>
              <input
                className={input}
                value={form.nic}
                onChange={(e) => handleNicChange(e.target.value)}
                onBlur={() => markTouched("identity")}
              />
              {errFor("identity") && <p className={hintErr}>{errFor("identity")}</p>}
            </div>
            <div>
              <label className={label}>Passport No (optional) :</label>
              <input
                className={input}
                value={form.passportNo}
                onChange={(e) => handlePassportChange(e.target.value)}
                onBlur={() => markTouched("identity")}
              />
            </div>
          </div>

          {/* DOB + Gender */}
          <div className="grid md:grid-cols-2 gap-5">
            <div data-err-key="dateOfBirth">
              <label className={label}>Date of Birth :</label>
              <input
                type="date"
                className={input}
                value={form.dateOfBirth}
                onChange={(e) => { setField("dateOfBirth", e.target.value); clearError("dateOfBirth"); }}
                onBlur={() => markTouched("dateOfBirth")}
              />
              {errFor("dateOfBirth") && <p className={hintErr}>{errFor("dateOfBirth")}</p>}
            </div>
            <div>
              <label className={label}>Gender :</label>
              <div className="flex items-center gap-6 mt-2">
                {["Male", "Female", "Other"].map(g => (
                  <label key={g} className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      className="accent-[var(--primary)]"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={(e) => setField("gender", e.target.value)}
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Residential Address */}
          <div className="grid md:grid-cols-2 gap-5">
            <div data-err-key="residentialAddress.addressLine1">
              <label className={label}>Address line 1 :</label>
              <input
                className={input}
                value={form.residentialAddress.addressLine1}
                onChange={(e) => { setAddr("addressLine1", e.target.value); clearError("residentialAddress.addressLine1"); }}
                onBlur={() => markTouched("residentialAddress.addressLine1")}
              />
              {errFor("residentialAddress.addressLine1") && <p className={hintErr}>{errFor("residentialAddress.addressLine1")}</p>}
            </div>
            <div>
              <label className={label}>Address line 2 :</label>
              <input className={input} value={form.residentialAddress.addressLine2} onChange={(e) => setAddr("addressLine2", e.target.value)} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div data-err-key="residentialAddress.city">
              <label className={label}>City :</label>
              <input
                className={input}
                value={form.residentialAddress.city}
                onChange={(e) => { setAddr("city", e.target.value); clearError("residentialAddress.city"); }}
                onBlur={() => markTouched("residentialAddress.city")}
              />
              {errFor("residentialAddress.city") && <p className={hintErr}>{errFor("residentialAddress.city")}</p>}
            </div>
            <div data-err-key="residentialAddress.postalCode">
              <label className={label}>Postal Code :</label>
              <input
                className={input}
                value={form.residentialAddress.postalCode}
                onChange={(e) => { setAddr("postalCode", e.target.value); clearError("residentialAddress.postalCode"); }}
                onBlur={() => markTouched("residentialAddress.postalCode")}
              />
              {errFor("residentialAddress.postalCode") && <p className={hintErr}>{errFor("residentialAddress.postalCode")}</p>}
            </div>
            <div data-err-key="residentialAddress.province">
              <label className={label}>Province :</label>
              <NiceSelect
                value={form.residentialAddress.province}
                onChange={(e) => handleProvinceChange(e.target.value)}
                onBlur={() => markTouched("residentialAddress.province")}
                placeholder="Select province"
              >
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </NiceSelect>
              {errFor("residentialAddress.province") && <p className={hintErr}>{errFor("residentialAddress.province")}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div data-err-key="residentialAddress.district">
              <label className={label}>District :</label>
              <NiceSelect
                value={form.residentialAddress.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                onBlur={() => markTouched("residentialAddress.district")}
                placeholder={currentProvince ? "Select district" : "Select province first"}
                disabled={!currentProvince}
              >
                {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </NiceSelect>
              {errFor("residentialAddress.district") && <p className={hintErr}>{errFor("residentialAddress.district")}</p>}
            </div>

            <div data-err-key="residentialAddress.dsDivision">
              <label className={label}>DS Division :</label>
              <NiceSelect
                value={form.residentialAddress.dsDivision}
                onChange={(e) => handleDSChange(e.target.value)}
                onBlur={() => markTouched("residentialAddress.dsDivision")}
                placeholder={currentDistrict ? "Select DS division" : "Select district first"}
                disabled={!currentDistrict}
              >
                {dsOptions.map(ds => <option key={ds} value={ds}>{ds}</option>)}
              </NiceSelect>
              {errFor("residentialAddress.dsDivision") && <p className={hintErr}>{errFor("residentialAddress.dsDivision")}</p>}
            </div>

            <div data-err-key="residentialAddress.gsDivision">
              <label className={label}>GS Division :</label>
              <input
                className={input}
                value={form.residentialAddress.gsDivision}
                onChange={(e) => { setAddr("gsDivision", e.target.value); clearError("residentialAddress.gsDivision"); }}
                onBlur={() => markTouched("residentialAddress.gsDivision")}
              />
              {errFor("residentialAddress.gsDivision") && <p className={hintErr}>{errFor("residentialAddress.gsDivision")}</p>}
            </div>
          </div>

          {/* Contact */}
          <div className="grid md:grid-cols-3 gap-5">
            <div data-err-key="mobileNo">
              <label className={label}>Mobile No :</label>
              <input
                type="tel"
                className={input}
                value={form.mobileNo}
                onChange={(e) => { setField("mobileNo", e.target.value); clearError("mobileNo"); }}
                onBlur={() => markTouched("mobileNo")}
              />
              {errFor("mobileNo") && <p className={hintErr}>{errFor("mobileNo")}</p>}
            </div>
            <div data-err-key="fixedNo">
              <label className={label}>Fixed No (optional) :</label>
              <input
                type="tel"
                className={input}
                value={form.fixedNo}
                onChange={(e) => { setField("fixedNo", e.target.value); clearError("fixedNo"); }}
                onBlur={() => markTouched("fixedNo")}
              />
              {errFor("fixedNo") && <p className={hintErr}>{errFor("fixedNo")}</p>}
            </div>
            <div data-err-key="email">
              <label className={label}>Email :</label>
              <input
                type="email"
                className={input}
                value={form.email}
                onChange={(e) => { setField("email", e.target.value); clearError("email"); }}
                onBlur={() => markTouched("email")}
              />
              {errFor("email") && <p className={hintErr}>{errFor("email")}</p>}
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
};

export default OwnerDetails;
