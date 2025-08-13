"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { requests } from "../../../requests";


const ACTIVE_ROW_ID = "req-1003";

const RequestsTable = () => {
  const router = useRouter();

  const goToRequest = (id) => {
    router.push(`/Request/${id}`);
  };

  const headers = [
    "Company Name",
    "Owner Name",
    "Business Type",
    "Business category",
    "Status",
    "Request Date",
  ];

  return (
    <div className="rounded-2xl overflow-hidden bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-primary/10 text-left">
            {headers.map((h, i) => (
              <th
                key={h}
                className={[
                  "px-5 py-4 text-sm sm:text-base font-semibold text-base-text",
                  i !== 0 ? "border-l border-primary/20" : "",
                ].join(" ")}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {requests.map((r) => {
            const isActive = r.id === ACTIVE_ROW_ID;
            return (
              <tr
                key={r.id}
                role="link"
                tabIndex={0}
                aria-label={`Open request ${r.id}`}
                onClick={() => goToRequest(r.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToRequest(r.id);
                  }
                }}
                className={[
                  "cursor-pointer align-top",
                  "border-b border-primary/20",
                  "hover:bg-primary/5 focus:bg-primary/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                ].join(" ")}
                style={
                  isActive
                    ? { boxShadow: "inset 0 -2px 0 0 rgb(var(--primary) / 1)" }
                    : undefined
                }
              >
                <td className="px-5 py-4 text-base-text">{r.companyName}</td>
                <td className="px-5 py-4 text-base-text border-l border-primary/20">
                  {r.ownerName}
                </td>
                <td className="px-5 py-4 text-base-text border-l border-primary/20">
                  {r.businessType}
                </td>
                <td className="px-5 py-4 text-base-text border-l border-primary/20">
                  {r.businessCategory}
                </td>
                <td className="px-5 py-4 border-l border-primary/20">
                  <span
                    className={
                      r.status === "Verified" ? "text-green-600" : "text-amber-600"
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-base-text border-l border-primary/20 whitespace-nowrap">
                  {r.requestDate}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;
