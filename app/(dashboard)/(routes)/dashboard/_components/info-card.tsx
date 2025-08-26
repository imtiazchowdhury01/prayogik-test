import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
  className: string;
}

export const InfoCard = ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
  className,
}: InfoCardProps) => {
  return (
    <div
      className={cn(
        "border rounded-md flex items-center gap-x-2 p-3",
        className
      )}
    >
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-500 text-sm">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};
