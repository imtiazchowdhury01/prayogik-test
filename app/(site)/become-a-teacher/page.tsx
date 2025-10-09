// @ts-nocheck
import type { Metadata } from "next";
import CourseTypesSection from "./_components/CourseTypesSection";
import HeroSection from "./_components/HeroSection";
import TopicsSection from "./_components/TopicsSection";
import WhyJoinSection from "./_components/WhyJoinSection";
import HowToBecomeTeacher from "./_components/HowToBecomeTeacher";
import FaqComponent from "@/components/FaqComponent";
import CtaSection from "./_components/CtaSection";
import ActionBanner from "@/components/common/ActionBanner";
import SectionTitle from "@/components/common/SectionTitle";
import VideoGallery from "../course-roadmap/_components/VideoGallery";
import { mentorsFeedbackData } from "../course-roadmap/_utils/data";

export const metadata: Metadata = {
  title: "Submit Course Proposals | Create Impactful Courses with Prayogik",
  description:
    "Have a skill to teach? Propose your course idea to Prayogik and join our community of expert instructors. Help learners build real-world skills through practical Bangla courses.",
};

const CourseProposals = async () => {
  const faqItems = [
    {
      question: "মেন্টর হিসেবে যুক্ত হতে কী যোগ্যতা প্রয়োজন?",
      answer:
        "সংশ্লিষ্ট বিষয়ের গভীর জ্ঞান ও অভিজ্ঞতা থাকা প্রয়োজন। ডিজিটাল মার্কেটিং, প্রযুক্তি বা অন্য যে কোনও ইন-ডিমান্ড বিষয়ের উপর দক্ষতা থাকলে সুবিধা হবে। কন্টেন্ট তৈরি এবং অনলাইন পাঠদান করার সামর্থ্য থাকাও জরুরি।",
    },
    {
      question: "কী ধরনের কোর্স আমাদের কে দিতে পারেন?",
      answer:
        "ডিজিটাল মার্কেটিং, SEO, সোশ্যাল মিডিয়া, গ্রাফিক ডিজাইন, প্রোগ্রামিং, ফ্রিল্যান্সিং, বিজনেস স্ট্রাটেজি বা অন্যান্য যেকোনো ইন-ডিমান্ড ডিজিটাল স্কিল বা প্রফেশনাল স্কিল বিষয়ে কোর্স হতে পারে।",
    },
    {
      question: "কোর্স ইডিটিং, আপলোড ও পরিচালনার দায়িত্ব কে নেবে?",
      answer:
        "কোর্সের কন্টেন্ট মেন্টররা তৈরি করবেন, তবে ইডিটিং, টেকনিক্যাল হেল্প ও প্ল্যাটফর্ম মেইনটেনেন্স আমাদের প্রায়োগিকের টিম মেম্বাররা করবে।",
    },
    {
      question: "আমরা কি কোর্স তৈরির জন্য কোন সাহায্য পাব?",
      answer:
        "হ্যাঁ, মেন্টরদের জন্য আমাদের পক্ষ থেকে গাইডলাইন, প্রযুক্তিগত সহায়তা ও কোর্স আউটলাইন তৈরীতে সাপোর্ট প্রদান করা হবে।",
    },
    {
      question: "মেন্টরদের আয়ের ক্যালকুলেশনটা কীভাবে হবে?",
      answer:
        "শর্ট কোর্স গুলো এককালীন পেমেন্ট দিয়ে কিনে নেওয়া হয়। স্ট্যান্ডার্ড ও লাইভ কোর্স গুলোর বিক্রয় থেকে মুনাফা শেয়ার করা হবে।",
    },
    {
      question: "কোর্স মান নিয়ন্ত্রণ করার ব্যবস্থা কী?",
      answer:
        "কোর্সগুলি গুণগত মান বজায় রাখতে আমাদের রিভিউ পদ্ধতি রয়েছে। কোর্স চালুর পূর্বে মান যাচাই করা হয় এবং প্রয়োজনীয় পরিবর্তনের পরামর্শ দেয়া হয়।",
    },
    {
      question: "আমি কি আমার কোর্স অন্য কোথাও বিক্রি করতে পারবো?",
      answer:
        "দুঃখিত, আমাদের প্ল্যাটফর্মে প্রকাশিত কোর্স অন্য কোনো জায়গায় বিক্রির অনুমতি নেই। আমরা চাই আপনার কোর্সটি এক্সক্লুসিভ থাকুক, যাতে শিক্ষার্থীরা নির্ভরযোগ্যভাবে এখান থেকেই শিখতে পারে।",
    },
    {
      question: "কোন ধরনের শিক্ষাগত প্রমাণপত্র বা সার্টিফিকেট দেয়া হবে?",
      answer:
        "আমাদের পেজ থেকে সফল শিক্ষার্থীদের জন্য সার্টিফিকেট ইস্যু করা হয় যা কোর্স বিক্রেতার নাম ও প্ল্যাটফর্মের ব্র্যান্ডিং থাকবে।",
    },
    {
      question:
        "কোর্স বিক্রি ছাড়া অন্যান্য ফাংশনেও মেন্টররা অংশগ্রহণ করতে পারেন?",
      answer:
        "হ্যাঁ, মেন্টররা ওয়েবিনার, লাইভ সেশন, প্রশ্নোত্তর পর্ব ইত্যাদিতেও অংশ নিতে পারেন।",
    },
    {
      question:
        "কোর্সে ব্যবহারযোগ্য কোন সফটওয়্যার বা সরঞ্জাম সম্পর্কে দিকনির্দেশনা দেওয়া হয়?",
      answer:
        "প্রয়োজনীয় সফটওয়্যার বা সরঞ্জামের লিস্ট মেন্টরদের সাথে শেয়ার করা হয় যাতে কোর্সের মান উন্নত হয়।",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 space-y-10 sm:space-y-0">
        <HeroSection />
        <WhyJoinSection />
        <div className="pt-24">
          <div className="">
            <div className="mb-8 sm:mb-10 lg:mb-12 app-container">
              <h2 className="course-proposal-heading">মেন্টরদের মন্তব্য</h2>
              <p className="course-proposal-description max-w-3xl">
                প্রায়োগিকের সাথে কাজ করা মেন্টরদের অভিজ্ঞতা জানুন।
              </p>
            </div>
            <VideoGallery videos={mentorsFeedbackData} />
          </div>
        </div>
        <TopicsSection />
        <HowToBecomeTeacher />
        <div id="details">
          <CourseTypesSection />
        </div>
        <div className="app-container">
          {/* Section Header */}
          <div className="mb-8 sm:mb-10 lg:mb-10">
            <h2 className="course-proposal-heading">
              কোর্স সম্পর্কিত সাধারণ প্রশ্ন
            </h2>
            <p className="course-proposal-description max-w-full">
              কোর্স, সাবস্ক্রিপশন বিষয়ে আপনার সকল প্রশ্নের নির্ভরযোগ্য উত্তর এক
              জায়গায়।
            </p>
          </div>
          <FaqComponent faqItems={faqItems} />
        </div>
        {/* <div>
          <ActionBanner
            title="শিক্ষক হিসেবে যোগদান করতে চান?"
            description="আপনার দক্ষতা শেয়ার করুন, আয় করুন নিজের নিয়মে, আর গড়ে তুলুন শিক্ষার্থীদের শেখার নতুন সম্ভাবনা প্রয়োগিকে প্ল্যাটফর্মে।"
            buttonText=""
            buttonLink=""
            backgroundImage="/images/teacher/teacher-cta-bg.webp"
            className="mb-0 md:mb-28"
            showTeacherButton={true}
          />
        </div> */}
      </div>
    </div>
  );
};

export default CourseProposals;
