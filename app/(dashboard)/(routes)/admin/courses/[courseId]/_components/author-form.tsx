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
import { updateCourse } from "@/lib/course/updateCourse";

interface AuthorFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string; email: string }[];
}

const formSchema = z.object({
  teacherProfileId: z.string().min(1, { message: "Author is required" }),
});

export const AuthorForm = ({
  initialData,
  courseId,
  options,
}: AuthorFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown container
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for search input

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teacherProfileId: initialData?.teacherProfileId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // setLoading(true);
    // try {
    //   await axios.patch(`/api/admin/courses/${courseId}`, {
    //     teacherProfileId: values.teacherProfileId,
    //   });
    //   toast.success("Author updated");
    //   setIsEditing(false); // Exit edit mode
    //   router.refresh();
    // } catch {
    //   toast.error("Something went wrong");
    // } finally {
    //   setLoading(false);
    // }
    await updateCourse({
      courseId,
      values: {
        teacherProfileId: values.teacherProfileId,
      },
      setLoading,
      router,
      successMessage: "Author updated",
      api: `/api/admin/courses/${courseId}`,
    });
  };

  // Filter options based on the search term (searching both label and email)
  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Get selected option for display
  const selectedOption = options.find(
    (opt) => opt.value === initialData.teacherProfileId
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course author
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit author
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.teacherProfileId && "text-slate-500 italic"
          )}
        >
          {selectedOption
            ? `${selectedOption.label} - ${selectedOption.email}`
            : "No author"}
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
              {form.watch("teacherProfileId")
                ? options.find(
                    (opt) => opt.value === form.watch("teacherProfileId")
                  )?.label
                : "Select a author"}
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
                    placeholder="Search by name or email..."
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
                      onClick={() => {
                        form.setValue("teacherProfileId", option.value);
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center justify-between w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-gray-500">
                          {option.email}
                        </span>
                      </div>
                      {form.watch("teacherProfileId") === option.value && (
                        <Check className="h-4 w-4 text-green-500" /> // Green tick mark
                      )}
                    </button>
                  ))}

                  {/* No Results Message */}
                  {filteredOptions.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No authors found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-x-2">
            <Button
              disabled={!isValid || isSubmitting || loading}
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
