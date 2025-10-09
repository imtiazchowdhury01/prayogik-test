"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Certification } from "@prisma/client";
import { Pencil, Loader, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { revalidatePage } from "@/actions/revalidatePage";
import { getChildCategoriesDBCall } from "@/lib/data-access-layer/categories";
import { clientApi } from "@/lib/utils/openai/client";

interface CertificationCategoryFormProps {
  initialData: Certification;
  certificationId: string;
}

interface CategoryOption {
  label: string;
  value: string;
}

const formSchema = z.object({
  skillIds: z
    .array(z.string())
    .min(1, { message: "At least one skill is required" }),
});

export const CertificationCategoryForm = ({
  initialData,
  certificationId,
}: CertificationCategoryFormProps) => {
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
      skillIds: initialData?.skillIds || [],
    },
    mode: "onChange",
  });

  const {
    setValue,
    watch,
    formState: { errors, isValid },
  } = form;

  const selectedSkillIds = watch("skillIds");

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
        console.log({
          fetchedCategories,
          categoryOptions,
          fetchedCategoriesCount: fetchedCategories.length,
          categoryOptionsCount: categoryOptions.length,
        });
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

  // Handle category selection for multiple selection
  const handleCategorySelect = (value: string) => {
    const currentSkillIds = selectedSkillIds || [];
    let newSkillIds;

    if (currentSkillIds.includes(value)) {
      // Remove if already selected
      newSkillIds = currentSkillIds.filter((id) => id !== value);
    } else {
      // Add if not selected
      newSkillIds = [...currentSkillIds, value];
    }

    setValue("skillIds", newSkillIds, { shouldValidate: true });
  };

  // Remove a selected skill
  const removeSkill = (skillId: string) => {
    const newSkillIds = selectedSkillIds.filter((id) => id !== skillId);
    setValue("skillIds", newSkillIds, { shouldValidate: true });
  };

  // Get selected skill labels for display
  const getSelectedSkillLabels = () => {
    return selectedSkillIds
      .map((skillId) => categories.find((cat) => cat.value === skillId)?.label)
      .filter(Boolean);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await clientApi.updateCertification({
        params: {
          certificationId,
        },
        body: {
          skillIds: values.skillIds,
        },
      });
      // await axios.patch(`/api/certifications/${certificationId}`, {
      //   skillIds: values.skillIds,
      // });
      toast.success("Certification updated");
      setIsEditing(false);
      await revalidatePage([
        { route: "/" },
        { route: "/live" },
        { route: "/certifications" },
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
          Skills
          <span className="text-red-500">*</span>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit skills
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-2">
          {categoriesLoading ? (
            <p className="text-sm text-slate-500 italic">Loading...</p>
          ) : selectedSkillIds.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {getSelectedSkillLabels().map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No skills selected</p>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="relative" ref={dropdownRef}>
            {/* Selected Skills Display */}
            {selectedSkillIds.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {getSelectedSkillLabels().map((label, index) => (
                  <span
                    key={selectedSkillIds[index]}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => removeSkill(selectedSkillIds[index])}
                      className="ml-1 p-0.5 rounded-full hover:bg-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={categoriesLoading}
              className="flex items-center justify-between w-full p-2 border rounded-md bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {categoriesLoading
                ? "Loading categories..."
                : selectedSkillIds.length > 0
                ? `${selectedSkillIds.length} skill(s) selected`
                : "Select skills"}
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
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Filtered Options */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredOptions.map((option) => {
                    const isSelected = selectedSkillIds.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleCategorySelect(option.value)}
                        className={cn(
                          "flex items-center justify-between w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        )}
                      >
                        <span className={cn(isSelected && "font-medium")}>
                          {option.label}
                        </span>
                        {isSelected && <Check className="h-4 w-4 text-brand" />}
                      </button>
                    );
                  })}

                  {/* No Results Message */}
                  {filteredOptions.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No skills found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Show errors if validation fails */}
          {errors.skillIds && (
            <div className="text-red-500 text-sm mt-2">
              {errors.skillIds.message}
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
