"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, CourseMode } from "@prisma/client";
import {
  Pencil,
  Loader,
  Check,
  Video,
  Calendar,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";
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
    courseLiveBatchStartedAt?: Date | null;
    totalLiveClass?: number | null;
    liveSchedules?: {
      id: string;
      dayOfWeek: string;
      startTime: Date;
      endTime: Date;
    }[];
  };
  courseId: string;
}
// DayOfWeek enum
enum DayOfWeek {
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
}

// Helper function to convert time string to minutes for comparison
const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper function to check for time overlap
const hasTimeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const start1Minutes = timeToMinutes(start1);
  const end1Minutes = timeToMinutes(end1);
  const start2Minutes = timeToMinutes(start2);
  const end2Minutes = timeToMinutes(end2);

  return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
};

const formSchema = z
  .object({
    courseMode: z.nativeEnum(CourseMode, {
      required_error: "Course mode is required",
    }),
    courseLiveLink: z.string().optional(),
    courseLiveLinkPassword: z.string().optional(),
    courseLiveBatchStartedAt: z.string().optional(),
    totalLiveClass: z.number().optional(),
    liveSchedules: z
      .array(
        z
          .object({
            dayOfWeek: z.nativeEnum(DayOfWeek),
            startTime: z.string().min(1, "Start time is required"),
            endTime: z.string().min(1, "End time is required"),
          })
          .refine(
            (data) => {
              const startMinutes = timeToMinutes(data.startTime);
              const endMinutes = timeToMinutes(data.endTime);
              return endMinutes > startMinutes;
            },
            {
              message: "End time must be after start time",
              path: ["endTime"],
            }
          )
      )
      .optional(),
  })
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
      if (data.courseMode === CourseMode.LIVE && data.liveSchedules) {
        const schedulesByDay = data.liveSchedules.reduce((acc, schedule) => {
          if (!acc[schedule.dayOfWeek]) {
            acc[schedule.dayOfWeek] = [];
          }
          acc[schedule.dayOfWeek].push(schedule);
          return acc;
        }, {} as Record<string, typeof data.liveSchedules>);

        // Check for overlapping times on same day
        for (const [day, schedules] of Object.entries(schedulesByDay)) {
          if (schedules.length > 1) {
            for (let i = 0; i < schedules.length; i++) {
              for (let j = i + 1; j < schedules.length; j++) {
                if (
                  hasTimeOverlap(
                    schedules[i].startTime,
                    schedules[i].endTime,
                    schedules[j].startTime,
                    schedules[j].endTime
                  )
                ) {
                  return false;
                }
              }
            }
          }
        }
      }
      return true;
    },
    {
      message: "Cannot have overlapping schedules on the same day",
      path: ["liveSchedules"],
    }
  )
  .refine(
    (data) => {
      if (data.courseMode === CourseMode.LIVE) {
        return (
          data.courseLiveBatchStartedAt &&
          data.courseLiveBatchStartedAt.trim() !== ""
        );
      }
      return true;
    },
    {
      message: "Batch start date is required for live courses",
      path: ["courseLiveBatchStartedAt"],
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

  const formatTimeForInput = (date: Date | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    // Convert to local timezone
    const localDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Add formatTimeForDisplay function for better display
  const formatTimeForDisplay = (date: Date | null | undefined) => {
    if (!date) return "";

    // Extract time directly from the ISO string without timezone conversion
    const isoString = date instanceof Date ? date.toISOString() : String(date);
    const timePart = isoString.split("T")[1]?.split(".")[0]; // Gets "HH:MM:SS"

    if (!timePart) return "";

    const [hours, minutes] = timePart.split(":").map(Number);

    // Convert to 12-hour format
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const ampm = hours >= 12 ? "PM" : "AM";

    return `${hour12}:${minutes
      .toString()
      .padStart(2, "0")}${ampm.toLowerCase()}`;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseMode: initialData?.courseMode || undefined,
      courseLiveBatchStartedAt: initialData.courseLiveBatchStartedAt
        ? new Date(initialData.courseLiveBatchStartedAt)
            .toISOString()
            .split("T")[0]
        : "",
      courseLiveLink: initialData.courseLiveLink || "",
      courseLiveLinkPassword: initialData.courseLiveLinkPassword || "",
      totalLiveClass: initialData.totalLiveClass || 0,
      liveSchedules:
        initialData.liveSchedules?.map((schedule) => ({
          dayOfWeek: schedule.dayOfWeek as DayOfWeek,
          startTime: formatTimeForInput(schedule.startTime),
          endTime: formatTimeForInput(schedule.endTime),
        })) || [],
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

  // Add state for managing schedules
  const [schedules, setSchedules] = useState(
    initialData.liveSchedules?.map((schedule) => ({
      dayOfWeek: schedule.dayOfWeek as DayOfWeek,
      startTime: formatTimeForInput(schedule.startTime),
      endTime: formatTimeForInput(schedule.endTime),
    })) || []
  );

  // Handle course mode selection and trigger validation
  const handleCourseModeSelect = (value: CourseMode) => {
    setValue("courseMode", value, { shouldValidate: true });
    setIsDropdownOpen(false);

    // Clear live session fields if switching to RECORDED
    if (value === CourseMode.RECORDED) {
      setValue("courseLiveLink", "", { shouldValidate: true });
      setValue("courseLiveLinkPassword", "", { shouldValidate: true });
      setValue("courseLiveBatchStartedAt", "", { shouldValidate: true });
      setValue("totalLiveClass", undefined, { shouldValidate: true });
      setValue("liveSchedules", [], { shouldValidate: true });
      setSchedules([]);
    }
  };
  // 8. Add schedule management functions
  const addSchedule = () => {
    const newSchedule = {
      dayOfWeek: DayOfWeek.SATURDAY,
      startTime: "",
      endTime: "",
    };
    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    setValue("liveSchedules", updatedSchedules, { shouldValidate: true });
  };

  const removeSchedule = (index: number) => {
    const updatedSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(updatedSchedules);
    setValue("liveSchedules", updatedSchedules, { shouldValidate: true });
  };

  const updateSchedule = (index: number, field: string, value: string) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = { ...updatedSchedules[index], [field]: value };

    // Validate for overlaps if updating time fields
    if (field === "startTime" || field === "endTime") {
      const currentSchedule = updatedSchedules[index];

      // Check if start time is before end time
      if (currentSchedule.startTime && currentSchedule.endTime) {
        if (
          timeToMinutes(currentSchedule.startTime) >=
          timeToMinutes(currentSchedule.endTime)
        ) {
          form.setError("liveSchedules", {
            type: "manual",
            message: `End time must be after start time`,
          });
          return;
        }
      }

      // Check for overlaps with other schedules on same day
      const sameDaySchedules = updatedSchedules.filter(
        (schedule, i) =>
          i !== index &&
          schedule.dayOfWeek === currentSchedule.dayOfWeek &&
          schedule.startTime &&
          schedule.endTime
      );

      if (currentSchedule.startTime && currentSchedule.endTime) {
        for (const otherSchedule of sameDaySchedules) {
          if (
            hasTimeOverlap(
              currentSchedule.startTime,
              currentSchedule.endTime,
              otherSchedule.startTime,
              otherSchedule.endTime
            )
          ) {
            form.setError("liveSchedules", {
              type: "manual",
              message: `This schedule overlaps with another schedule on ${currentSchedule.dayOfWeek.toLowerCase()}`,
            });
            return;
          }
        }
      }
    }

    setSchedules(updatedSchedules);
    setValue("liveSchedules", updatedSchedules, { shouldValidate: true });
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
        submitData.totalLiveClass = values.totalLiveClass || 0;
        submitData.courseLiveBatchStartedAt = values.courseLiveBatchStartedAt
          ? new Date(values.courseLiveBatchStartedAt + "T00:00:00.000Z")
          : null;
        submitData.courseLiveLinkPassword =
          values.courseLiveLinkPassword || null;
        // Convert schedules to proper DateTime format with timezone
        submitData.liveSchedules =
          values.liveSchedules?.map((schedule) => {
            // Create ISO string directly without timezone conversion
            const today = new Date();
            const dateStr = today.toISOString().split("T")[0]; // Get YYYY-MM-DD

            const startTimeISO = `${dateStr}T${schedule.startTime}:00.000Z`;
            const endTimeISO = `${dateStr}T${schedule.endTime}:00.000Z`;

            return {
              dayOfWeek: schedule.dayOfWeek,
              startTime: startTimeISO,
              endTime: endTimeISO,
            };
          }) || [];
      } else {
        // Clear live session data for RECORDED courses
        submitData.courseLiveLink = null;
        submitData.courseLiveLinkPassword = null;
        submitData.liveSchedules = [];
        submitData.courseLiveBatchStartedAt = null;
        submitData.totalLiveClass = 0;
      }

      // console.log("submitData result:", submitData);

      await axios.patch(`/api/courses/${courseId}`, submitData);
      toast.success("Course updated");
      setIsEditing(false);
      await revalidatePage([
        { route: "/" },
        { route: "/home" },
        { route: "/live" },
        { route: "/(course)/courses", type: "layout" },
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
          {/*display section for non-editing mode */}
          {initialData.courseMode === CourseMode.LIVE && (
            <div className="border-t pt-4 space-y-2">
              <div className="ml-6 space-y-2">
                {/* Live Link  */}
                <div className="flex items-center gap-2 text-sm">
                  <Video className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">Link:</span>
                  <span className="text-gray-700">
                    {initialData.courseLiveLink || "Not set"}
                  </span>
                </div>
                {/* Live link Password */}
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">Password:</span>
                  <span className="text-gray-700">
                    {initialData.courseLiveLinkPassword
                      ? "••••••••"
                      : "Not set"}
                  </span>
                </div>
                {/* Total live Classes */}
                <div className="flex items-center gap-2 text-sm">
                  <Video className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">Total Classes:</span>
                  <span className="text-gray-700">
                    {initialData.totalLiveClass || "Not set"}
                  </span>
                </div>
                {/* live class Start Date */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">Batch Start:</span>
                  <span className="text-gray-700">
                    {initialData.courseLiveBatchStartedAt
                      ? new Date(
                          initialData.courseLiveBatchStartedAt
                        ).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
                {/* live class Schedules */}
                <div className="flex items-start gap-2 text-sm">
                  <Calendar className="h-3 w-3 text-gray-500 mt-1" />
                  <div>
                    <span className="font-medium">Schedules:</span>
                    {initialData.liveSchedules &&
                    initialData.liveSchedules.length > 0 ? (
                      <div className="mt-1 space-y-1">
                        {initialData.liveSchedules.map((schedule, index) => (
                          <div key={index} className="text-gray-700">
                            <span className="font-medium capitalize">
                              {schedule.dayOfWeek.toLowerCase()}
                            </span>
                            :{" "}
                            <span>
                              {formatTimeForDisplay(schedule.startTime)} -{" "}
                              {formatTimeForDisplay(schedule.endTime)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-700 ml-2">Not scheduled</span>
                    )}
                  </div>
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
            <div className="relative pb-4" ref={dropdownRef}>
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
            {/* FormField with Live Schedules section */}
            {selectedCourseMode === CourseMode.LIVE && (
              <div className="border-t pt-8 space-y-4">
                {/* batch start date */}
                <div className="flex flex-row justify-between gap-4">
                  <div className="w-full">
                    <FormField
                      control={control}
                      name="courseLiveBatchStartedAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Batch Start Date{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input disabled={loading} type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* total live class*/}

                  <div className="w-full">
                    <FormField
                      control={control}
                      name="totalLiveClass"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Total Live Classes (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              type="number"
                              min="0"
                              placeholder="Enter number of live classes"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={control}
                  name="courseLiveLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Live Link (Optional)
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

                {/* Live Schedules Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Live Schedules (Optional)
                    </FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSchedule}
                      disabled={loading}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Schedule
                    </Button>
                  </div>
                  <div
                    className={`space-y-3 ${
                      schedules.length > 3
                        ? "max-h-[600px] overflow-y-auto"
                        : ""
                    }`}
                  >
                    {schedules.map((schedule, index) => (
                      <div
                        key={index}
                        className="border rounded-md p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            Schedule {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSchedule(index)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <FormLabel className="block text-sm font-medium mb-1">
                              Day of Week
                            </FormLabel>
                            <select
                              value={schedule.dayOfWeek}
                              onChange={(e) =>
                                updateSchedule(
                                  index,
                                  "dayOfWeek",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border rounded-md text-sm"
                              disabled={loading}
                            >
                              {Object.values(DayOfWeek).map((day) => (
                                <option key={day} value={day}>
                                  {day.charAt(0) + day.slice(1).toLowerCase()}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <FormLabel className="block text-sm font-medium mb-1">
                              Start Time
                            </FormLabel>
                            <Input
                              type="time"
                              value={schedule.startTime}
                              onChange={(e) =>
                                updateSchedule(
                                  index,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              disabled={loading}
                            />
                          </div>

                          <div>
                            <FormLabel className="block text-sm font-medium mb-1">
                              End Time
                            </FormLabel>
                            <Input
                              type="time"
                              value={schedule.endTime}
                              onChange={(e) =>
                                updateSchedule(index, "endTime", e.target.value)
                              }
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {schedules.length === 0 && (
                    <div className="text-center py-8 text-gray-500 border border-dashed rounded">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No schedules added yet</p>
                      <p className="text-sm">
                        Click "Add Schedule" to create your first live session
                        schedule
                      </p>
                    </div>
                  )}

                  {errors.liveSchedules && (
                    <div className="text-red-500 text-sm">
                      {errors.liveSchedules.message}
                    </div>
                  )}
                </div>
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
