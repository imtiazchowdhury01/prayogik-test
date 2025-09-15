import CommonGridLayout from "@/components/common/CommonGridLayout";
import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
import Course from "../../become-a-teacher/_components/icon/Course";
import HeadphoneIcon from "../_utils/HeadphoneIcon";
import { Card, CardContent } from "@/components/ui/card";
import QouteIcon from "../_utils/QouteIcon";
import Image from "next/image";
import Link from "next/link";

const PrimeIntro = () => {
  const bgColors = ["bg-[#F8F3E9]", "bg-[#E9F8F2]", "bg-[#EEF8E9]"];
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
  const reviews = [
    {
      id: 1,
      link: "https://facebook.com/ZidanShahria",
      description: "facebook/ZidanShahria",
      name: "জিদান শাহরিয়া",
      avatar: "/reviews/facebook/zidan_shahria.webp",
      text: "আজকাল অনেকেই ডিজিটাল মার্কেটিং ও সম্পর্কিত স্কিল শিখতে চান, কিন্তু কোথায় থেকে শুরু করবেন তা নিয়ে দ্বিধায় থাকেন। আমি নিজেও ৩টা কোর্স করেছি। এখানে শুধু থিওরি শেখানো হয়নি, বরং মার্কেটের আসল চাহিদার সঙ্গে মিল রেখে কনটেন্ট তৈরি করা হয়েছে। আমার মনে হয়, যদি তারা নিয়মিত নতুন টুলস আর ট্রেন্ড যোগ করে, তাহলে এই প্ল্যাটফর্ম শুধু আমাদের দেশে নয়, আন্তর্জাতিকভাবে বড় একটা জায়গা করে নিতে পারবে। যারা ক্যারিয়ার গ্রোথ চান, নতুন স্কিল অর্জন করতে চান কিংবা ডিজিটাল মার্কেটিংয়ে পেশাদার হতে চান-তাদের জন্য এটি একটি অসাধারণ জায়গা। আমি অবশ্যই সবাইকে এই প্ল্যাটফর্ম রেকমেন্ড করব।",
      bgColor: bgColors[1],
    },
    {
      id: 2,
      link: "https://facebook.com/alton.rupok",
      description: "facebook/alton.rupok",
      name: "মোঃ রূপক",
      avatar: "/reviews/facebook/mdrupok.webp",
      text: "প্রায়োগিক প্ল্যাটফর্মটা ব্যবহার করে আমার সত্যিই দারুণ লাগলো! অনলাইনে ক্যারিয়ার বানাতে চাইলে এটাই একরকম পারফেক্ট জায়গা। ভিডিওগুলো ছোট ছোট আর একদম সহজভাবে বুঝানো, তাই শিখতেও ঝামেলা হয় না। বাংলায় এমন অ্যাডভান্স কোর্স আমি আগে কোথাও দেখিনি, একদম নতুন এক্সপেরিয়েন্স বলতেই হবে। সবচেয়ে ভালো লেগেছে, দেশের সেরা মেন্টরদের কোর্স একসাথে এই প্ল্যাটফর্মে পাওয়া যায়, আর কোর্সগুলার কোয়ালিটি সত্যিই ইন্টারন্যাশনাল লেভেলের। আমি ব্যক্তিগতভাবে অনেক স্যাটিসফায়েড, আর অন্যদেরও রেকমেন্ড করব যেন প্রায়োগিক থেকে কোর্স করে।",
      bgColor: bgColors[2],
    },
  ];
  return (
    <div>
      <SectionTitle
        title="প্রায়োগিক প্রাইম কী?"
        description="বিশেষ মেম্বারশিপ ক্যাটাগরি, যেখানে আপনি শুধু প্রাইম ক্যাটাগরির সব কোর্সে একসেসই নয়, সাথে পাচ্ছেন এক্সক্লুসিভ সুবিধা। একটি সাবস্ক্রিপশনে প্রিমিয়াম কোর্স, ছাড়, আর কমিউনিটি সাপোর্ট—সব একসাথে।"
      />
      {/* common grid layout */}
      <CommonGridLayout
        data={data}
        gridClassName="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        containerClass="md:max-w-4xl max-w-7xl px-6 xl:px-0"
      />
      {/* review from facebook */}
      <section className="md:max-w-4xl max-w-7xl px-6 xl:px-0 mx-auto mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 transition-all duration-300 ease-in-out">
          {reviews.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`${testimonial.bgColor} border-0 shadow-sm h-full transition-all duration-300 ease-in-out transform`}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Quote Icon */}
                <div className="mb-4">
                  <QouteIcon />
                </div>
                {/* Testimonial Text */}
                <p className="text-gray-900 leading-relaxed text-base max-h-[400px] overflow-y-auto pb-1">
                  {testimonial.text}
                </p>
                <hr className="mb-4 border-gray-300" />
                {/* Profile Section */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="relative aspect-square w-10 h-10">
                    <Image
                      src={testimonial.avatar || "/reviews/default.png"}
                      alt={`${testimonial.name}'s profile picture`}
                      width={80}
                      height={80}
                      quality={85}
                      className="rounded-full object-cover w-full h-full"
                      loading="eager"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">
                      {testimonial.name}
                    </h4>
                    {/* <Link href={testimonial.link}> */}
                    <p className="text-gray-600 text-sm ">
                      {testimonial.description}
                    </p>
                    {/* </Link> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PrimeIntro;
