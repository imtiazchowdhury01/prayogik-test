import { LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface InfoCardProps {
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
  className: string;
  countComponent: ReactNode; // Changed from numberOfItems to countComponent
}

export const InfoCard = ({
  variant,
  icon: Icon,
  label,
  className,
  countComponent,
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
        {countComponent}
      </div>
    </div>
  );
};
