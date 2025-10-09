"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Event, EventType } from "@prisma/client";
import { Pencil, Loader, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { updateEvent } from "@/lib/event/event";

interface EventTypeFormProps {
  initialData: Event;
  eventId: string;
}

// Updated schema with conditional price validation
const formSchema = z.object({
  type: z.nativeEnum(EventType, {
    required_error: "Event type is required",
  }),
  price: z.number().optional(),
});
// .refine((data) => {
//   // If event type is PAID, price is required and must be greater than 0
//   if (data.type === EventType.PAID) {
//     return data.price !== undefined && data.price >= 0;
//   }
//   return true;
// }, {
//   message: "Price is required for paid events and must be greater than 0",
//   path: ["price"],
// });

// Helper function to format enum values to readable labels
const formatEventTypeLabel = (value: EventType): string => {
  const labelMap: Record<EventType, string> = {
    [EventType.FREE]: "Free Event",
    [EventType.PAID]: "Paid Event",
    [EventType.EOI]: "EOI",
  };
  return labelMap[value];
};

// Generate event type options from Prisma enum
const eventTypeOptions = Object.values(EventType).map((value) => ({
  label: formatEventTypeLabel(value),
  value: value,
}));

export const EventTypeForm = ({ initialData, eventId }: EventTypeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  // Ensure we set mode to onChange for triggering validation on each change
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type || undefined,
      price: initialData?.price || undefined,
    },
    mode: "onChange", // Validate on value change
  });

  const {
    setValue,
    watch,
    register,
    formState: { errors, isValid },
  } = form;

  const selectedType = watch("type");
  const isPaidEvent = selectedType === EventType.PAID;

  // Filter options based on the search term
  const filteredOptions = eventTypeOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle event type selection and trigger validation
  const handleEventTypeSelect = (value: EventType) => {
    setValue("type", value, { shouldValidate: true });

    // Clear price if switching to free event
    if (value === EventType.FREE || value === EventType.EOI) {
      setValue("price", undefined, { shouldValidate: true });
    }

    setIsDropdownOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Prepare the final values, ensuring price is null for free events
      const finalValues = {
        ...values,
        price: values.type === EventType.PAID ? values.price : undefined,
      };

      // console.log('finalValues result:', values);

      await updateEvent({
        eventId,
        values: finalValues,
        slug: initialData.slug,
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
        <div>
          Type
          <span className="text-red-500">*</span>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit type
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="space-y-2 mt-2">
          <p
            className={cn(
              "text-sm",
              !initialData.type && "text-slate-500 italic"
            )}
          >
            {initialData.type
              ? eventTypeOptions.find((opt) => opt.value === initialData.type)
                  ?.label
              : "No event type"}
          </p>
          {initialData.type === EventType.PAID && initialData.price && (
            <p className="text-sm text-brand font-medium">
              Price: ৳{initialData.price}
            </p>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Event Type Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {/* Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full p-2 border rounded-md bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {watch("type")
                ? eventTypeOptions.find((opt) => opt.value === watch("type"))
                    ?.label
                : "Select an event type"}
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
              <div className="absolute z-20 mt-2 w-full bg-white border rounded-md shadow-lg">
                {/* Search Bar */}
                {/* <div className="p-2 border-b">
                  <Input
                    ref={searchInputRef}
                    placeholder="Search event types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div> */}

                {/* Filtered Options */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleEventTypeSelect(option.value)}
                      className="flex items-center justify-between w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <span>{option.label}</span>
                      {watch("type") === option.value && (
                        <Check className="h-4 w-4 text-brand" />
                      )}
                    </button>
                  ))}

                  {/* No Results Message */}
                  {filteredOptions.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No event types found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Show errors if validation fails */}
          {errors.type && (
            <div className="text-red-500 text-sm mt-2">
              {errors.type.message}
            </div>
          )}

          {/* Price Field - Only show for paid events */}
          {isPaidEvent && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
                  ৳
                </span>
                <Input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  className="pl-6"
                  {...register("price", {
                    valueAsNumber: true,
                    validate: (value) => {
                      if (isPaidEvent && (!value || value <= 0)) {
                        return "Price must be greater than 0 for paid events";
                      }
                      return true;
                    },
                  })}
                />
              </div>
              {errors.price && (
                <div className="text-red-500 text-sm">
                  {errors.price.message}
                </div>
              )}
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
