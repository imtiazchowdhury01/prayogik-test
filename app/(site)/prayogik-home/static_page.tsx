import ActionBanner from "@/components/common/ActionBanner";
import type { Metadata } from "next";
import OurExperts from "../_components/home/OurExperts";
import PrayogikHero from "../_components/home/PrayogikHero";
import SuccessStory from "../_components/home/SuccessStory";
import UpcomingEvents from "../_components/home/UpcomingEvents";
import HomeCourses from "./_components/HomeCourses";

const metadata: Metadata = {
  title: "Prayogik – Practical Courses in Bangla for Career Skills",
  description:
    "Learn real-world skills in Bangla with micro, mini & short courses. Join thousands of learners in Bangladesh upgrading their careers with Prayogik.",
};

async function HomePage() {
  return (
    <div>
      <PrayogikHero />
      <HomeCourses />
      <ActionBanner
        title="কোর্স রোডম্যাপ"
        description="জেনে নিন, কোন কোর্স গুলো তৈরি হয়েছে, কোন কোর্স গুলো নিয়ে কাজ চলছে  আর  ভবিষ্যতে কোন কোর্স গুলো আমাদের পরিকল্পনায় আছে।"
        buttonText="কোর্স রোডম্যাপ দেখুন"
        buttonLink="/course-roadmap"
        backgroundImage="/images/teacher/teacher-cta-bg.webp"
      />
      <OurExperts />
      <div className="pt-28">
        <ActionBanner
          title="শেখাতে আগ্রহী?"
          description="আপনার দক্ষতা ও নলেজ শেয়ার করুন। আমাদের প্ল্যাটফর্মে কোর্স, লাইভ ট্রেনিং, ওয়ার্কশপ বা ক্যারিয়ার মেন্টর হিসেবে যোগ দিন!"
          buttonText="এখানে বিস্তারিত জানুন"
          buttonLink="/become-a-teacher"
          backgroundImage="/images/teacher/teacher-cta-bg.webp"
        />
      </div>
      <UpcomingEvents />
      <SuccessStory />
    </div>
  );
}
