// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const NotificationHandler = ({ message, hasError }) => {
  const searchParams = useSearchParams();
  const success = searchParams.get("success" || success);
  const canceled = searchParams.get("canceled" || canceled);
  const failed = searchParams.get("failed" || failed);
  const error = searchParams.get("failed" || error);

  const toastShown = useRef(false);

  useEffect(() => {
    if (success && !toastShown.current) {
      toast.success(message);
      toastShown.current = true;
    } else if (canceled && !toastShown.current) {
      toast.error(message);
      toastShown.current = true;
    } else if (hasError && !toastShown.current) {
      toast.error(message);
      toastShown.current = true;
    } else if (failed && !toastShown.current) {
      toast.error(message);
      toastShown.current = true;
    }
  }, [success, canceled, failed]);

  return null;
};

export default NotificationHandler;
