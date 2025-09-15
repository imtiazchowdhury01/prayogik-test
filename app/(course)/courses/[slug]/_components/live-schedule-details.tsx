import React from "react";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { formatLiveCourseDate } from "@/lib/utils/formatLiveCourseTime";
import {
  formatBanglaTime,
  getUniqueBengaliDays,
} from "@/lib/utils/liveSchedule/liveScheduleDateTime";

const LiveScheduleDetails = ({ course }: any) => {
  return (
    <section id="live-schedule" className="mt-7">
      <h4 className="mb-4 text-xl font-bold text-fontcolor-title">
        কোর্সের সময়সূচী ও ক্লাসসংখ্যা
      </h4>
      <div className="text-fontcolor-description">
        <div>
          <span className="font-semibold">মোট লাইভ ক্লাস:</span>{" "}
          {convertNumberToBangla(Number(course?.totalLiveClass))}
          টি
        </div>

        {/* Course start date */}
        {course?.courseLiveBatchStartedAt && (
          <div>
            <span className="font-semibold">ব্যাচ শুরু: </span>
            <span>{formatLiveCourseDate(course.courseLiveBatchStartedAt)}</span>
          </div>
        )}

        {/* Schedule times for each day */}
        {(() => {
          const schedules = course?.liveSchedules || [];
          const uniqueDays = getUniqueBengaliDays(schedules);

          if (schedules.length === 0) return null;

          return (
            <div className="pt-2">
              <span className="font-semibold" >ক্লাসের সময়:</span>
              {uniqueDays.map((day, index) => {
                const schedule = schedules.find(
                  (s: any) =>
                    s.dayOfWeek && getUniqueBengaliDays([s])[0] === day
                );
                if (!schedule) return null;

                const startTime = formatBanglaTime(schedule.startTime);
                const endTime = formatBanglaTime(schedule.endTime);

                return (
                  <div key={index}>
                    {day}, {startTime} – {endTime}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </section>
  );
};

export default LiveScheduleDetails;
