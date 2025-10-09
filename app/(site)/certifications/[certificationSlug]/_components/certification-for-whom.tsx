"use client";
import React, { useState, useRef, useEffect } from "react";
import CertificationCoursesList from "./certification-courses-list";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { TextContent } from "@/components/TextContent";
import { EmptyState } from "@/components/empty-state";
import { FileText } from "lucide-react";
import CertificationSectionTitle from "./certification-section-title";

const CertificationForWhom = ({ data }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if content exceeds 2 lines
    if (contentRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(contentRef.current).lineHeight
      );
      const maxHeight = lineHeight * 3; // 2 lines
      setShouldShowButton(contentRef.current.scrollHeight > maxHeight);
    }
  }, [data?.whofor]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-4 ">
        <CertificationSectionTitle
          title={`পেশাদার সার্টিফিকেট - ${convertNumberToBangla(
            data?.totalCoursesCount
          )}
          টি কোর্স সিরিজ`}
        />

        <div className="flex flex-col justify-start items-start relative gap-5">
          {data?.whofor ? (
            <>
              <div
                ref={contentRef}
                className={`relative ${
                  !isExpanded && shouldShowButton
                    ? "max-h-12 overflow-hidden"
                    : ""
                }`}
              >
                <TextContent value={data?.whofor} />
                {!isExpanded && shouldShowButton && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
                )}
              </div>
              {shouldShowButton && (
                <button
                  onClick={toggleExpanded}
                  className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
                >
                  {isExpanded ? "মিনিমাইজ করুন" : "আরও পড়ুন"}
                </button>
              )}
            </>
          ) : (
            <EmptyState
              title="ডেসক্রিপশন নেই"
              icons={[FileText]}
              description="অনুগ্রহপূর্বক ডেসক্রিপশন যোগ করুন"
              minWidth="auto"
            />
          )}
        </div>
      </div>
      {/* others course list */}
      <CertificationCoursesList courses={data?.courses} />
    </div>
  );
};

export default CertificationForWhom;
