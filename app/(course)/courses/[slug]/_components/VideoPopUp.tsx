// @ts-nocheck
"use client";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MoreCourseList from "./MoreCourseList";
import { useEffect, useState } from "react";
import { VdocipherVideoPlayer } from "./vdocipher-video-player";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

export default function VideoPopUp({
  course,
}: {
  course: {
    id: string;
    title: string;
    previewVideoUrl: string;
    lesson?: {
      id: string;
      videoStatus?: string;
      title: string;
      textContent: string;
    };
    isLocked?: boolean;
    completeOnEnd?: () => void;
  };
}) {
  const {
    title,
    previewVideoUrl,
    lesson = { id: "", videoStatus: "", title: "" },
    isLocked = false,
    completeOnEnd = () => {},
  } = course;

  const [loading, setLoading] = useState(true);

  const getYouTubeVideoId = (url: string) => {
    const youtubeRegex =
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  const isYouTubeVideo =
    previewVideoUrl?.includes("youtube.com") ||
    previewVideoUrl?.includes("youtu.be");
  const isEmbeddedVideo = previewVideoUrl?.startsWith("http");
  const isVdoCipherVideo = previewVideoUrl?.includes("vdocipher.com");
  const isDirectVideo = previewVideoUrl?.endsWith(".mp4");

  const youtubeVideoId = isYouTubeVideo
    ? getYouTubeVideoId(previewVideoUrl)
    : null;

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [previewVideoUrl]);

  return (
    <DialogContent
      className={`${previewVideoUrl ? "max-w-2xl" : "max-w-max"} bg-white`}
    >
      <DialogHeader>
        <DialogTitle>
          <div className="flex flex-col">
            {/* <p
              className="text-sm font-semibold tracking-wide"
              dangerouslySetInnerHTML={{ __html: title }}
            /> */}

            <p
              className="text-sm font-semibold tracking-wide text-gray-700"
              dangerouslySetInnerHTML={{ __html: lesson?.title }}
            />
          </div>
        </DialogTitle>
      </DialogHeader>

      {loading ? (
        <div className="flex-1">
          <Skeleton className="h-auto min-h-[350px] w-full rounded-md flex justify-center items-center">
            <Loader className="w-6 h-6 animate-spin text-gray-400" />
          </Skeleton>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between w-full mx-auto gap-x-6">
            <div className="w-full text-red-400">
              {previewVideoUrl ? (
                isYouTubeVideo && youtubeVideoId ? (
                  <div className="relative aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1`}
                      title="YouTube Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                ) : isEmbeddedVideo ? (
                  <div className="relative aspect-w-16 aspect-h-9">
                    <iframe
                      className="w-full h-full"
                      src={previewVideoUrl}
                      frameBorder="0"
                      allowFullScreen
                      title="Embedded Video"
                    ></iframe>
                  </div>
                ) : isDirectVideo ? (
                  <div className="relative aspect-w-16 aspect-h-9">
                    <video className="w-full h-full" controls autoPlay muted>
                      <source src={previewVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <VdocipherVideoPlayer
                    chapterId={lesson.id}
                    title={lesson.title}
                    courseId={course.id || ""}
                    nextChapterId={null}
                    videoUrl={previewVideoUrl}
                    videoStatus={lesson.videoStatus || ""}
                    isLocked={isLocked}
                    completeOnEnd={completeOnEnd}
                  />
                )
              ) : (
                <div
                  className="bg-white p-4 max-h-[400px] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: lesson.textContent }}
                ></div>
              )}
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  );
}
