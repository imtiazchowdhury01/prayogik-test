import React from "react";
import CTA from "./_component/CTA";
import { BootcampTabs } from "./_component/BootcampTabs";
import { BootcampSummary } from "./_component/BootcampSummary";
import { BootcampCurriculum } from "./_component/BootcampCurriculum";
import { BootcampInstructors } from "./_component/BootcampInstructors";
import { BootcampFAQ } from "./_component/BootcampFAQ";
import { RelatedBootcamps } from "./_component/RelatedBootcamps";
import { BootcampHeader } from "./_component/BootcampHeader";
import AdditionalFeatures from "./_component/AdditionalFeatures";
import RelatedSkills from "./_component/RelatedSkills";
import BootcampSchedule from "./_component/BootcampSchedule";
import { StudentFeedback } from "./_component/StudentFeedback";
import BootcampSidebar from "./_component/BootcampSidebar";

export default function page() {
  return (
    <div className="bg-white">
      <div className="app-container">
        <main className="flex flex-wrap items-start gap-10">
          <div className="flex-1 rounded-lg shrink basis-0 min-w-60 max-md:max-w-full">
            <div className="flex flex-col justify-center w-full mt-5 text-base max-md:max-w-full">
              <BootcampHeader />
              <BootcampTabs />
              <BootcampSummary />
              <BootcampCurriculum />
              <AdditionalFeatures />
              <BootcampInstructors />
              <RelatedSkills />
              <BootcampSchedule />
              <StudentFeedback />
              <BootcampFAQ />
              <RelatedBootcamps />
            </div>
          </div>
          <BootcampSidebar />
        </main>
      </div>
      <CTA />
    </div>
  );
}
