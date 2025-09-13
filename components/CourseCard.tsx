import { formatDuration } from "@/lib/formatDuration";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { SingleCardButton } from "./single-card-button";
import {
  convertNumberToBangla,
  getPlainTextFromHtml,
} from "@/lib/convertNumberToBangla";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import FreeLessonPreviewButton from "./FreeLessonPreviewButton";
import { Clock, UserRound } from "lucide-react";
import { GradientBorderBadge } from "./ui/badge";
import { CourseMode } from "@prisma/client";
import LiveCourseIcon from "./LiveCourseIcon";
import LiveCourseTime from "./liveCourseTime";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
const CourseCard = ({
  variant = "dark",
  course,
  className,
  instructor,
  pathname,
}: {
  variant?: "light" | "dark";
  className?: string;
  course: any;
  instructor?: string;
  userId?: string;
  purchasedCourseIds?: string[];
  pathname?: string;
}) => {
  const { slug, imageUrl, progress, lessons, nextLessonSlug = null } = course;
  const freeLesson = lessons?.find(
    (lesson: any) => lesson.isFree && lesson.videoUrl
  );
  let formattedDuration = formatDuration(course?.totalDuration);

  return (
    <div
      className={twMerge(
        `flex flex-col h-full min-h-[500px] relative overflow-hidden rounded-lg group transition-all border-[1px] border-[#E6E7E7] duration-300, ${className} ${
          variant === "light"
            ? "bg-white shadow-custom"
            : "bg-[#133b37] shadow-custom"
        } `
      )}
    >
      {variant === "dark" && (
        <div className="absolute inset-0 invisible transition-all duration-300 bg-no-repeat opacity-25 pointer-events-none group-hover:visible group-hover:bg-gradient-to-r group-hover:from-white/100 group-hover:to-white/50"></div>
      )}
      {/* course image */}
      <div
        className="relative w-full overflow-hidden rounded-t-lg"
        style={{ aspectRatio: "16 / 9" }}
      >
        {imageUrl && (
          <Image
            src={imageUrl || "/default-image.jpg"}
            alt="course-card-image"
            fill
            className="object-cover w-full h-full rounded-t-lg bg-[#F9FAFB]"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
            quality={75}
          />
        )}
        {/* Live course badge - positioned at top right */}
        {course?.courseMode === CourseMode.LIVE && <LiveCourseIcon />}
        <FreeLessonPreviewButton course={course} freeLesson={freeLesson} />
      </div>

      <div className="flex flex-col justify-between px-4 py-3">
        {/* text content */}
        <div className="space-y-2 mt-[9px]">
          {/* course title */}
          <p
            className={`text-base font-bold leading-6 ${
              variant === "light" ? "text-card-black-text" : "text-white "
            }`}
          >
            {textLangChecker(course?.title)}
          </p>
          {/* instructor name */}
          <p
            className={`${
              variant === "light"
                ? "text-card-black-text font-base"
                : "text-[#CBD5E1]"
            }  text-sm font-medium`}
          >
            <span>ইন্সট্রাক্টর</span>{" "}
            {instructor ? textLangChecker(instructor) : ""}
          </p>
          {/* description */}
          <div
            className={`${
              variant === "light" ? "text-[#414B4A]" : "text-greyscale-300"
            } text-sm line-clamp-2`}
          >
            {getPlainTextFromHtml(course?.description, 125)}
          </div>
          {/* student count and duration */}
          {course?.courseMode !== CourseMode.LIVE && (
            <div className="flex items-center gap-4 ">
              {/* student count */}
              <div className="flex items-center gap-1">
                <UserRound
                  size={16}
                  className={`${
                    variant === "light"
                      ? "text-[#414B4A]"
                      : "text-greyscale-300"
                  }`}
                />
                <p
                  className={`${
                    variant === "light"
                      ? "text-[#414B4A]"
                      : "text-greyscale-300"
                  }  text-sm mt-0.5`}
                >
                  {convertNumberToBangla(
                    course?._count?.enrolledStudents ||
                      course?.enrolledStudents?.length
                  )}{" "}
                  শিক্ষার্থী
                </p>
              </div>
              {/* time duration */}
              {formattedDuration && (
                <div className="flex items-center gap-1.5">
                  <Clock
                    size={16}
                    className={`${
                      variant === "light"
                        ? "text-[#414B4A]"
                        : "text-greyscale-300"
                    } `}
                  />
                  <p
                    className={`${
                      variant === "light"
                        ? "text-[#414B4A]"
                        : "text-greyscale-300"
                    }  text-sm mt-0.3`}
                  >
                    {formattedDuration}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* bottom part */}
      <div className="px-4 pb-4 space-y-2 pt-5 mt-auto">
        {/* prime badge only show for course mode recorded */}
        {course?.isUnderSubscription &&
          course?.courseMode !== CourseMode.LIVE &&
          (progress == null || progress === "" || Number.isNaN(progress)) && (
            <GradientBorderBadge>প্রাইমের সাথে ফ্রি</GradientBorderBadge>
          )}

        {/* price  and Time for live course*/}
        <LiveCourseTime CourseMode={CourseMode} course={course} />

        {(progress == null || progress === "" || Number.isNaN(progress)) && (
          <p className="flex items-center space-x-2">
            {course?.prices[0]?.isFree ? (
              <span className="text-base font-bold font-primary text-secondary-brand">
                *ফ্রি
              </span>
            ) : (
              <span className="text-lg font-bold text-card-highlighted">
                ৳{" "}
                {course?.prices[0]?.discountedAmount
                  ? convertNumberToBangla(course?.prices[0]?.discountedAmount)
                  : convertNumberToBangla(course?.prices[0]?.regularAmount)}
              </span>
            )}

            {course?.prices[0]?.discountedAmount ? (
              <span
                className={`line-through ${
                  variant === "light" ? "text-[#414B4A]" : "text-greyscale-300"
                }  text-[15px] leading-4`}
              >
                ৳ {convertNumberToBangla(course?.prices[0]?.regularAmount)}
              </span>
            ) : null}
          </p>
        )}

        {/* action button */}
        <Suspense fallback={<SingleCardButtonSkeleton />}>
          <SingleCardButton
            courseId={course.id}
            progress={progress}
            nextLessonSlug={nextLessonSlug}
            slug={slug}
            lessons={lessons}
            variant={variant}
            courseMode={course?.courseMode}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default CourseCard;

export const SingleCardButtonSkeleton = () => {
  return (
    <div className="w-full">
      <Skeleton className="h-10 w-full rounded-md sm:h-12" />
    </div>
  );
};
