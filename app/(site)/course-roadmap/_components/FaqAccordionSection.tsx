// @ts-nocheck
"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const FaqAccordionSection = () => {
  const [openItems, setOpenItems] = useState({ 0: true });

  const toggleItem = (index) => {
    setOpenItems((prev) => {
      if (prev[index]) {
        return { ...prev, [index]: false };
      }
      return { [index]: true };
    });
  };

  const faqs = [
    {
      question: "কোন কোন কোর্স প্রাইমের মেম্বারা ফ্রিতে এক্সেস করতে পারবেন?",
      answer:
        "প্রাইমের মেম্বারা সকল প্রাইমের কোর্স সম্পূর্ণ ফ্রিতে এক্সেস পাবেন।",
    },
    {
      question: "কোন কোর্সগুলো প্রাইমের মেম্বারা ছাড়ে পেতে পারেন?",
      answer: "প্রাইমের মেম্বারশিপ নিয়ে আপনি বিশেষ ছাড়ে কোর্স কিনতে পারবেন।",
    },
    {
      question: "নতুন কোর্স যুক্ত হলে প্রাইমের মেম্বারা কি নোটিশ এক্সেস পারেন?",
      answer:
        "হ্যাঁ, নতুন কোর্স যুক্ত হলে প্রাইমের মেম্বারা তাৎক্ষণিক নোটিফিকেশন পাবেন।",
    },
    {
      question: "সার্টিফিকেশন রাইটিং করতে কি রিকোয়ার পাওয়া যাবে?",
      answer:
        "সার্টিফিকেশনের জন্য প্রয়োজনীয় সকল রিসোর্স এবং গাইডলাইন প্রদান করা হবে।",
    },
  ];

  return (
    <section className="py-6 xs:py-8 sm:py-12 md:py-16 bg-white mb-6 xs:mb-8 sm:mb-12 md:mb-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-start">
          {/* Left side - Heading and description */}
          <div className="space-y-3 xs:space-y-4 sm:space-y-6">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              আপনার সব প্রশ্নের সহজ সমাধান, এক জায়গায় ।
            </h2>
            <p className="text-gray-600 text-xs xs:text-sm sm:text-base lg:text-lg leading-relaxed">
              আপনার সব প্রশ্নের নিখুঁত উত্তর ও সহজ উপায় এখন এক জায়গায় পাবেন,
              দেখুন সব কিছু একসাথে সাজানো হয়েছে আপনার সুবিধার জন্য।
            </p>

            {/* Decorative image */}
            <div className="pt-4 xs:pt-6 sm:pt-10 lg:pt-20">
              <Image
                src="/roadmap/faq-image.png"
                alt="FAQ icon"
                width={172}
                height={44}
                className="object-cover w-auto h-auto max-w-full max-h-8 xs:max-h-10 sm:max-h-none"
                priority={true}
              />
            </div>
          </div>

          {/* Right side - FAQ items */}
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 transition-colors duration-200"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className={`w-full ${
                    index === 0 
                      ? "pb-3 xs:pb-4 sm:pb-5 md:pb-6" 
                      : "py-3 xs:py-4 sm:py-5 md:py-6"
                  } text-left flex items-start sm:items-center justify-between transition-all duration-200 rounded-sm`}
                  aria-expanded={openItems[index]}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-xs xs:text-sm sm:text-base lg:text-lg font-semibold text-black pr-2 xs:pr-3 sm:pr-4 flex-1 text-left leading-tight">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 mt-0.5 xs:mt-1 sm:mt-0">
                    <div
                      className={`w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${
                        openItems[index] ? "bg-black" : "bg-gray-200"
                      } rounded-full flex items-center justify-center transition-colors duration-200`}
                    >
                      {openItems[index] ? (
                        <ArrowUp
                          className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-white"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowDown
                          className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-black"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                </button>

                {openItems[index] && (
                  <div
                    className="pb-3 xs:pb-4 sm:pb-5 md:pb-6"
                    id={`faq-answer-${index}`}
                  >
                    <p className="text-gray-600 text-xs xs:text-sm md:text-base leading-relaxed animate-fade-in">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqAccordionSection;