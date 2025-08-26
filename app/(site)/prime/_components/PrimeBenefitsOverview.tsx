import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
import Course from "../../become-a-teacher/_components/icon/Course";
import CommonGridLayout from "@/components/common/CommonGridLayout";
import HeadphoneIcon from "../_utils/HeadphoneIcon";

const PrimeBenefitsOverview = () => {
  const PrimeOverViewdata = [
    {
      title: "প্রস্তুতকৃত কোর্স",
      description:
        "৫০টির বেশি কোর্সে আনলিমিটেড অ্যাক্সেস পাবেন — একসাথে সব কিছু শিখতে পারবেন নিজের গতিতে।",
      price: "45000+",
      discount: "",
      icon: <Course />,
      color: "#BDAA77",
      cardBg: "#F8F3E9",
    },
    {
      title: "প্রতি মাসে নতুন কোর্স",
      description:
        "প্রতি মাসে যুক্ত হবে গড়ে ১০টি নতুন কোর্স, যেগুলোর এক্সেস পাবেন একদম ফ্রি।",
      price: "9000",
      discount: "",
      icon: <Course />,
      color: "#777DBD",
      cardBg: "#E9ECF8",
    },
    {
      title: "প্রাইভেট কমিউনিটি ও সাপোর্ট",
      description:
        "আপনি থাকবেন একটি প্রাইভেট লার্নিং কমিউনিটিতে, যেখানে পাবেন গাইডলাইন, প্রশ্ন করার সুযোগ এবং ফিডব্যাক সাপোর্ট।",
      price: "",
      discount: "",
      icon: <HeadphoneIcon />,
      color: "#8ABD77",
      cardBg: "#EEF8E9",
    },
    {
      title: "স্ট্যান্ডার্ড ও লাইভ কোর্সে বিশেষ ছাড়",
      description:
        "আমাদের স্ট্যান্ডার্ড পেইড কোর্স, লাইভ ট্রেইনিং, ওয়ার্কশপ এবং সার্টিফিকেশন প্রোগ্রামে পাবেন এক্সক্লুসিভ ডিসকাউন্ট।",
      price: "",
      discount: "30-40",
      icon: <Course />,
      color: "#9477BD",
      cardBg: "#F0E9F8",
    },
  ];
  return (
    <div>
      <SectionTitle
        title="প্রাইম মেম্বার হলে আপনি যা পাচ্ছেন"
        description="ফাউন্ডেশন থেকে স্পেশালাইজেশন—ডিজিটাল মার্কেটিংয়ে সফল ক্যারিয়ারের জন্য প্রয়োজনীয় সবকিছু একই প্ল্যাটফরমে। একটি সাবস্ক্রিপশনে পাচ্ছেন স্কিল শেখা, ক্যারিয়ার গড়া আর প্রফেশনাল কমিউনিটির সাপোর্ট—সব একসাথে।"
        descriptionClassName="max-w-3xl"
      />
      {/* common grid layout */}
      <CommonGridLayout
        data={PrimeOverViewdata}
        gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
        containerClass="md:max-w-4xl max-w-7xl px-6 xl:px-0"
      />
    </div>
  );
};

export default PrimeBenefitsOverview;
