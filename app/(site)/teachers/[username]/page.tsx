import React from "react";
import { TeacherHero } from "./_components/TeacherHero";
import { TeacherCourses } from "./_components/TeacherCourses";
import { OtherMentors } from "./_components/OtherMentors";
import TeacherNotFound from "./_components/TeacherNotFound";
import type { Metadata } from "next";
import {
  getTeacherCreatedCourseDBCall,
  getTeacherDetailsWithPublishedCourseDBCall,
  getTeachersDBCall,
} from "@/lib/data-access-layer/teachers";
import { notFound } from "next/navigation";
import { Course } from "@prisma/client";
import { generateMultipleBlurDataURLs } from "@/lib/blurGenerator";

// Generate static params for all teachers
export async function generateStaticParams() {
  try {
    // const teachers = await getTeachersDBCall();
    return [{ username: "prayogik_team" }];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const { username } = params;
  const teacher = await getTeacherDetailsWithPublishedCourseDBCall(username);

  if (!teacher) return notFound();
  const subjectSpecializations =
    teacher?.teacherProfile?.subjectSpecializations?.join(", ") || "";

  return {
    title: `${teacher.name} | ${teacher?.teacherProfile?.subjectSpecializations[0]} বিশেষজ্ঞ ও প্রশিক্ষক | প্রায়োগিক`,
    description: `${teacher.name} এর কাছে শিখুন, ${
      teacher?.teacherProfile?.yearsOfExperience?.split(" ")[0]
    }+ বছরের ইন্ডাস্ট্রি অভিজ্ঞতা সম্পন্ন একজন ডিজিটাল মার্কেটিং পেশাদার। প্রায়োগিকে তার ${subjectSpecializations} সম্পর্কিত কোর্সগুলি অন্বেষণ করুন এবং বিশেষজ্ঞ নির্দেশনায় আপনার দক্ষতা উন্নত করুন।`,
  };
}

const TeacherDetails = async ({ params }: { params: { username: string } }) => {
  const { username } = params;
  if (!username) return <TeacherNotFound />;

  const [teacherCourses, allTeacher] = await Promise.all([
    getTeacherCreatedCourseDBCall(username),
    getTeachersDBCall(),
  ]);

  const currentTeacher = allTeacher.find((t) => t?.username === username);
  if (!currentTeacher) {
    return <TeacherNotFound />;
  }
  // remove current teachers from all teacher list
  const filteredTeachers = allTeacher.filter(
    (t) =>
      t?.username !== username &&
      t?.teacherProfile?.createdCourses?.some(
        (course: Course) => course.isPublished
      )
  );

  // / Collect all image URLs that need blur data
  const imageUrls = [
    // Current teacher avatar (for TeacherHero)
    currentTeacher?.avatarUrl,
    // Course instructor avatars (for TeacherCourses)
    ...teacherCourses?.map((course: any) => course?.teacher?.user?.avatarUrl),
    // Other mentors avatars (for OtherMentors)
    ...filteredTeachers.map((teacher: any) => teacher?.avatarUrl),
  ].filter((url) => typeof url === "string" && url.trim() !== "");

  const blurDataMap = await generateMultipleBlurDataURLs(imageUrls);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <TeacherHero
        teacher={currentTeacher}
        blurDataURL={
          currentTeacher?.avatarUrl
            ? blurDataMap[currentTeacher.avatarUrl]
            : null
        }
      />
      <TeacherCourses courses={teacherCourses} />
      {filteredTeachers.length > 0 && (
        <OtherMentors allTeacher={filteredTeachers} blurDataMap={blurDataMap} />
      )}
    </div>
  );
};

export default TeacherDetails;
