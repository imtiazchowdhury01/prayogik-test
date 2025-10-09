"use client";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateEventRegistrationStatus } from "@/lib/event/event-registration";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const ApprovalSwitch = ({ registration }: { registration: any }) => {
  const [currentStatus, setCurrentStatus] = useState(registration.isApproved);
  const [isPending, startTransition] = useTransition();

  // Check if user has paid for the event
  const hasPaid = !!registration.purchase;

  // Disable switch if user has already paid and is currently approved
  // (admin can't reject paid users)
  const isDisabled = hasPaid && currentStatus;

  // Function to render status text or loader
  const renderStatusText = () => {
    if (currentStatus) {
      return (
        <span className={`text-xs font-medium text-green-600`}>Approved</span>
      );
    }
    return null;
  };

  const handleStatusChange = async (newStatus: boolean) => {
    // Prevent rejection if user has already paid
    if (hasPaid && !newStatus) {
      toast.error("Cannot reject users who have already paid for the event");
      return;
    }

    startTransition(async () => {
      console.log(registration, "status");
      try {
        const result = await updateEventRegistrationStatus(
          registration.id,
          newStatus
        );

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        setCurrentStatus(newStatus);
        toast.success(result.message);
      } catch (error) {
        console.error("Error updating registration status:", error);
        toast.error("Failed to update registration status");
      }
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {isPending ? (
                <div className="flex items-center justify-center w-11 h-6">
                  <Loader className="animate-spin size-4 text-gray-500" />
                </div>
              ) : (
                <Switch
                  checked={currentStatus}
                  onCheckedChange={handleStatusChange}
                  disabled={isDisabled || isPending}
                  className="data-[state=checked]:bg-green-600 scale-50"
                />
              )}
            </div>
          </TooltipTrigger>
          {isDisabled && !isPending && (
            <TooltipContent>
              <p>Paid - Cannot reject</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {renderStatusText()}
    </div>
  );
};

export default ApprovalSwitch;