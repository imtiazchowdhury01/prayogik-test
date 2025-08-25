// VideoDialog.tsx (Client Component)
"use client";
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import VideoPopUp from "./VideoPopUp";

interface VideoDialogProps {
  course: any;
  freeLesson: any;
  children: React.ReactNode;
}

const VideoDialog = ({ course, freeLesson, children }: VideoDialogProps) => {
  if (!freeLesson) {
    return <>{children}</>;
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
          <div>
            <VideoPopUp
              course={{
                id: course.id,
                title: course.title,
                previewVideoUrl: freeLesson.videoUrl,
                lesson: freeLesson,
              }}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default VideoDialog;
