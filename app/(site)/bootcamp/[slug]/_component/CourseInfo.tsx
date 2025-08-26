import React from "react";

interface CourseInfoItemProps {
  icon: string;
  text: string;
}

const CourseInfoItem: React.FC<CourseInfoItemProps> = ({ icon, text }) => (
  <div className="flex gap-1.5 items-center">
    <i className={`ti ti-${icon} w-5 h-5 text-slate-600`} aria-hidden="true" />
    <span>{text}</span>
  </div>
);

export const CourseInfo: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-5 items-center mt-3 w-full text-slate-600 max-sm:flex-col max-sm:gap-2 max-sm:items-start">
      <CourseInfoItem icon="calendar" text="১২ সপ্তাহের বুটক্যাম্প" />
      <div className="w-px h-3 bg-slate-300 max-sm:hidden" aria-hidden="true" />
      <CourseInfoItem icon="clock" text="ফুল-টাইম" />
      <div className="w-px h-3 bg-slate-300 max-sm:hidden" aria-hidden="true" />
      <CourseInfoItem icon="certificate" text="প্রফেশনাল সার্টিফিকেট" />
    </div>
  );
};
