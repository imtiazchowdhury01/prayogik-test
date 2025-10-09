import { EmptyState } from "@/components/empty-state";
import { TextContent } from "@/components/TextContent";
import { FileText } from "lucide-react";
import React from "react";
import CertificationSectionTitle from "./certification-section-title";

const CertificationDescription = ({ data }: any) => {
  return (
    <div
      id="course-description"
      className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4 max-w-4xl"
    >
      <CertificationSectionTitle title="প্রফেশনাল সার্টিফিকেট সম্পর্কে" />
      <div className="flex flex-col justify-start items-start  relative gap-6">
        {data?.description ? (
          <TextContent value={data?.description} />
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

export default CertificationDescription;
