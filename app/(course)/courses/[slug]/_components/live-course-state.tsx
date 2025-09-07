//@ts-nocheck
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { formatLiveCourseDate } from "@/lib/utils/formatLiveCourseTime";
import {
  formatBanglaTime,
  formatBengaliDaysList,
  getUniqueBengaliDays,
} from "@/lib/utils/liveSchedule/liveScheduleDateTime";

const LiveCourseState = ({ course }: any) => {
  const schedules = course?.liveSchedules || [];
  const lessonsCount = course?.lessons?.length;

  // Extract unique days using utility function
  const uniqueDays = getUniqueBengaliDays(schedules);

  // Get time information if available
  const firstSchedule = schedules[0];
  const startTime = firstSchedule
    ? formatBanglaTime(firstSchedule.startTime)
    : "";
  const endTime = firstSchedule ? formatBanglaTime(firstSchedule.endTime) : "";
  const hasTimeInfo = startTime && endTime && uniqueDays.length > 0;

  // Course start date
  const courseStartDate = course?.courseLiveBatchStartedAt
    ? formatLiveCourseDate(course.courseLiveBatchStartedAt)
    : null;

  // State items to display
  const stateItems = [
    // Lesson count
    lessonsCount > 0 && {
      label: "লেসন:",
      value: `${convertNumberToBangla(lessonsCount)} টি`,
    },

    // Course start date
    courseStartDate && {
      label: "ব্যাচ শুরু:",
      value: courseStartDate,
    },

    // Schedule time
    hasTimeInfo && {
      label: "সময়:",
      value: `${startTime} – ${endTime} (${formatBengaliDaysList(uniqueDays)})`,
    },
  ].filter(Boolean);

  if (stateItems.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {stateItems.map((item, index) => (
        <div
          key={index}
          className="bg-[#FFF5E6] rounded px-2 py-1 md:text-sm text-[13px]"
        >
          <span className="font-semibold">{item?.label}</span>{" "}
          <span className="text-gray-700">{item?.value}</span>
        </div>
      ))}
    </div>
  );
};

export default LiveCourseState;
