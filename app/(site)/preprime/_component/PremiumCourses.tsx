// TypeScript React Next.js 14 Server Component
import React from "react";
import PremiumCourseCard from "@/components/PremiumCourseCard";
import { Button } from "@/components/ui/button";
import { FaAngleRight, FaAngleUp } from "react-icons/fa6";
import { ShowAllButton } from "./ShowAllButton";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

// Define types for better type safety
interface Teacher {
  user: {
    name: string;
  };
}

interface Course {
  id: string;
  teacherProfile?: Teacher;
  [key: string]: any; // Other course properties
}

interface PremiumCoursesProps {
  userSubscription: any;
  showAll?: boolean;
}

// This function fetches data server-side
async function getPremiumCourses(showAll: boolean = false) {
  "use server";
  const take = showAll ? "all" : "10";

  try {
    // Use absolute URL for production or relative URL with proper Next.js fetch
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || ""
      }/api/courses/premium?take=${take}`,
      {
        headers: {
          Cookie: cookies().toString(),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching premium courses:", error);
    return { courses: [], purchasedCourseIds: [] };
  }
}

export default async function PremiumCourses({
  userSubscription,
  showAll = false,
}: PremiumCoursesProps) {
  // Server-side data fetching
  const { courses, purchasedCourseIds } = await getPremiumCourses(showAll);
  // Constants
  const INITIAL_DISPLAY_COUNT = 10;
  const displayCourses = showAll
    ? courses
    : courses.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreCourses = courses.length > INITIAL_DISPLAY_COUNT;

  // Premium courses count
  const premiumCoursesCount = await db.course.count({
    where: {
      isPublished: true,
      isUnderSubscription: true,
    },
  });

  return (
    <section className="w-full bg-[#042F2B] py-16 sm:py-[100px]">
      <div className="app-container">
        <div className="flex flex-col justify-center mb-10">
          <h4 className="font-bold text-white text-center text-3xl sm:text-4xl md:text-[40px]">
            আমাদের{" "}
            <span className="bg-gradient-to-r from-[#F9851A] to-[#F101E2] bg-clip-text text-transparent">
              প্রাইম{" "}
            </span>
            কোর্স সমূহ
          </h4>
          <p className="mt-2 text-[16px] text-center text-white max-w-xl mx-auto leading-[1.5]">
            প্রাইম মেম্বার হয়ে {convertNumberToBangla(premiumCoursesCount)}+
            কোর্সে ফ্রিতে এক্সেস নিন। প্রতি মাসে এক্সেস নিন আরও নতুন ৫+ কোর্সে।
          </p>
        </div>

        {displayCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {displayCourses.map((course: Course, ind: number) => (
              <PremiumCourseCard
                key={course.id || ind}
                course={course}
                purchasedCourseIds={purchasedCourseIds}
                instructor={course?.teacherProfile?.user?.name}
                userSubscription={userSubscription}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center border-2 border-gray-400 border-dashed rounded-lg p-14">
            <div className="flex flex-col items-center justify-center">
              <h3 className="mb-2 text-xl font-semibold text-white">
                কোনো প্রিমিয়াম কোর্স পাওয়া যায়নি
              </h3>
              <p className="text-gray-300">
                বর্তমানে কোনো প্রিমিয়াম কোর্স নেই। অনুগ্রহ করে পরে আবার চেক
                করুন।
              </p>
            </div>
          </div>
        )}

        {/* Toggle Button with Client-Side Interactivity */}
        {hasMoreCourses && (
          <div className="flex items-center justify-center mt-10">
            <ShowAllButton showAll={showAll} />
          </div>
        )}
      </div>
    </section>
  );
}
