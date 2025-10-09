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
import { SubscriptionPlan } from "@prisma/client";
import { getSubscriptionDBCall } from "@/lib/data-access-layer/subscriptions";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

export const metadata: Metadata = {
  title: "Unlock All Courses with One Subscription | Prayogik",
  description:
    "Get unlimited access to all premium Bangla courses with a single subscription. Learn practical skills, grow your career, and enjoy new courses regularly—only on Prayogik.",
};

const page = async () => {
  const plans: SubscriptionPlan[] = await getSubscriptionDBCall();
  const trialPlan = plans?.find((plan: any) => plan.isTrial);
  const courseLimit = trialPlan?.trialCourseLimit ?? 0;

  // const trialPlanDuration = trialPlan?.trialDurationInDays
  // ? trialPlan.trialDurationInDays % 30 === 0
  //   ? trialPlan.trialDurationInDays / 30
  //   : trialPlan.trialDurationInDays
  // : undefined;

  const formatTrialDuration = (days?: number) => {
    if (!days) return "";
    // If divisible by 30 → show months
    if (days % 30 === 0) {
      return `${days / 30} মাসের`;
    }
    // Otherwise → show days
    return `${days} দিনের`;
  };

  const trialPlanDuration = formatTrialDuration(
    trialPlan?.trialDurationInDays ?? undefined
  );

  return (
    <div className="min-h-screen space-y-24">
      <OfferHero
        trialPlan={trialPlan}
        trialPlanDuration={trialPlanDuration}
        courseLimit={courseLimit}
      />
      <PrimeIntro />
      <SpecialLaunchingOffer plans={plans} courseLimit={courseLimit} />
      <PrimeBenefitsOverview />
      <CourseRoadmapOverView
        trialPlan={trialPlan}
        trialPlanDuration={convertNumberToBangla(trialPlanDuration ?? 0)}
        trialPlanPrice={trialPlan?.regularPrice}
        courseLimit={courseLimit}
      />
      <StudentFeedback />
      <MentorFeedback
        trialPlan={trialPlan}
        trialPlanDuration={convertNumberToBangla(trialPlanDuration ?? 0)}
        trialPlanPrice={trialPlan?.regularPrice}
        courseLimit={courseLimit}
      />
      <PrimePlanFeatures />
      <MembershipBenefits />
      <FoundersVision />
      <OfferFaq
        trialPlan={trialPlan}
        trialPlanDuration={convertNumberToBangla(trialPlanDuration ?? 0)}
        trialPlanPrice={trialPlan?.regularPrice}
        courseLimit={courseLimit}
      />
    </div>
  );
};

export default page;
