// @ts-nocheck
"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircle, FileText, Lock } from "lucide-react";
import { useState } from "react";
import VideoPopUp from "./VideoPopUp";

export default function ClientCourseLesson({ lesson, course, index }) {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <div className="flex items-start w-full gap-4">
      {lesson.isFree ? (
        <Dialog>
          <DialogTrigger asChild>
            <button
              onClick={() => handleLessonClick(lesson)}
              className="text-sm text-black flex justify-between w-full gap-4"
            >
              <div className="w-full flex gap-2">
                {lesson.videoUrl !== null ? (
                  <PlayCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <FileText className="h-5 w-5 text-green-500" />
                )}
                <div>
                  <p className="text-sm text-black capitalize text-start">
                    {lesson?.title?.trim()}
                  </p>
                  {lesson.description && (
                    <p
                      className="text-sm mt-2 text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: lesson?.description,
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600">Free</div>
            </button>
          </DialogTrigger>
          {selectedLesson && (
            <VideoPopUp
              course={{
                id: course.id,
                title: course.title,
                previewVideoUrl: selectedLesson.videoUrl || "",
                lesson: selectedLesson,
              }}
            />
          )}
        </Dialog>
      ) : (
        <div className="flex justify-between w-full gap-4">
          <div className="w-full flex gap-2">
            {lesson.videoUrl !== null ? (
              <PlayCircle className="w-5 h-5 text-red-500" />
            ) : (
              <FileText className="h-5 w-5 text-green-500" />
            )}
            <div>
              <p className="text-sm text-black capitalize">{lesson?.title}</p>
              {lesson.description && (
                <p
                  className="text-sm mt-2 text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: lesson?.description,
                  }}
                />
              )}
            </div>
          </div>
          <div>
            <Lock className="h-4 w-4 text-gray-700" />
          </div>
        </div>
      )}
    </div>
  );
}
