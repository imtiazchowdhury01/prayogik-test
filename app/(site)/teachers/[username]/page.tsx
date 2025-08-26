// @ts-nocheck
import React from "react";
import { TeacherHero } from "./_components/TeacherHero";
import { TeacherCourses } from "./_components/TeacherCourses";
import { OtherMentors } from "./_components/OtherMentors";
import { UserX } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import TeacherNotFound from "./_components/TeacherNotFound";
import type { Metadata } from "next";
import { fi } from "@faker-js/faker";
import { clientApi } from "@/lib/utils/openai/client";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const { username } = params;
  const userId = await getUserIdbyUsername(username);
  const teacher = await getTeacherDetailsWithPublishedCourse(userId);
  const subjectSpecializations =
    teacher?.teacherProfile?.subjectSpecializations?.join(", ") || "";

  return {
    title: `${teacher.name} | ${teacher?.teacherProfile?.subjectSpecializations[0]} বিশেষজ্ঞ ও প্রশিক্ষক | প্রায়োগিক`,
    description: `${teacher.name} এর কাছে শিখুন, ${
      teacher?.teacherProfile?.yearsOfExperience.split(" ")[0]
    }+ বছরের ইন্ডাস্ট্রি অভিজ্ঞতা সম্পন্ন একজন ডিজিটাল মার্কেটিং পেশাদার। প্রায়োগিকে তার ${subjectSpecializations} সম্পর্কিত কোর্সগুলি অন্বেষণ করুন এবং বিশেষজ্ঞ নির্দেশনায় আপনার দক্ষতা উন্নত করুন।`,
  };
}

// Define types for teacher data (you can replace with your actual types)
type Teacher = any;

async function getTeacherDetailsWithPublishedCourse(
  userId: string
): Promise<Teacher | null> {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      teacherProfile: true,
    },
  });

  if (
    !user ||
    !user.teacherProfile ||
    user.teacherProfile.teacherStatus !== "VERIFIED"
  ) {
    return null;
  }

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || ""
    }/api/teacher/${userId}/details-with-course`
  );

  if (!response.ok) throw new Error("Failed to fetch teacher details");
  return response.json();
}

async function getAllTeachers(): Promise<Teacher[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/teacher/details`
  );

  if (!response.ok) throw new Error("Failed to fetch all teachers");
  return response.json();
}

async function getUserIdbyUsername(username: string) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) throw new Error("Failed to get user");
  return user.id;
}

const TeacherDetails = async ({ params }: { params: { username: string } }) => {
  const { username } = params;
  const { userId } = await getServerUserSession();
  if (!username) return <TeacherNotFound />;

  const [teacherResponse, allTeacher] = await Promise.all([
    clientApi.getCoursesQuery({
      query: {
        teacher: username,
      },
      extraHeaders: {
        cookie: cookies().toString(),
      },
    }),
    getAllTeachers(),
  ]);
  
  const teacherCourses = teacherResponse.body.courses || [];

  const currentTeacher = allTeacher.find((t) => t?.username === username);
  if (!currentTeacher) {
    return <TeacherNotFound />;
  }
  // remove current teachers from all teacher list
  const filteredTeachers = allTeacher.filter(
    (t) =>
      t?.username !== username &&
      t.teacherProfile.createdCourses?.some((course) => course.isPublished)
  );

  return (
    <div className="flex flex-col overflow-hidden bg-zinc-100">
      <TeacherHero teacher={currentTeacher} />
      <TeacherCourses courses={teacherCourses} userId={userId} />
      {filteredTeachers.length > 0 && (
        <OtherMentors allTeacher={filteredTeachers} />
      )}
    </div>
  );
};

export default TeacherDetails;
