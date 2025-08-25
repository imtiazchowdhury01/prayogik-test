import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
// import OfferActionBanner from "./OfferActionBanner";
// import { actionBannerData } from "../_utils/data";
import FaqComponent from "@/components/FaqComponent";

const OfferFaq = () => {
  const faqItems = [
    {
      question: "কী ধরনের কোর্স তৈরি করতে পারবো?",
      answer:
        "আমাদের প্ল্যাটফর্মে তিন ধরনের শর্ট ও মিনি কোর্স তৈরি করতে পারবেন:  মাইক্রো কোর্স, মিনি কোর্স, শর্ট কোর্স ",
    },
    {
      question: "কত টাকা আয় করতে পারবো?",
      answer:
        "প্রিমিয়াম কোর্স ছাড়া অন্যান্য সকল কোর্সে প্রাইম মেম্বাররা বিশেষ ডিসকাউন্টে এক্সেস পাবেন।",
    },
    {
      question: "কিভাবে কোর্স জমা দিবো?",
      answer:
        "অবশ্যই। নতুন কোনো প্রিমিয়াম কোর্স যুক্ত হলে সেটিতে প্রাইম মেম্বাররা ফ্রিতে এক্সেস পাবেন, এবং অন্যান্য নতুন কোর্সে থাকবে ডিসকাউন্ট সুবিধা।",
    },
    {
      question: "আমি কি আমার কোর্স অন্য কোথাও বিক্রি করতে পারবো?",
      answer:
        "না, প্রায়োগিক আপনার কোর্সের সম্পূর্ণ স্বত্ব কিনে নেবে, ফলে এটি অন্য কোথাও বিক্রি বা শেয়ার করা যাবে না। তবে, কোর্সটি আপনার নামেই প্রকাশিত হবে এবং এটি আপনার অথরিটি ও ব্র্যান্ড বিল্ডিংয়ে সাহায্য করবে।",
    },
  ];
  return (
    <div>
      <div>
        <SectionTitle
          title="প্রায়োগিক প্রাইম নিয়ে প্রশ্নোত্তর"
          description="কোর্স, সাবস্ক্রিপশন বিষয়ে আপনার সকল প্রশ্নের নির্ভরযোগ্য উত্তর এক জায়গায়।"
        />
      <div className="px-6 xl:px-0">
          <FaqComponent faqItems={faqItems} showRightSection={false} />
      </div>
      </div>
      {/* <OfferActionBanner
        actionBannerData={actionBannerData}
        sectionBadge="রেগুলার ফি: "
        title="লঞ্চ অফার ফি: "
        description="মূল্য বৃদ্ধির আগেই সাবস্ক্রিপশন নিশ্চিত করুন। পরবর্তী মূল্য বৃদ্ধির তারিখঃ "
        buttonText="সাবস্ক্রাইব করুন"
        buttonLink="/prime"
        backgroundImage=""
        className="mb-0 xl:mb-28"
      /> */}
    </div>
  );
};

export default OfferFaq;
