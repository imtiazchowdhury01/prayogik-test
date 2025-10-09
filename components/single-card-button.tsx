import Link from "next/link";
import { CourseProgress } from "./course-progress";
import { CourseMode } from "@prisma/client";

type CourseCardButtonProps = {
  courseId: string;
  progress: any;
  nextLessonSlug: any;
  slug: string;
  lessons: any;
  variant: "dark" | "light" | undefined;
  courseMode: string;
  certificationslug?: string;
};

export const CourseCardButton = ({
  courseId,
  progress = null,
  nextLessonSlug,
  slug,
  lessons,
  variant,
  courseMode,
  certificationslug,
}: CourseCardButtonProps) => {
  return (
    <div className="">
      {courseMode === CourseMode.RECORDED &&
      progress !== null &&
      !certificationslug ? (
        <div className="flex flex-col gap-2">
          {
            <div className="">
              <CourseProgress
                variant={progress === 100 ? "success" : "default"}
                size="sm"
                value={progress}
                cardVariant={variant}
              />
            </div>
          }

          {nextLessonSlug && (
            <Link href={`/courses/${slug}/${nextLessonSlug}`}>
              <div className="block w-full px-4 py-2 text-base font-semibold text-center text-white transition-all duration-300 rounded-md hover:bg-primary-700 sm:px-6 sm:py-3 bg-primary-brand">
                চালিয়ে যান
              </div>
            </Link>
          )}
        </div>
      ) : (
        <div>
          <Link
            href={
              certificationslug
                ? `/certifications/${certificationslug}`
                : `/courses/${slug}`
            }
            className="block w-full px-4 py-2 text-base font-semibold text-center text-white transition-all duration-300 rounded-sm hover:bg-primary-700 sm:px-6 sm:py-3 bg-primary-brand"
            prefetch={true}
          >
            <span className="ml-2">
              {certificationslug
                ? "বিস্তারিত দেখুন"
                : courseMode === CourseMode.RECORDED
                ? "কোর্সটি দেখুন"
                : "বিস্তারিত দেখুন"}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};
