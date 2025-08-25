// @ts-nocheck
"use client";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import VideoPopUp from "./VideoPopUp";
import { FileText, Lock, PlayCircle } from "lucide-react";
import { useState } from "react";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { formatDurationToBanglaHMS } from "@/lib/convertNumberToBangla";
export const VisitorLessonCard = ({ lesson, course }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  // lesson duration format to Bangla
  function convertNumberToBangla(num: number): string {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((d) => banglaDigits[parseInt(d)])
      .join("");
  }

  return (
    <div className="p-4 mb-4 bg-[#F3F9F9] rounded-md">
      <div className="flex items-start w-full">
        {lesson.isFree ? (
          <Dialog>
            <DialogTrigger asChild>
              <button
                onClick={() => handleLessonClick(lesson)}
                className="flex justify-between w-full gap-4 text-sm text-black"
              >
                <div className="flex w-full gap-2">
                  {lesson.videoUrl !== null ? (
                    <PlayCircle className="w-5 h-5 text-gray-700" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-700" />
                  )}
                  <div>
                    <p className="text-sm text-black capitalize text-start">
                      {textLangChecker(lesson?.title?.trim())}
                    </p>
                    {lesson.description && (
                      <p
                        className="mt-2 text-sm text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: lesson?.description,
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-950 font-secondary font-medium">
                  ফ্রি
                </div>
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
            <div className="flex w-full gap-2">
              {!lesson.isFree ? (
                <Lock className="w-5 h-5 text-gray-700" />
              ) : lesson.videoUrl !== null ? (
                <PlayCircle className="w-5 h-5 text-gray-700" />
              ) : (
                <FileText className="w-5 h-5 text-gray-700" />
              )}
              <div>
                <p className="text-sm text-black capitalize">{lesson?.title}</p>
                {lesson.description && (
                  <p
                    className="mt-2 text-sm text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: lesson?.description,
                    }}
                  />
                )}
              </div>
            </div>

            {/*
             * formatDurationToBanglaHMS(3665); // Returns "১:০১:০৫ ঘণ্টা"
             * formatDurationToBanglaHMS(125);  // Returns "০২:০৫ মি"
             */}
            <div className="text-gray-600">
              {lesson.duration ? (
                <>
                  {formatDurationToBanglaHMS(lesson.duration)}
                  <span className="text-base pl-0.5">
                    {formatDurationToBanglaHMS(lesson.duration).split(":")
                      .length === 3
                      ? "ঘণ্টা"
                      : "মিনিট"}
                  </span>
                </>
              ) : null}
              {!lesson.duration && lesson.videoUrl === null && (
                <FileText className="w-5 h-5 text-gray-600" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
