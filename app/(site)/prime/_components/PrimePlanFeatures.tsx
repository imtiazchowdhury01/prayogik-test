import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
import { featuresPlanData } from "../_utils/data";
import FeatureList from "@/components/common/FeatureList";

const PrimePlanFeatures = () => {
  return (
    <div>
      <SectionTitle
        title="প্রাইম প্ল্যান থেকে আপনি যা যা পাবেন"
        description="বিশেষ মেম্বারশিপ ক্যাটাগরি, যেখানে আপনি শুধু প্রাইম ক্যাটাগরির সব কোর্সে একসেসই নয়, সাথে এক্সক্লুসিভ সুবিধা।একটি সাবস্ক্রিপশনে প্রিমিয়াম কোর্স, ছাড়, আর কমিউনিটি সাপোর্ট—সব একসাথে।"
      />
      <FeatureList features={featuresPlanData} FeatureTitle="" />
    </div>
  );
};

export default PrimePlanFeatures;
