import FaqComponent from "@/components/FaqComponent";
import React from "react";
import CertificationSectionTitle from "./certification-section-title";

const CertificationFAQ = ({ data }: any) => {
  return (
    <div
      id="course-faq"
      className="flex flex-col max-w-4xl justify-start items-start relative gap-4"
    >
      <CertificationSectionTitle title="FAQs" size="course-proposal-heading" />

      <div className="w-full">
        <FaqComponent
          faqItems={data?.faqs}
          showRightSection={false}
          alignment="mx-left"
        />
      </div>
    </div>
  );
};

export default CertificationFAQ;
