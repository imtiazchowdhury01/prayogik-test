import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
import OfferVideoSection from "./OfferVideoSection";

const FoundersVision = () => {
  const dataSrc = {
    videoSrc: "",
    imageSrc: "/images/prime/founder-video-image.webp",
  };
  return (
    <div>
      <SectionTitle
        title="ফাউন্ডারের ভিশন:প্রায়োগিক প্রাইম কেন অন্যরকম?"
        description="ডিজিটাল মার্কেটারদের ক্যারিয়ার এবং দক্ষতা বৃদ্ধিতে প্রায়োগিক প্রাইম কীভাবে একটি গুরুত্বপূর্ণ ভূমিকা পালন করবে, সে বিষয়ে আমাদের ফাউন্ডারের ভিশন জানুন। তার ভাবনা থেকে ধারণা নিন কেন এটি অন্য যেকোনো প্ল্যাটফর্ম থেকে আলাদা।"
        descriptionClassName="max-w-4xl md:px-8"
      />
      {/* hero video section */}
      <OfferVideoSection dataSrc={dataSrc} customOpacity={0.01} />
    </div>
  );
};

export default FoundersVision;
