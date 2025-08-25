// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { createTag } from "../_actions/tags.action";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(50, "Tag name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-_]+$/,
      "Tag name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

interface TagsFormProps {
  onClose: () => void;
  onTagCreated?: (tag: any) => void;
}

const TagsForm = ({ onClose, onTagCreated }: TagsFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTagInput>({
    resolver: zodResolver(createTagSchema),
  });

  const onSubmit = async (data: CreateTagInput) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call server action directly
      const result = await createTag(data);
      // Show success toast
      toast.success("Tag created successfully!");
      setSuccess(true);
      reset();
      onTagCreated?.(result);
      router.refresh();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-2 w-full max-w-md mx-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Create New Tag</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tag Name</Label>
          <Input
            id="name"
            placeholder="Enter tag name..."
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>Create</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TagsForm;
