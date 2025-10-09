// @ts-nocheck
"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  course: any;
  lessonId: string;
  courseId: string;
  nextLesson?: any;
  isCompleted?: boolean;
  userId: any;
  onLessonClick?: any;
  onProgressUpdate?: (lessonId: string, isCompleted: boolean) => void;
}

export const CourseProgressButton = ({
  course,
  lessonId,
  courseId,
  nextLesson,
  isCompleted,
  userId,
  onLessonClick,
  onProgressUpdate,
}: CourseProgressButtonProps) => {
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(isCompleted);

  // Update local state when prop changes
  useEffect(() => {
    setLessonCompleted(isCompleted);
  }, [isCompleted, lessonId]);

  const onChange = async () => {
    try {
      setIsLoading(true);
      const newCompletionStatus = !lessonCompleted;

      // Update progress using fetch
      const response = await fetch(
        `/api/courses/${courseId}/lessons/${lessonId}/progress`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isCompleted: newCompletionStatus,
          }),
        }
      );

      const data = await response.json();
      setLessonCompleted(data.isCompleted);
      
      // Notify parent about progress update
      if (onProgressUpdate) {
        onProgressUpdate(lessonId, data.isCompleted);
      }

      if (!data.isCompleted) {
        toast.success("প্রগ্রেস আপডেট করা হয়েছে");
        return;
      }

      // Navigate to next lesson without refresh
      if (data.isCompleted && nextLesson && onLessonClick) {
        onLessonClick(nextLesson);
      }

      // Check course completion
      const courseResponse = await fetch(`/api/courses/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          courseId: course.id,
        }),
      });

      const courseData = await courseResponse.json();
      const progressPercentage = courseData.progress;
      if (progressPercentage === 100) {
        confetti.onOpen();
      } else {
        toast.success("প্রগ্রেস আপডেট করা হয়েছে");
      }
    } catch (error) {
      console.error(error);
      toast.error("সমস্যা হয়েছে আবার চেষ্টা করুন");
    } finally {
      setIsLoading(false);
    }
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
        সম্পূর্ণ হয়েছে
      </label>
    </div>
  );
};