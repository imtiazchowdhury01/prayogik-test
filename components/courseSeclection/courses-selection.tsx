// @ts-nocheck
"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import toast from "react-hot-toast";
import { CourseSelectionPagination } from "./course-selection-pagination";
import { CourseSelectionCard } from "./course-selection-card";
import { CourseSelectionEmptyState } from "./course-selection-empty-state";
import { CourseSelectionSkeleton } from "./course-selection-skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import {
  clientSideFetchCourses,
  clientSideSearchCourses,
} from "@/lib/utils/openai/client/course";
import { Course } from "@/types/course";
import { QueryKeys } from "@/constants/query-keys";

// Types
interface CourseSelectionTexts {
  title?: string;
  subtitle?: string;
  subtitleWithPrevious?: string;
  searchPlaceholder?: string;
  availableCoursesTitle?: string;
  selectedCoursesTitle?: string;
  submitButtonText?: string;
  emptySelectionMessage?: string;
  emptySelectionSubMessage?: string;
  emptySelectionSubMessageWithPrevious?: string;
  searchResultsTitle?: string;
  loadingText?: string;
  retryButtonText?: string;
  errorPrefix?: string;
  maxSelectionReachedMessage?: string;
  remainingSlotsMessage?: string;
  maxSelectionCompletedMessage?: string;
  availableCoursesTab?: string;
  selectedCoursesTab?: string;
}

interface CourseSelectionProps {
  className?: string;

  // Selection configuration
  maxSelections?: number;
  previouslySelectedIds?: string[];
  initialSelectedCourses?: Course[];

  // Actions
  onSubmit: (selectedCourseIds: string[]) => Promise<void>;
  onClose?: () => void;
  onSelectionChange?: (courses: Course[]) => void;
  onError?: (error: Error) => void;

  // State
  isSubmitting?: boolean;

  // Configuration
  pageSize?: number;
  searchDebounceDelay?: number;
  showHeader?: boolean;
  enableSearch?: boolean;
  enableMobileToggle?: boolean;

  // Customization
  texts?: CourseSelectionTexts;

  // Query configuration
  coursesQueryKey?: string;
  searchQueryKey?: string;
  staleTime?: number;
  searchStaleTime?: number;
  allowRemovePrevious?: boolean;
}

// Default texts - updated to handle unlimited selections
const defaultTexts: CourseSelectionTexts = {
  title: "প্রাইম কোর্স নির্বাচন করুন",
  subtitle:
    "সর্বোচ্চ {maxSelections}টি কোর্স বেছে নিতে পারবেন। নির্বাচিত: {selectedCount}/{maxSelections}",
  subtitleWithPrevious:
    "আগে নির্বাচিত: {previousCount}টি, বাকি: {remainingSlots}টি নির্বাচন করতে পারবেন। বর্তমান নির্বাচন: {selectedCount}/{remainingSlots}",
  searchPlaceholder: "কোর্স খুঁজুন...",
  availableCoursesTitle: "প্রাইম কোর্সসমূহ",
  selectedCoursesTitle: "নির্বাচিত কোর্স",
  submitButtonText: "সেভ করুন",
  emptySelectionMessage: "এখনো কোন কোর্স নির্বাচন করা হয়নি",
  emptySelectionSubMessage: "১টি থেকে {maxSelections}টি পর্যন্ত কোর্স বেছে নিন",
  emptySelectionSubMessageWithPrevious: "আরো {remainingSlots}টি কোর্স বেছে নিন",
  searchResultsTitle: "খোঁজার ফলাফল",
  loadingText: "লোড হচ্ছে...",
  retryButtonText: "আবার চেষ্টা করুন",
  errorPrefix: "ত্রুটি:",
  maxSelectionReachedMessage:
    "সর্বোচ্চ {maxSelections}টি কোর্স নির্বাচন করতে পারবেন",
  remainingSlotsMessage:
    "আপনি আরো {remainingSlots}টি কোর্স নির্বাচন করতে পারেন।",
  maxSelectionCompletedMessage: "আপনি সর্বোচ্চ সংখ্যক কোর্স নির্বাচন করেছেন।",
  availableCoursesTab: "প্রাইম কোর্সসমূহ",
  selectedCoursesTab: "নির্বাচিত",
};

// Constants
const DEFAULT_PAGE_SIZE = 8;
const DEFAULT_SEARCH_DEBOUNCE_DELAY = 500;
const DEFAULT_STALE_TIME = 5 * 60 * 1000;
const DEFAULT_SEARCH_STALE_TIME = 2 * 60 * 1000;

// Helper function to replace placeholders in text
const replaceTextPlaceholders = (
  text: string,
  replacements: Record<string, string | number>
): string => {
  let result = text;
  Object.entries(replacements).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    result = result.replace(
      new RegExp(placeholder, "g"),
      convertNumberToBangla(value.toString())
    );
  });
  return result;
};

// Main component
export function CourseSelection({
  className,
  maxSelections, // Now optional
  previouslySelectedIds = [],
  initialSelectedCourses = [],
  onSubmit,
  onClose,
  onSelectionChange,
  onError,
  isSubmitting = false,
  pageSize = DEFAULT_PAGE_SIZE,
  searchDebounceDelay = DEFAULT_SEARCH_DEBOUNCE_DELAY,
  showHeader = true,
  enableSearch = true,
  enableMobileToggle = true,
  texts = {},
  coursesQueryKey = QueryKeys.SUBSCRIPTION_COURSES,
  searchQueryKey = QueryKeys.SEARCH_SUBSCRIPTION_COURSES,
  staleTime = DEFAULT_STALE_TIME,
  searchStaleTime = DEFAULT_SEARCH_STALE_TIME,
  allowRemovePrevious = false,
}: CourseSelectionProps) {
  // Merge texts with defaults
  const t = { ...defaultTexts, ...texts };

  // Determine if there's a limit
  const hasLimit = maxSelections !== undefined && maxSelections > 0;
  const effectiveMaxSelections = hasLimit
    ? maxSelections
    : Number.MAX_SAFE_INTEGER;

  // State
  const [selectedCourses, setSelectedCourses] = useState<Course[]>(
    initialSelectedCourses
  );
  // NEW: Track removed previously selected course IDs
  const [removedPreviousIds, setRemovedPreviousIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSelected, setShowMobileSelected] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, searchDebounceDelay);
  const isSearchMode = enableSearch && debouncedSearchQuery.trim().length > 0;

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.(selectedCourses);
  }, [selectedCourses, onSelectionChange]);

  // Queries
  const regularCoursesQuery = useQuery({
    queryKey: [coursesQueryKey, currentPage, pageSize],
    queryFn: () => clientSideFetchCourses(currentPage, pageSize),
    enabled: !isSearchMode,
    staleTime,
  });

  const searchCoursesQuery = useQuery({
    queryKey: [searchQueryKey, debouncedSearchQuery, currentPage, pageSize],
    queryFn: () =>
      clientSideSearchCourses(debouncedSearchQuery, currentPage, pageSize),
    enabled: isSearchMode,
    staleTime: searchStaleTime,
  });

  // Create course objects for previously selected courses from all available data
  const previouslySelectedCourses = useMemo(() => {
    if (previouslySelectedIds.length === 0) return [];

    // Filter out removed previous courses
    const activePreviousIds = previouslySelectedIds.filter(
      (id) => !removedPreviousIds.includes(id)
    );

    // Try to find previously selected courses in current data
    const allDataCourses = [
      ...(regularCoursesQuery.data?.courses || []),
      ...(searchCoursesQuery.data?.courses || []),
    ];
    console.log('allDataCourses result:', allDataCourses);

    return activePreviousIds.map((id) => {
      const found = allDataCourses.find((course) => course.id === id);
      return found
        ? { ...found, isPreviouslySelected: true }
        : {
            id,
            title: t.loadingText || "কোর্স লোড হচ্ছে...",
            slug: "",
            courseType: "",
            courseMode: "",
            teacherProfile: { user: { name: "", email: "" } },
            prices: [],
            _count: { lessons: 0, enrolledStudents: 0 },
            isPreviouslySelected: true,
          };
    });
  }, [
    previouslySelectedIds,
    removedPreviousIds,
    regularCoursesQuery.data,
    searchCoursesQuery.data,
    t.loadingText,
  ]);

  // Derived state
  const activeQuery = isSearchMode ? searchCoursesQuery : regularCoursesQuery;

  const { courses, pagination } = useMemo(() => {
    if (isSearchMode && searchCoursesQuery.data) {
      const allCourses = searchCoursesQuery.data.data.courses || [];
      // Filter out previously selected courses (that are still active)
      const activePreviousIds = previouslySelectedIds.filter(
        (id) => !removedPreviousIds.includes(id)
      );
      const filtered = allCourses.filter(
        (course) => !activePreviousIds.includes(course.id)
      );
      return {
        courses: filtered,
        pagination: searchCoursesQuery.data.data.pagination,
      };
    }

    if (!isSearchMode && regularCoursesQuery.data) {
      const allCourses = regularCoursesQuery.data.courses || [];
      // Filter out previously selected courses (that are still active)
      const activePreviousIds = previouslySelectedIds.filter(
        (id) => !removedPreviousIds.includes(id)
      );
      const filtered = allCourses.filter(
        (course) => !activePreviousIds.includes(course.id)
      );
      return {
        courses: filtered,
        pagination: regularCoursesQuery.data.pagination,
      };
    }

    return { courses: [], pagination: null };
  }, [
    isSearchMode,
    searchCoursesQuery.data,
    regularCoursesQuery.data,
    previouslySelectedIds,
    removedPreviousIds,
  ]);

  const activePreviousCount =
    previouslySelectedIds.length - removedPreviousIds.length;
  const totalSelectedCount = selectedCourses.length + activePreviousCount;
  const canAddMore = hasLimit
    ? totalSelectedCount < effectiveMaxSelections
    : true;
  const hasChanges =
    selectedCourses.length > 0 || removedPreviousIds.length > 0;
  const canSubmit = hasChanges;
  const remainingSlots = hasLimit
    ? effectiveMaxSelections - activePreviousCount
    : Number.MAX_SAFE_INTEGER;

  // All selected courses (previously + currently selected)
  const allSelectedCourses = [
    ...previouslySelectedCourses,
    ...selectedCourses.map((course) => ({
      ...course,
      isPreviouslySelected: false,
    })),
  ];

  // Event handlers
  const handleAddCourse = useCallback(
    (course: Course) => {
      // Check if course is already previously selected (silently ignore)
      const activePreviousIds = previouslySelectedIds.filter(
        (id) => !removedPreviousIds.includes(id)
      );
      if (activePreviousIds.includes(course.id)) {
        return;
      }

      // Check if course is already in current selection
      if (selectedCourses.find((c) => c.id === course.id)) {
        return;
      }

      // Check if we can add more courses (only if there's a limit)
      if (hasLimit && !canAddMore) {
        const message = replaceTextPlaceholders(t.maxSelectionReachedMessage!, {
          maxSelections: effectiveMaxSelections,
        });
        toast.error(message);
        return;
      }

      setSelectedCourses((prev) => [...prev, course]);
    },
    [
      canAddMore,
      hasLimit,
      selectedCourses,
      previouslySelectedIds,
      removedPreviousIds,
      effectiveMaxSelections,
      t.maxSelectionReachedMessage,
    ]
  );

  const handleRemoveCourse = useCallback(
    (courseId: string) => {
      // Check if it's a previously selected course
      if (previouslySelectedIds.includes(courseId)) {
        // Add to removed previous IDs if allowRemovePrevious is true
        if (allowRemovePrevious) {
          setRemovedPreviousIds((prev) =>
            prev.includes(courseId) ? prev : [...prev, courseId]
          );
        }
        return;
      }

      // Remove from currently selected courses
      setSelectedCourses((prev) => prev.filter((c) => c.id !== courseId));
    },
    [previouslySelectedIds, allowRemovePrevious]
  );

  // Helper function to check if a course is previously selected and still active
  const isPreviouslySelected = useCallback(
    (courseId: string) => {
      return (
        previouslySelectedIds.includes(courseId) &&
        !removedPreviousIds.includes(courseId)
      );
    },
    [previouslySelectedIds, removedPreviousIds]
  );

  // Helper function to check if currently selected (not previously selected)
  const isCurrentlySelected = useCallback(
    (courseId: string) => {
      return selectedCourses.some((c) => c.id === courseId);
    },
    [selectedCourses]
  );

  const handleSubmit = useCallback(async () => {
    // Allow submit if there are any changes (new selections or removals)
    const hasChanges =
      selectedCourses.length > 0 || removedPreviousIds.length > 0;
    if (!hasChanges) return;

    try {
      // Get currently selected course IDs
      // const newCourseIds = selectedCourses.map((course) => course.id);

    const newCourseIds = selectedCourses.map((course) => {
      if (course.id && typeof course.id === 'object' && '$oid' in course.id) {
        return course.id.$oid;
      }
      return course.id;
    });
    
    // console.log('newCourseIds result:', newCourseIds);
      // If we allow removing previous courses, we need to send the final state
      if (allowRemovePrevious) {
        // Send all active courses (previous that weren't removed + newly selected)
        const activePreviousIds = previouslySelectedIds.filter(
          (id) => !removedPreviousIds.includes(id)
        );
        const finalCourseIds = [...activePreviousIds, ...newCourseIds];

        // console.log("CourseSelection - Submitting final state:", {
        //   previouslySelectedIds,
        //   removedPreviousIds,
        //   activePreviousIds,
        //   newCourseIds,
        //   finalCourseIds,
        // });

        await onSubmit(finalCourseIds);
      } else {
        // Just send newly selected courses
        // console.log(
        //   "CourseSelection - Submitting new courses only:",
        //   newCourseIds
        // );
        await onSubmit(newCourseIds);
      }

      onClose?.();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Unknown error occurred");
      onError?.(err);
      console.error("Failed to submit courses:", error);
    }
  }, [
    selectedCourses,
    previouslySelectedIds,
    removedPreviousIds,
    onSubmit,
    onClose,
    onError,
    allowRemovePrevious,
  ]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Error state
  if (activeQuery.isError) {
    return (
      <div className={cn("w-full h-full p-4", className)}>
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <p className="text-destructive text-sm">
              {t.errorPrefix}{" "}
              {activeQuery.error instanceof Error
                ? activeQuery.error.message
                : "কোর্স লোড করতে সমস্যা হয়েছে"}
            </p>
            <Button
              onClick={() => activeQuery.refetch()}
              className="mt-4"
              variant="outline"
              size="sm"
            >
              {t.retryButtonText}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      {/* Header */}
      {showHeader && (
        <div className="mb-4 text-center px-1">
          <div className="flex items-center justify-center mb-2">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {t.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {hasLimit
              ? activePreviousCount > 0
                ? replaceTextPlaceholders(t.subtitleWithPrevious!, {
                    previousCount: activePreviousCount,
                    remainingSlots,
                    selectedCount: selectedCourses.length,
                  })
                : replaceTextPlaceholders(t.subtitle!, {
                    maxSelections: effectiveMaxSelections,
                    selectedCount: selectedCourses.length,
                  })
              : // No limit case
              activePreviousCount > 0
              ? `আগে নির্বাচিত: ${convertNumberToBangla(
                  activePreviousCount
                )}টি, বর্তমান নির্বাচন: ${convertNumberToBangla(
                  selectedCourses.length
                )}টি`
              : `নির্বাচিত: ${convertNumberToBangla(
                  selectedCourses.length
                )}টি কোর্স`}
          </p>
        </div>
      )}

      {/* Mobile Toggle Buttons */}
      {enableMobileToggle && (
        <div className="flex sm:hidden mb-4 bg-muted rounded-lg p-1">
          <button
            onClick={() => setShowMobileSelected(false)}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
              !showMobileSelected
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.availableCoursesTab}
          </button>
          <button
            onClick={() => setShowMobileSelected(true)}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors relative",
              showMobileSelected
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.selectedCoursesTab}
            {allSelectedCourses.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {allSelectedCourses.length}
              </span>
            )}
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-6">
        {/* Available Courses */}
        <div
          className={cn(
            "sm:col-span-3 flex flex-col min-h-0",
            enableMobileToggle && showMobileSelected ? "hidden sm:flex" : "flex"
          )}
        >
          {/* Search input */}
          {enableSearch && (
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-10 h-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Course List */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-foreground">
                {isSearchMode ? t.searchResultsTitle : t.availableCoursesTitle}
              </h3>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              {activeQuery.isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <CourseSelectionSkeleton key={i} />
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <CourseSelectionEmptyState
                  isSearchMode={isSearchMode}
                  searchQuery={debouncedSearchQuery}
                  onClearSearch={clearSearch}
                />
              ) : (
                <div
                  className={cn(
                    "space-y-3",
                    activeQuery.isPreviousData && "opacity-70"
                  )}
                >
                  {courses.map((course, index) => (
                    <CourseSelectionCard
                      key={`${course.id}-${index}`}
                      course={course}
                      isSelected={isCurrentlySelected(course.id)}
                      isPreviouslySelected={isPreviouslySelected(course.id)}
                      onAdd={() => handleAddCourse(course)}
                      onRemove={() => handleRemoveCourse(course.id)}
                      canAddMore={canAddMore}
                      variant="available"
                      allowRemovePrevious={allowRemovePrevious}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination && (
              <CourseSelectionPagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                isLoading={activeQuery.isPreviousData}
              />
            )}

            {/* Loading indicator */}
            {activeQuery.isPreviousData && (
              <div className="flex items-center justify-center mt-2">
                <div className="text-xs text-muted-foreground">
                  {t.loadingText}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Courses */}
        <div
          className={cn(
            "sm:col-span-2 flex flex-col max-h-[500px]",
            enableMobileToggle && !showMobileSelected
              ? "hidden sm:flex"
              : "flex"
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">
              {t.selectedCoursesTitle}
            </h3>
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              {hasLimit
                ? `${convertNumberToBangla(
                    allSelectedCourses.length
                  )}/${convertNumberToBangla(effectiveMaxSelections)}`
                : convertNumberToBangla(allSelectedCourses.length)}
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto mb-4">
            {allSelectedCourses.length === 0 ? (
              <Card className="border-dashed border-2 border-muted">
                <CardContent className="flex items-center justify-center py-6">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">
                      {t.emptySelectionMessage}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {hasLimit
                        ? activePreviousCount > 0
                          ? replaceTextPlaceholders(
                              t.emptySelectionSubMessageWithPrevious!,
                              {
                                remainingSlots,
                              }
                            )
                          : replaceTextPlaceholders(
                              t.emptySelectionSubMessage!,
                              {
                                maxSelections: effectiveMaxSelections,
                              }
                            )
                        : null}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {allSelectedCourses.map((course) => (
                  <CourseSelectionCard
                    key={course.id}
                    course={course}
                    isSelected={true}
                    isPreviouslySelected={course.isPreviouslySelected}
                    onAdd={() => {}}
                    onRemove={() => handleRemoveCourse(course.id)}
                    canAddMore={false}
                    variant="selected"
                    allowRemovePrevious={allowRemovePrevious}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="w-full h-10"
              size="sm"
            >
              {isSubmitting ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                t.submitButtonText
              )}
            </Button>

            {/* Info Card */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                {hasLimit
                  ? selectedCourses.length === 0 &&
                    removedPreviousIds.length === 0
                    ? activePreviousCount > 0
                      ? replaceTextPlaceholders(t.remainingSlotsMessage!, {
                          remainingSlots,
                        })
                      : replaceTextPlaceholders(t.emptySelectionSubMessage!, {
                          maxSelections: effectiveMaxSelections,
                        })
                    : totalSelectedCount < effectiveMaxSelections
                    ? replaceTextPlaceholders(t.remainingSlotsMessage!, {
                        remainingSlots:
                          effectiveMaxSelections - totalSelectedCount,
                      })
                    : t.maxSelectionCompletedMessage
                  : // No limit case
                  selectedCourses.length === 0 &&
                    removedPreviousIds.length === 0
                  ? ""
                  : `মোট নির্বাচিত: ${convertNumberToBangla(
                      totalSelectedCount
                    )}টি কোর্স`}
              </p>
              {activePreviousCount > 0 && (
                <p className="text-xs text-muted-foreground text-center mt-1">
                  আগে নির্বাচিত: {convertNumberToBangla(activePreviousCount)}টি
                  কোর্স
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
