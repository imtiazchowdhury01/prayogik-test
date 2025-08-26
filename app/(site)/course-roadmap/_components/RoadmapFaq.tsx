import React from "react";
import FaqComponent from "@/components/FaqComponent";
import SectionTitle from "@/components/common/SectionTitle";

const RoadmapFaq = () => {
  const faqItems = [
    {
      question: "আমি কি কোর্স শেষ করার পর সার্টিফিকেট পাবো?",
      answer:
        "হ্যাঁ, সফলভাবে কোর্স সম্পন্ন করলে আপনি একটি ভেরিফায়েড ডিজিটাল সার্টিফিকেট পাবেন যা আপনার CV ও LinkedIn প্রোফাইলে যুক্ত করতে পারবেন।",
    },
    {
      question: "কোর্সে জয়েন করলে কি লাইফটাইম অ্যাক্সেস থাকবে?",
      answer:
        "হ্যাঁ, একবার কোর্সে জয়েন করলে আপনি কোর্স কনটেন্টে লাইফটাইম অ্যাক্সেস পাবেন।",
    },
    {
      question: "আমি নতুন, তবুও কি কোর্সটি করতে পারবো?",
      answer:
        "অবশ্যই। এই কোর্সটি নতুনদের জন্যও ডিজাইন করা হয়েছে, যাতে বেসিক থেকে অ্যাডভান্সড পর্যন্ত ধাপে ধাপে শিখতে পারেন।",
    },
    {
      question: "আমি কি কোর্স শেষ করার পরও সাপোর্ট পাবো?",
      answer:
        "হ্যাঁ, কোর্স শেষ করার পরও আমাদের সাপোর্ট টিম এবং কমিউনিটি থেকে সহায়তা পাবেন।",
    },
  ];

  return (
    <>
      <div>
        <SectionTitle
          title="কোর্স সম্পর্কিত সাধারণ প্রশ্ন"
          description="প্রায়োগিক কোর্স নিয়ে সব সাধারণ প্রশ্নের উত্তর সহজে খুঁজে পান এখানে।"
        />
        <div className="px-6 xl:px-0 pb-8">
          <FaqComponent faqItems={faqItems} showRightSection={false} />
        </div>
      </div>
    </>
  );
};

export default RoadmapFaq;
