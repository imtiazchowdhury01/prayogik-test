"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { Pencil, Loader, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { revalidatePage } from "@/actions/revalidatePage";
import { getChildCategoriesDBCall } from "@/lib/data-access-layer/categories";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
}

interface CategoryOption {
  label: string;
  value: string;
}

const formSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required" }),
});

export const CategoryForm = ({ initialData, courseId }: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
    },
    mode: "onChange",
  });

  const {
    setValue,
    watch,
    formState: { errors, isValid },
  } = form;

  // Fetch categories when component mounts or when editing starts
  useEffect(() => {
    const loadCategories = async () => {
      if (categories.length > 0) return; // Don't refetch if already loaded

      setCategoriesLoading(true);
      try {
        const fetchedCategories = await getChildCategoriesDBCall();

        const categoryOptions = fetchedCategories.map((category) => ({
          label: category?.name,
          value: category?.id,
        }));
        console.log({fetchedCategories, categoryOptions, fetchedCategoriesCount: fetchedCategories.length, categoryOptionsCount:categoryOptions.length});
        setCategories(categoryOptions);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, [categories.length]);

  // Filter options based on the search term
  const filteredOptions = categories.filter((option) =>
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
          {categoriesLoading
            ? "Loading..."
            : initialData.categoryId
            ? categories.find((opt) => opt.value === initialData.categoryId)
                ?.label || "Category not found"
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
              disabled={categoriesLoading}
              className="flex items-center justify-between w-full p-2 border rounded-md bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {categoriesLoading
                ? "Loading categories..."
                : watch("categoryId")
                ? categories.find((opt) => opt.value === watch("categoryId"))
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
            {isDropdownOpen && !categoriesLoading && (
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
                        <Check className="h-4 w-4 text-green-500" />
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
            <Button
              disabled={!isValid || loading || categoriesLoading}
              type="submit"
            >
              {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
