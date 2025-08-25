// @ts-nocheck
import { cn } from "@/lib/utils";
import React from "react";

const RequiredFieldStar = ({
  labelText,
  className,
}: {
  labelText?: string;
  className?: string;
}) => {
  // Default label text if no prop is provided
  const displayLabelText = labelText || "Specialized Area";

  return (
    <p className={cn("text-sm", className)}>
      {displayLabelText} <span className="text-red-500">*</span>
    </p>
  );
};

export default RequiredFieldStar;
