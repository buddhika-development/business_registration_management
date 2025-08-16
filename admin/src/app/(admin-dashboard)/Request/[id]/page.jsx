"use client";

import BusinessDetails from "@/components/layout/BusinessFormReview/BusinessDetails";
import BusinessDocuments from "@/components/layout/BusinessFormReview/BusinessDocuments";
import BusinessOwnerDetails from "@/components/layout/BusinessFormReview/BusinessOwnerDetails";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const [pageState, setPageState] = useState(1);
  const router = useRouter();

  const moveForward = () => {
    if (pageState === 3) {
      const target =
        process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || "/AdminDashboard";
      router.push(target);
    } else {
      setPageState(pageState + 1);
    }
  };

  const moveBackward = () => {
    setPageState(pageState - 1);
  };

  return (
    <>
      {pageState === 1 ? (
        <BusinessDetails request_Id={id} />
      ) : pageState === 2 ? (
        <BusinessOwnerDetails request_Id={id} />
      ) : (
        <BusinessDocuments request_Id={id} />
      )}

      <div className="mt-8 flex items-start gap-3 w-fit">
        {pageState > 1 && (
          <button className="mute-btn" onClick={moveBackward}>
            Back
          </button>
        )}

        <button className="btn" onClick={moveForward}>
          {pageState === 3 ? "Finish" : "Next"}
        </button>
      </div>
    </>
  );
}
