import React from "react";
import { MessageSquare, Target, Lightbulb } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const PrayogikIntro = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "আপনার পছন্দের কোর্স খুঁজুন",
      description:
        "হাজারো কোর্সের মধ্য থেকে আপনার আগ্রহ এবং প্রয়োজন অনুযায়ী কোর্স বেছে নিন।",
    },
    {
      icon: Target,
      title: "নিয়ে দক্ষতা বাড়ান",
      description:
        "বিভিন্ন প্রকল্পে, কুইজ ও অ্যাসাইনমেন্টে জ্ঞান বাড়ান ও আত্মবিশ্বাসী হন।",
    },
    {
      icon: Lightbulb,
      title: "আপনার জ্ঞান বৃদ্ধি করুন",
      description:
        "আমাদের উন্নতমানের টুলস এবং রিসোর্স ব্যবহার করে আপনার শেখার অভিজ্ঞতাকে আরও সহজ ও কার্যকর করে তুলুন এবং অন্যদের থেকে এগিয়ে থাকুন।",
    },
  ];

  return (
    <div className="bg-brand text-white px-8 lg:px-16 py-10 rounded-l-lg">
      <div className="mx-auto">
        <div className="h-8 md:h-10 w-36 md:w-40 mb-8">
          <Link href="/">
            <Image
              src="/Prayogik-nav-logo-white.svg"
              alt="logo"
              width={0}
              height={0}
              sizes="100vw"
              className="object-cover w-full h-full"
              priority
            />
          </Link>
        </div>

        <div className="mb-12 mt-20">
          <h2 className="text-xl font-bold leading-relaxed mb-6">
            জ্ঞান অর্জন করুন, সহজে শিখুন, একসাথে এগিয়ে যান।
          </h2>
          <p className="text-base font-light text-gray-100 leading-relaxed max-w-xl">
            আপনার পছন্দের বিষয়ে সেরা কোর্সটি খুঁজে নিন। অভিজ্ঞ শিক্ষকদের কাছ
            থেকে শিখে আপনার দক্ষতাকে এক নতুন স্তরে নিয়ে যান।
          </p>
        </div>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-base font-light text-gray-100 leading-relaxed max-w-xl">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="my-16">
          <p className="text-sm opacity-75 leading-relaxed">
            *শিক্ষার্থীদের জন্য সহজ ও কার্যকর শিক্ষার পদ্ধতি সাহায্যে নতুন
            দিগন্ত উন্মোচন।
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrayogikIntro;
