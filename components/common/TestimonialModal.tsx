//@ts-nocheck
"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const TestimonialModal = ({ testimonial }: any) => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadMore = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTestimonial(null);
  };

  // Function to check if text needs truncation (roughly 3 lines worth of characters)
  const shouldShowReadMore = (text: string) => {
    return text && text.length > 140; // Adjust this number based on your design
  };

  const getPreviewText = (text: string, limit: number = 140) => {
    if (!text) return "";
    if (text.length <= limit) return text;

    // Cut at limit
    let truncated = text.slice(0, limit);

    // Ensure we don't cut in the middle of a word
    if (text[limit] !== " ") {
      truncated = truncated.slice(0, truncated.lastIndexOf(" "));
    }

    return truncated + " ...";
  };
  return (
    <>
      <div className="text-gray-950 mb-6 leading-relaxed text-base flex-grow md:overflow-hidden text-justify">
        {shouldShowReadMore(testimonial?.text) ? (
          <p className="inline">
            <span>{getPreviewText(testimonial?.text, 140)}</span>{" "}
            <button
              className="text-sm text-gray-600 hover:text-gray-700 hover:underline inline font-medium"
              onClick={() => handleReadMore(testimonial)}
            >
              আরো পড়ুন
            </button>
          </p>
        ) : (
          <p>{testimonial?.text}</p>
        )}
      </div>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="sr-only"></DialogTitle>
          </DialogHeader>

          {selectedTestimonial && (
            <div className="space-y-4">
              {/* Quote Icon */}
              <div>
                <svg
                  width="25"
                  height="19"
                  viewBox="0 0 25 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.211166 17.5798C1.28327 13.1103 4.87003 4.79703 6.84922 0.5096C6.99345 0.197162 7.30567 0 7.64979 0H10.7283C11.3328 0 11.7806 0.593271 11.6261 1.17774C10.7736 4.40195 8.73682 12.8535 7.67508 17.8955C7.58842 18.3071 7.22666 18.6 6.8061 18.6H1.04555C0.498233 18.6 0.0835014 18.112 0.211166 17.5798Z"
                    fill="#414B4A"
                  />
                  <path
                    d="M24.3031 1.02028C23.231 5.48975 19.6442 13.8031 17.6651 18.0905C17.5208 18.4029 17.2086 18.6001 16.8645 18.6001H13.786C13.1815 18.6001 12.7336 18.0068 12.8882 17.4224C13.7407 14.1981 15.7775 5.74658 16.8392 0.704559C16.9259 0.29302 17.2876 9.72748e-05 17.7082 9.72748e-05H23.4687C24.016 9.72748e-05 24.4308 0.488056 24.3031 1.02028Z"
                    fill="#414B4A"
                  />
                </svg>
              </div>

              {/* Full testimonial text - shows complete text */}
              <p className="text-gray-900 leading-relaxed text-base max-h-[400px] overflow-y-auto">
                {selectedTestimonial.text}
              </p>

              <hr className="border-gray-300" />

              {/* Profile Section */}
              <div className="flex items-center gap-3">
                <div className="relative aspect-square w-12 h-12">
                  <Image
                    src={selectedTestimonial.avatar || "/reviews/default.png"}
                    alt={`${selectedTestimonial.name}'s profile picture`}
                    width={80}
                    height={80}
                    quality={75}
                    className="rounded-full object-cover w-full h-full"
                    loading="eager"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {selectedTestimonial.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {selectedTestimonial.title}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestimonialModal;
