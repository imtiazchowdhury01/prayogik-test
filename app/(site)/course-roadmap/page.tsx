import { Metadata } from "next";
import CourseRoadmapOverView from "./_components/CourseRoadmapOverView";
import MentorFeedback from "./_components/MentorFeedback";
import RoadmapFaq from "./_components/RoadmapFaq";
import RoadmapBenefits from "./_components/RoadmapBenefits";
import StudentFeedback from "./_components/StudentFeedback";
import CommonHeroSection from "@/components/common/CommonHeroSection";

export const metadata: Metadata = {
  title: "Course Roadmap | Build Skills Step by Step with Prayogik",
  description:
    "Follow structured learning paths designed for real-life skill development. Choose your goal and progress through hand-picked, sequential Bangla courses—only on Prayogik.",
};

const page = () => {
  return (
    <div className="min-h-screen space-y-28">
      <CommonHeroSection
        title="প্রায়োগিক কোর্স রোডম্যাপ"
        description="আমাদের পরিকল্পনা - ডিজিটাল মার্কেটিং ও ডিজিটাল স্কিলের প্রয়োজনীয় ও ইন-ডিমান্ড দক্ষতাগুলোকে সাশ্রয়ী ও সহজলভ্য করা। জেনে নিন, আমরা কোন স্কিলভিত্তিক কোর্স নিয়ে কাজ করছি এবং ভবিষ্যতের জন্য কী পরিকল্পনা রয়েছে।"
        buttonText="কোর্স এক্সপ্লোর করুন"
        buttonLink="/courses"
        backgroundImage="/Launching-offer-BG.svg"
        imageSrc="/images/prime/video-frame-bg.webp"
      />
      <CourseRoadmapOverView />
      <StudentFeedback />
      <MentorFeedback />
      <RoadmapBenefits />
      <RoadmapFaq />
    </div>
  );
};

export default page;
