//@ts-nocheck
import { Card } from "@/components/ui/card";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { getCourseRoadmap } from "@/lib/getCourseRoadmap";

const RoadmapStateCard = async () => {
  const { liveNowCount, wipCount, plannedCount } = await getCourseRoadmap(
    "HERO"
  );
  // Calculate total for percentages
  const totalCourses = liveNowCount + wipCount + plannedCount;

  const stats = [
    {
      title: "কোর্স তৈরি হয়েছে",
      value: liveNowCount,
      percentage:
        totalCourses > 0 ? Math.round((liveNowCount / totalCourses) * 100) : 0,
    },
    {
      title: "কোর্স তৈরি হচ্ছে",
      value: wipCount,
      percentage:
        totalCourses > 0 ? Math.round((wipCount / totalCourses) * 100) : 0,
    },
    {
      title: "কোর্স প্লানে আছে",
      value: plannedCount,
      percentage:
        totalCourses > 0 ? Math.round((plannedCount / totalCourses) * 100) : 0,
    },
  ];

  return (
    <div className="space-y-4 bg-[#0AA89A] p-6 rounded-lg">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="bg-teal-600 border-none p-6 flex items-center justify-between gap-4"
        >
          <div className="md:w-1/2 w-full">
            <h3 className="text-white text-xl font-semibold">
              {convertNumberToBangla(stat.value)}টি {stat.title}
            </h3>
            <div className="mt-4 w-full bg-white/25 rounded-full h-2">
              <div
                className="bg-teal-100 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stat.percentage}%` }}
              ></div>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center w-[60px] h-[32px] rounded bg-white/10"></div>
        </Card>
      ))}
    </div>
  );
};

export default RoadmapStateCard;
