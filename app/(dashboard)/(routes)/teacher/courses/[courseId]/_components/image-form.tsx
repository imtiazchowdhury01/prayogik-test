// @ts-nocheck
"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon, Loader } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { uploadCourseElementToS3 } from "@/actions/upload-aws";
import { PiImagesLight } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCourse } from "@/lib/course/updateCourse";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const MAX_FILE_SIZE_BYTES =
    (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // try {
    //   await axios.patch(`/api/courses/${courseId}`, values);
    //   toast.success("Course updated");
    //   setIsUploading(false);
    //   toggleEdit();

    //   router.refresh();
    // } catch {
    //   toast.error("Something went wrong");
    // }

    await updateCourse({
      courseId,
      values,
      toggleEdit,
      setIsUploading,
      router,
    });
  };

  //for handling course image upload
  const handleImageUpload = async (e) => {
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

      const previousImageUrl = initialData.imageUrl;
      if (previousImageUrl) {
        formData.append("previousUrl", previousImageUrl);
      }

      // Call the upload function
      const response = await uploadCourseElementToS3(formData, courseId);

      if (response.success) {
        await onSubmit({ imageUrl: response.url }); // Submit the new image URL
      } else {
        toast.error("File upload failed!");
        setIsUploading(false);
        setIsEditing(false);
      }
    } catch (error) {
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
        <div>
          Course image
          <span className="text-red-500">*</span>
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 flex justify-center">
            <Image
              alt="Upload"
              height={100}
              width={500}
              className="object-cover rounded-md"
              src={initialData.imageUrl}
              priority
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            {isUploading ? (
              <Loader className="animate-spin" />
            ) : (
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            )}
          </div>

          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
