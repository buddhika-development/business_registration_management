"use client";

import Image from "next/image";
import { useState } from "react";

export default function NameCheckerHero() {
  const [businessName, setBusinessName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/client/name-check", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) setError("Authentication required.");
        else if (res.status === 422) setError("Business name contains restricted terms.");
        else if (res.status === 409) setError("Business name not available.");
        else setError(data.errors?.message || "Something went wrong");
      } else {
        setResult(data.data);
      }
    } catch (err) {
      setError("Network error. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">

          <div className="relative mx-auto max-w-sm md:max-w-none">
            <Image
              src="/name-checker-hero.png"
              alt="Name checking page"
              width={2100}
              height={2100}
              priority
              className="w-full h-auto object-contain select-none"
            />
          </div>


          <div className="space-y-6">
            <h1 className="text-1xl md:text-1xl font-extrabold leading-tight text-slate-900">
              Confirm your business name <br />
              <span className="text-[#5252C9]">is Unique on your Business</span>
            </h1>

            <form className="space-y-4 mt-8" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="biz-name"
                >
                  Business Name :
                </label>
                <input
                  id="biz-name"
                  type="text"
                  placeholder="ex: Fresh Combo meal"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn"
              >
                Check Availability
              </button>

              {error && <p className="text-red-600 mt-2 bg-red-50 py-3 border-[1px] border-red-200 rounded-lg px-5">{error}</p>}
              {result && result.Decision === "available" && (
                <div className=" bg-green-100 text-green-600 py-3 border-[1px] border-green-300 px-5 rounded-lg mt-2">
                  <p className="text-[18px] font-semibold mb-2">Business name is available!</p>
                  <a href="/RegisterBusiness" className="">Strat Registration before someone get your Iconic name</a>
                </div>
              )}
              {result && result.Decision === "conflict" && (
                <p className="text-yellow-600 bg-yellow-50 py-3 border-[1px] border-yellow-300 px-5 rounded-lg mt-2">Business name already exists.</p>
              )}
              {result && result.Decision === "blocked" && (
                <p className="text-red-600 bg-red-50 py-3 border-[1px] border-red-300 px-5 rounded-lg mt-2"> Business name contains restricted terms.</p>
              )}
            </form>


          </div>
        </div>
      </div>
    </section>
  );
}


