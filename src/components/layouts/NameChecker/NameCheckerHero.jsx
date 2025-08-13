"use client";

import Image from "next/image";
import { useState } from "react";

export default function NameCheckerHero() {
  
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid items-center gap-4 md:grid-cols-2">
          
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

            <form  className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="biz-name"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Business Name :
                </label>
                <input
                  id="biz-name"
                  type="text"
                  placeholder="ex: Fresh Combo meal"
                  className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 outline-none transition focus:border-[#5252C9] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-white bg-[#5252C9] hover:opacity-95 disabled:opacity-60"
              >
                Check Availability
              </button>
            </form>

            
          </div>
        </div>
      </div>
    </section>
  );
}


