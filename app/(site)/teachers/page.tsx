// @ts-nocheck
import { TeachersHero } from "./_components/TeachersHero";
import BecomeAnInstructor from "../_components/home/BecomeAnInstructor";
import AllTeachers from "./_components/AllTeachers";
import type { Metadata } from "next";
import { TeacherWithProfileSchema } from "@/lib/utils/openai/types";
import { z } from "zod";
import { clientApi } from "@/lib/utils/openai/client";
import ActionBanner from "@/components/common/ActionBanner";
import { getTeachersDBCall } from "@/lib/data-access-layer/teachers";

export const metadata: Metadata = {
  title: "Meet Our Instructors | Skilled & Experienced Teachers | Prayogik",
  description:
    "Learn from top industry experts and experienced professionals. Our instructors are passionate about teaching practical skills in Bangla to help you grow your career.",
};
// Define the type for TeacherWithProfile using the schema
type TeacherWithProfile = z.infer<typeof TeacherWithProfileSchema>;

// export const dynamic = "force-dynamic";

const TeachersPage = async () => {
  let data: TeacherWithProfile[] = [];
  // Fetching verified teachers from the API
  try {
    // API call to get verified teachers with a limit of 8
    data = await getTeachersDBCall();

  } catch (err) {
    console.error("Failed to fetch verified teachers details:", err);
  }
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <TeachersHero />
      <AllTeachers initialTeachers={data} />
      <ActionBanner
        title="শিক্ষক হিসেবে যোগদান করতে চান?"
        description="আপনার দক্ষতা শেয়ার করুন, আয় করুন নিজের নিয়মে, আর গড়ে তুলুন শিক্ষার্থীদের শেখার নতুন সম্ভাবনা প্রয়োগিকে প্ল্যাটফর্মে।"
        buttonText="রেজিস্ট্রেশন করুন"
        buttonLink="/become-a-teacher"
        backgroundImage="/images/teacher/teacher-cta-bg.webp"
      />
    </div>
  );
};

export default TeachersPage;
