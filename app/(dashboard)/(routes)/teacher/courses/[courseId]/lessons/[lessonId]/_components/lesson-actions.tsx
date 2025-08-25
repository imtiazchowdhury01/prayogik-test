"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

interface LessonActionsProps {
  disabled: boolean;
  courseId: string;
  lessonId: string;
  isPublished: boolean;
  isAdmin?: boolean;
}

export const LessonActions = ({
  disabled,
  courseId,
  lessonId,
  isPublished,
  isAdmin = false,
}: LessonActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/lessons/${lessonId}/unpublish`
        );
        toast.success("Lesson unpublished");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/lessons/${lessonId}/publish`
        );
        toast.success("Lesson published");
      }
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
      await axios.delete(`/api/courses/${courseId}/lessons/${lessonId}`);
      toast.success("Lesson deleted");

      if (isAdmin) {
        router.replace(`/admin/courses/${courseId}`);
      } else {
        router.replace(`/teacher/courses/${courseId}`);
      }
      router.refresh();
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isLoading ? (
          <Loader className="animate-spin h-4 w-4" /> // Show loader when loading
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
