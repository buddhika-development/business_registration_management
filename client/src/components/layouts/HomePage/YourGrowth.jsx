import React from "react";

const features = [
  {
    title: "Legal recognition for your business",
    Icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" {...props}>
        <path d="M3 10h18M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M6 10v9h12v-9" stroke="currentColor" />
        <path d="M9 19v-5h6v5" stroke="currentColor" />
      </svg>
    ),
  },
  {
    title: "Protection of your business name and brand",
    Icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" {...props}>
        <path d="M6 10V8a6 6 0 1 1 12 0v2" stroke="currentColor" />
        <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" />
        <path d="M12 14v3" stroke="currentColor" />
      </svg>
    ),
  },
  {
    title: "Smooth, transparent, and secure registration process",
    Icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" {...props}>
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" />
        <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" />
        <path d="M10 19l1.5-1.5L13 19l3-3" stroke="currentColor" />
      </svg>
    ),
  },
  {
    title: "Support from our dedicated team",
    Icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" {...props}>
        <circle cx="12" cy="7" r="3" stroke="currentColor" />
        <path d="M4 19a8 8 0 0 1 16 0" stroke="currentColor" />
        <path d="M18.5 11.5a2.5 2.5 0 1 0 0-5" stroke="currentColor" />
        <path d="M5.5 11.5a2.5 2.5 0 1 1 0-5" stroke="currentColor" />
      </svg>
    ),
  },
];

const YourGrowth = () => {
  return (
    <section className="bg-white pt-4 pb-12 md:pt-6 md:pb-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Headings */}
        <div className="text-center mb-8 md:mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            We are here for help
          </h3>
          <p className="text-xl md:text-2xl font-semibold text-indigo-600 mt-1">
            Your Growth
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ title, Icon }, idx) => (
            <div
              key={idx}
              className={[
                "rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow",
                
                idx !== features.length - 1 ? "lg:border-r lg:border-gray-200" : "",
              ].join(" ")}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="rounded-2xl bg-indigo-50 p-4">
                  <Icon className="h-10 w-10 text-indigo-600" />
                </div>
                <p className="text-sm md:text-[15px] leading-snug text-gray-700 max-w-[22ch]">
                  {title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YourGrowth;
