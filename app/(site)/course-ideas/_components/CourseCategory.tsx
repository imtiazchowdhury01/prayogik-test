"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
// Course categories
const categories = [
  { id: "all", name: "সকল কোর্স" },
  { id: "digital-marketing", name: "ডিজিটাল মার্কেটিং" },
  { id: "seo", name: "SEO" },
  { id: "social-media", name: "সোশ্যাল মিডিয়া" },
  { id: "content", name: "কন্টেন্ট মার্কেটিং" },
  { id: "ecommerce", name: "ই-কমার্স" },
  { id: "business", name: "বিজনেস" },
  { id: "data", name: "ডাটা অ্যানালিটিক্স" },
];

// Course ideas
const courseIdeas = [
  {
    id: "linkedin-outreach",
    title: "LinkedIn Outreach Mastery",
    category: "digital-marketing",
    type: "Micro Course",
    duration: "২৫ মিনিট",
    price: "১২,০০০",
    description:
      "LinkedIn-এ টার্গেটেড লিড জেনারেশন করার সম্পূর্ণ প্রক্রিয়া শিখুন। কীভাবে সঠিক প্রোফাইল খুঁজে বের করবেন, কানেকশন রিকোয়েস্ট পাঠাবেন এবং কনভার্সন করবেন।",
    outline: [
      "লেসন ১: টার্গেট অডিয়েন্স আইডেন্টিফিকেশন (৫ মিনিট)",
      "লেসন ২: পারফেক্ট কানেকশন রিকোয়েস্ট টেমপ্লেট (৭ মিনিট)",
      "লেসন ৩: ফলো-আপ মেসেজ স্ট্র্যাটেজি (৮ মিনিট)",
      "লেসন ৪: অটোমেশন টুলস ও টেকনিক (৫ মিনিট)",
    ],
  },
  {
    id: "google-ads",
    title: "Google Ads Setup in 30 Minutes",
    category: "digital-marketing",
    type: "Micro Course",
    duration: "২৮ মিনিট",
    price: "১৪,০০০",
    description:
      "Google Ads ক্যাম্পেইন সেটআপ করার দ্রুত ও কার্যকর পদ্ধতি শিখুন। কীওয়ার্ড রিসার্চ থেকে শুরু করে অ্যাড গ্রুপ সেটআপ, বাজেট নির্ধারণ এবং ট্র্যাকিং সিস্টেম সেটআপ পর্যন্ত সবকিছু।",
    outline: [
      "লেসন ১: অ্যাকাউন্ট সেটআপ ও কীওয়ার্ড রিসার্চ (৮ মিনিট)",
      "লেসন ২: অ্যাড গ্রুপ ও অ্যাড কপি তৈরি (১০ মিনিট)",
      "লেসন ৩: বাজেট ও বিডিং স্ট্র্যাটেজি (৫ মিনিট)",
      "লেসন ৪: ট্র্যাকিং ও অপ্টিমাইজেশন (৫ মিনিট)",
    ],
  },
  {
    id: "facebook-retargeting",
    title: "Facebook Ads Retargeting",
    category: "social-media",
    type: "Mini Course",
    duration: "৪৫ মিনিট",
    price: "১৮,০০০",
    description:
      "ফেসবুক অ্যাডে রিটার্গেটিং ক্যাম্পেইন সেটআপ করে কনভার্সন রেট বাড়ানোর কৌশল শিখুন। পিক্সেল সেটআপ, কাস্টম অডিয়েন্স তৈরি এবং ডাইনামিক প্রোডাক্ট অ্যাড সেটআপ সম্পর্কে বিস্তারিত জানুন।",
    outline: [
      "লেসন ১: পিক্সেল সেটআপ ও কাস্টম অডিয়েন্স (১০ মিনিট)",
      "লেসন ২: ফানেল স্টেজ অনুযায়ী অডিয়েন্স সেগমেন্টেশন (১০ মিনিট)",
      "লেসন ৩: ডাইনামিক প্রোডাক্ট অ্যাড সেটআপ (১০ মিনিট)",
      "লেসন ৪: রিটার্গেটিং ক্যাম্পেইন অপ্টিমাইজেশন (১৫ মিনিট)",
    ],
  },
  {
    id: "seo-fundamentals",
    title: "SEO Fundamentals",
    category: "seo",
    type: "Short Course",
    duration: "৫৫ মিনিট",
    price: "২২,০০০",
    description:
      "ওয়েবসাইট ট্রাফিক বাড়ানোর জন্য প্রয়োজনীয় সকল SEO কৌশল শিখুন। অন-পেজ ও অফ-পেজ অপ্টিমাইজেশন, কীওয়ার্ড রিসার্চ, কন্টেন্ট স্ট্র্যাটেজি এবং ব্যাকলিংক বিল্ডিং সম্পর্কে বিস্তারিত জানুন।",
    outline: [
      "লেসন ১: অন-পেজ ও অফ-পেজ SEO টেকনিক (১৫ মিনিট)",
      "লেসন ২: কীওয়ার্ড রিসার্চ ও কন্টেন্ট অপ্টিমাইজেশন (১৫ মিনিট)",
      "লেসন ৩: ব্যাকলিংক বিল্ডিং স্ট্র্যাটেজি (১৫ মিনিট)",
      "লেসন ৪: SEO টুলস ও অ্যানালিটিক্স (১০ মিনিট)",
    ],
  },
  {
    id: "email-marketing",
    title: "Email Marketing Automation",
    category: "digital-marketing",
    type: "Mini Course",
    duration: "৪০ মিনিট",
    price: "১৬,০০০",
    description:
      "ইমেইল মার্কেটিং অটোমেশন সেটআপ করে সেলস ও কনভার্সন বাড়ানোর কৌশল শিখুন। ইমেইল সিকোয়েন্স, সেগমেন্টেশন, A/B টেস্টিং এবং অ্যানালিটিক্স সম্পর্কে বিস্তারিত জানুন।",
    outline: [
      "লেসন ১: ইমেইল সিকোয়েন্স সেটআপ (১০ মিনিট)",
      "লেসন ২: কনভার্সন-ফোকাসড ইমেইল কপি লেখা (১০ মিনিট)",
      "লেসন ৩: A/B টেস্টিং ও অপ্টিমাইজেশন (১০ মিনিট)",
      "লেসন ৪: ইমেইল অটোমেশন ও ফলো-আপ (১০ মিনিট)",
    ],
  },
  {
    id: "content-marketing",
    title: "Content Marketing Strategy",
    category: "content",
    type: "Mini Course",
    duration: "৩৫ মিনিট",
    price: "১৫,০০০",
    description:
      "কার্যকর কন্টেন্ট মার্কেটিং স্ট্র্যাটেজি তৈরি করার পদ্ধতি শিখুন। কন্টেন্ট ক্যালেন্ডার প্ল্যানিং, ভাইরাল কন্টেন্ট তৈরি এবং কন্টেন্ট ডিস্ট্রিবিউশন চ্যানেল সম্পর্কে বিস্তারিত জানুন।",
    outline: [
      "লেসন ১: কন্টেন্ট ক্যালেন্ডার প্ল্যানিং (১০ মিনিট)",
      "লেসন ২: ভাইরাল কন্টেন্ট তৈরির কৌশল (১০ মিনিট)",
      "লেসন ৩: কন্টেন্ট ডিস্ট্রিবিউশন চ্যানেল (১০ মিনিট)",
      "লেসন ৪: কন্টেন্ট পারফরম্যান্স মেজারমেন্ট (৫ মিনিট)",
    ],
  },
  {
    id: "shopify-store",
    title: "Shopify Store Setup",
    category: "ecommerce",
    type: "Mini Course",
    duration: "৫০ মিনিট",
    price: "২০,০০০",
    description:
      "শূন্য থেকে একটি সম্পূর্ণ Shopify স্টোর সেটআপ করার পদ্ধতি শিখুন। থিম সিলেকশন, প্রোডাক্ট আপলোড, পেমেন্ট গেটওয়ে সেটআপ, শিপিং কনফিগারেশন এবং স্টোর অপ্টিমাইজেশন সম্পর্কে বিস্তারিত জানুন।",
  },
  {
    id: "instagram-growth",
    title: "Instagram Growth Hacking",
    category: "social-media",
    type: "Micro Course",
    duration: "৩০ মিনিট",
    price: "১৩,০০০",
    description:
      "ইনস্টাগ্রামে অর্গানিক ফলোয়ার বাড়ানোর প্রমাণিত কৌশল শিখুন। কন্টেন্ট স্ট্র্যাটেজি, হ্যাশট্যাগ অপ্টিমাইজেশন, এনগেজমেন্ট বাড়ানো এবং ফলোয়ার-টু-কাস্টমার কনভার্সন সম্পর্কে বিস্তারিত জানুন।",
  },
  {
    id: "data-visualization",
    title: "Data Visualization for Marketers",
    category: "data",
    type: "Mini Course",
    duration: "৪৫ মিনিট",
    price: "১৭,০০০",
    description:
      "মার্কেটিং ডাটা ভিজ্যুয়ালাইজেশন করার পদ্ধতি শিখুন। Google Data Studio, Tableau এবং Excel-এ ইন্টারেক্টিভ ড্যাশবোর্ড তৈরি করে মার্কেটিং পারফরম্যান্স রিপোর্টিং সম্পর্কে বিস্তারিত জানুন।",
  },
  {
    id: "business-model-canvas",
    title: "Business Model Canvas",
    category: "business",
    type: "Micro Course",
    duration: "২৫ মিনিট",
    price: "১২,০০০",
    description:
      "বিজনেস মডেল ক্যানভাস ব্যবহার করে আপনার ব্যবসার মডেল পরিকল্পনা করার পদ্ধতি শিখুন। কাস্টমার সেগমেন্ট, ভ্যালু প্রপোজিশন, রেভিনিউ স্ট্রিম এবং কস্ট স্ট্রাকচার সম্পর্কে বিস্তারিত জানুন।",
  },
  {
    id: "youtube-seo",
    title: "YouTube SEO Mastery",
    category: "seo",
    type: "Mini Course",
    duration: "৪০ মিনিট",
    price: "১৬,০০০",
    description:
      "ইউটিউব ভিডিও র‍্যাঙ্কিং বাড়ানোর প্রমাণিত কৌশল শিখুন। কীওয়ার্ড রিসার্চ, টাইটেল ও ডেসক্রিপশন অপ্টিমাইজেশন, থাম্বনেইল ডিজাইন এবং এনগেজমেন্ট বাড়ানোর কৌশল সম্পর্কে বিস্তারিত জানুন।",
  },
  {
    id: "facebook-group",
    title: "Facebook Group Growth & Monetization",
    category: "social-media",
    type: "Short Course",
    duration: "৬০ মিনিট",
    price: "২৪,০০০",
    description:
      "ফেসবুক গ্রুপ তৈরি, গ্রোথ এবং মনিটাইজেশন করার পদ্ধতি শিখুন। কমিউনিটি বিল্ডিং, এনগেজমেন্ট বাড়ানো, কন্টেন্ট স্ট্র্যাটেজি এবং গ্রুপ থেকে আয় করার বিভিন্ন উপায় সম্পর্কে বিস্তারিত জানুন।",
  },
];
const CourseCategory = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<
    (typeof courseIdeas)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCourses = courseIdeas.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCourseModal = (course: (typeof courseIdeas)[0]) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Open apply modal
  const openApplyModal = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_TEACHER_APP_URL}/new-proposal?query=${selectedCourse?.title}`
    );
    // setIsModalOpen(false);
    // setIsApplyModalOpen(true);
  };

  return (
    <>
      {/* Page Header */}
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tighter text-tertiary-950 sm:text-4xl md:text-5xl">
          কোর্স আইডিয়া লিস্ট
        </h1>
        <p className="mb-8 text-tertiary-950/80 md:text-xl">
          আমাদের প্ল্যাটফর্মে যে সকল কোর্স তৈরি করা যাবে তার একটি তালিকা। আপনি
          চাইলে এই লিস্ট থেকে একটি আইডিয়া বেছে নিতে পারেন অথবা আপনার নিজের
          আইডিয়া জমা দিতে পারেন।
        </p>

        {/* Search and Filter */}
        <div className="flex flex-col max-w-2xl gap-4 mx-auto mb-8 sm:flex-row">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-tertiary-400" />
            </div>
            <Input
              type="text"
              placeholder="কোর্স আইডিয়া খুঁজুন..."
              value={searchQuery}
              onChange={(e) => {
                setActiveCategory("all");
                setSearchQuery(e.target.value);
              }}
              className="py-2 pl-10 pr-3 bg-white border rounded-full border-tertiary-200 focus:ring-2 focus:ring-tertiary-300 focus:border-tertiary-300 "
            />
          </div>
          <div className="relative">
            {/* <select className="py-2 pl-3 pr-10 bg-white border rounded-full border-tertiary-200 focus:ring-2 focus:ring-tertiary-300 focus:border-tertiary-300 focus:outline-none">
                  <option value="">সকল ক্যাটাগরি</option>
                  {categories.slice(1).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select> */}
            {/* <Select>
              <SelectTrigger className="py-2 w-[180px] bg-white border rounded-full border-tertiary-200 focus:ring-2 focus:ring-tertiary-300 focus:border-tertiary-300 focus:outline-none mx-auto ">
                <SelectValue placeholder="সকল ক্যাটাগরি" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>সকল ক্যাটাগরি</SelectLabel>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {textLangChecker(category.name)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select> */}
            {/* <div className="absolute flex items-center pr-3 transform -translate-y-1/2 pointer-events-none right-3 top-1/2">
                  <Filter className="w-5 h-5 text-tertiary-400" />
                </div> */}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setSearchQuery("");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category.id === activeCategory
                  ? "bg-tertiary text-white shadow-md"
                  : "bg-white border border-tertiary-200 text-tertiary-950 hover:bg-tertiary-50"
              }`}
            >
              {textLangChecker(category.name)}
            </button>
          ))}
        </div>
      </div>

      {/* Course Ideas Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => {
          if (activeCategory !== "all" && course.category != activeCategory)
            return;
          return (
            <div
              key={course.id}
              className="overflow-hidden transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-tertiary-100 text-tertiary">
                    {textLangChecker(course.type)}
                  </span>
                  <span className="text-sm text-tertiary-700">
                    {course.duration}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-bold text-tertiary-950">
                  {textLangChecker(course.title)}
                </h3>

                <p className="mb-4 text-sm text-tertiary-950/80 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-tertiary-100">
                  <p className="font-bold text-tertiary-950">৳{course.price}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-tertiary hover:bg-tertiary-50"
                    onClick={() => openCourseModal(course)}
                  >
                    বিস্তারিত দেখুন <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-tertiary-100 text-tertiary">
                {selectedCourse?.type}
              </span>
              <span className="text-sm text-tertiary-700">
                {selectedCourse?.duration}
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold text-tertiary-950">
              {selectedCourse?.title}
            </DialogTitle>
            <DialogDescription className="text-tertiary-950/80">
              {selectedCourse?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedCourse?.outline && (
            <div className="mt-4">
              <h4 className="mb-3 text-lg font-semibold text-tertiary-950">
                কোর্স আউটলাইন:
              </h4>
              <ul className="space-y-2">
                {selectedCourse?.outline.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="bg-tertiary-100 rounded-full w-7 h-7 flex items-center justify-center  mt-0.5">
                      <span className="text-xs font-bold text-tertiary">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-tertiary-950/80">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 mt-4 border rounded-lg bg-tertiary-50 border-tertiary-100">
            <p className="mb-2 font-medium text-tertiary-950">
              এই কোর্সটি তৈরি করে আপনি পাবেন:
            </p>
            <p className="text-xl font-bold text-tertiary-950">
              ৳{selectedCourse?.price}
            </p>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              বাতিল করুন
            </Button>
            <Button
              className="text-white bg-tertiary hover:bg-tertiary-600"
              onClick={openApplyModal}
            >
              এই কোর্স তৈরি করতে আবেদন করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseCategory;
