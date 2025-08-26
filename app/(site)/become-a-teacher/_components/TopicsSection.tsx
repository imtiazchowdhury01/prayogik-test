// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { ArrowRight, CheckCircle, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import courseCategoryImage from "public/course-proposals/category-section.webp";

const TopicsSection = () => {
  const [activeCategory, setActiveCategory] = useState("digital-marketing");
  const [topicCat, settopicCat] = useState("");

  const categories = [
    {
      id: "digital-marketing",
      name: "ডিজিটাল মার্কেটিং & SEO",
      icon: "🚀",
      image: "/placeholder.svg",
    },
    {
      id: "ecommerce",
      name: "ই-কমার্স ও ড্রপশিপিং",
      icon: "🛒",
      image: "/placeholder.svg",
    },
    {
      id: "copywriting",
      name: "কপিরাইটিং ও কন্টেন্ট মার্কেটিং",
      icon: "✍️",
      image: "/placeholder.svg",
    },
    {
      id: "data-analytics",
      name: "ডাটা অ্যানালিটিক্স",
      icon: "📊",
      image: "/placeholder.svg",
    },
    {
      id: "business",
      name: "বিজনেস স্ট্র্যাটেজি ও গ্রোথ",
      icon: "📈",
      image: "/placeholder.svg",
    },
  ];

  const topicsByCategory = {
    "digital-marketing": [
      "LinkedIn Ads",
      "Facebook Ads",
      "Google Ads",
      "SEO",
      "Link Building",
      "Local SEO",
      "Shopify SEO",
      "Parasite SEO",
      "Guest Posting",
      "Digital PR",
      "Content Strategy",
      "Email Marketing",
      "Social Media Management",
      "Influencer Marketing",
    ],
    ecommerce: [
      "Amazon FBA",
      "Dropshipping",
      "Print on Demand",
      "Dropshipping Facebook Ad Strategy",
      "Dropshipping Facebook UGC Ad Creation",
      "Shopify Store Setup",
      "Product Research",
      "Inventory Management",
      "Customer Service",
    ],
    copywriting: [
      "LinkedIn Copywriting",
      "Landing Page Copy",
      "1-Page Marketing Plan",
      "Authority First Content Creation",
      "Linkable Content Creation",
      "Interview Content Creation",
      "Email Copywriting",
      "Sales Page Copywriting",
    ],
    "data-analytics": [
      "Google Analytics",
      "Mastering SERP Analysis",
      "PPC Fundamentals",
      "SaaS GTM Strategy",
      "Data Visualization",
      "Excel for Marketers",
      "Marketing ROI Analysis",
    ],
    business: [
      "Cold Outreach",
      "LinkedIn Outreach",
      "Twitter Lead Generation",
      "Topical Authority",
      "Make Money with SEO",
      "Become a Media Buyer",
      "Business Model Canvas",
      "Pricing Strategy",
    ],
  };

  // Find the active category object
  const activeCategory_obj = categories.find(
    (cat) => cat.id === activeCategory
  );

  return (
    <section
      id="topics"
      className="w-full bg-white py-12 md:py-16 lg:py-24 xl:py-32"
    >
      <div className="app-container">
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="course-proposal-heading">
              কোন স্কিল ক্যাটাগরিতে যুক্ত হওয়া যাবে?
            </h2>
            <p className="course-proposal-description max-w-5xl text-sm sm:text-base md:text-lg">
              প্রধানত অনলাইন এন্টারপ্রেনিয়ারশিপ ও ডিজিটাল মার্কেটিং
              ক্যাটাগরিতেই আমাদের ফোকাস। তবে আপনি চাইলে স্কিল ডেভেলপমেন্ট,
              ক্যারিয়ার গঠন, ব্যবসা শুরু করা, কিংবা যেকোনো সৃজনশীল দক্ষতা নিয়ে
              আমাদের সাথে যুক্ত হতে পারেন। আমরা সবসময় এমন বিষয় খুঁজছি যেগুলো
              বাস্তব জীবনে কাজে লাগে ও তরুণদের ক্যারিয়ারে বাস্তব পরিবর্তন আনে।
            </p>
          </div>
        </div>

        {/* category and search bar container */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8 mb-6 sm:mb-8 md:mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  settopicCat("");
                }}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-brand text-white shadow-md"
                    : "bg-gray-100 text-card-black-text hover:bg-brand/10 "
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 md:w-5 md:h-5 text-card-black-text" />
            </div>
            <input
              type="text"
              value={topicCat}
              onChange={(e) => settopicCat(e.target.value)}
              className="block w-full py-1 md:py-3 pl-10 pr-3 bg-gray-100 border rounded-full border-none focus:ring-0 focus:ring-none focus:border-none focus:outline-none placeholder:text-sm sm:placeholder:text-base"
              placeholder="কোর্স টপিক খুঁজুন...."
            />
          </div>
        </div>

        {/* Category Image and Topics */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12 lg:grid-cols-5">
          {/* Left side - Category Image */}
          <div className="relative overflow-hidden rounded-xl lg:col-span-3 order-2 lg:order-1">
            <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] relative">
              <Image
                src={courseCategoryImage}
                alt={activeCategory_obj?.name || "Category image"}
                fill
                className="object-cover z-0"
                placeholder="blur"
                quality={75}
                priority
              />
              <div className="absolute left-0 bottom-0 right-0 bg-gradient-to-t from-tertiary-950/70 to-transparent h-[40%]"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white z-20">
                <div className="inline-block mb-2">
                  <span className="font-medium text-sm sm:text-base md:text-lg">
                    {activeCategory_obj?.name}
                  </span>
                </div>
                <p className="text-[#E6E7E7] text-xs sm:text-sm">
                  {activeCategory === "digital-marketing" &&
                    "ডিজিটাল মার্কেটিং ও SEO বিষয়ে দক্ষতা অর্জন করুন এবং অনলাইনে সফলতা অর্জন করুন।"}
                  {activeCategory === "ecommerce" &&
                    "ই-কমার্স ও ড্রপশিপিং এর মাধ্যমে অনলাইন ব্যবসা শুরু করুন এবং বিকাশ করুন।"}
                  {activeCategory === "copywriting" &&
                    "কার্যকর কপিরাইটিং এবং কন্টেন্ট মার্কেটিং কৌশল শিখুন যা আপনার ব্যবসাকে বাড়াবে।"}
                  {activeCategory === "data-analytics" &&
                    "ডাটা অ্যানালিটিক্স এর মাধ্যমে ব্যবসায়িক সিদ্ধান্ত নিতে শিখুন এবং ROI বাড়ান।"}
                  {activeCategory === "business" &&
                    "ব্যবসায়িক কৌশল এবং বৃদ্ধির জন্য প্রয়োজনীয় দক্ষতা অর্জন করুন।"}
                </p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Topics Cloud */}
            <div className="p-4 sm:p-6 rounded-[10px] border shadow-md h-full  lg:h-[400px] grid grid-rows-[auto_1fr_auto]">
              <h3 className="mb-3 sm:mb-4 md:mb-5 text-lg sm:text-xl font-bold text-card-black-text sticky top-0 bg-white pb-2">
                জনপ্রিয় টপিকসমূহ
              </h3>

              {/* Topics container  */}
              <div className="overflow-y-auto">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {topicsByCategory[activeCategory].map((topic, index) => {
                    if (!topic?.toLowerCase()?.includes(topicCat.toLowerCase()))
                      return;
                    return (
                      <div
                        key={index}
                        className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 transition-colors bg-white text-brand border rounded-full  border-brand/20 hover:bg-brand hover:text-white "
                      >
                        <p>{textLangChecker(topic)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Button*/}
              <Link
                href="/course-ideas"
                className="flex items-center gap-1 text-brand mt-8 lg:mt-4 font-semibold"
              >
                <span className="block">কোর্স আইডিয়া দেখুন</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-4 sm:p-6 md:p-7 rounded-mid border border-brand-accent bg-brand-accent text-card-black-text">
          <p className="text-sm sm:text-base">
            * এই ক্যাটাগরিগুলো শুধুমাত্র উদাহরণস্বরূপ উল্লেখ করা হয়েছে। আপনার
            দক্ষতা ও অভিজ্ঞতার ভিত্তিতে আপনি চাইলে নতুন বিষয়ও প্রস্তাব করতে
            পারেন। আমরা সবসময় ইন-ডিমান্ড এবং সময়ের সাথে প্রাসঙ্গিক (এভারগ্রিন)
            স্কিল যুক্ত করতে আগ্রহী।
          </p>
        </div>
      </div>
    </section>
  );
};

export default TopicsSection;
