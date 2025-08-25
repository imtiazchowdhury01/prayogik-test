"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const PaymentCancelledAlert = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isCancelled = searchParams.get("cancelled");

  useEffect(() => {
    if (isCancelled) {
      toast.error("Payment is cancelled!");

      // Remove cancelled from URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("cancelled");

      const newPath = `${window.location.pathname}${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      router.replace(newPath);
    }
  }, [isCancelled, router, searchParams]);

  return null;
};

export default PaymentCancelledAlert;
