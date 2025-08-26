// "use client";
// import CourseCard from "@/components/CourseCard";
// import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
// import { usePathname, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import CoursesSidebar from "./CoursesSidebar";
// import { Button } from "@/components/ui/button";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import Link from "next/link";
// import { Loader } from "lucide-react";
// import SidebarSheetComponent from "./SidebarSheetComponent";
// import { GeneralFilterSelect } from "./SelectFilterOption";

// const CourseWrapper = ({ initalData, categories, pagination }: any) => {
//   const [courses, setCourses] = useState(initalData || []);
//   const [showSidebar, setShowSidebar] = useState<boolean>(false);
//   const toggleSidebarHandler = () => setShowSidebar((prev) => !prev);
//   const [limit, setLimit] = useState<number>(pagination?.limit || 24);
//   const [sort, setSort] = useState<string>("desc");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const updateQueryParam = useUpdateQueryParam();
//   const path = usePathname();
//   const searchParams = useSearchParams();
//   const categoryParam = searchParams.get("category");

//   const loadMoreCourseHandler = async () => {
//     setIsLoading(true);
//     const incrementedLimit = limit + 9;
//     setLimit(incrementedLimit);
//     updateQueryParam("limit", incrementedLimit.toString());
//   };

//   useEffect(() => {
//     if (courses?.length > 0) {
//       setIsLoading(false);
//     }
//   }, [courses]);

//   const selectedCategory = categories.find(
//     (category) => category.slug === categoryParam
//   );

//   return (
//     <section className="min-h-[50vh]">
//       {/* breadcrumbs */}
//       <div className="border-b border-gray-100 py-6">
//         <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-6 xl:px-6 2xl:px-0">
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbLink asChild>
//                   <Link
//                     href="/"
//                     className="text-sm font-medium underline  underline-offset-4 sm:text-base text-fontcolor-title hover:text-primary-brand"
//                   >
//                     হোম
//                   </Link>
//                 </BreadcrumbLink>
//               </BreadcrumbItem>

//               <BreadcrumbSeparator />
//               <BreadcrumbItem>কোর্স</BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 {selectedCategory ? selectedCategory.name : "সকল কোর্স"}
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </div>
//       </div>

//       <div className="flex py-6 sm:py-[60px] lg:space-x-5 app-container gap-x-[6px]">
//         {/* Desktop Sidebar */}
//         <div className="hidden lg:block lg:w-1/4">
//           <CoursesSidebar
//             toggleSidebar={toggleSidebarHandler}
//             categories={categories}
//             isMobile={false}
//           />
//         </div>

//         <div className="w-full lg:w-3/4">
//           {/* title for small screen */}
//           <div className="block mb-3 xm:mb-0 lg:hidden">
//             <p className="text-black font-secondary font-semibold">
//               {selectedCategory ? selectedCategory.name : "সকল কোর্স"}
//             </p>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center ">
//               {/* Mobile/Tablet Sheet Sidebar Trigger - Only one instance */}
//               <SidebarSheetComponent
//                 categories={categories}
//                 setShowSidebar={setShowSidebar}
//                 showSidebar={showSidebar}
//                 toggleSidebarHandler={toggleSidebarHandler}
//               />
//               {/* title for large screen */}
//               <div className="hidden lg:block ">
//                 <p className="text-black font-semibold text-2xl">
//                   {selectedCategory ? selectedCategory.name : "সকল কোর্স"}
//                 </p>
//               </div>
//             </div>
//             <GeneralFilterSelect />
//           </div>

//           {/* Courses Card */}
//           <div className="grid grid-cols-1 gap-4 md:gap-y-[50px] gap-y-4 my-3 sm:grid-cols-2 md:grid-cols-3 mt-5">
//             {courses?.length > 0 ? (
//               courses?.map((course: any) => (
//                 <CourseCard
//                   key={course?.id}
//                   variant="light"
//                   course={course}
//                   instructor={course?.teacherProfile?.user?.name}
//                 />
//               ))
//             ) : (
//               <div className="flex items-center justify-center px-8 border-2 border-gray-300 border-dashed rounded-lg py-28 col-span-full">
//                 <div className="text-center text-gray-500">
//                   দুঃখিত! কোনো কোর্স পাওয়া যায় নি।
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* View More button */}
//           {pagination?.hasNextPage && (
//             <div className="flex items-center justify-center pt-5">
//               <Button
//                 onClick={loadMoreCourseHandler}
//                 disabled={isLoading}
//                 className="py-3 text-gray-500 min-w-[106px] relative"
//                 variant={"outline"}
//               >
//                 {isLoading ? (
//                   <Loader className="animate-spin h-5 w-5" />
//                 ) : (
//                   "আরও দেখুন"
//                 )}
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CourseWrapper;

// ------------------v2------------------------
"use client";
import CourseCard from "@/components/CourseCard";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CoursesSidebar from "./CoursesSidebar";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Loader } from "lucide-react";
import SidebarSheetComponent from "./SidebarSheetComponent";
import { GeneralFilterSelect } from "./SelectFilterOption";

const CourseWrapper = ({ initalData, categories, pagination }: any) => {
  const [courses, setCourses] = useState(initalData || []);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const toggleSidebarHandler = () => setShowSidebar((prev) => !prev);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("desc");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginationData, setPaginationData] = useState(pagination);
  const path = usePathname();
  const searchParams = useSearchParams();

  const loadMoreCourseHandler = async () => {
    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;

      // Build query parameters based on your existing API
      const queryParams = new URLSearchParams({
        page: nextPage.toString(),
        limit: paginationData.limit.toString(),
        sort: sort,
      });

      // Fetch more courses from your existing API
      const response = await fetch(`/api/courses?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();

      if (data.courses) {
        // Append new courses to existing ones
        setCourses((prevCourses: any[]) => [...prevCourses, ...data.courses]);
        setPaginationData(data.pagination);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset courses when filters change
  useEffect(() => {
    setCourses(initalData || []);
    setCurrentPage(1);
    setPaginationData(pagination);
  }, [initalData, pagination]);

  useEffect(() => {
    if (!searchParams.get("limit")) {
      // Handle any default limit logic if needed
    }
  }, [sort, path, searchParams]);


  return (
    <section className="min-h-[50vh]">
      {/* breadcrumbs */}
      <div className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-6 xl:px-6 2xl:px-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-sm font-medium underline  underline-offset-4 sm:text-base text-fontcolor-title hover:text-primary-brand"
                  >
                    হোম
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>কোর্স</BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex py-6 sm:py-[60px] lg:space-x-5 app-container gap-x-[6px]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-1/4">
          <CoursesSidebar
            toggleSidebar={toggleSidebarHandler}
            categories={categories}
            isMobile={false}
          />
        </div>

        <div className="w-full lg:w-3/4">
          {/* title for small screen */}
          <div className="block mb-3 xm:mb-0 lg:hidden">
            <p className="text-black font-secondary font-semibold">
               সকল কোর্স
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center ">
              {/* Mobile/Tablet Sheet Sidebar Trigger - Only one instance */}
              <SidebarSheetComponent
                categories={categories}
                setShowSidebar={setShowSidebar}
                showSidebar={showSidebar}
                toggleSidebarHandler={toggleSidebarHandler}
              />
              {/* title for large screen */}
              <div className="hidden lg:block ">
                <p className="text-black font-semibold text-2xl">
                 সকল কোর্স
                </p>
              </div>
            </div>
            <GeneralFilterSelect />
          </div>

          {/* Courses Card */}
          <div className="grid grid-cols-1 gap-4 md:gap-y-[50px] gap-y-4 my-3 sm:grid-cols-2 md:grid-cols-3 mt-5">
            {courses?.length > 0 ? (
              courses?.map((course: any) => (
                <CourseCard
                  key={course?.id}
                  variant="light"
                  course={course}
                  instructor={course?.teacherProfile?.user?.name}
                />
              ))
            ) : (
              <div className="flex items-center justify-center px-8 border-2 border-gray-300 border-dashed rounded-lg py-28 col-span-full">
                <div className="text-center text-gray-500">
                  দুঃখিত! কোনো কোর্স পাওয়া যায় নি।
                </div>
              </div>
            )}
          </div>

          {/* View More button */}
          {paginationData?.hasNextPage && (
            <div className="flex items-center justify-center pt-5">
              <Button
                onClick={loadMoreCourseHandler}
                disabled={isLoading}
                className="py-3 text-gray-500 min-w-[106px] relative"
                variant={"outline"}
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  "আরও দেখুন"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CourseWrapper;
