import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
// import OfferActionBanner from "./OfferActionBanner";
import { actionBannerData, featuresPlanData } from "../_utils/data";
import FeatureList from "@/components/common/FeatureList";

const PrimePlanFeatures = () => {
  return (
    <div>
      <SectionTitle
        title="প্রাইম প্ল্যান থেকে আপনি যা যা পাবেন"
        description="বিশেষ মেম্বারশিপ ক্যাটাগরি, যেখানে আপনি শুধু প্রাইম ক্যাটাগরির সব কোর্সে একসেসই নয়, সাথে এক্সক্লুসিভ সুবিধা।একটি সাবস্ক্রিপশনে প্রিমিয়াম কোর্স, ছাড়, আর কমিউনিটি সাপোর্ট—সব একসাথে।"
      />
      <FeatureList features={featuresPlanData} FeatureTitle="" />
      {/* <OfferActionBanner
        actionBannerData={actionBannerData}
        sectionBadge="রেগুলার ফি: "
        title="লঞ্চ অফার ফি: "
        description="মূল্য বৃদ্ধির আগেই সাবস্ক্রিপশন নিশ্চিত করুন। পরবর্তী মূল্য বৃদ্ধির তারিখঃ "
        buttonText="সাবস্ক্রাইব করুন"
        buttonLink="/prime"
        backgroundImage=""
        className="mt-24"
      /> */}
    </div>
  );
};

export default PrimePlanFeatures;
