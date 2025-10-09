// // @ts-nocheck
// "use client";

// import { useState, useCallback, useEffect, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Button, buttonVariants } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   Minus,
//   Search,
//   X,
//   Loader,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import Image from "next/image";
// import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
// import { clientApi } from "@/lib/utils/openai/client";
// import { useTrialContext } from "@/hooks/useTrialContext";

// // Enhanced type definitions
// interface Course {
//   id: string;
//   title: string;
//   slug: string;
//   description?: string;
//   imageUrl?: string;
//   totalDuration?: number;
//   courseType: string;
//   courseMode: string;
//   category?: {
//     name: string;
//     slug: string;
//   };
//   teacherProfile: {
//     user: {
//       name: string;
//       email: string;
//     };
//   };
//   prices: Array<{
//     regularAmount: number;
//     discountedAmount?: number;
//     isFree: boolean;
//   }>;
//   _count: {
//     lessons: number;
//     enrolledStudents: number;
//   };
//   isPurchased?: boolean;
// }

// interface Pagination {
//   currentPage: number;
//   totalPages: number;
//   totalCount: number;
//   hasNextPage: boolean;
//   hasPrevPage: boolean;
// }

// interface RegularCoursesResponse {
//   courses: Course[];
//   pagination: Pagination;
// }

// interface SearchApiResponse {
//   success: boolean;
//   data: {
//     courses: Course[];
//     pagination: Pagination;
//     searchType: string;
//   };
// }

// interface CourseSelectionProps {
//   className?: string;
//   maxSelections?: number;
// }

// interface CourseCardProps {
//   course: Course;
//   isSelected: boolean;
//   onAdd: () => void;
//   onRemove: () => void;
//   canAddMore: boolean;
//   variant?: "available" | "selected";
// }

// // Constants
// const DEFAULT_LIMIT = 8;
// const SEARCH_DEBOUNCE_DELAY = 500;
// const MOBILE_BREAKPOINT = 768;

// // Custom hooks
// function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// }

// function useWindowSize() {
//   const [windowSize, setWindowSize] = useState({
//     width: typeof window !== "undefined" ? window.innerWidth : 0,
//   });

//   useEffect(() => {
//     function handleResize() {
//       setWindowSize({
//         width: window.innerWidth,
//       });
//     }

//     if (typeof window !== "undefined") {
//       window.addEventListener("resize", handleResize);
//       handleResize();

//       return () => window.removeEventListener("resize", handleResize);
//     }
//   }, []);

//   return windowSize;
// }

// // API functions
// const fetchCourses = async (
//   page: number,
//   limit: number = DEFAULT_LIMIT
// ): Promise<RegularCoursesResponse> => {
//   const response = await clientApi.getCoursesQuery({
//     query: {
//       page,
//       limit,
//       sort: "desc",
//       isUnderSubscription: true,
//     },
//   });

//   if (response.status !== 200) {
//     throw new Error("কোর্স লোড করতে ব্যর্থ হয়েছে");
//   }

//   return response.body;
// };

// const searchCourses = async (
//   query: string,
//   page: number = 1,
//   limit: number = DEFAULT_LIMIT
// ): Promise<SearchApiResponse> => {
//   try {
//     const response = await clientApi.searchCourses({
//       query: {
//         q: query,
//         page: page.toString(),
//         limit: limit.toString(),
//         published: "true",
//         advanced: "true",
//         isUnderSubscription: "true",
//       },
//     });

//     if (response.status === 200) {
//       return response.body;
//     }

//     // Handle error responses
//     if (response.status === 400 || response.status === 500) {
//       throw new Error(response.body.error || "কোর্স খুঁজে পেতে ব্যর্থ হয়েছে");
//     }

//     throw new Error("কোর্স খুঁজে পেতে ব্যর্থ হয়েছে");
//   } catch (error) {
//     // Re-throw with Bengali error message if it's a network error
//     if (error instanceof Error && !error.message.includes("কোর্স")) {
//       throw new Error("কোর্স খুঁজে পেতে ব্যর্থ হয়েছে");
//     }
//     throw error;
//   }
// };

// // Components
// function CourseSkeleton() {
//   return (
//     <Card className="animate-pulse">
//       <div className="p-3">
//         <div className="flex items-center justify-between gap-3">
//           <div className="flex items-center gap-3 flex-1 min-w-0">
//             <div className="w-12 h-12 sm:w-14 sm:h-15 bg-muted rounded flex-shrink-0" />
//             <div className="flex-1 space-y-2">
//               <div className="h-4 bg-muted rounded w-3/4" />
//               <div className="h-3 bg-muted rounded w-1/2" />
//             </div>
//           </div>
//           <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded flex-shrink-0" />
//         </div>
//       </div>
//     </Card>
//   );
// }

// function CourseCard({
//   course,
//   isSelected,
//   onAdd,
//   onRemove,
//   canAddMore,
//   variant = "available",
// }: CourseCardProps) {
//   const actionButton = useMemo(() => {
//     if (variant === "selected") {
//       return (
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={onRemove}
//           className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
//           aria-label="Remove course"
//         >
//           <Minus className="h-4 w-4" />
//         </Button>
//       );
//     }

//     if (isSelected) {
//       return (
//         <div
//           className={cn(
//             buttonVariants({ variant: "secondary", size: "sm" }),
//             "text-xs px-2 h-8"
//           )}
//         >
//           নির্বাচিত
//         </div>
//       );
//     }

//     return (
//       <Button
//         onClick={onAdd}
//         disabled={!canAddMore}
//         variant="primary"
//         size="sm"
//         className="h-8 w-8 p-0"
//         aria-label="Add course"
//       >
//         <Plus className="h-3 w-3" />
//       </Button>
//     );
//   }, [variant, isSelected, onAdd, onRemove, canAddMore]);

//   return (
//     <Card
//       className={cn(
//         "group transition-all duration-200",
//         variant === "selected"
//           ? "border-primary/20 bg-primary/5"
//           : "hover:shadow-md"
//       )}
//     >
//       <div className="p-3">
//         <div className="flex items-start justify-between gap-3">
//           <div className="flex items-start gap-3 flex-1 min-w-0">
//             {course?.imageUrl && (
//               <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
//                 <Image
//                   src={course.imageUrl}
//                   alt={course?.title}
//                   width={300}
//                   height={300}
//                   className="w-full h-full object-cover rounded"
//                 />
//               </div>
//             )}
//             <div className="flex-1 min-w-0">
//               <h3 className="font-medium text-sm leading-tight mb-1 line-clamp-2 break-words">
//                 {course?.title}
//               </h3>
//               <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-2">
//                 <span className="truncate">
//                   {course?.teacherProfile?.user.name}
//                 </span>
//                 <div className="flex items-center gap-2">
//                   {course?._count?.lessons ? (
//                     <span>
//                       {convertNumberToBangla(course?._count?.lessons)}টি লেসন
//                     </span>
//                   ) : null}
//                   {course?._count?.enrolledStudents > 0 && (
//                     <>
//                       <span>•</span>
//                       <span>
//                         {convertNumberToBangla(
//                           course?._count?.enrolledStudents
//                         )}{" "}
//                         শিক্ষার্থী
//                       </span>
//                     </>
//                   )}
//                 </div>
//               </div>
//               {variant === "available" && (
//                 <Link
//                   href={`/courses/${course?.slug}`}
//                   className="text-brand hover:underline text-xs inline-block"
//                   onClick={(e) => e.stopPropagation()}
//                   target="_blank"
//                 >
//                   বিস্তারিত
//                 </Link>
//               )}
//             </div>
//           </div>
//           <div className="flex-shrink-0">{actionButton}</div>
//         </div>
//       </div>
//     </Card>
//   );
// }

// function EmptyState({
//   isSearchMode,
//   searchQuery,
//   onClearSearch,
// }: {
//   isSearchMode: boolean;
//   searchQuery: string;
//   onClearSearch: () => void;
// }) {
//   return (
//     <Card className="border-dashed border-2 border-muted">
//       <CardContent className="flex items-center justify-center py-8">
//         <div className="text-center">
//           <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
//           <p className="text-muted-foreground text-sm">
//             {isSearchMode
//               ? `"${searchQuery}" এর জন্য কোন কোর্স পাওয়া যায়নি`
//               : "কোন কোর্স পাওয়া যায়নি"}
//           </p>
//           {isSearchMode && (
//             <Button
//               variant="outline"
//               onClick={onClearSearch}
//               className="mt-3"
//               size="sm"
//             >
//               সব কোর্স দেখুন
//             </Button>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function Pagination({
//   pagination,
//   currentPage,
//   onPageChange,
//   isLoading,
// }: {
//   pagination: Pagination;
//   currentPage: number;
//   onPageChange: (page: number) => void;
//   isLoading: boolean;
// }) {
//   const { width } = useWindowSize();

//   const pageNumbers = useMemo(() => {
//     const totalPages = pagination.totalPages;
//     const current = currentPage;
//     const pages: number[] = [];

//     // For mobile, show fewer pages
//     const isMobile = width < MOBILE_BREAKPOINT;
//     const maxPages = isMobile ? 3 : 5;
//     const start = Math.max(1, current - Math.floor(maxPages / 2));
//     const end = Math.min(totalPages, start + maxPages - 1);

//     for (let i = start; i <= end; i++) {
//       pages.push(i);
//     }

//     return pages;
//   }, [pagination.totalPages, currentPage, width]);

//   if (pagination.totalPages <= 1) return null;

//   return (
//     <div className="flex items-center justify-center gap-1 mt-4 pt-3 border-t">
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={!pagination.hasPrevPage || isLoading}
//         className="h-8 px-2"
//       >
//         <ChevronLeft className="h-3 w-3" />
//         <span className="hidden xs:inline ml-1">পূর্ববর্তী</span>
//       </Button>

//       <div className="flex items-center gap-1">
//         {pageNumbers.map((pageNum) => (
//           <Button
//             key={pageNum}
//             variant={pageNum === currentPage ? "default" : "outline"}
//             size="sm"
//             onClick={() => onPageChange(pageNum)}
//             disabled={isLoading}
//             className="w-8 h-8 p-0 text-xs"
//           >
//             {convertNumberToBangla(pageNum)}
//           </Button>
//         ))}
//       </div>

//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={!pagination.hasNextPage || isLoading}
//         className="h-8 px-2"
//       >
//         <span className="hidden xs:inline mr-1">পরবর্তী</span>
//         <ChevronRight className="h-3 w-3" />
//       </Button>
//     </div>
//   );
// }

// // Main component
// export function CourseSelection({
//   className,
//   maxSelections = 3,
// }: CourseSelectionProps) {
//   const { submitTrialCourses, isSubmitting, subscription } = useTrialContext();
//   const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showMobileSelected, setShowMobileSelected] = useState(false);

//   const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_DELAY);
//   const isSearchMode = debouncedSearchQuery.trim().length > 0;

//   // Reset page when search query changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [debouncedSearchQuery]);

//   // Queries
//   const regularCoursesQuery = useQuery({
//     queryKey: ["courses", currentPage, DEFAULT_LIMIT],
//     queryFn: () => fetchCourses(currentPage, DEFAULT_LIMIT),
//     enabled: !isSearchMode,
//     keepPreviousData: true,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//   });

//   const searchCoursesQuery = useQuery({
//     queryKey: [
//       "search-courses",
//       debouncedSearchQuery,
//       currentPage,
//       DEFAULT_LIMIT,
//     ],
//     queryFn: () =>
//       searchCourses(debouncedSearchQuery, currentPage, DEFAULT_LIMIT),
//     enabled: isSearchMode,
//     keepPreviousData: false,
//     staleTime: 2 * 60 * 1000,
//   });

//   // Derived state
//   const activeQuery = isSearchMode ? searchCoursesQuery : regularCoursesQuery;

//   const { courses, pagination } = useMemo(() => {
//     if (isSearchMode && searchCoursesQuery.data) {
//       return {
//         courses: searchCoursesQuery.data.data.courses || [],
//         pagination: searchCoursesQuery.data.data.pagination,
//       };
//     }

//     if (!isSearchMode && regularCoursesQuery.data) {
//       return {
//         courses: regularCoursesQuery.data.courses || [],
//         pagination: regularCoursesQuery.data.pagination,
//       };
//     }

//     return { courses: [], pagination: null };
//   }, [isSearchMode, searchCoursesQuery.data, regularCoursesQuery.data]);

//   const canAddMore = selectedCourses.length < maxSelections;
//   const canSubmit = selectedCourses.length === maxSelections;

//   // Event handlers
//   const handleAddCourse = useCallback(
//     (course: Course) => {
//       if (canAddMore && !selectedCourses.find((c) => c.id === course.id)) {
//         setSelectedCourses((prev) => [...prev, course]);
//       }
//     },
//     [canAddMore, selectedCourses]
//   );

//   const handleRemoveCourse = useCallback((courseId: string) => {
//     setSelectedCourses((prev) => prev.filter((c) => c.id !== courseId));
//   }, []);

//   const isSelected = useCallback(
//     (courseId: string) => {
//       return selectedCourses.some((c) => c.id === courseId);
//     },
//     [selectedCourses]
//   );

//   const handleSubmit = useCallback(async () => {
//     const courseIds = selectedCourses.map((course) => course.id);
//     await submitTrialCourses(courseIds);
//   }, [selectedCourses, submitTrialCourses]);

//   const handleSearchChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setSearchQuery(e.target.value);
//     },
//     []
//   );

//   const clearSearch = useCallback(() => {
//     setSearchQuery("");
//     setCurrentPage(1);
//   }, []);

//   const handlePageChange = useCallback((page: number) => {
//     setCurrentPage(page);
//   }, []);

//   // Error state
//   if (activeQuery.isError) {
//     return (
//       <div className={cn("w-full h-full p-4", className)}>
//         <Card className="border-destructive">
//           <CardContent className="p-6 text-center">
//             <p className="text-destructive text-sm">
//               ত্রুটি:{" "}
//               {activeQuery.error instanceof Error
//                 ? activeQuery.error.message
//                 : "কোর্স লোড করতে সমস্যা হয়েছে"}
//             </p>
//             <Button
//               onClick={() => activeQuery.refetch()}
//               className="mt-4"
//               variant="outline"
//               size="sm"
//             >
//               আবার চেষ্টা করুন
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className={cn("w-full h-full flex flex-col", className)}>
//       {/* Header */}
//       <div className="mb-4 text-center px-1">
//         <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
//           প্রাইম কোর্স নির্বাচন করুন
//         </h2>
//         <p className="text-xs sm:text-sm text-muted-foreground">
//           {convertNumberToBangla(maxSelections)}টি কোর্স বেছে নিন। নির্বাচিত:{" "}
//           <span className="font-medium">
//             {convertNumberToBangla(selectedCourses.length)}/
//             {convertNumberToBangla(maxSelections)}
//           </span>
//         </p>
//       </div>

//       {/* Mobile Toggle Buttons */}
//       <div className="flex sm:hidden mb-4 bg-muted rounded-lg p-1">
//         <button
//           onClick={() => setShowMobileSelected(false)}
//           className={cn(
//             "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
//             !showMobileSelected
//               ? "bg-background text-foreground shadow-sm"
//               : "text-muted-foreground hover:text-foreground"
//           )}
//         >
//           প্রাইম কোর্সসমূহ
//         </button>
//         <button
//           onClick={() => setShowMobileSelected(true)}
//           className={cn(
//             "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors relative",
//             showMobileSelected
//               ? "bg-background text-foreground shadow-sm"
//               : "text-muted-foreground hover:text-foreground"
//           )}
//         >
//           নির্বাচিত
//           {selectedCourses.length > 0 && (
//             <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
//               {selectedCourses.length}
//             </span>
//           )}
//         </button>
//       </div>

//       <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//         {/* Available Courses */}
//         <div
//           className={cn(
//             "sm:col-span-2 flex flex-col min-h-0",
//             showMobileSelected ? "hidden sm:flex" : "flex"
//           )}
//         >
//           {/* Search input */}
//           <div className="mb-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
//               <Input
//                 type="text"
//                 placeholder="কোর্স খুঁজুন..."
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 className="pl-10 pr-10 h-9"
//               />
//               {searchQuery && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={clearSearch}
//                   className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
//                   aria-label="Clear search"
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* Course List */}
//           <div className="flex-1 min-h-0 flex flex-col">
//             <div className="mb-3">
//               <h3 className="text-sm font-medium text-foreground">
//                 {isSearchMode ? "খোঁজার ফলাফল" : "প্রাইম কোর্সসমূহ"}
//               </h3>
//             </div>

//             <div className="flex-1 min-h-0 overflow-y-auto">
//               {activeQuery.isLoading ? (
//                 <div className="space-y-3">
//                   {Array.from({ length: 6 }, (_, i) => (
//                     <CourseSkeleton key={i} />
//                   ))}
//                 </div>
//               ) : courses.length === 0 ? (
//                 <EmptyState
//                   isSearchMode={isSearchMode}
//                   searchQuery={debouncedSearchQuery}
//                   onClearSearch={clearSearch}
//                 />
//               ) : (
//                 <div
//                   className={cn(
//                     "space-y-3",
//                     activeQuery.isPreviousData && "opacity-70"
//                   )}
//                 >
//                   {courses.map((course, index) => (
//                     <CourseCard
//                       key={`${course.id}-${index}`}
//                       course={course}
//                       isSelected={isSelected(course.id)}
//                       onAdd={() => handleAddCourse(course)}
//                       onRemove={() => handleRemoveCourse(course.id)}
//                       canAddMore={canAddMore}
//                       variant="available"
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Pagination */}
//             {pagination && (
//               <Pagination
//                 pagination={pagination}
//                 currentPage={currentPage}
//                 onPageChange={handlePageChange}
//                 isLoading={activeQuery.isPreviousData}
//               />
//             )}

//             {/* Loading indicator */}
//             {activeQuery.isPreviousData && (
//               <div className="flex items-center justify-center mt-2">
//                 <div className="text-xs text-muted-foreground">
//                   লোড হচ্ছে...
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Selected Courses */}
//         <div
//           className={cn(
//             "sm:col-span-1 flex flex-col min-h-0",
//             !showMobileSelected ? "hidden sm:flex" : "flex"
//           )}
//         >
//           <div className="mb-3 flex items-center justify-between">
//             <h3 className="text-sm font-medium text-foreground">
//               নির্বাচিত কোর্স
//             </h3>
//             <span className="text-xs bg-muted px-2 py-1 rounded-full">
//               {convertNumberToBangla(selectedCourses.length)}/
//               {convertNumberToBangla(maxSelections)}
//             </span>
//           </div>

//           <div className="flex-1 min-h-0 overflow-y-auto mb-4">
//             {selectedCourses.length === 0 ? (
//               <Card className="border-dashed border-2 border-muted">
//                 <CardContent className="flex items-center justify-center py-6">
//                   <div className="text-center">
//                     <p className="text-muted-foreground text-xs">
//                       এখনো কোন কোর্স নির্বাচন করা হয়নি
//                     </p>
//                     <p className="text-muted-foreground text-xs mt-1">
//                       {convertNumberToBangla(maxSelections)}টি কোর্স বেছে নিন
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="space-y-3">
//                 {selectedCourses.map((course) => (
//                   <CourseCard
//                     key={course.id}
//                     course={course}
//                     isSelected={true}
//                     onAdd={() => {}}
//                     onRemove={() => handleRemoveCourse(course.id)}
//                     canAddMore={false}
//                     variant="selected"
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div className="space-y-3">
//             <Button
//               onClick={handleSubmit}
//               disabled={!canSubmit || isSubmitting}
//               className="w-full h-10"
//               size="sm"
//               variant={!canSubmit || isSubmitting ? "disabled" : "primary"}
//             >
//               {isSubmitting ? (
//                 <Loader size={16} className="animate-spin" />
//               ) : canSubmit ? (
//                 "সাবমিট"
//               ) : (
//                 `আরো ${convertNumberToBangla(
//                   maxSelections - selectedCourses.length
//                 )}টি নির্বাচন করুন`
//               )}
//             </Button>

//             {selectedCourses.length > 0 && (
//               <div className="p-3 bg-muted rounded-lg">
//                 <p className="text-xs text-muted-foreground text-center">
//                   {selectedCourses.length < maxSelections
//                     ? `আপনার আরো ${convertNumberToBangla(
//                         maxSelections - selectedCourses.length
//                       )}টি কোর্স নির্বাচন করতে হবে।`
//                     : "চমৎকার! এখন আপনি আপনার নির্বাচন জমা দিতে পারেন।"}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// =====================================
//  Version 2
// =====================================
// // @ts-nocheck
// "use client";
// import { useState, useCallback, useEffect, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Search, X, Loader } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
// import { clientApi } from "@/lib/utils/openai/client";
// import { useTrialContext } from "@/hooks/useTrialContext";

// import { CourseSelectionCard } from "./course-selection-card";
// import { CourseSelectionEmptyState } from "./course-selection-empty-state";
// import { CourseSelectionSkeleton } from "./course-selection-skeleton";
// import { CourseSelectionPagination } from "./course-selection-pagination";
// import { useDebounce } from "@/hooks/use-debounce";

// // Enhanced type definitions
// interface Course {
//   id: string;
//   title: string;
//   slug: string;
//   description?: string;
//   imageUrl?: string;
//   totalDuration?: number;
//   courseType: string;
//   courseMode: string;
//   category?: {
//     name: string;
//     slug: string;
//   };
//   teacherProfile: {
//     user: {
//       name: string;
//       email: string;
//     };
//   };
//   prices: Array<{
//     regularAmount: number;
//     discountedAmount?: number;
//     isFree: boolean;
//   }>;
//   _count: {
//     lessons: number;
//     enrolledStudents: number;
//   };
//   isPurchased?: boolean;
// }

// interface Pagination {
//   currentPage: number;
//   totalPages: number;
//   totalCount: number;
//   hasNextPage: boolean;
//   hasPrevPage: boolean;
// }

// interface RegularCoursesResponse {
//   courses: Course[];
//   pagination: Pagination;
// }

// interface SearchApiResponse {
//   success: boolean;
//   data: {
//     courses: Course[];
//     pagination: Pagination;
//     searchType: string;
//   };
// }

// interface CourseSelectionProps {
//   className?: string;
//   maxSelections?: number;
// }

// // Constants
// const DEFAULT_LIMIT = 8;
// const SEARCH_DEBOUNCE_DELAY = 500;

// // API functions
// const fetchCourses = async (
//   page: number,
//   limit: number = DEFAULT_LIMIT
// ): Promise<RegularCoursesResponse> => {
//   const response = await clientApi.getCoursesQuery({
//     query: {
//       page,
//       limit,
//       sort: "desc",
//       isUnderSubscription: true,
//     },
//   });

//   if (response.status !== 200) {
//     throw new Error("কোর্স লোড করতে ব্যর্থ হয়েছে");
//   }

//   return response.body;
// };

// const searchCourses = async (
//   query: string,
//   page: number = 1,
//   limit: number = DEFAULT_LIMIT
// ): Promise<SearchApiResponse> => {
//   try {
//     const response = await clientApi.searchCourses({
//       query: {
//         q: query,
//         page: page.toString(),
//         limit: limit.toString(),
//         published: "true",
//         advanced: "true",
//         isUnderSubscription: "true",
//       },
//     });

//     if (response.status === 200) {
//       return response.body;
//     }

//     if (response.status === 400 || response.status === 500) {
//       throw new Error(response.body.error || "কোর্স খুঁজে পেতে ব্যর্থ হয়েছে");
//     }

//     throw new Error("কোর্স খুঁজে পেতে ব্যর্থ হয়েছে");
//   } catch (error) {
//     if (error instanceof Error && !error.message.includes("কোর্স")) {
//       throw new Error("কোর্স খুঁজে পেতে ব্যর্থ হয়েছে");
//     }
//     throw error;
//   }
// };

// // Main component
// export function CourseSelection({
//   className,
//   maxSelections = 3,
// }: CourseSelectionProps) {
//   const { submitTrialCourses, isSubmitting, closeTrialModal } =
//     useTrialContext();
//   const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showMobileSelected, setShowMobileSelected] = useState(false);

//   const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_DELAY);
//   const isSearchMode = debouncedSearchQuery.trim().length > 0;

//   // Reset page when search query changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [debouncedSearchQuery]);

//   // Queries
//   const regularCoursesQuery = useQuery({
//     queryKey: ["courses", currentPage, DEFAULT_LIMIT],
//     queryFn: () => fetchCourses(currentPage, DEFAULT_LIMIT),
//     enabled: !isSearchMode,
//     keepPreviousData: true,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//   });

//   const searchCoursesQuery = useQuery({
//     queryKey: [
//       "search-courses",
//       debouncedSearchQuery,
//       currentPage,
//       DEFAULT_LIMIT,
//     ],
//     queryFn: () =>
//       searchCourses(debouncedSearchQuery, currentPage, DEFAULT_LIMIT),
//     enabled: isSearchMode,
//     keepPreviousData: false,
//     staleTime: 2 * 60 * 1000,
//   });

//   // Derived state
//   const activeQuery = isSearchMode ? searchCoursesQuery : regularCoursesQuery;

//   const { courses, pagination } = useMemo(() => {
//     if (isSearchMode && searchCoursesQuery.data) {
//       return {
//         courses: searchCoursesQuery.data.data.courses || [],
//         pagination: searchCoursesQuery.data.data.pagination,
//       };
//     }

//     if (!isSearchMode && regularCoursesQuery.data) {
//       return {
//         courses: regularCoursesQuery.data.courses || [],
//         pagination: regularCoursesQuery.data.pagination,
//       };
//     }

//     return { courses: [], pagination: null };
//   }, [isSearchMode, searchCoursesQuery.data, regularCoursesQuery.data]);

//   const canAddMore = selectedCourses.length < maxSelections;
//   const hasSelectedCourses = selectedCourses.length > 0;
//   const canSubmit = hasSelectedCourses; // Now can submit with any number >= 1

//   // Event handlers
//   const handleAddCourse = useCallback(
//     (course: Course) => {
//       if (canAddMore && !selectedCourses.find((c) => c.id === course.id)) {
//         setSelectedCourses((prev) => [...prev, course]);
//       }
//     },
//     [canAddMore, selectedCourses]
//   );

//   const handleRemoveCourse = useCallback((courseId: string) => {
//     setSelectedCourses((prev) => prev.filter((c) => c.id !== courseId));
//   }, []);

//   const isSelected = useCallback(
//     (courseId: string) => {
//       return selectedCourses.some((c) => c.id === courseId);
//     },
//     [selectedCourses]
//   );

//   const handleSubmit = useCallback(async () => {
//     if (!hasSelectedCourses) return;

//     try {
//       const courseIds = selectedCourses.map((course) => course.id);
//       await submitTrialCourses(courseIds);
//       // Close modal after successful submission
//       closeTrialModal();
//     } catch (error) {
//       // Error handling is managed by the trial context
//       console.error("Failed to submit courses:", error);
//     }
//   }, [
//     selectedCourses,
//     submitTrialCourses,
//     hasSelectedCourses,
//     closeTrialModal,
//   ]);

//   const handleSearchChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setSearchQuery(e.target.value);
//     },
//     []
//   );

//   const clearSearch = useCallback(() => {
//     setSearchQuery("");
//     setCurrentPage(1);
//   }, []);

//   const handlePageChange = useCallback((page: number) => {
//     setCurrentPage(page);
//   }, []);


//   // Error state
//   if (activeQuery.isError) {
//     return (
//       <div className={cn("w-full h-full p-4", className)}>
//         <Card className="border-destructive">
//           <CardContent className="p-6 text-center">
//             <p className="text-destructive text-sm">
//               ত্রুটি:{" "}
//               {activeQuery.error instanceof Error
//                 ? activeQuery.error.message
//                 : "কোর্স লোড করতে সমস্যা হয়েছে"}
//             </p>
//             <Button
//               onClick={() => activeQuery.refetch()}
//               className="mt-4"
//               variant="outline"
//               size="sm"
//             >
//               আবার চেষ্টা করুন
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className={cn("w-full h-full flex flex-col", className)}>
//       {/* Header */}
//       <div className="mb-4 text-center px-1">
//         <div className="flex items-center justify-between mb-2">
//           <h2 className="text-lg sm:text-xl font-bold text-foreground">
//             প্রাইম কোর্স নির্বাচন করুন
//           </h2>
//         </div>
//         <p className="text-xs sm:text-sm text-muted-foreground">
//           সর্বোচ্চ {convertNumberToBangla(maxSelections)}টি কোর্স বেছে নিতে
//           পারবেন। নির্বাচিত:{" "}
//           <span className="font-medium">
//             {convertNumberToBangla(selectedCourses.length)}/
//             {convertNumberToBangla(maxSelections)}
//           </span>
//         </p>
//       </div>

//       {/* Mobile Toggle Buttons */}
//       <div className="flex sm:hidden mb-4 bg-muted rounded-lg p-1">
//         <button
//           onClick={() => setShowMobileSelected(false)}
//           className={cn(
//             "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
//             !showMobileSelected
//               ? "bg-background text-foreground shadow-sm"
//               : "text-muted-foreground hover:text-foreground"
//           )}
//         >
//           প্রাইম কোর্সসমূহ
//         </button>
//         <button
//           onClick={() => setShowMobileSelected(true)}
//           className={cn(
//             "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors relative",
//             showMobileSelected
//               ? "bg-background text-foreground shadow-sm"
//               : "text-muted-foreground hover:text-foreground"
//           )}
//         >
//           নির্বাচিত
//           {selectedCourses.length > 0 && (
//             <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
//               {selectedCourses.length}
//             </span>
//           )}
//         </button>
//       </div>

//       <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//         {/* Available Courses */}
//         <div
//           className={cn(
//             "sm:col-span-2 flex flex-col min-h-0",
//             showMobileSelected ? "hidden sm:flex" : "flex"
//           )}
//         >
//           {/* Search input */}
//           <div className="mb-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
//               <Input
//                 type="text"
//                 placeholder="কোর্স খুঁজুন..."
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 className="pl-10 pr-10 h-9"
//               />
//               {searchQuery && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={clearSearch}
//                   className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
//                   aria-label="Clear search"
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* Course List */}
//           <div className="flex-1 min-h-0 flex flex-col">
//             <div className="mb-3">
//               <h3 className="text-sm font-medium text-foreground">
//                 {isSearchMode ? "খোঁজার ফলাফল" : "প্রাইম কোর্সসমূহ"}
//               </h3>
//             </div>

//             <div className="flex-1 min-h-0 overflow-y-auto">
//               {activeQuery.isLoading ? (
//                 <div className="space-y-3">
//                   {Array.from({ length: 6 }, (_, i) => (
//                     <CourseSelectionSkeleton key={i} />
//                   ))}
//                 </div>
//               ) : courses.length === 0 ? (
//                 <CourseSelectionEmptyState
//                   isSearchMode={isSearchMode}
//                   searchQuery={debouncedSearchQuery}
//                   onClearSearch={clearSearch}
//                 />
//               ) : (
//                 <div
//                   className={cn(
//                     "space-y-3",
//                     activeQuery.isPreviousData && "opacity-70"
//                   )}
//                 >
//                   {courses.map((course, index) => (
//                     <CourseSelectionCard
//                       key={`${course.id}-${index}`}
//                       course={course}
//                       isSelected={isSelected(course.id)}
//                       onAdd={() => handleAddCourse(course)}
//                       onRemove={() => handleRemoveCourse(course.id)}
//                       canAddMore={canAddMore}
//                       variant="available"
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Pagination */}
//             {pagination && (
//               <CourseSelectionPagination
//                 pagination={pagination}
//                 currentPage={currentPage}
//                 onPageChange={handlePageChange}
//                 isLoading={activeQuery.isPreviousData}
//               />
//             )}

//             {/* Loading indicator */}
//             {activeQuery.isPreviousData && (
//               <div className="flex items-center justify-center mt-2">
//                 <div className="text-xs text-muted-foreground">
//                   লোড হচ্ছে...
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Selected Courses */}
//         <div
//           className={cn(
//             "sm:col-span-1 flex flex-col min-h-0",
//             !showMobileSelected ? "hidden sm:flex" : "flex"
//           )}
//         >
//           <div className="mb-3 flex items-center justify-between">
//             <h3 className="text-sm font-medium text-foreground">
//               নির্বাচিত কোর্স
//             </h3>
//             <span className="text-xs bg-muted px-2 py-1 rounded-full">
//               {convertNumberToBangla(selectedCourses.length)}/
//               {convertNumberToBangla(maxSelections)}
//             </span>
//           </div>

//           <div className="flex-1 min-h-0 overflow-y-auto mb-4">
//             {selectedCourses.length === 0 ? (
//               <Card className="border-dashed border-2 border-muted">
//                 <CardContent className="flex items-center justify-center py-6">
//                   <div className="text-center">
//                     <p className="text-muted-foreground text-xs">
//                       এখনো কোন কোর্স নির্বাচন করা হয়নি
//                     </p>
//                     <p className="text-muted-foreground text-xs mt-1">
//                       ১টি থেকে {convertNumberToBangla(maxSelections)}টি পর্যন্ত
//                       কোর্স বেছে নিন
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="space-y-3">
//                 {selectedCourses.map((course) => (
//                   <CourseSelectionCard
//                     key={course.id}
//                     course={course}
//                     isSelected={true}
//                     onAdd={() => {}}
//                     onRemove={() => handleRemoveCourse(course.id)}
//                     canAddMore={false}
//                     variant="selected"
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="space-y-3">
//             <Button
//               onClick={handleSubmit}
//               disabled={!canSubmit || isSubmitting}
//               className="w-full h-10"
//               size="sm"
//             >
//               {isSubmitting ? (
//                 <Loader size={16} className="animate-spin" />
//               ) : (
//                 "সেভ করুন"
//               )}
//             </Button>

//             {/* Info Card */}
//             <div className="p-3 bg-muted rounded-lg">
//               <p className="text-xs text-muted-foreground text-center">
//                 {selectedCourses.length === 0
//                   ? `আপনি ১টি থেকে ${convertNumberToBangla(
//                       maxSelections
//                     )}টি পর্যন্ত কোর্স নির্বাচন করতে পারেন।`
//                   : selectedCourses.length < maxSelections
//                   ? `আপনি আরো ${convertNumberToBangla(
//                       maxSelections - selectedCourses.length
//                     )}টি কোর্স নির্বাচন করতে পারেন।`
//                   : "আপনি সর্বোচ্চ সংখ্যক কোর্স নির্বাচন করেছেন।"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }