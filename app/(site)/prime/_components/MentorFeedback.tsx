import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
import VideoGallery from "./VideoGallery";
import { mentorsFeedbackData } from "../../course-roadmap/_utils/data";

const MentorFeedback = () => {
  return (
    <div>
      <SectionTitle
        title="জেনে নিন মেন্টরদের মন্তব্য"
        description="প্রায়োগিকের প্রাইম সাবস্ক্রিপশন আপনার ডিজিটাল মার্কেটিং এক্সপার্টাইজ ও ক্যারিয়ার তৈরিতে গুরুত্বপূর্ণ বিনিয়োগ। শুনুন আমাদের সম্মানিত মেন্টরদের কথা, কীভাবে তারা যত্ন ও আন্তরিকতার সাথে প্রতিটি কোর্স তৈরি করেছেন। তাদের মতামত থেকে ধারণা নিন আমাদের উন্নত কোর্স কোয়ালিটি পলিসি সম্পর্কে।"
        descriptionClassName="max-w-5xl md:px-10"
      />
      <VideoGallery videos={mentorsFeedbackData} />
    </div>
  );
};

export default MentorFeedback;
