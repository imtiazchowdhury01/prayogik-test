//@ts-nocheck
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { ChevronDown, ChevronUp } from "lucide-react";

export const ShowMoreLessons = ({
  visibleLessons,
  visibleLessonCount,
  course,
  setVisibleLessons,
}) => {
  const handleToggleVisibility = () => {
    if (visibleLessons === visibleLessonCount) {
      // Show all lessons
      setVisibleLessons(course.lessons.length);
    } else {
      // Show only initial lessons
      setVisibleLessons(visibleLessonCount);
    }
  };

  const isShowingAll = visibleLessons > visibleLessonCount;
  const remainingLessons = course.lessons.length - visibleLessons;

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handleToggleVisibility}
        className="flex items-center justify-center w-full gap-2 px-4 py-3 transition ease-in bg-[#F3F9F9] rounded-md hover:bg-[#E8F4F4]"
      >
        {!isShowingAll ? (
          <span className="flex items-center gap-1">
            আরও {convertNumberToBangla(remainingLessons)}টি লেসন দেখুন
            <ChevronDown className="w-5 h-5" />
          </span>
        ) : (
          <span className="flex items-center gap-1">
            মিনিমাইজ করুন
            <ChevronUp className="w-5 h-5" />
          </span>
        )}
      </button>
    </div>
  );
};
