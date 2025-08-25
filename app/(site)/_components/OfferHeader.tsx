"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const OfferHeader = () => {
  const [isVisible, setIsVisible] = useState(false); // todo: true

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="bg-[#F9851A] relative overflow-hidden"
        >
          <div className="h-fit py-2.5 app-container text-white flex items-center justify-between">
            <div className="flex items-center md:gap-8 gap-2">
              <div className="bg-white px-2.5 py-0.5 h-fit text-[#FF6709] font-medium rounded-sm md:text-base text-sm flex items-center gap-1 transition-all duration-300 hover:bg-white">
                {/* SVG icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M6.40978 16.3468C6.9023 16.3468 7.14856 16.3468 7.37291 16.43C7.40407 16.4415 7.43479 16.4543 7.46499 16.4681C7.68249 16.5679 7.85663 16.742 8.20489 17.0903C9.00652 17.8918 9.40727 18.2927 9.90044 18.3296C9.96669 18.3346 10.0334 18.3346 10.0996 18.3296C10.5928 18.2927 10.9936 17.8918 11.7951 17.0903C12.1434 16.742 12.3175 16.5679 12.535 16.4681C12.5653 16.4543 12.5959 16.4415 12.6271 16.43C12.8515 16.3468 13.0978 16.3468 13.5903 16.3468H13.6811C14.9377 16.3468 15.566 16.3468 15.9564 15.9563C16.3468 15.566 16.3468 14.9377 16.3468 13.6811V13.5903C16.3468 13.0978 16.3468 12.8515 16.43 12.6271C16.4415 12.5959 16.4543 12.5653 16.4681 12.535C16.5679 12.3175 16.742 12.1434 17.0903 11.7951C17.8919 10.9936 18.2927 10.5928 18.3296 10.0996C18.3346 10.0333 18.3346 9.96667 18.3296 9.90042C18.2927 9.40725 17.8919 9.0065 17.0903 8.20488C16.742 7.85661 16.5679 7.68248 16.4681 7.46498C16.4543 7.43477 16.4415 7.40405 16.43 7.3729C16.3468 7.14855 16.3468 6.90229 16.3468 6.40976V6.31891C16.3468 5.06233 16.3468 4.43403 15.9564 4.04366C15.566 3.65329 14.9377 3.65329 13.6811 3.65329H13.5903C13.0978 3.65329 12.8515 3.65329 12.6271 3.57005C12.5959 3.55849 12.5653 3.54576 12.535 3.5319C12.3175 3.43213 12.1434 3.258 11.7951 2.90973C10.9936 2.10815 10.5928 1.70736 10.0996 1.6704C10.0334 1.66543 9.96669 1.66543 9.90044 1.6704C9.40727 1.70736 9.00652 2.10815 8.20489 2.90973C7.85663 3.258 7.68249 3.43213 7.46499 3.5319C7.43479 3.54576 7.40407 3.55849 7.37291 3.57005C7.14856 3.65329 6.9023 3.65329 6.40978 3.65329H6.31893C5.06234 3.65329 4.43404 3.65329 4.04368 4.04366C3.6533 4.43403 3.6533 5.06233 3.6533 6.31891V6.40976C3.6533 6.90229 3.6533 7.14855 3.57006 7.3729C3.5585 7.40405 3.54578 7.43477 3.53192 7.46498C3.43214 7.68248 3.25801 7.85661 2.90974 8.20488C2.10816 9.0065 1.70737 9.40725 1.67041 9.90042C1.66545 9.96667 1.66545 10.0333 1.67041 10.0996C1.70737 10.5928 2.10816 10.9936 2.90974 11.7951C3.25801 12.1434 3.43214 12.3175 3.53192 12.535C3.54578 12.5653 3.5585 12.5959 3.57006 12.6271C3.6533 12.8515 3.6533 13.0978 3.6533 13.5903V13.6811C3.6533 14.9377 3.6533 15.566 4.04368 15.9563C4.43404 16.3468 5.06234 16.3468 6.31893 16.3468H6.40978Z"
                    stroke="#FF6709"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12.5 7.5L7.5 12.5"
                    stroke="#FF6709"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.5 12.5H12.491M7.50897 7.5H7.5"
                    stroke="#FF6709"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mt-0.5">অফার</span>
              </div>
              <p className="md:text-base text-xs leading-[0.75rem] sm:leading-[1rem] pr-8">
                সীমিত সময়ের জন্য মার্কেটিং কোর্সে ৩০% ছাড়। অফারটি চলবে আর মাত্র
                ৭ দিন।
              </p>
            </div>
            <div>
              <Link href="/prime">
                <Button
                  variant="default"
                  className="bg-white mr-6 xl:mr-0 px-2.5 py-1 h-fit text-gray-900 font-medium text-xs text-nowrap md:text-base hover:bg-white rounded-sm hover:text-brand transition-all duration-300 hidden sm:block"
                >
                  কোর্সগুলো দেখুন
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute sm:-top-1 sm:right-0 -right-2 -top-1 p-2">
            <Button
              onClick={handleClose}
              variant="transparent"
              className="text-white"
            >
              <X className="h-5 w-5 text-white/50 hover:text-white transition-all duration-300 " />
            </Button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default OfferHeader;
