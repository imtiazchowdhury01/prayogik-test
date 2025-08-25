"use client";
import React, { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";

const icons = {
  success: CheckCircledIcon,
  warning: ExclamationTriangleIcon,
  error: CrossCircledIcon,
};

const AlertComponent = ({ message, onClose }) => {
  const { variant, title, description } = message || {};
  const Icon = icons[variant]; // Get the corresponding icon

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message || !Icon) return null;

  return (
    <Alert variant={variant}>
      <div className="flex items-start gap-4">
        <Icon
          className={`h-6 w-6 ${
            variant === "success"
              ? "text-green-500"
              : variant === "warning"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        />
        <div className="flex-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default AlertComponent;
