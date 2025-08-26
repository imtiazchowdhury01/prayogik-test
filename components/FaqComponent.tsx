"use client";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TeacherApplicationButton from "@/app/(site)/become-a-teacher/_components/TeacherApplicationButton";

const FaqComponent = ({
  faqItems,
  showRightSection = true, // Default to true if not provided
}: {
  faqItems: { question: string; answer: string }[];
  showRightSection?: boolean; // Default to true if not provided
}) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="relative pb-24">
      <div
        className={`${showRightSection ? "max-w-7xl" : "max-w-4xl"} mx-auto`}
      >
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Left Section - FAQ (60%) */}
          <div
            className={`${
              showRightSection ? "lg:col-span-3" : "lg:col-span-5"
            }  space-y-6`}
          >
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left flex items-center justify-between p-6 transition-colors"
                >
                  <span className="text-card-black-text font-semibold text-lg pr-4">
                    {item.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openItems.includes(index) ? (
                      <Minus className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.2, delay: 0.1 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.2 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-gray-600 text-base leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          {/* Right Section - Teacher Support (40%) */}
          {showRightSection && (
            <div className="lg:col-span-2 bg-white rounded-lg pt-8 pb-6 px-5 border border-gray-200 h-auto flex flex-col shadow-lg">
              <div className="flex justify-center mb-9">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="61"
                    height="60"
                    viewBox="0 0 61 60"
                    fill="none"
                  >
                    <path
                      d="M43 46.0742H33L21.875 53.4743C20.225 54.5743 18 53.3992 18 51.3992V46.0742C10.5 46.0742 5.5 41.0742 5.5 33.5742V18.5742C5.5 11.0742 10.5 6.07422 18 6.07422H43C50.5 6.07422 55.5 11.0742 55.5 18.5742V33.5742C55.5 41.0742 50.5 46.0742 43 46.0742Z"
                      fill="#414B4A"
                      stroke="#414B4A"
                      strokeWidth="3.75"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl lg:text-[32px] font-semibold leading-10 text-gray-900 mb-2 md:mb-4">
                শিক্ষক হিসেবে যোগদান করতে চান?
              </h2>

              <p className="text-gray-600 mb-8 xl:mb-12 2xl:mb-20">
                আপনার দক্ষতা শেয়ার করুন, অন্য করুন নিজের নিয়ন্ত্রণ, আর পেতে
                থাকুন নিয়মিতভাবে শেখার নতুন সুযোগসহ প্রতিটিতে রয়্যালটি।
              </p>
              <TeacherApplicationButton variant="full">
                রেজিস্ট্রেশন করুন
              </TeacherApplicationButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqComponent;