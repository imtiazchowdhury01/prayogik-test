import type { Metadata } from "next";
import OurExperts from "../_components/home/OurExperts";
import SuccessStory from "../_components/home/SuccessStory";
import LiveCourses from "../home/_components/LiveCourses";
import LiveHeroSection from "./_components/LiveHeroSection";

export const metadata: Metadata = {
  title: "Prayogik – Practical Courses in Bangla for Career Skills",
  description:
    "Learn real-world skills in Bangla with micro, mini & short courses. Join thousands of learners in Bangladesh upgrading their careers with Prayogik.",
};

export default function HomePage() {
  return (
    <div>
      <LiveHeroSection/>
      <div className="mb-24">
        <LiveCourses isLivePage={true}/>
      </div>
      <SuccessStory />
      <OurExperts />
    </div>
  );
}
