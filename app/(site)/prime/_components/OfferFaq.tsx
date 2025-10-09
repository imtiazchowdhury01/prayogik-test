import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
import FaqComponent from "@/components/FaqComponent";
import TrialCheckoutButton from "@/components/trial-checkout-button";
import PrimeActionBanner from "./PrimeActionBanner";

const OfferFaq = ({
  trialPlan,
  trialPlanDuration,
  trialPlanPrice,
  courseLimit,
}: {
  trialPlan: any;
  trialPlanDuration: any;
  trialPlanPrice: any;
  courseLimit: any;
}) => {
  const primefaqs = [
    {
      question: "প্রায়োগিক প্রাইম কী?",
      answer:
        "প্রায়োগিক প্রাইম একটি প্রিমিয়াম মেম্বারশিপ  , যার মাধ্যমে আপনি ১, ২ অথবা ৩ বছরের জন্য সাবস্ক্রিপশন নিয়ে সব প্রাইম কোর্স করতে পারবেন। ",
    },
    {
      question: "সাবস্ক্রিপশন নিয়ে কতদিন কোর্স করতে পারবো?",
      answer:
        "আপনার সাবস্ক্রিপশন প্যাকেজ অনুযায়ী ১, ২ বা ৩ বছর কোর্স করতে পারবেন।",
    },
    {
      question: "সাবস্ক্রিপশনে কি সব প্রাইম কোর্স অন্তর্ভুক্ত? ",
      answer: "জ্বী, সাবস্ক্রিপশন নিলেই সকল প্রাইম কোর্স বিনামূল্যে পাবেন।",
    },
    {
      question:
        "অন্যান্য স্ট্যান্ডার্ড কোর্স, লাইভ ক্লাস, সেমিনার, ওয়েবিনার ও ওয়ার্কশপে কি ছাড় পাবো?",
      answer:
        "হ্যাঁ, সাবস্ক্রিপশন ক্রয় করলে স্ট্যান্ডার্ড কোর্স, লাইভ ক্লাস, সেমিনার, ওয়েবিনার ও ওয়ার্কশপে বিশেষ ছাড় পাবেন।",
    },
    {
      question: "ওয়ার্কশপ ও সেমিনারে অংশগ্রহণ করতে পারবো?",
      answer: "প্রাইম মেম্বারশিপ থাকলে যথাযথ ডিসকাউন্টে অংশ নিতে পারবেন।",
    },
    {
      question: "সাবস্ক্রিপশন শেষ হলে কী হবে?",
      answer:
        "সাবস্ক্রিপশন শেষ হলে প্রাইম কোর্সের এক্সেস বন্ধ হয়ে যাবে। পুনরায় সাবস্ক্রিপশন নিলে আবার এক্সেস পাবেন।",
    },
    {
      question: "কীভাবে সাবস্ক্রিপশন নিতে পারি?",
      answer:
        "ওয়েবসাইটে প্রায়োগিক প্রাইম পেজে গিয়ে ১, ২, বা ৩ বছরের সাবস্ক্রিপশন সিলেক্ট করে পেমেন্ট করুন।",
    },
    {
      question: "কোর্সের অগ্রগতি (প্রগ্রেস) কি সংরক্ষণ থাকবে?",
      answer:
        "জ্বী, আপনার কোর্সের অগ্রগতি সংরক্ষিত থাকবে। সাবস্ক্রিপশন রিনিউ করলে আগের অবস্থান থেকে শুরু করতে পারবেন।",
    },
    {
      question: "কোন পেমেন্ট অপশন রয়েছে?",
      answer:
        "সাধারণ ডিজিটাল পেমেন্ট সুবিধা রয়েছে; বিশেষ করে বিকাশ। বিস্তারিত ওয়েবসাইটে দেখুন।",
    },
    {
      question: "সাপোর্ট বা তথ্যের জন্য কার সাথে যোগাযোগ করবো?",
      answer:
        "কোনো সাহায্য বা তথ্যের জন্য ওয়েবসাইটের সাপোর্ট টিমের সাথে যোগাযোগ করুন।",
    },
  ];
  return (
    <div>
      <SectionTitle
        title="প্রায়োগিক প্রাইম নিয়ে প্রশ্নোত্তর"
        description="কোর্স, সাবস্ক্রিপশন বিষয়ে আপনার সকল প্রশ্নের নির্ভরযোগ্য উত্তর এক জায়গায়।"
      />
      <div className="px-6 xl:px-0">
        <FaqComponent faqItems={primefaqs} showRightSection={false} />
      </div>
      <div>
        <PrimeActionBanner
          trialPlanPrice={trialPlanPrice}
          trialPlanDuration={trialPlanDuration}
          courseLimit={courseLimit}
          backgroundImage="/images/teacher/teacher-cta-bg.webp"
          className="mb-0 xl:mb-28"
          customButton={
            <TrialCheckoutButton
              trialPlan={trialPlan}
              size={"lg"}
              variant={"primary"}
              className="bg-secondary-button hover:bg-secondary-button hover:opacity-95 text-white block rounded-md transition-all duration-300 shadow-sm text-base font-semibold px-4"
              subTextNode=""
            >
              এখনই শুরু করুন
            </TrialCheckoutButton>
          }
        />
      </div>
    </div>
  );
};

export default OfferFaq;
