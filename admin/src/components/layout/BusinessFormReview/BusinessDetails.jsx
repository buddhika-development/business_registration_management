'use client'

import React, { useEffect, useState } from 'react'
import MainTitle from "@/components/ui/Titles/MainTitle";
import { OrbitProgress } from "react-loading-indicators";

const BusinessDetails = ({ request_Id }) => {
  const [businessData, setBusinessData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
        
        const decodedId = decodeURIComponent(request_Id);
        console.log("Original ID:", request_Id);
        console.log("Decoded ID:", decodedId);
        
        const res = await fetch(
          `${base}/api/admin/requests/${encodeURIComponent(decodedId)}`,
          { cache: "no-store" }
        );

        console.log("API URL:", `${base}/api/admin/requests/${encodeURIComponent(decodedId)}`);

        if (!res.ok) {
          throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }

        const json = await res.json();
        console.log("API Response:", json);
        setBusinessData(json.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "Failed to load");
      } finally {
        setIsLoading(false);
      }
    }

    if (request_Id) {
      fetchData();
    }
  }, [request_Id]);

  return (
    <div className="mt-8">
      <MainTitle title="Business Details" />

      {isLoading && 
        <div className="p-4 flex justify-center w-full">
          <OrbitProgress dense color="#4655c7" size="medium"/>
        </div>
      }
      
      {error && !isLoading && 
        <div className="p-4 text-red-600">Error: {error}</div>
      }

      {!isLoading && !error && businessData && (
        <div className="flex flex-col gap-3 mt-8">
          <p><strong>Business Name:</strong> {businessData.companyName}</p>
          <p><strong>Owner Name:</strong> {businessData.ownerName}</p>
          <p><strong>Business Type:</strong> {businessData.businessType}</p>
          <p><strong>Business Category:</strong> {businessData.businessCategory}</p>
          <p><strong>Status:</strong> {businessData.status}</p>
          <p><strong>Request Date:</strong> {businessData.requestDate}</p>
        </div>
      )}
    </div>
  );
};



export default BusinessDetails