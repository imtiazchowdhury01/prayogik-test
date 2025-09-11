// @ts-nocheck
"use client";
import axios from "axios";
import { Eye, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Loader } from "lucide-react";
import Link from "next/link";
import { revalidatePage } from "@/actions/revalidatePage";

interface ActionsProps {
  disabled: boolean;
  eventId: string;
  isPublished: boolean;
  eventSlug: string;
}

export const EventActions = ({
  disabled,
  eventId,
  isPublished,
  eventSlug,
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/admin/event/${eventId}/unpublish`);
        toast.success("Event unpublished");
      } else {
        await axios.patch(`/api/admin/event/${eventId}/publish`);
        toast.success("Event published");
        confetti.onOpen();
      }
      await revalidatePage([
        { route: "/" },
        { route: "/home" },
        { route: "/admin/events" },
        { route: "/events" },
      ]);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/admin/event/${eventId}`);
      toast.success("Event deleted");

      router.replace(`/admin/events`);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.error); // Show the error message returned from the API
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
      await revalidatePage([
        { route: "/" },
        { route: "/home" },
        { route: "/events" },
      ]);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Link
        href={`/preview/events/${eventSlug}`}
        title="Event Preview"
        target="_blank"
        className="mr-4"
      >
        <Eye className="h-5 w-5 text-sm text-gray-700 animate-pulse" />
      </Link>

      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isLoading ? (
          <Loader className="animate-spin h-4 w-4" /> // Show loading indicator
        ) : isPublished ? (
          "Unpublish"
        ) : (
          "Publish"
        )}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
