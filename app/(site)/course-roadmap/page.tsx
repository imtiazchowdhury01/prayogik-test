import ActionBanner from "@/components/common/ActionBanner";
import { CourseRoadmap } from "./_components/CourseRoadmap";
import { Hero } from "./_components/Hero";

import type { Metadata } from "next";
import HowToGetCourse from "./_components/HowToGetCourse";
import CoursePromotionSection from "./_components/CoursePromotionSection";

export const metadata: Metadata = {
  title: "Course Roadmap | Build Skills Step by Step with Prayogik",
  description:
    "Follow structured learning paths designed for real-life skill development. Choose your goal and progress through hand-picked, sequential Bangla courses—only on Prayogik.",
};

export default function CourseRoadMapPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />
      <div className="container mx-auto px-6 sm:px-8 md:px-8 lg:px-8 xl:px-8 2xl:px-1 max-w-7xl mt-12">
        {/* Course Roadmap Section */}
        <CourseRoadmap />
        <CoursePromotionSection />
        <HowToGetCourse />
      </div>
      <ActionBanner
        title="শেখাতে আগ্রহী?"
        description="আপনার দক্ষতা ও নলেজ শেয়ার করুন। আমাদের প্ল্যাটফর্মে কোর্স, লাইভ ট্রেনিং, ওয়ার্কশপ বা ক্যারিয়ার মেন্টর হিসেবে যোগ দিন!"
        buttonText="এখানে বিস্তারিত জানুন"
        buttonLink="/become-a-teacher"
        backgroundImage="/images/teacher/teacher-cta-bg.webp"
      />
    </div>
  );
}
