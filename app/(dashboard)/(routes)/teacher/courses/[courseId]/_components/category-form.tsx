"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { Pencil, Loader, Check } from "lucide-react"; // Import Check icon
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"; // Import shadcn Input component
import { revalidatePage } from "@/actions/revalidatePage";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required" }),
});

export const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  // Ensure we set mode to onChange for triggering validation on each change
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
    },
    mode: "onChange", // Validate on value change
  });

  const {
    setValue,
    watch,
    formState: { errors, isValid },
  } = form;

  // Filter options based on the search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle category selection and trigger validation
  const handleCategorySelect = (value: string) => {
    setValue("categoryId", value, { shouldValidate: true });
    setIsDropdownOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await axios.patch(`/api/courses/${courseId}`, {
        categoryId: values.categoryId,
      });
      toast.success("Course updated");
      setIsEditing(false); // Exit edit mode
       await revalidatePage([
      { route: '/(site)', type: "layout" },
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

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div>
          Course category
          <span className="text-red-500">*</span>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.categoryId && "text-slate-500 italic"
          )}
        >
          {initialData.categoryId
            ? options.find((opt) => opt.value === initialData.categoryId)?.label
            : "No category"}
        </p>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="relative" ref={dropdownRef}>
            {/* Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full p-2 border rounded-md bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {watch("categoryId")
                ? options.find((opt) => opt.value === watch("categoryId"))
                    ?.label
                : "Select a category"}
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
                    placeholder="Search categories..."
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
                      onClick={() => handleCategorySelect(option.value)}
                      className="flex items-center justify-between w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <span>{option.label}</span>
                      {watch("categoryId") === option.value && (
                        <Check className="h-4 w-4 text-green-500" /> // Green tick mark
                      )}
                    </button>
                  ))}

                  {/* No Results Message */}
                  {filteredOptions.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No categories found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Show errors if validation fails */}
          {errors.categoryId && (
            <div className="text-red-500 text-sm mt-2">
              {errors.categoryId.message}
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
