import CommonGridLayout from "@/components/common/CommonGridLayout";
import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
import Course from "../../become-a-teacher/_components/icon/Course";
import HeadphoneIcon from "../_utils/HeadphoneIcon";

const PrimeIntro = () => {
  const data = [
    {
      title: "সব প্রাইম কোর্সে আনলিমিটেড একসেস",
      description:
        "প্রাইম ক্যাটাগরির অধীনে যেসব কোর্স যুক্ত হয়, সেগুলো আপনি আলাদাভাবে না কিনেই একসেস করতে পারবেন—একটি সাবস্ক্রিপশনেই।",
      price: "",
      discount: "",
      icon: <Course />,
      color: "#8ABD77",
      cardBg: "#EEF8E9",
    },
    {
      title: "স্ট্যান্ডার্ড ও লাইভ কোর্সে ডিসকাউন্ট",
      description:
        "প্রাইম মেম্বাররা স্ট্যান্ডার্ড কোর্স, লাইভ ট্রেইনিং, ওয়ার্কশপ এবং সার্টিফিকেশন প্রোগ্রামে বিশেষ ছাড় পাবেন।",
      price: "",
      discount: "",
      icon: <Course />,
      color: "#BDAA77",
      cardBg: "#F8F3E9",
    },
    {
      title: "কমিউনিটি ও ফিডব্যাক সাপোর্ট",
      description:
        "আপনার শেখার জার্নিতে পাশে থাকবে প্রাইভেট কমিউনিটি, যেখানে পাবেন ফিডব্যাক, গাইডলাইন এবং সহায়তা।",
      price: "",
      discount: "",
      icon: <HeadphoneIcon />,
      color: "#77BDBD",
      cardBg: "#E9F7F8",
    },
  ];
  return (
    <div>
      <SectionTitle
        title="প্রায়োগিক প্রাইম কী?"
        description="বিশেষ মেম্বারশিপ ক্যাটাগরি, যেখানে আপনি শুধু প্রাইম ক্যাটাগরির সব কোর্সে একসেসই নয়, সাথে এক্সক্লুসিভ সুবিধা।একটি সাবস্ক্রিপশনে প্রিমিয়াম কোর্স, ছাড়, আর কমিউনিটি সাপোর্ট—সব একসাথে।"
      />
      {/* common grid layout */}
      <CommonGridLayout
        data={data}
        gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        containerClass="md:max-w-4xl max-w-7xl px-6 xl:px-0"
      />
    </div>
  );
};

export default PrimeIntro;
