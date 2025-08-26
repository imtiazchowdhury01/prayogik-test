// @ts-nocheck

"use client";
export const dynamic = "force-dynamic";
import Image from "next/image";
import Link from "next/link";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { Preview } from "./preview";
import { Play } from "lucide-react";
import { SingleCardButton } from "./single-card-button";
import { useEffect, useState } from "react";
import { SingleCardButtonOld } from "./single-card-button-old";
import { DashboardSingleCardButton } from "./dashboard-single-card-button";

export default function SingleCourse({
  course,
  userId,
  purchasedCourseIds = [],
}) {
  const {
    id,
    slug,
    imageUrl,
    title,
    prices,
    description,
    category,
    progress,
    purchases,
    lessons,
    isUnderSubscription,
  } = course;

  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  const offer = 35;
  const isPurchased = purchases && purchases.length > 0;
  const isAuthenticated = !!userId;

  useEffect(() => {
    if (userId && purchasedCourseIds?.includes(course.id)) {
      setLoading(true);
      const apiUrl = `/api/user/userprogress?userId=${userId}&courseId=${course.id}`;

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching user progress");
          }
          return response.json();
        })
        .then((data) => {
          setUserProgress(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user progress:", error);
        });
    }
  }, [userId, purchasedCourseIds, course.id]);

  // First, get all completed lesson IDs from user progress
  const completedLessonIds =
    userProgress
      ?.filter((progress) => progress?.isCompleted)
      ?.map((progress) => progress?.lessonId) || [];

  // Find the highest position among completed lessons
  const highestCompletedPosition = Math.max(
    ...lessons
      .filter((lesson) => completedLessonIds.includes(lesson.id))
      .map((lesson) => lesson.position),
    -1 // Default value if no lessons are completed
  );

  // Find the next lesson based on position - the lesson with the smallest position
  // greater than the highest completed position
  const nextLesson = lessons
    .filter(
      (lesson) =>
        lesson.isPublished && lesson.position > highestCompletedPosition
    )
    .sort((a, b) => a.position - b.position)[0]; // Sort by position and take the first one

  const nextLessonSlug = nextLesson ? nextLesson.slug : null;
  return (
    <div className="flex flex-col justify-between h-full gap-2 overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="relative border group">
        <div className="w-full md:w-full h-0 pb-[56.25%] md:pb-0 md:h-[160px] overflow-hidden ">
          {imageUrl && (
            <Image
              src={imageUrl || "/default-image.jpg"}
              alt="course-image"
              width={0}
              height={0}
              sizes="100vw"
              className="object-cover w-full h-full rounded-t-lg"
              priority={true}
            />
          )}
        </div>
        <Link
          href={
            isAuthenticated && progress !== null
              ? `/courses/${slug}/${lessons[0]?.slug}`
              : `/courses/${slug}`
          }
          className="absolute inset-0 flex items-center justify-center w-full h-full group"
        >
          <div className="flex items-center justify-center transition-all duration-300 hover:bg-[#0000003b] w-full h-full">
            <div className="bg-[#727374ab] p-3 rounded-full">
              <Play className="text-white rounded-full" size={16} />
            </div>
          </div>
        </Link>
      </div>
      <div className="p-4">
        <div className="flex flex-row flex-wrap items-center justify-between w-full gap-2 text-xs">
          <Link
            href={`/courses/category?categoryId=${course?.category?.id}`}
            className="relative bg-blue-100 text-blue-800 text-xs font-medium rounded-[44px] flex items-center gap-1 px-3 py-1"
          >
            {category?.name}
          </Link>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium rounded-[44px] flex items-center gap-1 px-3 py-1">
            {convertNumberToBangla(lessons.length) || 0} টি ক্লাস
          </span>
        </div>
        <div className="pt-4 pb-2">
          <Link
            href={
              isAuthenticated && progress !== null
                ? `/courses/${slug}/${lessons[0]?.slug}`
                : `/courses/${slug}`
            }
            className="text-lg font-semibold capitalize transition-colors duration-300 hover:text-teal-600"
          >
            {title}
          </Link>
        </div>
        <div className="text-sm text-gray-600">
          <Preview
            value={
              description.length > 200 ? description.slice(0, 200) : description
            }
          />
        </div>
      </div>

      <div>
        {isUnderSubscription &&
          (progress == null || progress === "" || Number.isNaN(progress)) && (
            <div className="flex mx-4">
              <div className="px-2 bg-gray-100 rounded-lg">
                {/* {isFreeForMember && (
                <p className="text-[#14B8A9] text-sm">Free with Plus</p>
              )}
              {isDiscountedForMember && (
                <p className="text-[#14B8A9] text-sm">Discounted with Plus</p>
              )} */}
              </div>
            </div>
          )}

        <DashboardSingleCardButton
          isAuthenticated={isAuthenticated}
          progress={progress}
          nextLessonSlug={nextLessonSlug}
          slug={slug}
          lessons={lessons}
          loading={loading}
        />
      </div>
    </div>
  );
}
