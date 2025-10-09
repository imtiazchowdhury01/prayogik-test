import type { Metadata } from "next";
import OurExperts from "../_components/home/OurExperts";
import SuccessStory from "../_components/home/SuccessStory";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import AllEvents from "./_components/all-events";

export const metadata: Metadata = {
  title: "Prayogik – Practical Courses in Bangla for Career Skills",
  description:
    "Learn real-world skills in Bangla with micro, mini & short courses. Join thousands of learners in Bangladesh upgrading their careers with Prayogik.",
};

export default function EventPage() {
  return (
    <div>
      <CommonHeroSection
        title="প্রায়োগিক ইভেন্ট "
        description=" আমাদের প্রায়োগিক ইভেন্ট গুলোতে আপনি শিখবেন হাতে-কলমে দক্ষতা, যা
          সরাসরি বাস্তবে কাজে লাগানো যাবে। প্রতিটি ইভেন্ট  ডিজাইন করা হয়েছে
          সহজবোধ্যভাবে এবং সাশ্রয়ী মূল্যে, যাতে আপনি ডিজিটাল স্কিল আয়ত্ত করে
          ক্যারিয়ারে নতুন সুযোগ তৈরি করতে পারেন।"
        buttonText=""
        buttonLink="/courses"
        backgroundImage="/Launching-offer-BG.svg"
        imageSrc="/images/prime/video-frame-bg.webp"
      />
      <div>
        <AllEvents />
      </div>
      <SuccessStory />
      <div className="pb-24">
        <OurExperts />
      </div>
    </div>
  );
}
