import { EmptyState } from "@/components/empty-state";
import { FileText } from "lucide-react";
import React from "react";
import CertificationSectionTitle from "./certification-section-title";

const CertificationAchivedSkills = ({ data }: any) => {
  return (
    <div
      id="course-outcome-achievement"
      className="flex flex-col justify-start items-start relative gap-4 sm:gap-6 lg:gap-7 w-full max-w-4xl"
    >
      <CertificationSectionTitle title="আপনার অর্জিত দক্ষতা" />

      {!data?.skills?.length ? (
        <div className="flex flex-wrap justify-start items-center  gap-2 sm:gap-3 w-full">
          {data?.skills?.map((skill: any, index: any) => (
            <div
              key={index}
              className="flex justify-center items-center relative overflow-hidden gap-1 px-2.5 sm:px-3 lg:px-2 py-1.5 rounded bg-brand/10 "
            >
              <p className="flex-grow-0 flex-shrink-0 text-sm text-center text-brand whitespace-nowrap">
                {skill?.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="এখনো দেয়া হয়নি"
          icons={[FileText]}
          description=""
          minWidth="auto"
        />
      )}
    </div>
  );
};

export default CertificationAchivedSkills;
