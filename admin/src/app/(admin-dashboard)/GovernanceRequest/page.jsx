"use client";

import React from "react";
import { requestsMini } from "../../../../requestGovermence";

const RequestsTableMini = () => {
  const statusClass = (s) => {
    if (s === "Verified") return "text-green-600";
    if (s === "Pending") return "text-amber-600";
    return "text-base-text";
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
    <div className="rounded-2xl overflow-hidden bg-white mt-8">
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
          {requestsMini.map((r, rowIdx) => (
            <tr
              key={r.id}
              className={[
                "border-b border-primary/20 align-top",
                "hover:bg-primary/5",
              ].join(" ")}
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
              <td
                className={[
                  "px-5 py-4 border-l border-primary/20",
                  statusClass(r.status),
                ].join(" ")}
              >
                {r.status}
              </td>
              <td className="px-5 py-4 text-base-text border-l border-primary/20 whitespace-nowrap">
                {r.requestDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTableMini;
