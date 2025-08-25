// @ts-nocheck
import ExpertCard from "@/components/ExpertCard";
import MoreBtn from "@/components/more-btn";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { TeacherWithProfileSchema } from "@/lib/utils/openai/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import TeacherCarousal from "../teacher/TeacherCarousal";
import { generateMultipleBlurDataURLs } from "@/lib/blurGenerator";
import TeachersGrid from "../teacher/TeachersGrid";

// Define the type for TeacherWithProfile using the schema
type TeacherWithProfile = z.infer<typeof TeacherWithProfileSchema>;

const OurExperts = async () => {
  let teachers: TeacherWithProfile[] = [];

  // Fetch verified teachers directly from the database
  try {
    const teachersData = await db.user.findMany({
      where: {
        teacherProfile: {
          teacherStatus: "VERIFIED",
        },
      },
      take: 4,
      include: {
        teacherProfile: {
          include: {
            teacherRank: true,
            _count: {
              select: {
                createdCourses: {
                  where: {
                    isPublished: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        teacherProfile: {
          createdCourses: {
            _count: "desc", // Order by count of createdCourses (published) in descending order
          },
        },
      },
    });
    const safeTeachers = teachersData.map((teacher) => {
      const {
        password,
        emailVerified,
        emailVerificationToken,
        resetToken,
        tokenUsed,
        isAdmin,
        isSuperAdmin,
        phoneNumber,
        role,
        ...safeData
      } = teacher;
      return safeData;
    });
    teachers = safeTeachers;
  } catch (err) {
    console.error("Page : Failed to fetch teachers details:", err);
  }
  // Collect all image URLs from the course (filtering out null values)
  const imageUrls = [
    ...(teachers
      ?.map((teacher: any) => teacher?.avatarUrl)
      .filter((url) => typeof url === "string" && url.trim() !== "") || []),
  ];
  // Generate blur data for all images in parallel
  const blurDataMap = await generateMultipleBlurDataURLs(imageUrls);

  return (
    <section className="w-full">
      <div className="app-container">
        <div className="flex items-center justify-center w-full mb-6 md:justify-between">
          <div>
            <h2 className="font-bold md:text-left text-center text-3xl sm:text-4xl md:text-[40px]">
              এক্সপার্টদের কাছ থেকে শিখুন
            </h2>
            <p className="mt-2 md:mt-4 md:my-4 text-base text-fontcolor-subtitle text-center md:text-left">
              কোর্স করুন নিজ নিজ ক্ষেত্রে অভিজ্ঞ ও দক্ষ প্রশিক্ষকদের কাছ থেকে।
            </p>
          </div>
        </div>
        {/* -----------Experts Carousel-------------- */}
        {/* <TeacherCarousal teachers={teachers} blurDataMap={blurDataMap} /> */}
        {/* -----------Experts Grid ----------------- */}
        <TeachersGrid teachers={teachers} blurDataMap={blurDataMap} />
      </div>
    </section>
  );
};

export default OurExperts;
