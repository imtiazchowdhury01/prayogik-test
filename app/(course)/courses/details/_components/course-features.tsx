// @ts-nocheck
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { InfinityIcon, Presentation, ScrollText, User } from "lucide-react";
import React from "react";

export default function CourseFeatures({ course }) {
  return (
    <>
      <ul className="flex-1 text-sm text-gray-800 space-y-3">
        <li className="flex gap-1 items-center">
          <Presentation className="w-4 h-4 stroke-gray-700" />
          {convertNumberToBangla(course?.chapters?.length) || 0} টি ক্লাস
        </li>
        <li className="flex gap-1 items-center">
          <ScrollText className="w-4 h-4 stroke-gray-700" />
          {convertNumberToBangla(course?.attachments?.length) || 0} টি
          অ্যাটাচমেন্ট
        </li>
        <li className="flex gap-1 items-center">
          <User className="w-4 h-4 stroke-gray-700" />
          {convertNumberToBangla(course?.purchases?.length) || 0} জন শিক্ষার্থী
        </li>
        <li className="flex gap-1 items-center">
          <InfinityIcon className="w-4 h-4 stroke-gray-700" />
          আনলিমিটেড অ্যাক্সেস
        </li>
      </ul>
    </>
  );
}
