"use client";

import { ArrowDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence

export default function PrimeFaqSection() {
  const [openItems, setOpenItems] = useState<number[]>([0]); // Initialize with first item open

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqItems = [
    {
      question: "কোন কোন কোর্স প্রিমিয়াম মেম্বারশিপ ছাড়ে এক্সেস করতে পারবেন?",
      answer:
        "প্রাইম এর আওতাধীন সমস্ত প্রিমিয়াম কোর্স প্রাইম মেম্বার'রা এক্সেস করতে পারবেন।",
    },
    {
      question: "কোন কোনগুলো প্রিমিয়াম মেম্বারশিপ ছাড়ে পেতে পারবেন?",
      answer:
        "প্রিমিয়াম কোর্স ছাড়া অন্যান্য সকল কোর্সে প্রাইম মেম্বাররা বিশেষ ডিসকাউন্টে এক্সেস পাবেন।",
    },
    {
      question:
        "নতুন কোন যুক্ত হলে প্রিমিয়াম মেম্বারশিপ কি সেটিতে এক্সেস পারবেন?",
      answer:
        "অবশ্যই। নতুন কোনো প্রিমিয়াম কোর্স যুক্ত হলে সেটিতে প্রাইম মেম্বাররা ফ্রিতে এক্সেস পাবেন, এবং অন্যান্য নতুন কোর্সে থাকবে ডিসকাউন্ট সুবিধা।",
    },
    {
      question: "সাবস্ক্রিপশন বাতিল করলে কি রিফান্ড পাওয়া যাবে?",
      answer:
        "দুঃখিত, সাবস্ক্রিপশন বাতিলের ক্ষেত্রে কোনো রিফান্ড প্রদান করা হয় না।",
    },
  ];

  return (
    <div className="relative pt-10 pb-24">
      <div className="max-w-7xl mx-auto 2xl:px-0 xl:px-8 lg:px-6 md:px-7 px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Section */}
          <div className="space-y-2 lg:text-left text-left">
            <h1 className="text-4xl text-center lg:text-left lg:text-5xl font-bold text-gray-900 leading-tight mt-3">
              আপনার সব প্রশ্নের সহজ
              <br />
              সমাধান, এক জায়গায়।
            </h1>
            <p className="text-gray-600 text-base  text-center lg:text-left">
              আপনার সব প্রশ্নের নির্ভরযোগ্য ও সহজ উত্তর এখন এক আঙ্গিনায়
              <br className="hidden lg:block" />
              পাবেন, যেখানে সব কিছু একসাথে সাজানো হয়েছে আপনার
              <br className="hidden lg:block" />
              সুবিধার জন্য।
            </p>

            {/* Decorative Arrow */}
            <div className="pt-12 hidden lg:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="160"
                height="82"
                viewBox="0 0 160 82"
                fill="none"
              >
                <path
                  d="M1.39712 80.9813C34.6868 44.9821 69.8184 46.9204 90.8174 57.1766C94.0919 58.7759 101.835 62.2321 97.0539 68.3694C93.5092 72.3915 87.5669 76.2197 79.8012 72.9578C68.6903 68.2922 56.7059 58.8753 69.4968 46.1472C83.4215 32.2909 107.271 22.5996 125.628 16.473C134.532 13.5014 145.4 10.5417 154.502 9.93724C160.545 9.53597 156.346 11.0971 151.74 13.7208C146.836 16.6391 135.871 23.1525 146.729 16.6915C151.141 14.0663 152.584 12.924 157.109 10.8597C161.616 9.18195 156.772 8.51004 155.677 8.11441C152.225 6.86715 147.605 4.27844 145.813 1.26822"
                  stroke="url(#paint0_linear_19026_24951)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_19026_24951"
                    x1="160.393"
                    y1="6.36508"
                    x2="10.1825"
                    y2="95.7457"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#BFC3C2" />
                    <stop offset="0.702444" stopColor="#E8EEF0" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Right Section - FAQ */}
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`bg-white pt-1 ${
                  index !== faqItems.length - 1 ? "border-b" : ""
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className={`w-full text-left flex items-center justify-between ${
                    openItems.includes(index) ? "pb-2" : "pb-5"
                  }`}
                >
                  <span className="text-gray-900 font-medium text-lg pr-4">
                    {item.question}
                  </span>
                  <div
                    className={`p-2 rounded-full flex justify-center items-center ${
                      openItems.includes(index) ? "bg-black" : "bg-zinc-100"
                    }`}
                    style={{ width: 44, height: 44 }}
                  >
                    <ArrowDown
                      className={`w-5 h-5 rounded-full transition-transform duration-300 flex-shrink-0 ${
                        openItems.includes(index)
                          ? "text-white rotate-180"
                          : "text-gray-700"
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                        scaleY: 0,
                        transformOrigin: "top",
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        scaleY: 1,
                        transition: {
                          height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.3, delay: 0.1 },
                          scaleY: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        scaleY: 0,
                        transformOrigin: "top",
                        transition: {
                          height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.2 },
                          scaleY: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
