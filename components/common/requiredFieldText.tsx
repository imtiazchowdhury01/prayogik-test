// @ts-nocheck
import { cn } from "@/lib/utils";

const RequiredFieldText = ({ text, className }) => {
  // Default text if no prop is provided
  const displayText = text || "Star marked are required fields.";

  return (
    <p
      className={cn(
        "text-sm text-gray-500 mt-2 mb-4 flex gap-1 items-center",
        className
      )}
    >
      <span className="text-red-500 text-base">*</span> {displayText}
    </p>
  );
};

export default RequiredFieldText;
