import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface InfoCardProps {
  variant?: "default" | "success";
  label: string;
  icon: any;
  className?: string;
  count: string;
}

// Memoize the component to prevent unnecessary re-renders
export const InfoCard = memo(
  ({ variant, icon: Icon, label, className, count }: InfoCardProps) => {
    return (
      <div
        className={cn(
          "rounded-md flex items-center gap-x-4 p-4 px-6",
          className
        )}
      >
        <div
          className={` ${
            variant === "success"
              ? "bg-brand/10 text-brand"
              : "bg-[#FFF5E6] text-orange-500"
          } rounded-lg p-[0.85rem]`}
        >
          <Icon />
        </div>
        <div>
          <p className="font-semibold text-base">{label}</p>
          <p className="text-gray-500 text-xs pt-2">{count}</p>
        </div>
      </div>
    );
  }
);

InfoCard.displayName = "InfoCard";
