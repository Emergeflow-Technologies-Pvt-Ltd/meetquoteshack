"use client";

import React, { useEffect, useState, useCallback } from "react";
import SubscribeModalLoanee from "./SubscribeModalLoanee";

export default function PlanSelectorClientLoanee() {
  const [open, setOpen] = useState(false);
  const [initialPlanId, setInitialPlanId] = useState<string | undefined>(undefined);

  // Stable close handler to avoid unnecessary re-renders
  const closeModal = useCallback(() => {
    setOpen(false);
    setInitialPlanId(undefined);
  }, []);

  useEffect(() => {
    function handleOpenModal(e: CustomEvent) {
      const planId = e.detail?.planId as string | undefined;
      setInitialPlanId(planId);
      setOpen(true);
    }

    window.addEventListener("open-loanee-modal", handleOpenModal as EventListener);

    return () => {
      window.removeEventListener("open-loanee-modal", handleOpenModal as EventListener);
    };
  }, []);

  return (
    <>
      {open && (
        <SubscribeModalLoanee
          open={open}
          onClose={closeModal}
          initialPlanId={initialPlanId}
        />
      )}
    </>
  );
}
