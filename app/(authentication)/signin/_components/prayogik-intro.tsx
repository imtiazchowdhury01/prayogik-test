import React from "react";
import { MessageSquare, Target, Lightbulb, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PrayogikIntro = () => {
  const review = {
    name: "Md Samran Hossain",
    profession: "SEO Specialist",
    comment:
      '<p>"আমার প্রায়োগিক প্ল্যাটফর্মটা সত্যিই ভালো লেগেছে। সবচেয়ে ভালো দিক হলো এরা মাইক্রো নিশ বা সাব-ক্যাটাগরি ভিত্তিক কোর্স করে, যেটা নির্দিষ্ট স্কিল শিখতে অনেক সহজ করে তোলে।</p><p>আরেকটা ভালো দিক হলো কোর্সের মধ্যে বেস্ট সোর্স থেকে রিসোর্স যোগ করে দেয়। যেমন – Cold Email কোর্সে তারা একটা খুবই রিসোর্সফুল YouTube ভিডিও যুক্ত করেছে।</p><p>যেটা আসলেই ভ্যালু যোগ করেছে। তাদের কোর্সগুলো শর্ট, ক্লিয়ার আর টু দ্য পয়েন্ট – যেটা টাইম বাঁচায় আর দ্রুত শেখার সুযোগ দেয়।"</p>',
    avatarUrl: "/reviews/facebook/samran-hossain.webp",
  };

  return (
    <div
      id="left-section"
      className="bg-brand xl:w-1/2 w-full hidden lg:flex justify-center items-center text-white px-10 xl:px-16 py-0 rounded-none xl:rounded-l-lg min-h-screen xl:min-h-fit "
    >
      <div className="mx-auto text-justify">
        <div className="h-8 md:h-10 w-36 md:w-40 xl:mb-8 mt-10 -ml-2">
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

        {/* Testimonial */}
        <div className="max-w-2xl mx-auto space-y-8 md:py-16 lg:py-20 xl:py-10">
          <div className="relative">
            <Quote className="absolute -top-8 left-0 w-5 h-5 text-gray-100/90 rotate-180" />
            <blockquote
              className="lg:text-base xl:text-base font-normal text-white max-w-xl space-y-2 text-left relative"
              dangerouslySetInnerHTML={{ __html: review.comment }}
            />
          </div>

          <div className="flex items-center justify-start gap-3">
            <Avatar className="w-11 h-11  border-2">
              <AvatarImage src={review.avatarUrl} alt={review.name} />
              <AvatarFallback>
                {review.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-left text-sm space-y-0.5">
              <p className="font-medium text-gray-100">{review.name}</p>
              <p className="text-gray-100 text-xs font-light">
                {review.profession}
              </p>
            </div>
          </div>
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
