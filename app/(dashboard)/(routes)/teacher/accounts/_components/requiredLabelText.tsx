// @ts-nocheck
import { cn } from "@/lib/utils";

export const RequiredLabelText = ({ text, className }) => {
  // Default text if no prop is provided
  const displayText = text || "Star marked are required fields.";

  return (
    <p className={cn("text-sm mt-2 mb-4 flex gap-1 items-center", className)}>
      {displayText}
      <span className="text-red-500 text-base">*</span>
    </p>
  );
};

export default RequiredLabelText;
