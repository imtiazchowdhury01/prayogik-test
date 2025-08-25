// @ts-nocheck

import { Progress } from "@/components/ui/progress";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
  cardVariant?: "dark" | "light";
}

const colorByVariant = {
  default: "text-[#D27CE9]",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

export const CourseProgress = ({
  value = 0,
  variant,
  size,
  cardVariant,
}: CourseProgressProps) => {
  return (
    <>
      <p className={cn("font-medium text-sm text-card-highlighted mb-1")}>
        {convertNumberToBangla(Math.round(value))}% সম্পন্ন হয়েছে
      </p>
      <Progress
        className={`h-1 mb-2 rounded-full ${
          cardVariant === "dark"
            ? "bg-white/10 [&>div]:bg-primary-100"
            : "bg-greyscale-200 [&>div]:bg-primary-brand"
        } `}
        value={value}
        variant={variant}
      />
    </>
  );
};
