//@ts-nocheck
import React from "react";
import { formatDuration } from "@/lib/formatDuration";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { EmptyState } from "@/components/empty-state";
import { FileText } from "lucide-react";
import { ShowMoreLessonsClient } from "./show-more-lessons-client";

interface SyllabasProps {
  course: any;
}

const Syllabas = ({ course }: SyllabasProps) => {
  const visibleLessonCount = 10;

  return (
    <section className="mt-14" id="syllabas">
      <div className="flex items-center justify-between mb-4 sm:mb-0">
        <h4 className="sm:mb-4 mb-0 text-xl font-bold text-black">
          কোর্স সিলেবাস
        </h4>
        <p className="font-medium text-gray-700 text-[16px]">
          <span>{convertNumberToBangla(course?.lessons?.length)}টি লেসন</span>{" "}
          {formatDuration(course?.totalDuration) && (
            <span> ({formatDuration(course?.totalDuration)})</span>
          )}
        </p>
      </div>
      <div>
        {course?.lessons?.length === 0 ? (
          <EmptyState
            title="লেসন নেই"
            icons={[FileText]}
            description="অনুগ্রহপূর্বক লেসন যোগ করুন"
          />
        ) : (
          <ShowMoreLessonsClient
            course={course}
            visibleLessonCount={visibleLessonCount}
          />
        )}
      </div>
    </section>
  );
};

export default Syllabas;
