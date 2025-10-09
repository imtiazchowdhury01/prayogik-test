"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DifficultyLevel } from "@prisma/client";
import { Pencil, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { revalidatePage } from "@/actions/revalidatePage";
import { clientApi } from "@/lib/utils/openai/client";

interface DifficultyLevelFormProps {
  initialData: {
    level: string;
  };
  certificationId: string;
}

const formSchema = z.object({
  level: z.nativeEnum(DifficultyLevel, {
    required_error: "Difficulty level is required",
  }),
});

// Helper function to format enum values to readable labels
const formatDifficultyLevelLabel = (value: DifficultyLevel): string => {
  const labelMap: Record<DifficultyLevel, string> = {
    [DifficultyLevel.BEGINNER]: "Beginner",
    [DifficultyLevel.INTERMEDIATE]: "Intermediate",
    [DifficultyLevel.ADVANCED]: "Advanced",
  };
  return labelMap[value];
};

// Generate difficulty level options from Prisma enum
const difficultyLevelOptions = Object.values(DifficultyLevel).map((value) => ({
  label: formatDifficultyLevelLabel(value),
  value: value,
}));

export const CertificationLevelForm = ({
  initialData,
  certificationId,
}: DifficultyLevelFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Ensure we set mode to onChange for triggering validation on each change
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level:
        (initialData?.level as DifficultyLevel) || DifficultyLevel.BEGINNER,
    },
    mode: "onChange", // Validate on value change
  });

  const {
    setValue,
    watch,
    formState: { errors, isValid },
  } = form;

  // Handle difficulty level selection and trigger validation
  const handleDifficultyLevelChange = (value: string) => {
    setValue("level", value as DifficultyLevel, { shouldValidate: true });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await clientApi.updateCertification({
        params: {
          certificationId,
        },
        body: {
          level: values.level,
        },
      });
      // await axios.patch(`/api/certifications/${certificationId}`, {
      //   level: values.level,
      // });
      toast.success("Course updated");
      setIsEditing(false); // Exit edit mode
      await revalidatePage([
        { route: "/" },
        { route: "/(course)/courses", type: "layout" },
      ]);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div>
          Difficulty level
          <span className="text-red-500">*</span>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit level
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.level && "text-slate-500 italic"
          )}
        >
          {initialData.level
            ? difficultyLevelOptions.find(
                (opt) => opt.value === initialData.level
              )?.label
            : "No difficulty level"}
        </p>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Select
            value={watch("level") || ""}
            onValueChange={handleDifficultyLevelChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a difficulty level" />
            </SelectTrigger>
            <SelectContent>
              {difficultyLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Show errors if validation fails */}
          {errors.level && (
            <div className="text-red-500 text-sm mt-2">
              {errors.level.message}
            </div>
          )}

          <div className="flex items-center gap-x-2">
            <Button disabled={!isValid || loading} type="submit">
              {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
