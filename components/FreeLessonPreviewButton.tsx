"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import VideoPopUp from "@/app/(course)/courses/[slug]/_components/VideoPopUp";
import { Course } from "@prisma/client";

const FreeLessonPreviewButton = ({
  course,
  freeLesson,
}: {
  course: Course;
  freeLesson: any;
}) => {
  const [videoPopupModal, setvideoPopupModal] = useState(false);

  if (!freeLesson) return null;

  return (
    <>
      <button
        onClick={() => {
          setvideoPopupModal(true);
        }}
        className="w-11 h-11 z-10 flex items-center justify-center rounded-full cursor-pointer bg-[#042F2B] transition-all duration-500 hover:opacity-70  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 "
      >
        <Image
          src={"/icon/playFill.svg"}
          alt="play-icon"
          width={10}
          height={12}
        />
      </button>

      {/* Dialog for video popup */}
      <Dialog
        open={videoPopupModal}
        onOpenChange={() => {
          setvideoPopupModal(false);
        }}
      >
        <DialogContent>
          {freeLesson && (
            <VideoPopUp
              course={{
                id: course.id,
                title: course.title,
                previewVideoUrl: freeLesson?.videoUrl || "",
                lesson: freeLesson,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FreeLessonPreviewButton;
