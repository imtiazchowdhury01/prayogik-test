import CommonHeroSection from "@/components/common/CommonHeroSection";
import React from "react";
import SuccessStory from "../_components/home/SuccessStory";
import OurExperts from "../_components/home/OurExperts";
import CertificationCourses from "./_components/certification-courses";

const CertificationPage = () => {
  return (
    <div>
      <CommonHeroSection
        title="সার্টিফিকেশন কোর্স"
        description=" আমাদের প্রায়োগিক সার্টিফিকেশন কোর্সগুলো আপনাকে প্রদান করবে প্রফেশনাল দক্ষতা, যা সরাসরি বাস্তবে কাজে লাগানো যাবে। প্রতিটি কোর্স ডিজাইন করা হয়েছে সহজবোধ্য এবং মানসম্মতভাবে, যাতে আপনি আপনার ক্যারিয়ারকে এক নতুন উচ্চতায় নিয়ে যেতে পারেন।"
        buttonText=""
        buttonLink="/courses"
        backgroundImage="/Launching-offer-BG.svg"
        imageSrc="/images/prime/video-frame-bg.webp"
      />
      <div>
        <CertificationCourses
          bgColor="bg-[#F3F9F9]"
          isCertificationPage={true}
        />
      </div>
      <SuccessStory />
      <div className="pb-24">
        <OurExperts />
      </div>
    </div>
  );
};

export default CertificationPage;
