"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Event, EventStatus } from "@prisma/client";
import { Pencil, Loader, Check, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { updateEvent } from "@/lib/event/event";

interface EventStatusFormProps {
  initialData: Event;
  eventId: string;
}

const formSchema = z.object({
  status: z.nativeEnum(EventStatus, {
    required_error: "Event status is required",
  }),
});

// Helper function to format enum values to readable labels
const formatEventStatusLabel = (value: EventStatus): string => {
  const labelMap: Record<EventStatus, string> = {
    [EventStatus.DRAFT]: "Draft",
    [EventStatus.UPCOMING]: "Upcoming",
    [EventStatus.WAITING]: "Waiting List",
    [EventStatus.CLOSED]: "Closed",
  };
  return labelMap[value];
};

// Helper function to get status colors
const getStatusColor = (status: EventStatus): string => {
  const colorMap: Record<EventStatus, string> = {
    [EventStatus.DRAFT]: "text-gray-600 bg-gray-100",
    [EventStatus.UPCOMING]: "text-blue-600 bg-blue-100",
    [EventStatus.WAITING]: "text-yellow-600 bg-yellow-100",
    [EventStatus.CLOSED]: "text-red-600 bg-red-100",
  };
  return colorMap[status];
};

// Helper function to get status descriptions
const getStatusDescription = (status: EventStatus): string => {
  const descriptionMap: Record<EventStatus, string> = {
    [EventStatus.DRAFT]: "Event is being prepared and not visible to attendees",
    [EventStatus.UPCOMING]: "Event is live and accepting registrations",
    [EventStatus.WAITING]: "Event will be published soon, new registrations go to waiting list",
    [EventStatus.CLOSED]: "Event registration is closed",
  };
  return descriptionMap[status];
};

// Generate event status options from Prisma enum
const eventStatusOptions = Object.values(EventStatus).map((value) => ({
  label: formatEventStatusLabel(value),
  value: value,
  description: getStatusDescription(value),
  color: getStatusColor(value),
}));

export const EventStatusForm = ({ initialData, eventId }: EventStatusFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: initialData?.status || undefined,
    },
    mode: "onChange",
  });

  const {
    setValue,
    watch,
    formState: { errors, isValid },
  } = form;

  // Filter options based on the search term
  const filteredOptions = eventStatusOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle event status selection and trigger validation
  const handleEventStatusSelect = (value: EventStatus) => {
    setValue("status", value, { shouldValidate: true });
    setIsDropdownOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await updateEvent({
        eventId,
        values,
        toggleEdit,
        setLoading,
        router,
      });
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
        <div className="flex items-center">
          Status
          <span className="text-red-500">*</span>
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit status
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="space-y-3 mt-4">
          {initialData.status ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  getStatusColor(initialData.status)
                )}>
                  {formatEventStatusLabel(initialData.status)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {getStatusDescription(initialData.status)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic flex items-center gap-2">
              <Activity className="h-4 w-4" />
              No status set
            </p>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="relative" ref={dropdownRef}>
            {/* Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full p-3 border rounded-md bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {watch("status") ? (
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    getStatusColor(watch("status"))
                  )}>
                    {formatEventStatusLabel(watch("status"))}
                  </span>
                </div>
              ) : (
                "Select event status"
              )}
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

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg">
                {/* Search Bar */}
                <div className="p-2 border-b">
                  <Input
                    ref={searchInputRef}
                    placeholder="Search status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Filtered Options */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleEventStatusSelect(option.value)}
                      className="flex items-start justify-between w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            option.color
                          )}>
                            {option.label}
                          </span>
                          {watch("status") === option.value && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  ))}

                  {/* No Results Message */}
                  {filteredOptions.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No status options found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Show errors if validation fails */}
          {errors.status && (
            <div className="text-red-500 text-sm mt-2">
              {errors.status.message}
            </div>
          )}
          <div className="flex items-center gap-x-2 pt-4">
            <Button disabled={!isValid || loading} type="submit">
              {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};