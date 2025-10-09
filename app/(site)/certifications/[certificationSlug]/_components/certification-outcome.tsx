import React from "react";
import { CheckCircle, FileText } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

const CertificationOutcome = ({
  data,
  preview,
}: {
  data: any;
  preview?: boolean;
}) => {
  return (
    <div
      id="course-outcome-achievement"
      className="flex flex-col gap-4 max-w-4xl"
    >
      <h2 className="text-xl font-bold text-fontcolor-title">
        আপনি কী অর্জন করবেন
      </h2>

      <div className="flex flex-col gap-4">
        {data?.learningOutcomes?.length ? (
          data?.learningOutcomes?.map((outcome: any, index: any) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <p className="text-base text-[#021614]">{outcome}</p>
            </div>
          ))
        ) : (
          <EmptyState
            title="এখনো দেয়া হয়নি"
            icons={[FileText]}
            description=""
            minWidth="auto"
          />
        )}
      </div>
    </div>
  );
};

export default CertificationOutcome;
