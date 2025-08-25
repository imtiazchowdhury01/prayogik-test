// // @ts-nocheck
// "use client";

// import axios from "axios";
// import { CheckCircle, Loader } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { Button } from "@/components/ui/button";
// import { useConfettiStore } from "@/hooks/use-confetti-store";
// import { getProgress } from "@/actions/get-progress";
// import { getServerUserSession } from "@/lib/getServerUserSession";
// import { log } from "console";

// interface Lesson {
//   id: string;
//   slug: string;
//   title: string;
// }

// interface Course {
//   id: string;
//   slug: string;
//   lessons: Lesson[];
// }

// interface CourseProgressButtonProps {
//   course: Course;
//   lessonId: string;
//   courseId: string;
//   nextLessonId?: string;
//   isCompleted?: boolean;
//   userId: any;
// }

// export const CourseProgressButton = ({
//   course,
//   lessonId,
//   courseId,
//   nextLessonId,
//   isCompleted,
//   userId,
// }: CourseProgressButtonProps) => {
//   const router = useRouter();
//   const confetti = useConfettiStore();
//   const [isLoading, setIsLoading] = useState(false);
//   const [lessonCompleted, setLessonCompleted] = useState(isCompleted);

//   const onClick = async () => {
//     try {
//       let lessonSlug;

//       setIsLoading(true);

//       if (nextLessonId) {
//         lessonSlug = findLessonSlugById(nextLessonId);
//       }

//       const response = await axios.put(
//         `/api/courses/${courseId}/lessons/${lessonId}/progress`,
//         {
//           isCompleted: !lessonCompleted,
//         }
//       );

//       setLessonCompleted(response?.data?.isCompleted);

//       if (response?.data?.isCompleted == false) {
//         toast.success("Progress updated");
//         router.refresh();
//         return;
//       }

//       if (response?.data?.isCompleted && nextLessonId && lessonSlug) {
//         router.push(`/courses/${course.slug}/${lessonSlug}`);
//       }

//       const { data } = await axios.post(`/api/courses/${courseId}`, {
//         userId,
//         courseId: course.id,
//       });

//       const progressPercentage = data.progress;

//       if (progressPercentage == "100") {
//         confetti.onOpen();
//       } else {
//         toast.success("Progress updated");
//       }

//       router.refresh();
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const findLessonSlugById = (lessonId: string) => {
//     const lesson = course.lessons.find((lesson) => lesson.id === lessonId);
//     return lesson ? lesson.slug : null;
//   };

//   return (
//     <Button
//       onClick={onClick}
//       disabled={isLoading}
//       type="button"
//       variant={lessonCompleted ? "outline" : "success"}
//       className="lg:w-full md:w-auto"
//     >
//       {isLoading ? (
//         <Loader className="h-4 w-4 animate-spin" />
//       ) : (
//         <>
//           {lessonCompleted ? "Mark as incomplete" : "Mark as complete"}
//           <CheckCircle
//             className={`h-4 w-4 ml-2 ${
//               lessonCompleted ? "text-gray-400" : " text-white"
//             }`}
//           />
//         </>
//       )}
//     </Button>
//   );
// };

// @ts-nocheck
"use client";

import axios from "axios";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { getProgress } from "@/actions/get-progress";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { log } from "console";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Lesson {
  id: string;
  slug: string;
  title: string;
}

interface Course {
  id: string;
  slug: string;
  lessons: Lesson[];
}

interface CourseProgressButtonProps {
  course: Course;
  lessonId: string;
  courseId: string;
  nextLessonId?: string;
  isCompleted?: boolean;
  userId: any;
}

export const CourseProgressButton = ({
  course,
  lessonId,
  courseId,
  nextLessonId,
  isCompleted,
  userId,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(isCompleted);

  const onChange = async () => {
    try {
      let lessonSlug;

      setIsLoading(true);

      if (nextLessonId) {
        lessonSlug = findLessonSlugById(nextLessonId);
      }

      const response = await axios.put(
        `/api/courses/${courseId}/lessons/${lessonId}/progress`,
        {
          isCompleted: !lessonCompleted,
        }
      );

      setLessonCompleted(response?.data?.isCompleted);

      if (response?.data?.isCompleted == false) {
        toast.success("Progress updated");
        router.refresh();
        return;
      }

      if (response?.data?.isCompleted && nextLessonId && lessonSlug) {
        router.push(`/courses/${course.slug}/${lessonSlug}`);
      }

      const { data } = await axios.post(`/api/courses/${courseId}`, {
        userId,
        courseId: course.id,
      });

      const progressPercentage = data.progress;

      if (progressPercentage == "100") {
        confetti.onOpen();
      } else {
        toast.success("প্রগ্রেস আপডেট করা হয়েছে");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("সমস্যা হয়েছে আবার চেষ্টা করুন");
    } finally {
      setIsLoading(false);
    }
  };

  const findLessonSlugById = (lessonId: string) => {
    const lesson = course.lessons.find((lesson) => lesson.id === lessonId);
    return lesson ? lesson.slug : null;
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        {isLoading ? (
          <div className="w-5 h-5 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-brand" />
          </div>
        ) : (
          <input
            type="checkbox"
            id={`lesson-${lessonId}`}
            checked={lessonCompleted || false}
            onChange={onChange}
            disabled={isLoading}
            className="w-5 h-5 text-brand bg-white border-2 border-brand rounded  focus:ring-0 focus:border-0 checked:bg-brand checked:border-brand transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          />
        )}
      </div>
      <label
        htmlFor={`lesson-${lessonId}`}
        className={`text-base font-medium cursor-pointer select-none transition-colors duration-200 ${
          lessonCompleted ? "text-brand" : "text-gray-700"
        } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
      >
        {/* {lessonCompleted ? "সম্পূর্ণ হয়েছে" : "সম্পূর্ণ করুন"} */}
        সম্পূর্ণ হয়েছে
      </label>
    </div>
  );
};
