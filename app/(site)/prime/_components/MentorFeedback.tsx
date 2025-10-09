import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
import { mentorsFeedbackData } from "../../course-roadmap/_utils/data";
import VideoGallery from "../../course-roadmap/_components/VideoGallery";
import TrialCheckoutButton from "@/components/trial-checkout-button";
import PrimeActionBanner from "./PrimeActionBanner";

const MentorFeedback = ({
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
      <SectionTitle
        title="জেনে নিন মেন্টরদের মন্তব্য"
        description="প্রায়োগিকের প্রাইম সাবস্ক্রিপশন আপনার ডিজিটাল মার্কেটিং এক্সপার্টাইজ ও ক্যারিয়ার তৈরিতে গুরুত্বপূর্ণ বিনিয়োগ। শুনুন আমাদের সম্মানিত মেন্টরদের কথা, কীভাবে তারা যত্ন ও আন্তরিকতার সাথে প্রতিটি কোর্স তৈরি করেছেন। তাদের মতামত থেকে ধারণা নিন আমাদের উন্নত কোর্স কোয়ালিটি পলিসি সম্পর্কে।"
        descriptionClassName="max-w-5xl md:px-10"
      />
      <VideoGallery videos={mentorsFeedbackData} />
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

export default MentorFeedback;
