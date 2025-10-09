import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
import SubscriptionPlans from "./SubscriptionPlans";
// import OfferActionBanner from "./OfferActionBanner";
// import { actionBannerData } from "../_utils/data";

const SpecialLaunchingOffer = ({ plans, courseLimit }: any) => {
  return (
    <div>
      <SectionTitle
        title="প্রাইম ফি"
        description="কম খরচে সর্বোচ্চ রিটার্ন—একটি ফি-তে ডিজিটাল মার্কেটিংয়ের প্রায় সব স্কিলসেট শেখার সুযোগ"
        descriptionClassName="max-w-3xl md:px-4"
      />

      {/* subscription plan section */}
      <SubscriptionPlans plans={plans} courseLimit={courseLimit} />
    </div>
  );
};

export default SpecialLaunchingOffer;
