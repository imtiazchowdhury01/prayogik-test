import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CourseRoadmap } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";

type RoadmapCardProps = {
  roadmap: CourseRoadmap;
  getStatusBadge: (status: string) => React.ReactNode;
  getDifficultyBadge: (difficulty: string) => React.ReactNode;
  getDaysRemaining: (date: Date) => number | string;
};

const InProgressCourseCard: React.FC<RoadmapCardProps> = ({
  roadmap,
  getStatusBadge,
  getDifficultyBadge,
  getDaysRemaining,
}) => {
  return (
    <Card
      key={roadmap.id}
      className="w-full max-w-full bg-white shadow-md overflow-hidden rounded-md"
    >
      {/* Header Image */}
      <div className="relative w-full aspect-[16/9] md:aspect-[auto] md:h-[160px] overflow-hidden rounded-t-md">
        <Image
          src="/roadmap/running-1.png"
          alt="course-image"
          fill
          sizes="100vw"
          className="object-cover"
          priority={true}
        />
      </div>

      <CardContent className="p-4">
        {/* Status Badge */}
        <div className="mb-4">
          <span className="inline-block">
            {/* {getStatusBadge(roadmap.status)} */}
            {getDifficultyBadge(roadmap.difficulty)}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-md font-bold text-gray-900 ">
          {roadmap.title}
          {/* মার্ন স্ট্যাক ডেভেলপমেন্ট */}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-700 mb-4 text-sm truncate">
          {roadmap.description}
        </p>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-start gap-2 items-center">
            <span className="flex items-center gap-2 font-semibold">
              <Clock className=" w-4 h-4" />
              {/* সময়কাল আইকন */}
              সময়কাল:
            </span>
            <span className="font-medium text-gray-900">
              {roadmap.estimatedDuration}
            </span>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <span className="flex items-center gap-2 font-semibold">
              <Calendar className="w-4 h-4" />
              {/* বাকি দিন আইকন */}
              বাকি দিন:
            </span>
            <span className="font-medium text-gray-900">
              {roadmap.targetDate
                ? getDaysRemaining(roadmap.targetDate)
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <span className="flex items-center gap-2 font-semibold">
              <Calendar className=" w-4 h-4" />
              {/* লক্ষ্য আইকন */}
              লক্ষ্য:
            </span>
            <span className="font-medium text-gray-900">
              {roadmap.targetDate
                ? format(roadmap.targetDate, "MMM d, yyyy")
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full mt-6 px-4 py-2 bg-primary-brand text-white font-medium rounded-sm transition-all duration-300 hover:bg-primary-700">
          কোর্সটি কিনুন
        </button>
      </CardContent>
    </Card>
  );
};
export default InProgressCourseCard;
