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
  courseId: string;
  isPublished: boolean;
  isCoTeacher?: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
  isAdmin?: boolean;
  isCourseAuthor?: boolean;
}

export const Actions = ({
  disabled,
  courseId,
  isPublished,
  isCoTeacher,
  isAdmin = false,
  isCourseAuthor,
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Course unpublished");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Course published");
        confetti.onOpen();
      }
      await revalidatePage([
        { route: "/", type: "layout" },
        { route: "/courses", type: "layout" },
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
      await axios.delete(`/api/courses/${courseId}`);
      toast.success("Course deleted");
      if (isAdmin) {
        router.replace(`/admin/courses`);
      } else {
        router.replace(`/teacher/courses`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data); // Show the error message returned from the API
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
      await revalidatePage([
        { route: "/", type: "layout" },
        { route: "/courses", type: "layout" },
      ]);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Link
        href={`/preview/courses/${courseId}`}
        title="Course Preview"
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

      {isCourseAuthor && (
        <ConfirmModal onConfirm={onDelete}>
          <Button size="sm" disabled={isLoading}>
            <Trash className="h-4 w-4" />
          </Button>
        </ConfirmModal>
      )}
    </div>
  );
};
