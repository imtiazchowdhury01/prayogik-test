import React from "react";
import Image from "next/image";
import profileBlankImage from "@/public/profile/blank-profile.webp";
import TestimonialModal from "@/components/common/TestimonialModal";
import CertificationSectionTitle from "./certification-section-title";

const CertificationLearnersComments = () => {
  const certificationTestimonials = [
    {
      id: 4,
      course: "এসইও জব প্রিপারেশন কোর্স",
      name: "আহসান চৌধুরী",
      avatar: "/reviews/facebook/Ahsan Chowdhury.webp",
      text: "নতুন বা মিডলেভেল SEO শিখতে বা দক্ষতা বাড়াতে চাইলে প্রায়োগিক বাংলাদেশের অন্যতম শীর্ষ ই-লার্নিং প্ল্যাটফর্ম। অত্যন্ত প্রফেশনাল ও সুপারিশকৃত।",
    },
    {
      id: 6,
      course: "মাস্টারিং কন্টেন্ট স্ট্রাটেজি",
      name: "মোঃ অলিউল্লাহ মির্ধা",
      avatar: "/reviews/facebook/mridha.webp",
      text: "বাংলাদেশের অনলাইন লার্নিং প্ল্যাটফর্মগুলোর মধ্যে আপনাদের কোর্সগুলো সত্যিই আলাদা। সাজানো-গোছানো ছোট ছোট ভিডিওতে শেখা অনেক সহজ হয়েছে। যদি প্র্যাকটিক্যাল অ্যাসাইনমেন্ট আর এমসিকিউ যুক্ত হয়, তাহলে শিক্ষার্থীরা আরও দক্ষ হয়ে উঠবে। আমি নির্দ্বিধায় অন্যদেরও এই প্ল্যাটফর্ম রেকমেন্ড করব।",
    },
    {
      id: 11,
      course: "মাস্টারিং কন্টেন্ট স্ট্রাটেজি",
      name: "উমর ফারুক",
      avatar: "/reviews/omarfaruk.webp",
      text: "প্রায়োগিকের বহুমুখী কোর্সে অংশগ্রহণ আমার জন্য জ্ঞান ও দক্ষতা বৃদ্ধির এক অসাধারণ অভিজ্ঞতা ছিল প্রায়োগিকের এই উদ্যোগ নিঃসন্দেহে প্রশংসনীয়। আমি মনে করি এই প্লাটফর্মের মাধ্যমে শিক্ষার্থীরা অনেক উপকৃত হবে। আমি শর্ট কোর্স থেকে আমি বাস্তব অর্থেই অনেক জ্ঞান অর্জন করেছি। তাই আমি প্রোয়োগিকের এই প্লাটফর্মের কোর্সগুলো আমি নিরদ্বিধায় রেকোমেন্ড করছি।",
    },
    {
      id: 7,
      course: "এসইও জব প্রিপারেশন কোর্স",
      name: "নজরুল ইসলাম তুহিন",
      avatar: "/reviews/facebook/nazrul-islam-tohin.webp",
      text: "প্রায়োগিকের কোর্সে আমার সেরা অভিজ্ঞতা। ডিজিটাল মার্কেটার ও অনলাইন বিজনেস এর জন্য এই প্লাটফর্ম অনেক কার্যকর। টপিক গুলো সংক্ষিপ্ত ও প্রাকটিক্যাল হয়াতে শেখা সহজ এবং আরও কার্যকর হবে লার্নারদের জন্য। ভিডিও ও অডিও কোয়ালিটি অনেক ভালো। নতুন কিছু শেখার জন্য অনেক উপকারী। ডিজিটাল মার্কেটিং শেখার জন্য অনেক দারুন প্লাটফর্ম। শিক্ষার্থীরা নতুন কিছু বাস্তবে কাজে লাগানোর সেরা প্লাটফর্ম, ইনশাল্লাহ।",
    },
  ];

  return (
    <div
      id="review"
      className="flex flex-col justify-start items-start relative gap-4 max-w-4xl"
    >
      <CertificationSectionTitle title="লার্নারদের মন্তব্য" />

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {certificationTestimonials.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-start items-start gap-2.5 p-4 rounded-lg bg-white border-[1.2px] border-[#dfedeb] shadow-[0px_4px_4px_0px_rgba(2,22,20,0.02)]"
          >
            <div className="flex flex-col justify-start items-start relative gap-4">
              <div className="flex justify-start items-center relative gap-3">
                <div className="w-12 h-12 relative overflow-hidden rounded-[27px]">
                  <Image
                    src={item.avatar || profileBlankImage}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="object-cover"
                    sizes="48px"
                    quality={100}
                    priority
                  />
                </div>
                <div className="flex flex-col justify-start items-start relative gap-1">
                  <p className="text-base font-semibold text-left text-[#021614]">
                    {item.name}
                  </p>
                  <p className="text-sm text-left text-[#41504f]">
                    {item.course}
                  </p>
                </div>
              </div>
              {/* Testimonial Text */}
              <TestimonialModal testimonial={item} />
              {/* <p className="text-base text-[#41504f] font-normal text-justify">
                “{item.comment}”
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationLearnersComments;
