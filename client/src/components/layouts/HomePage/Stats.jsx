import React from "react";

const stats = [
  {
    value: "32,187",
    label: ["Total Registered Companies in", "Our Database"],
  },
  {
    value: "92%",
    label: ["Applications Processed Within 3", "Business Days"],
  },
  {
    value: "7,540",
    label: ["Name Availability Checks This", "Month"],
  },
];

const Stats = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 to-white py-10 md:py-14">
      {/* decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
      >
        <svg
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[1200px] h-[400px]"
          viewBox="0 0 1200 400"
          fill="none"
        >
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* soft bars */}
          <rect x="820" y="80" width="24" height="220" rx="8" fill="url(#g1)" />
          <rect x="860" y="60" width="24" height="240" rx="8" fill="url(#g1)" />
          <rect x="900" y="40" width="24" height="260" rx="8" fill="url(#g1)" />
          <rect x="940" y="20" width="24" height="280" rx="8" fill="url(#g1)" />
          {/* soft waves */}
          <path
            d="M0 240 C 200 160 380 320 600 240 C 820 160 1000 320 1200 240 V 400 H 0 Z"
            fill="url(#g1)"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 text-center">
        {/* heading */}
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
          Trusted by Thousands of
        </h3>
        <p className="text-2xl md:text-3xl font-bold text-indigo-600 mt-1">
          Businesses Nationwide
        </p>

        {/* stats */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-xl md:text-2xl font-bold text-indigo-700 tracking-tight">
                {s.value}
              </div>
              <div className="mt-1 text-sm md:text-base text-gray-700 leading-snug">
                {s.label.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
