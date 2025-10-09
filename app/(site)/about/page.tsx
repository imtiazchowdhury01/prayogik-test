import CommonGridLayout from "@/components/common/CommonGridLayout";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import React from "react";
import Course from "../become-a-teacher/_components/icon/Course";
import SectionTitle from "@/components/common/SectionTitle";
import HeadphoneIcon from "../course-roadmap/_utils/HeadphoneIcon";
import FeatureList from "@/components/common/FeatureList";
import AboutCta from "./_components/AboutCta";
import ImageContentSection from "./_components/ImageContentSection";

export default function page() {
  const PrimeOverViewdata = [
    {
      title: "অন-ডিমান্ড কোর্স",
      description:
        "লং কোর্স, শর্ট কোর্স এবং মিনি কোর্স—সবকিছুই অন-ডিমান্ড ফরম্যাটে। আপনার সুবিধামতো সময়ে শিখুন, আপনার ক্যারিয়ার লক্ষ্য পূরণে যে স্কিল প্রয়োজন শিখুন আপনার সুবিধামতো সময়ে ।",
      price: "",
      discount: "",
      icon: <Course />,
      color: "#BDAA77",
      cardBg: "#F8F3E9",
    },
    {
      title: "অনলাইন / অফলাইন ট্রেনিং",
      description:
        "নির্দিষ্ট বিষয়ের উপর আয়োজন করা হয় অনলাইন এবং অফলাইন ট্রেনিং। এক্সপার্টদের সরাসরি গাইডেন্সে হাতে-কলমে শিখে নিতে পারবেন গুরুত্বপূর্ণ স্কিলগুলো।",
      price: "",
      discount: "",
      icon: <Course />,
      color: "#777DBD",
      cardBg: "#E9ECF8",
    },
    {
      title: "লার্নিং ট্র্যাকস",
      description:
        "ক্যারিয়ারকে নির্দিষ্ট ট্র্যাকে শুরু করতে সহায়তা করার জন্য রয়েছে স্পেশালাইজড লার্নিং ট্র্যাক। SEO,গুগল এডস, সোশ্যাল মিডিয়া, কনটেন্ট মার্কেটিংসহ বিভিন্ন ক্ষেত্রে  নিজেকে স্পেশালিষ্ট হিসেবে তৈরির সুযোগ।",
      price: "",
      discount: "",
      icon: <HeadphoneIcon />,
      color: "#8ABD77",
      cardBg: "#EEF8E9",
    },
    {
      title: "প্রাইম মেম্বারশিপ",
      description:
        "প্রায়োগিক প্রাইম মেম্বারশিপ আপনাকে দেবে এক্সক্লুসিভ কনটেন্ট, বিশেষায়িত ট্র্যাক, কাস্টম সার্টিফিকেট এবং শেখার অতিরিক্ত সুবিধা- যা আপনার ক্যারিয়ারকে আরও দ্রুত এগিয়ে নেবে।",
      price: "",
      discount: "",
      icon: <Course />,
      color: "#9477BD",
      cardBg: "#F0E9F8",
    },
  ];
  const featuresPlanData = [
    {
      title: "১. ইন-ডিমান্ড কোর্স",
      points: [
        "আমাদের কোর্সগুলো সাজানো হয়েছে ইন্ডাস্ট্রির বর্তমান ও ভবিষ্যতের চাহিদা অনুযায়ী। শিক্ষার্থীরা শিখছে ঠিক সেই দক্ষতাগুলো, যেগুলো এখন বাজারে সবচেয়ে বেশি প্রয়োজন।",
      ],
    },
    {
      title: "২. এক্সপার্ট প্রফেশনাল দ্বারা পরিচালিত",
      points: [
        "প্রতিটি কোর্স ও লাইভ ট্রেনিং পরিচালনা করেন অভিজ্ঞ এক্সপার্ট প্রফেশনালরা। তারা বাস্তব অভিজ্ঞতা থেকে শেখান, যাতে শিক্ষার্থীরা শুধু থিওরি নয়, কাজের জ্ঞানও অর্জন করতে পারে।",
      ],
    },
    {
      title: "৩. নির্দিষ্ট ক্যারিয়ার ট্র্যাক",
      points: [
        "আমরা বিভিন্ন স্পেশালাইজড ক্যারিয়ার ট্র্যাক অফার করি—যেমন SEO, সোশ্যাল মিডিয়া মার্কেটিং, কন্টেন্ট মার্কেটিং, ফেসবুক অ্যাডস ইত্যাদি। এতে শিক্ষার্থীরা নির্দিষ্ট পথে দক্ষ হয়ে ক্যারিয়ার গড়তে পারে।",
      ],
    },
    {
      title: "৪. ক্যারিয়ার সাপোর্ট ও গাইডেন্স",
      points: [
        "আমরা নিয়মিত সেমিনার ও আলোচনার আয়োজন করি, যেখানে সিনিয়র প্রফেশনালরা শিক্ষার্থীদের গাইড করেন। তারা ট্রেন্ড, পরিবর্তন ও ভবিষ্যৎ সুযোগ নিয়ে ধারণা দেন, যাতে সঠিক দিক ও কোর্স বেছে নেওয়া সহজ হয়।",
      ],
    },
    {
      title: "৫. শক্তিশালী কমিউনিটি ও নেটওয়ার্ক",
      points: [
        "প্রায়োগিক - এ শিক্ষার্থীরা শুধু একা শিখে না, বরং একটি কমিউনিটির অংশ হয়ে ওঠে। সহপাঠী ও এক্সপার্টদের সাথে নেটওয়ার্কিংয়ের মাধ্যমে তারা শিখতে, শেয়ার করতে ও বেড়ে উঠতে পারে।",
      ],
    },
    {
      title: "৬. প্রায়োগিক প্রাইম-এ আরও সুযোগ",
      points: [
        "প্রাইম মেম্বার হলে প্রতিটি কোর্সের সাথে পাবেন কাস্টম সার্টিফিকেট, এক্সক্লুসিভ কনটেন্ট, আর বিশেষ ট্র্যাকস। যা আপনার ক্যারিয়ারকে আরও দ্রুত এগিয়ে নেবে।",
      ],
    },
  ];

  const ctaCards = [
    {
      title: "ক্যারিয়ার গড়ুন আজই",
      description:
        "আজ থেকেই শুরু করুন আপনার ক্যারিয়ার যাত্রা, অর্জন করুন প্রতিযোগিতামূলক দক্ষতা।",
      link: "/courses",
      buttonText: "কোর্স গুলো দেখুন",
    },
    {
      title: "মেন্টরশিপ শুরু করুন",
      description:
        "আপনার দক্ষতা ও অভিজ্ঞতা শেয়ার করে ভবিষ্যৎ প্রজন্মকে এগিয়ে নিতে সাহায্য করুন।.",
      link: "/become-a-teacher",
      buttonText: "মেন্টর হতে বিস্তারিত জানুন",
    },
  ];
  return (
    <div className="space-y-28">
      <CommonHeroSection
        title="প্রায়োগিক - ডিজিটাল মার্কেটিং শেখার কমপ্লিট প্ল্যাটফর্ম"
        description="প্রায়োগিক হলো একটি ক্যারিয়ার-কেন্দ্রিক ডিজিটাল লার্নিং প্লাটফর্ম, যেখানে এক্সপার্টদের তৈরি কোর্স, লাইভ ট্রেনিং, ওয়ার্কশপ এবং ক্যারিয়ার ট্র্যাকের মাধ্যমে আপনি শুধু স্কিল অর্জনই করবেন না, বরং বাস্তবে প্রয়োগ করে ক্যারিয়ারে এগিয়ে যাবেন।"
        backgroundImage="/Launching-offer-BG.svg"
        imageSrc="/images/prime/video-frame-bg.webp"
        badgeText="আমাদের সম্পর্কে"
        showBadge={true}
        badgeClassName="bg-[#119D90] text-white"
        titleClass="lg:leading-[1.3] xl:leading-[1.3] 2xl:leading-[1.3]"
      />
      <ImageContentSection />
      <section>
        <SectionTitle
          title="প্রায়োগিক - এ যা থাকছে"
          description="ভালোভাবে শেখা এবং সফল হওয়ার উদ্দেশ্যে প্রায়োগিক - এ রয়েছে নানা উদ্যোগ।"
        />
        {/* common grid layout */}
        <CommonGridLayout
          data={PrimeOverViewdata}
          gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
          containerClass="md:max-w-4xl max-w-7xl px-6 xl:px-0"
        />
      </section>
      <section>
        <SectionTitle
          title="কেন প্রায়োগিক?"
          description="প্রায়োগিক অন্যদের থেকে আলাদা। আমরা তৈরি করছি একটি পূর্ণাঙ্গ লার্নিং ইকোসিস্টেম, যেখানে শিক্ষার্থীরা শিখবে সেই দক্ষতা যা তাদের ক্যারিয়ার গড়তে সত্যিই কাজে লাগবে।"
        />
        <FeatureList features={featuresPlanData} FeatureTitle="" />
      </section>
      <section className="pb-28">
        <AboutCta cards={ctaCards} />
      </section>
    </div>
  );
}
