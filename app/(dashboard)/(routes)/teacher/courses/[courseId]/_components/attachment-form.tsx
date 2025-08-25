"use client";

import * as z from "zod";
import axios from "axios";
import {
  Pencil,
  PlusCircle,
  ImageIcon,
  File,
  Loader2,
  X,
  Loader,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import {
  deleteImageFromS3,
  uploadCourseElementToS3,
} from "@/actions/upload-aws";
import Link from "next/link";
import { revalidatePage } from "@/actions/revalidatePage";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated");
      toggleEdit();
        await revalidatePage([
      { route: '/(site)', type: "layout" },
      { route: "/courses", type: "layout" },
    ]);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (attachment: any) => {
    try {
      setDeletingId(attachment?.id);
      await axios.delete(
        `/api/courses/${courseId}/attachments/${attachment?.id}`
      );

      // Delete element from aws
      const previousKey = attachment?.url?.split(".amazonaws.com/")[1];
      if (previousKey) await deleteImageFromS3(previousKey);

      toast.success("Attachment deleted");
        await revalidatePage([
      { route: '/(site)', type: "layout" },
      { route: "/courses", type: "layout" },
    ]);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const MAX_FILE_SIZE_BYTES =
    (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

  const handleAttachmentUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("courseSrc", file);

      // Call the upload function
      const response = await uploadCourseElementToS3(formData, courseId);

      if (response.success) {
        await onSubmit({ url: response.url });
      } else {
        toast.error("File upload failed!");
        setIsUploading(false);
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(
        "Error uploading file: " + (error?.message || "Unknown error")
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <Link
                    href={attachment.url}
                    target="_blank"
                    className="text-xs line-clamp-1"
                  >
                    {attachment.name.split("?")[0]}
                  </Link>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            {isUploading ? (
              <Loader className="animate-spin" />
            ) : (
              <Input
                type="file"
                onChange={handleAttachmentUpload}
                disabled={isUploading}
              />
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};
