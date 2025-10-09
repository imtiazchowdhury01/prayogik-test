import ActionBanner from "@/components/common/ActionBanner";
import type { Metadata } from "next";
import OurExperts from "./_components/home/OurExperts";
import SuccessStory from "./_components/home/SuccessStory";
import UpcomingEvents from "./_components/home/UpcomingEvents";
import HomeCourses from "./_components/HomeCourses";
import LiveCourses from "./_components/LiveCourses";
import PrayogikHero from "./_components/home/PrayogikHero";
import CertificationCourses from "./certifications/_components/certification-courses";

export const metadata: Metadata = {
  title: "Prayogik – Practical Courses in Bangla for Career Skills",
  description:
    "Learn real-world skills in Bangla with micro, mini & short courses. Join thousands of learners in Bangladesh upgrading their careers with Prayogik.",
};

export default function HomePage() {
  return (
    <div>
      <PrayogikHero />
      <HomeCourses />
      <LiveCourses />
      {/* <CertificationCourses  isCertificationPage={false}/> */}
      <UpcomingEvents />
      <SuccessStory />
      <OurExperts />
      <div className="pt-28">
        <ActionBanner
          title="অভিজ্ঞ প্রফেশনাল?"
          description="আপনার দক্ষতা ও নলেজ শেয়ার করুন। আমাদের প্ল্যাটফর্মে কোর্স, লাইভ ট্রেনিং, ওয়ার্কশপ বা ক্যারিয়ার মেন্টর হিসেবে যোগ দিন!"
          buttonText="বিস্তারিত"
          buttonLink="/become-a-teacher"
          backgroundImage="/images/teacher/teacher-cta-bg.webp"
          className="mb-0 xl:mb-28"
        />
      </div>
    </div>
  );
}
