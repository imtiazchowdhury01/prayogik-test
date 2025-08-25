import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // New gradient border variant
        gradientBorder:
          "border-transparent bg-white text-transparent bg-clip-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  // Special handling for gradient border variant
  if (variant === "gradientBorder") {
    return (
      <div className="relative inline-flex">
        {/* Gradient border container */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] p-[1px]">
          <div className="h-full w-full rounded-full bg-white"></div>
        </div>

        {/* Content with gradient text */}
        <div
          className={cn(
            "relative inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-transparent",
            className
          )}
          {...props}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3A4D] to-[#FF8538]">
            {props.children}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// Alternative implementation using CSS-in-JS approach for cleaner usage
function GradientBorderBadge({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative inline-flex", className)} {...props}>
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] p-[1px]">
        <div className="h-full w-full rounded-full bg-white"></div>
      </div>

      {/* Content */}
      <div className="relative inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-transparent">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3A4D] to-[#FF8538]">
          {children}
        </span>
      </div>
    </div>
  );
}

export { Badge, badgeVariants, GradientBorderBadge };
