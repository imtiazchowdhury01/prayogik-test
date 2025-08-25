import React from "react";
import FeatureList from "@/components/common/FeatureList";
import SectionTitle from "@/components/common/SectionTitle";
import { featuresRoadmapData } from "../_utils/data";

const RoadmapBenefits = () => {
  return (
    <div>
      <SectionTitle
        title="আপনার জন্য বাস্তব শেখার সুবিধা"
        description="বাস্তব প্রোজেক্ট ও দক্ষতা উন্নয়নের মাধ্যমে আপনার ক্যারিয়ারকে নতুন উচ্চতায় নিয়ে যান।"
      />
      <FeatureList features={featuresRoadmapData} FeatureTitle="" />
    </div>
  );
};

export default RoadmapBenefits;
