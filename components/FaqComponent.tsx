"use client";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="grid grid-cols-1 gap-16 items-start">
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
        </div>
      </div>
    </div>
  );
};

export default FaqComponent;