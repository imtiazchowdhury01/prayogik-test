"use client";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SectionTitle from "@/components/common/SectionTitle";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

// Course Card Component
export const CourseCard = ({
  course,
  blurDataMap,
}: {
  course: any;
  blurDataMap: any;
}) => {
  if (!course) {
    return (
      <div className="bg-transparent p-4 h-28 flex items-center justify-center">
        <span className="text-gray-400 text-sm">কোর্স নেই</span>
      </div>
    );
  }

  const hasValidCourseLink = course?.courseLink;
  const avatarUrl = course?.teacher?.user?.avatarUrl;
  const blurDataURL = avatarUrl ? blurDataMap[avatarUrl] : null;

  return (
    <div className="bg-transparent p-4 min-h-28 w-full flex items-start gap-3">
      {/* Instructor Image */}
      <div className="w-[118px] h-[118px] rounded-lg overflow-hidden flex-shrink-0">
        <div className="relative w-[118px] h-[118px] rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={avatarUrl || "/placeholder.svg?height=116&width=116"}
            alt={course?.teacher?.user?.name || "Instructor"}
            fill
            sizes="118px"
            className="object-cover"
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL || undefined}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg?height=116&width=116";
            }}
          />
        </div>
      </div>

      {/* Content in flex-col (vertical) */}
      <div className="flex-1 flex flex-col justify-between min-h-[116px] pl-3">
        <div className="flex-1">
          <div className="space-y-1">
            {/* Course Title */}
            <h4 className="font-bold line-clamp-2 leading-[1.4rem]">
              {course.title}
            </h4>

            {/* Instructor Name */}
            <p className="text-sm text-[#414B4A] truncate">
              {course?.teacher?.user?.name
                ? `ইন্সট্রাক্টর ${course?.teacher?.user?.name}`
                : "শিক্ষক নিযুক্ত হয়নি"}
            </p>
          </div>

          {/* Description */}
          <p className="text-xs text-[#414B4A] line-clamp-2 my-2">
            {course?.description || ""}
          </p>
        </div>

        {/* Button at bottom */}
        <div className="flex justify-start">
          {hasValidCourseLink ? (
            <Link
              href={course.courseLink}
              className="text-white text-xs transition-colors whitespace-nowrap px-2 py-1 rounded bg-teal-600 hover:bg-teal-700"
            >
              কোর্সটি দেখুন
            </Link>
          ) : (
            <div className="text-white text-xs transition-colors whitespace-nowrap px-2 py-1 rounded bg-zinc-300 cursor-not-allowed">
              কোর্সটি দেখুন
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Column Component with Animated Pagination
export const CourseColumn = ({
  courses,
  title,
  description,
  showAllCoursesButton = false,
  columnBg,
  blurDataMap,
}: {
  courses: any[];
  title: string;
  description: string;
  showAllCoursesButton?: boolean;
  columnBg?: string;
  blurDataMap: Record<string, string | null>;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 4;

  // Create sample courses if none provided
  const displayCourses = courses || [];
  const hasValidCourses = displayCourses.length > 0;
  const totalPages = hasValidCourses
    ? Math.ceil(displayCourses.length / coursesPerPage)
    : 1;
  const currentCourses = hasValidCourses
    ? displayCourses.slice(
        currentPage * coursesPerPage,
        (currentPage + 1) * coursesPerPage
      )
    : [];

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Animation variants for pagination only
  const pageVariants = {
    initial: { opacity: 0, x: 30 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -30,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <div className="flex flex-col h-full min-h-[52rem]">
      {/* Column Header */}
      <div className={`p-4 ${columnBg} border-b border-gray-100`}>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">
          {convertNumberToBangla(courses?.length)} টি কোর্স {description}{" "}
        </p>
      </div>

      {/* Column Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1">
            {hasValidCourses ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  // @ts-ignore
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {currentCourses.map((course, index) => (
                    <div
                      key={course?.id || index}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <CourseCard course={course} blurDataMap={blurDataMap} />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <BookOpen className="w-12 h-12 mb-3 text-gray-400" />
                <p className="text-sm font-medium">কোনো কোর্স নেই</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && hasValidCourses && (
            <div className="p-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  className={`w-8 h-8 p-0 ${
                    currentPage === 0
                      ? "bg-transparent !cursor-not-allowed"
                      : "bg-[#E6E7E7]"
                  }`}
                  aria-label="previous slide"
                  disabled={currentPage === 0}
                >
                  <ArrowLeft
                    className={`w-4 h-4 ${
                      currentPage === 0 ? "opacity-20" : "opacity-100"
                    }`}
                  />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  className={`w-8 h-8 p-0 ${
                    currentPage === totalPages - 1
                      ? "bg-transparent !cursor-not-allowed"
                      : "bg-[#E6E7E7]"
                  }`}
                  aria-label="next slide"
                  disabled={currentPage === totalPages - 1}
                >
                  <ArrowRight
                    className={`w-4 h-4 ${
                      currentPage === totalPages - 1
                        ? "opacity-20"
                        : "opacity-100"
                    }`}
                  />
                </Button>
              </div>
              {showAllCoursesButton && (
                <Link
                  href={"/courses"}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-md font-medium text-sm"
                >
                  সব কোর্স
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component (Client Component)
export const CourseRoadmapClient = ({
  liveNowCourses,
  wipCourses,
  plannedCourses,
  blurDataMap,
  updatedAt,
  showSectionHeader = true,
}: {
  liveNowCourses: any[];
  wipCourses: any[];
  plannedCourses: any[];
  blurDataMap: Record<string, string | null>;
  updatedAt: any;
  showSectionHeader?: boolean;
}) => {
  // console.log('updatedAt result:', convertDateTimeToBanglaTime(updatedAt));
  return (
    <section className={`bg-white  ${showSectionHeader ? "pb-4" : ""} `}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {showSectionHeader && (
          <>
            <SectionTitle
              title="কোর্স আপডেট"
              description="সম্পন্ন, চলমান ও পরিকল্পনায় থাকা কোর্সসমূহ একনজরে"
              containerClassName="pb-2"
            />
            <div className="text-center text-nowrap pb-8">
              <p className="text-sm md:text-base">
                <span className="font-semibold">শেষ আপডেট: </span>
                <span className="text-gray-700 font-normal">
                  {new Date(updatedAt).toLocaleDateString("bn-BD", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          </>
        )}

        {/* Course Grid Container - Three Separate Cards */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px]"
          style={{ gap: "26px" }}
        >
          {/* Live Now Courses Card */}
          <div className="rounded-lg border border-gray-200  overflow-hidden bg-brand-primary-lighter">
            <CourseColumn
              courses={liveNowCourses}
              title="যেসব কোর্স এখনই পাচ্ছেন"
              description="তৈরি হয়েছে"
              showAllCoursesButton={true}
              columnBg="bg-brand-primary-light"
              blurDataMap={blurDataMap}
            />
          </div>

          {/* Work In Progress Courses Card */}
          <div className="rounded-lg border border-gray-200  overflow-hidden bg-secondary-brand-accent-lighter">
            <CourseColumn
              courses={wipCourses}
              title="শীঘ্রই আসছে যেসব কোর্স"
              description="তৈরি হচ্ছে"
              columnBg="bg-secondary-brand-accent-light"
              blurDataMap={blurDataMap}
            />
          </div>

          {/* Planned Courses Card */}
          <div className="rounded-lg border border-gray-200  overflow-hidden bg-green-light">
            <CourseColumn
              courses={plannedCourses}
              title="ভবিষ্যতে যেসব কোর্স পাবেন"
              description="প্লানে আছে"
              columnBg="bg-green-deep-light"
              blurDataMap={blurDataMap}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
