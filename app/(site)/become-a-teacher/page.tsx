// @ts-nocheck
import type { Metadata } from "next";
import CourseTypesSection from "./_components/CourseTypesSection";
import HeroSection from "./_components/HeroSection";
import TopicsSection from "./_components/TopicsSection";
import WhyJoinSection from "./_components/WhyJoinSection";
import HowToBecomeTeacher from "./_components/HowToBecomeTeacher";
import FaqComponent from "@/components/FaqComponent";
import CtaSection from "./_components/CtaSection";

export const metadata: Metadata = {
  title: "Submit Course Proposals | Create Impactful Courses with Prayogik",
  description:
    "Have a skill to teach? Propose your course idea to Prayogik and join our community of expert instructors. Help learners build real-world skills through practical Bangla courses.",
};

const CourseProposals = async () => {
  const faqItems = [
    {
      question: "কী ধরনের কোর্স তৈরি করতে পারবো?",
      answer:
        "আমাদের প্ল্যাটফর্মে তিন ধরনের শর্ট ও মিনি কোর্স তৈরি করতে পারবেন:  মাইক্রো কোর্স, মিনি কোর্স, শর্ট কোর্স ",
    },
    {
      question: "কত টাকা আয় করতে পারবো?",
      answer:
        "প্রিমিয়াম কোর্স ছাড়া অন্যান্য সকল কোর্সে প্রাইম মেম্বাররা বিশেষ ডিসকাউন্টে এক্সেস পাবেন।",
    },
    {
      question: "কিভাবে কোর্স জমা দিবো?",
      answer:
        "অবশ্যই। নতুন কোনো প্রিমিয়াম কোর্স যুক্ত হলে সেটিতে প্রাইম মেম্বাররা ফ্রিতে এক্সেস পাবেন, এবং অন্যান্য নতুন কোর্সে থাকবে ডিসকাউন্ট সুবিধা।",
    },
    {
      question: "আমি কি আমার কোর্স অন্য কোথাও বিক্রি করতে পারবো?",
      answer:
        "না, প্রায়োগিক আপনার কোর্সের সম্পূর্ণ স্বত্ব কিনে নেবে, ফলে এটি অন্য কোথাও বিক্রি বা শেয়ার করা যাবে না। তবে, কোর্সটি আপনার নামেই প্রকাশিত হবে এবং এটি আপনার অথরিটি ও ব্র্যান্ড বিল্ডিংয়ে সাহায্য করবে।",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 space-y-10 sm:space-y-0">
        <HeroSection />
        <WhyJoinSection />
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
            <p className="course-proposal-description max-w-[450px]">
              কোর্স, সাবস্ক্রিপশন বিষয়ে আপনার সকল প্রশ্নের নির্ভরযোগ্য উত্তর এক
              জায়গায়।
            </p>
          </div>
          <FaqComponent faqItems={faqItems} />
        </div>
      </main>
    </div>
  );
};

export default CourseProposals;
