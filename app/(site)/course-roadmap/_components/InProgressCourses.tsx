import {
  getDifficultyBadge,
  getStatusBadge,
} from "@/app/(dashboard)/(routes)/admin/manage/course-roadmap/_components/utils";
import { CardDescription } from "@/components/ui/card";
import { CourseRoadmap } from "@prisma/client";
import { differenceInDays } from "date-fns";
import InProgressCourseCard from "./InProgressCourseCard";

// const dummyinProgressRoadmaps = [
//   {
//     id: "1",
//     title: "React বেসিকস শেখা",
//     description: "React এর মৌলিক ধারণা ও কম্পোনেন্ট তৈরি শেখা।",
//     difficulty: "ADVANCED",
//     status: "IN_PROGRESS",
//     estimatedDuration: "২ সপ্তাহ",
//     targetDate: new Date("2025-07-01"),
//     // অন্যান্য প্রপার্টি থাকলে যুক্ত করুন
//   },
//   {
//     id: "2",
//     title: "React Hooks গভীরভাবে",
//     description: "State ও Lifecycle হ্যান্ডল করার জন্য React Hooks শেখা।",
//     difficulty: "ADVANCED",
//     status: "IN_PROGRESS",
//     estimatedDuration: "৩ সপ্তাহ",
//     targetDate: new Date("2025-07-15"),
//   },
//   {
//     id: "3",
//     title: "React Router ও Navigation",
//     description: "React অ্যাপে রাউটিং ও নেভিগেশন বাস্তবায়ন।",
//     difficulty: "ADVANCED",
//     status: "IN_PROGRESS",
//     estimatedDuration: "১ সপ্তাহ",
//     targetDate: new Date("2025-06-25"),
//   },
//   {
//     id: "4",
//     title: "Redux দিয়ে State Management",
//     description: "বড় অ্যাপ্লিকেশনে স্টেট ম্যানেজমেন্টের জন্য Redux শেখা।",
//     difficulty: "ADVANCED",
//     status: "IN_PROGRESS",
//     estimatedDuration: "৪ সপ্তাহ",
//     targetDate: new Date("2025-08-01"),
//   },
// ];

const InProgressCourses = ({
  inProgressRoadmaps,
}: {
  inProgressRoadmaps: CourseRoadmap[];
}) => {
  const getDaysRemaining = (targetDate: Date) => {
    const today = new Date();
    const days = differenceInDays(targetDate, today);
    return days > 0 ? days : 0;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container max-w-7xl p-6 lg:px-1 mx-auto px-6 md:px-8">
        {/* section title */}
        <div>
          <h4 className="font-bold md:text-left text-center text-3xl sm:text-4xl md:text-[40px] pb-3">
            বর্তমানে চলছে
          </h4>
          <p className="text-lg text-gray-700 text-center md:w-full w-10/12 mx-auto md:text-left pb-6">
            সেরা অনলাইন কোর্সগুলিতে অ্যাক্সেস পান এবং শীর্ষ পেশাদারদের সাথে
            ইন্টারঅ্যাক্ট করুন
          </p>
        </div>

        {inProgressRoadmaps.length === 0 ? (
          <CardDescription className="text-center py-16">
            No course found
          </CardDescription>
        ) : null}

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {inProgressRoadmaps.map((roadmap) => (
            <InProgressCourseCard
              key={roadmap.id}
              roadmap={roadmap}
              getStatusBadge={getStatusBadge}
              getDifficultyBadge={getDifficultyBadge}
              getDaysRemaining={getDaysRemaining}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InProgressCourses;
