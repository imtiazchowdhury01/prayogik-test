// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { Urls } from "@/constants/urls";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { api } from "@/services/api";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Eye, EyeIcon, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await api.patch(`${Urls.admin.courses}/${courseId}/unpublish`);
        toast.success("Course unpublished");
      } else {
        await api.patch(`${Urls.admin.courses}/${courseId}/publish`);
        toast.success("Course published");
        confetti.onOpen();
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
      await api.delete(`${Urls.admin.courses}/${courseId}`);
      toast.success("Course deleted");
      router.refresh();
      router.push(`/admin/courses`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data); // Show the error message returned from the API
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    router.push(`/courses/preview/${courseId}`);
  };

  return (
    <div className="flex items-center gap-2">
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

      {/* <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal> */}
    </div>
  );
};
