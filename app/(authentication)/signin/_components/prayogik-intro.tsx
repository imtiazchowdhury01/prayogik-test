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
    <div
      id="left-section"
      className="bg-brand xl:w-1/2 w-full hidden lg:flex justify-center items-center text-white px-10 xl:px-16 py-0 rounded-none xl:rounded-l-lg min-h-screen xl:min-h-fit "
    >
      <div className="mx-auto text-justify">
        <div className="h-8 md:h-10 w-36 md:w-40 xl:mb-8 mt-10">
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

        <div className="mb-8 lg:mb-10 xl:mb-16 mt-8 xl:mt-12">
          <h2 className="text-lg lg:text-xl font-bold leading-relaxed mb-4 xl:mb-4">
            জ্ঞান অর্জন করুন, সহজে শিখুন, একসাথে এগিয়ে যান।
          </h2>
          <p className=" lg:text-sm xl:text-base font-light text-gray-100 leading-relaxed max-w-xl">
            আপনার পছন্দের বিষয়ে সেরা কোর্সটি খুঁজে নিন। অভিজ্ঞ শিক্ষকদের কাছ
            থেকে শিখে আপনার দক্ষতাকে এক নতুন স্তরে নিয়ে যান।
          </p>
        </div>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="xl:w-12 w-10 xl:h-12 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="xl:w-6 w-4 xl:h-6 h-4" />
              </div>
              <div>
                <h3 className="text-md xl:text-md font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="lg:text-sm xl:text-base font-light text-gray-100 leading-relaxed max-w-xl">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 lg:mt-8 xl:my-16">
          <p className="text-xs xl:text-sm font-light xl:font-normal xl:opacity-75 leading-relaxed">
            *শিক্ষার্থীদের জন্য সহজ ও কার্যকর শিক্ষার পদ্ধতি সাহায্যে নতুন
            দিগন্ত উন্মোচন।
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrayogikIntro;
