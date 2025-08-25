import { Metadata } from "next";
import CourseRoadmapOverView from "./_components/CourseRoadmapOverView";
import MentorFeedback from "./_components/MentorFeedback";
import RoadmapFaq from "./_components/RoadmapFaq";
import RoadmapHeroSection from "./_components/RoadMapHeroSection";
import RoadmapBenefits from "./_components/RoadmapBenefits";
import StudentFeedback from "./_components/StudentFeedback";


export const metadata: Metadata = {
  title: "Course Roadmap | Build Skills Step by Step with Prayogik",
  description:
    "Follow structured learning paths designed for real-life skill development. Choose your goal and progress through hand-picked, sequential Bangla courses—only on Prayogik.",
};

const page = () => {
  return (
    <div className="min-h-screen space-y-28">
      <RoadmapHeroSection />
      <CourseRoadmapOverView />
      <StudentFeedback />
      <MentorFeedback />
      <RoadmapBenefits />
      <RoadmapFaq />
    </div>
  );
};

export default page;
