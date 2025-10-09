import React from "react";
import CertificationInfoCard from "./certification-info-card";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

const CertificationInfos = ({ data }: any) => {
  // Helper function to format duration
  const formatDuration = (durationInSeconds: number) => {
    if (durationInSeconds === 0) return "সময়কাল নির্ধারিত হয়নি";

    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${convertNumberToBangla(hours)} ঘন্টা`);
    if (minutes > 0) parts.push(`${convertNumberToBangla(minutes)} মিনিট`);
    if (seconds > 0) parts.push(`${convertNumberToBangla(seconds)} সেকেন্ড`);

    return parts.join(" ") || "";
  };

  // Function to convert difficulty level to Bangla
  const getDifficultyLevelInBangla = (level: string) => {
    const difficultyMap: { [key: string]: string } = {
      BEGINNER: "বিগিনার",
      INTERMEDIATE: "ইন্টারমিডিয়েট",
      ADVANCED: "অ্যাডভান্সড",
    };
    return difficultyMap[level] || level;
  };

  return (
    <div className="xl:flex xl:flex-row grid md:grid-cols-2 grid-cols-1 gap-8 my-12">
      <CertificationInfoCard
        heading={`${convertNumberToBangla(
          data?.totalCoursesCount
        )}টি কোর্স সিরিজ`}
        description="কোর্স শেষ করে প্রোফেশনাল সার্টিফিকেট অর্জন করুন"
      />

      <CertificationInfoCard
        heading={`${getDifficultyLevelInBangla(data?.level)} লেভেল`}
        description="প্রস্তাবিত অভিজ্ঞতা"
      />

      <CertificationInfoCard
        heading="নমনীয় সময়সূচী"
        description="নিজের গতিতে শিখুন"
      />

      <CertificationInfoCard
        heading="ঘন্টা"
        description={`সম্পূর্ণ হতে ${convertNumberToBangla(
          formatDuration(data?.totalCoursesDuration)
        )} সময় লাগবে`}
      />
    </div>
  );
};

export default CertificationInfos;
