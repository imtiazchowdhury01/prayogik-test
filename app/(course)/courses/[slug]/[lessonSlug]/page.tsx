// page.js - Server Component
import { getCourseBySlug } from "@/actions/get-course-by-slug";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getLesson } from "@/lib/utils/GetLessons";

import { Metadata } from "next";
import { redirect } from "next/navigation";
import { LessonContent } from "./_components/lesson-content";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { userId } = await getServerUserSession();
  const course = await getCourseBySlug(params.slug, userId!);

  return {
    title: `${course?.title} শেখা শুরু করুন | ভিডিও লেসন এবং প্র্যাকটিক্যাল গাইড | প্রায়োগিক`,
    description: `প্রায়োগিক থেকে ${course?.title} কোর্সের ভিডিও লেসন, প্র্যাকটিক্যাল গাইড, এবং বিশেষজ্ঞ নির্দেশনা সহ শেখা শুরু করুন। হাতেকলমে প্রজেক্ট এবং বিশেষজ্ঞ নির্দেশনায় ${course?.category?.name} দক্ষতা উন্নত করতে এখনই লেসনগুলি দেখুন। প্রায়োগিকের সাথে শেখার অভিজ্ঞতা উপভোগ করুন!`,
  };
}

const Page = async ({ params }: { params: any }) => {
  const { slug, lessonSlug } = params;
  const { userId } = await getServerUserSession();

  const course = await getCourseBySlug(slug, userId!);

  // Fetch lesson data on server
  const lessonResponse = await getLesson(slug, lessonSlug, userId!);

  if (lessonResponse.error) {
    return redirect(`/courses/${slug}`);
  }

  const { lesson, progress, purchase, nextLesson } = lessonResponse.data;

  const lessonData = {
    lesson,
    course,
    progress,
    purchase,
    userId,
    nextLesson,
  };

  return (
    <div>
      <LessonContent lessonData={lessonData} />
    </div>
  );
};

export default Page;
