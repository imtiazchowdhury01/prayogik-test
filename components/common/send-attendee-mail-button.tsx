import React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface SendAttendeeMailButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "secondary"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  count?: number;
  showIcon?: boolean;
  showText?: boolean;
  iconOnly?: boolean;
  children?: React.ReactNode;
  selectedRowsCount?: number;
  hasPaidRows?: boolean; // Add this prop
}

export const SendAttendeeMailButton: React.FC<SendAttendeeMailButtonProps> = ({
  onClick,
  disabled = false,
  variant = "outline",
  size = "sm",
  className,
  count,
  showIcon = true,
  showText = true,
  iconOnly = false,
  children,
  selectedRowsCount,
  hasPaidRows = false, // Add default value
}) => {
  // If iconOnly is true, override other settings
  const displayIcon = iconOnly || showIcon;
  const displayText = !iconOnly && showText;

  // Determine the tooltip message
  const getTooltipMessage = () => {
    if (selectedRowsCount === 0) {
      return "Select attendee";
    }
    if (hasPaidRows) {
      return "Uncheck paid rows";
    }
    if (disabled) {
      return "";
    }
    return "Send notification to attendee";
  };

  return (
    <Button
      variant={variant}
      size={iconOnly ? "icon" : size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "transition-colors",
        (disabled || selectedRowsCount === 0) &&
          "text-gray-500 hover:text-gray-500 hover:bg-inherit cursor-not-allowed",
        className
      )}
      title={getTooltipMessage()}
    >
      {displayIcon && <Send className={cn("h-4 w-4", displayText && "mr-2")} />}
      {displayText && (
        <>
          {children || "Send Notification"}
          {count !== undefined && count > 0 && ` (${count})`}
        </>
      )}
    </Button>
  );
};
