import React from "react";
import OfferHero from "./_components/OfferHero";
import PrimeIntro from "./_components/PrimeIntro";
import SpecialLaunchingOffer from "./_components/SpecialLaunchingOffer";
import PrimeBenefitsOverview from "./_components/PrimeBenefitsOverview";
import CourseRoadmapOverView from "./_components/CourseRoadmapOverView";
import StudentFeedback from "./_components/StudentFeedback";
import MentorFeedback from "./_components/MentorFeedback";
import FoundersVision from "./_components/FoundersVision";
import PrimePlanFeatures from "./_components/PrimePlanFeatures";
import MembershipBenefits from "./_components/MembershipBenefits";
import OfferFaq from "./_components/OfferFaq";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unlock All Courses with One Subscription | Prayogik",
  description:
    "Get unlimited access to all premium Bangla courses with a single subscription. Learn practical skills, grow your career, and enjoy new courses regularly—only on Prayogik.",
};

const page = () => {
  return (
    <div className="min-h-screen space-y-24">
      <OfferHero />
      <PrimeIntro />
      <SpecialLaunchingOffer />
      <PrimeBenefitsOverview />
      <CourseRoadmapOverView />
      <StudentFeedback />
      <MentorFeedback />
      <PrimePlanFeatures />
      <MembershipBenefits />
      <FoundersVision />
      <OfferFaq />
    </div>
  );
};

export default page;
