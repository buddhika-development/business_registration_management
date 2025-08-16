"use client";

import BusinessDetails from "@/components/layout/BusinessFormReview/BusinessDetails";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const params = useParams()
  const {id} = params
  const [pageState, setPageState] = useState(1)

  const moveForward = () => {
    setPageState(pageState + 1)
  }

  const moveBackward = () => {
    setPageState(pageState - 1)
  }

  return (
    <>
      {
        pageState == 1 ? (
          <BusinessDetails request_Id={id}/>
        ) : pageState == 2 ? (
          <div>
            second form section
          </div>
        ) : (
          <div>
            third
          </div>
        )
      }

      <div className="mt-8 flex items-start gap-3 w-fit">
        {
          pageState > 1 && (
            <button className="mute-btn" onClick={() => moveBackward()}>Back</button>
          )
        }

        <button className="btn" onClick={() => moveForward()}>Next</button>
      </div>
    </>
  );
}