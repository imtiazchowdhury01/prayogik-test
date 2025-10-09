import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { Card } from "@/components/ui/card";

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
      <Card
        className={cn("rounded-md flex items-center gap-x-4 p-4 2xl:px-6 xl:px-4 px-6 border border-slate-200 shadow-none", className)}
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
      </Card>
    );
  }
);

InfoCard.displayName = "InfoCard";
