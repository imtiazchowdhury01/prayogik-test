import FeatureList from "@/components/common/FeatureList";
import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
import { featuresMembershipData } from "../_utils/data";

const MembershipBenefits = () => {
  return (
    <div>
      <SectionTitle
        title="আপনি কিভাবে এই মেম্বারশীপ থেকে উপকৃত হবেন"
        description="আমাদের পরিকল্পনা — ডিজিটাল মার্কেটিং ও ডিজিটাল স্কিলের প্রয়োজনীয় ও ইন-ডিমান্ড দক্ষতাগুলোকে সহজী ও সংগঠিত করা । জেনে নিন, আমরা কোন স্কিলগুলো কোর্স কাজ করছি এবং ভবিষ্যতের জন্য কী পরিকল্পনা রয়েছে ।"
      />
      <FeatureList
        features={featuresMembershipData}
        FeatureTitle="এই মেম্বারশিপ থেকে আপনি কীভাবে উপকৃত হবেন"
      />
    </div>
  );
};

export default MembershipBenefits;
