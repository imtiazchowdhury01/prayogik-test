import type { Metadata } from "next";
import OurExperts from "../_components/home/OurExperts";
import SuccessStory from "../_components/home/SuccessStory";
import LiveCourses from "../_components/LiveCourses";
import CommonHeroSection from "@/components/common/CommonHeroSection";

export const metadata: Metadata = {
  title: "Prayogik – Practical Courses in Bangla for Career Skills",
  description:
    "Learn real-world skills in Bangla with micro, mini & short courses. Join thousands of learners in Bangladesh upgrading their careers with Prayogik.",
};

export default function HomePage() {
  return (
    <div>
      <CommonHeroSection
        title="প্রায়োগিক লাইভ কোর্স"
        description=" আমাদের প্রায়োগিক লাইভ কোর্সগুলোতে আপনি শিখবেন হাতে-কলমে দক্ষতা, যা
          সরাসরি বাস্তবে কাজে লাগানো যাবে। প্রতিটি কোর্স ডিজাইন করা হয়েছে
          সহজবোধ্যভাবে এবং সাশ্রয়ী মূল্যে, যাতে আপনি ডিজিটাল স্কিল আয়ত্ত করে
          ক্যারিয়ারে নতুন সুযোগ তৈরি করতে পারেন।"
        buttonText="কোর্স এক্সপ্লোর করুন"
        buttonLink="/courses"
        backgroundImage="/Launching-offer-BG.svg"
        imageSrc="/images/prime/video-frame-bg.webp"
      />
      <div className="mb-24">
        <LiveCourses isLivePage={true} />
      </div>
      <SuccessStory />
      <div className="pb-24">
        <OurExperts />
      </div>
    </div>
  );
}
