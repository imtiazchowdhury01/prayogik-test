import React from "react";
import CourseRoadmap from "../../course-roadmap/_components/CourseRoadmap";
import TrialCheckoutButton from "@/components/trial-checkout-button";
import PrimeActionBanner from "./PrimeActionBanner";

const CourseRoadmapOverView = ({
  trialPlan,
  trialPlanDuration,
  trialPlanPrice,
  courseLimit,
}: {
  trialPlan: any;
  trialPlanDuration: any;
  trialPlanPrice: any;
  courseLimit: any;
}) => {
  return (
    <div>
      {/* <SectionTitle
        title="কোর্স আপডেট"
        description="সম্পন্ন, চলমান ও পরিকল্পনায় থাকা কোর্সসমূহ একনজরে"
      /> */}
      {/* Course Roadmap Section */}
      <div className="container mx-auto px-6 sm:px-8 md:px-8 lg:px-8 xl:px-8 2xl:px-1 max-w-7xl">
        <CourseRoadmap showSectionHeader={true} />
      </div>
      <div className="pt-28">
        <PrimeActionBanner
          trialPlanPrice={trialPlanPrice}
          trialPlanDuration={trialPlanDuration}
          courseLimit={courseLimit}
          backgroundImage="/images/teacher/teacher-cta-bg.webp"
          className="mb-0 xl:mb-28"
          customButton={
            <TrialCheckoutButton
              trialPlan={trialPlan}
              size={"lg"}
              variant={"primary"}
              className="bg-secondary-button hover:bg-secondary-button hover:opacity-95 text-white block rounded-md transition-all duration-300 shadow-sm text-base font-semibold px-4"
              subTextNode=""
            >
              এখনই শুরু করুন
            </TrialCheckoutButton>
          }
        />
      </div>
    </div>
  );
};

export default CourseRoadmapOverView;
