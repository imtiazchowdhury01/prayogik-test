"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, CourseMode } from "@prisma/client";
import { Pencil, Loader, Check, Video, Calendar, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { revalidatePage } from "@/actions/revalidatePage";

interface CombinedCourseModeFormProps {
  initialData: Course & {
    courseLiveLink?: string | null;
    courseLiveLinkPassword?: string | null;
    courseLiveLinkScheduledAt?: Date | null;
  };
  courseId: string;
}

const formSchema = z
  .object({
    courseMode: z.nativeEnum(CourseMode, {
      required_error: "Course mode is required",
    }),
    courseLiveLink: z.string().optional(),
    courseLiveLinkPassword: z.string().optional(),
    courseLiveLinkScheduledAt: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.courseMode === CourseMode.LIVE) {
        return data.courseLiveLink && data.courseLiveLink.trim() !== "";
      }
      return true;
    },
    {
      message: "Live link is required for live courses",
      path: ["courseLiveLink"],
    }
  )
  .refine(
    (data) => {
      if (
        data.courseMode === CourseMode.LIVE &&
        data.courseLiveLink &&
        data.courseLiveLink.trim() !== ""
      ) {
        try {
          new URL(data.courseLiveLink);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    {
      message: "Please enter a valid URL",
      path: ["courseLiveLink"],
    }
  )
  .refine(
    (data) => {
      if (data.courseMode === CourseMode.LIVE) {
        return (
          data.courseLiveLinkScheduledAt &&
          data.courseLiveLinkScheduledAt.trim() !== ""
        );
      }
      return true;
    },
    {
      message: "Scheduled date & time is required for live courses",
      path: ["courseLiveLinkScheduledAt"],
    }
  );

// Helper function to format enum values to readable labels
const formatCourseModeLabel = (value: CourseMode): string => {
  const labelMap: Record<CourseMode, string> = {
    [CourseMode.RECORDED]: "Recorded Course",
    [CourseMode.LIVE]: "Live Course",
  };
  return labelMap[value];
};

// Generate course mode options from Prisma enum
const courseModeOptions = Object.values(CourseMode).map((value) => ({
  label: formatCourseModeLabel(value),
  value: value,
}));

export const CourseModeForm = ({
  initialData,
  courseId,
}: CombinedCourseModeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  // Format date for input field (datetime-local format)
  const formatDateForInput = (date: Date | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseMode: initialData?.courseMode || undefined,
      courseLiveLink: initialData.courseLiveLink || "",
      courseLiveLinkPassword: initialData.courseLiveLinkPassword || "",
      courseLiveLinkScheduledAt: formatDateForInput(
        initialData.courseLiveLinkScheduledAt
      ),
    },
    mode: "onChange",
  });

  const {
    setValue,
    watch,
    formState: { errors, isValid },
    control,
  } = form;

  const selectedCourseMode = watch("courseMode");

  // Filter options based on the search term
  const filteredOptions = courseModeOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle course mode selection and trigger validation
  const handleCourseModeSelect = (value: CourseMode) => {
    setValue("courseMode", value, { shouldValidate: true });
    setIsDropdownOpen(false);

    // Clear live session fields if switching to RECORDED
    if (value === CourseMode.RECORDED) {
      setValue("courseLiveLink", "", { shouldValidate: true });
      setValue("courseLiveLinkPassword", "", { shouldValidate: true });
      setValue("courseLiveLinkScheduledAt", "", { shouldValidate: true });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const submitData: any = {
        courseMode: values.courseMode,
      };

      // Only include live session data if mode is LIVE
      if (values.courseMode === CourseMode.LIVE) {
        submitData.courseLiveLink = values.courseLiveLink || null;
        submitData.courseLiveLinkPassword =
          values.courseLiveLinkPassword || null;
        submitData.courseLiveLinkScheduledAt = values.courseLiveLinkScheduledAt
          ? new Date(values.courseLiveLinkScheduledAt).toISOString()
          : null;
      } else {
        // Clear live session data for RECORDED courses
        submitData.courseLiveLink = null;
        submitData.courseLiveLinkPassword = null;
        submitData.courseLiveLinkScheduledAt = null;
      }

      await axios.patch(`/api/courses/${courseId}`, submitData);
      toast.success("Course updated");
      setIsEditing(false);
      await revalidatePage([
        { route: "/(site)", type: "layout" },
        { route: "/courses", type: "layout" },
      ]);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  // Format date for display
  const formatDateForDisplay = (date: Date | null | undefined) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div>
          Course Mode
          <span className="text-red-500">*</span>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit configuration
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4 space-y-4">
          <div>
            <p
              className={cn(
                "text-sm mt-1",
                !initialData.courseMode && "text-slate-500 italic"
              )}
            >
              {initialData.courseMode
                ? courseModeOptions.find(
                    (opt) => opt.value === initialData.courseMode
                  )?.label
                : "No course mode"}
            </p>
          </div>

          {initialData.courseMode === CourseMode.LIVE && (
            <div className="border-t pt-4 space-y-2">
              <div className="ml-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Video className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">Link:</span>
                  <span className="text-gray-700">
                    {initialData.courseLiveLink || "Not set"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">Password:</span>
                  <span className="text-gray-700">
                    {initialData.courseLiveLinkPassword
                      ? "••••••••"
                      : "Not set"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">Scheduled:</span>
                  <span className="text-gray-700">
                    {formatDateForDisplay(
                      initialData.courseLiveLinkScheduledAt
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* Course Mode Selection */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Mode <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full p-2 border rounded-md bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {watch("courseMode")
                  ? courseModeOptions.find(
                      (opt) => opt.value === watch("courseMode")
                    )?.label
                  : "Select a course mode"}
                <svg
                  className="h-4 w-4 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg">
                  <div className="p-2 border-b">
                    <Input
                      ref={searchInputRef}
                      placeholder="Search course modes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    {filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleCourseModeSelect(option.value)}
                        className="flex items-center justify-between w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <span>{option.label}</span>
                        {watch("courseMode") === option.value && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </button>
                    ))}

                    {filteredOptions.length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No course modes found.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {errors.courseMode && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.courseMode.message}
                </div>
              )}
            </div>

            {/* Live Session Details - Only show when LIVE mode is selected */}
            {selectedCourseMode === CourseMode.LIVE && (
              <div className="border-t pt-4 space-y-4">
                {/* <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Video className="h-4 w-4" />
                  Live Session Details
                </div> */}

                <FormField
                  control={control}
                  name="courseLiveLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Live Link <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="https://zoom.us/j/1234567890 or https://meet.google.com/abc-def-ghi"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="courseLiveLinkPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Meeting Password (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Enter meeting password if required"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="courseLiveLinkScheduledAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Scheduled Date & Time{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || loading} type="submit">
                {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
