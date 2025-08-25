"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { Pencil, Loader, Check, X, Search, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { updateCourse } from "@/lib/course/updateCourse";

interface AuthorFormProps {
  initialData: Course & {
    coTeachers: {
      id: string;
      user: {
        name: string;
        email: string;
      };
    }[];
  };
  courseId: string;
}

interface SearchResult {
  id: string;
  name: string;
  email: string;
}

const formSchema = z.object({
  coTeacherIds: z.array(z.string()).max(5, {
    message: "Maximum 5 Co-Authors is allowed!",
  }),
});

export const CoAuthorForm = ({ initialData, courseId }: AuthorFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Create initial selected teachers from props
  const getInitialSelectedTeachers = () =>
    initialData.coTeachers.map((teacher) => ({
      id: teacher.id,
      name: teacher.user.name,
      email: teacher.user.email,
    }));

  const [selectedTeachers, setSelectedTeachers] = useState<SearchResult[]>(
    getInitialSelectedTeachers()
  );

  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: sessionData } = useSession();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coTeacherIds: initialData?.coTeacherIds || [],
    },
  });

  const { isSubmitting, isDirty } = form.formState;

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3 || !isValidEmail(query)) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setSearchLoading(true);
      try {
        const response = await axios.get(
          `/api/teacher/search?email=${encodeURIComponent(query)}`
        );
        const results = response.data
          .filter(
            (teacher: SearchResult) =>
              !selectedTeachers.some((selected) => selected.id === teacher.id)
          )
          .filter((teacher: any) => teacher.email !== sessionData?.user?.email);

        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setSearchLoading(false);
      }
    }, 300),
    [selectedTeachers, sessionData?.user?.email]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Add teacher to selection
  const addTeacher = (teacher: SearchResult) => {
    if (selectedTeachers.length >= 5) {
      toast.error("Maximum 5 Co-Authors allowed!");
      return;
    }

    const newSelectedTeachers = [...selectedTeachers, teacher];
    setSelectedTeachers(newSelectedTeachers);

    // Update form value
    form.setValue(
      "coTeacherIds",
      newSelectedTeachers.map((t) => t.id),
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );

    // Clear search
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);

    // Focus back to input
    searchInputRef.current?.focus();
  };

  // Remove teacher from selection
  const removeTeacher = (teacherId: string) => {
    const newSelectedTeachers = selectedTeachers.filter(
      (t) => t.id !== teacherId
    );
    setSelectedTeachers(newSelectedTeachers);

    // Update form value
    form.setValue(
      "coTeacherIds",
      newSelectedTeachers.map((t) => t.id),
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values.coTeacherIds, "teacherIDs");
    // setLoading(true);
    // try {
    //   await axios.patch(`/api/courses/${courseId}`, {
    //     coTeacherIds: values.coTeacherIds,
    //   });
    //   toast.success("Co-Authors updated");
    //   setIsEditing(false);
    //   router.refresh();
    // } catch {
    //   toast.error("Something went wrong");
    // } finally {
    //   setLoading(false);
    // }

    await updateCourse({
      courseId,
      values: {
        coTeacherIds: values.coTeacherIds,
      },
      setLoading,
      router,
      successMessage: "Co-Authors updated",
      api: `/api/courses/${courseId}`,
    });
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);

    // Reset to initial state
    const initialTeachers = getInitialSelectedTeachers();
    setSelectedTeachers(initialTeachers);

    // Reset form with initial values
    form.reset({
      coTeacherIds: initialData.coTeachers.map((t) => t.id),
    });
  };

  // Handle edit button click
  const handleEditClick = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
      // Sync form state with current data when starting to edit
      const currentTeachers = getInitialSelectedTeachers();
      setSelectedTeachers(currentTeachers);
      form.reset({
        coTeacherIds: currentTeachers.map((t) => t.id),
      });
    }
  };

  // Update selectedTeachers when initialData changes (after successful submission)
  useEffect(() => {
    if (!isEditing) {
      const newInitialTeachers = getInitialSelectedTeachers();
      setSelectedTeachers(newInitialTeachers);
    }
  }, [initialData.coTeachers, isEditing]);

  return (
    <FormProvider {...form}>
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
          Course co-authors
          <Button onClick={handleEditClick} variant="ghost">
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit co-authors
              </>
            )}
          </Button>
        </div>

        {!isEditing && (
          <div className="mt-2">
            {initialData.coTeachers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {initialData.coTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-white px-3 py-1 rounded-full text-sm border"
                  >
                    {teacher.user.name} ({teacher.user.email})
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No co-authors</p>
            )}
          </div>
        )}

        {isEditing && (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="coTeacherIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search and select co-authors by email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 z-10 transform text-gray-700 -translate-y-1/2 h-4 w-4" />
                        <Input
                          ref={searchInputRef}
                          type="email"
                          placeholder="Type email to search teachers..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          className="pl-10"
                          disabled={selectedTeachers.length >= 5}
                        />
                        {searchLoading && (
                          <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                        )}
                      </div>

                      {/* Search Results Dropdown */}
                      {showDropdown && (
                        <div
                          ref={dropdownRef}
                          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                        >
                          {searchResults.map((teacher) => (
                            <button
                              key={teacher.id}
                              type="button"
                              onClick={() => addTeacher(teacher)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between group"
                            >
                              <div>
                                <div className="font-medium text-sm">
                                  {teacher.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {teacher.email}
                                </div>
                              </div>
                              <Check className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>

                  {/* Selected Teachers or No Selection Message */}
                  <div className="mt-3">
                    {selectedTeachers.length > 0 ? (
                      <>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Selected Co-Authors ({selectedTeachers.length}/5):
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedTeachers.map((teacher) => (
                            <div
                              key={teacher.id}
                              className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                              <span>
                                {teacher.name} ({teacher.email})
                              </span>
                              <button
                                type="button"
                                onClick={() => removeTeacher(teacher.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-gray-500 italic bg-gray-50 border border-gray-200 rounded-md p-2">
                        No co-teacher selected
                      </div>
                    )}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                className="disabled:opacity-50"
                disabled={isSubmitting || loading || !isDirty}
              >
                {loading ? (
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                Save
              </Button>
            </div>
          </form>
        )}
      </div>
    </FormProvider>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
