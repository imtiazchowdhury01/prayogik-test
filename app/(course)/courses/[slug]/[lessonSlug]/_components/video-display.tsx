//@ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import { VdocipherVideoPlayer } from "../../_components/vdocipher-video-player";
import { useTab } from "@/hooks/use-tab";
import { TextContent } from "@/components/TextContent";
import { useSession } from "next-auth/react";
import CourseDescription from "../../_components/course-description";
import Attachment from "../../_components/Attachement";

interface Props {
  lesson: {
    id: string;
    title: string;
    videoUrl: string;
    videoStatus?: string;
    isCompleted?: boolean;
    textContent?: any;
    attachments?: any;
    isFree?: boolean; // Add this property
  };
  course?: {
    id: string;
    slug: string;
    attachments?: any[]; // Add if needed
  };
  nextLesson?: {
    id: string;
    slug: string;
  } | null;
  studentProfileId?: string;
  isLocked?: any;
  completeOnEnd?: any;
  progress?: any;
  purchase?: any;
}

export const VideoDisplay = ({
  lesson,
  course,
  nextLesson,
  studentProfileId,
  progress,
  purchase,
}: Props) => {
  const session = useSession();
  
  const isLocked =
    !lesson?.isFree &&
    !purchase &&
    (session?.data as any)?.user?.info?.studentProfile?.subscription?.status !==
      "ACTIVE";

  const completeOnEnd = !!purchase && !progress?.isCompleted;

  const { activeTab, setActiveTab } = useTab();
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const previousLessonId = useRef(lesson.id);
  const isMounted = useRef(false);

  useEffect(() => {
    // Reset video ended state when lesson changes
    setVideoEnded(false);

    // Check if this is a lesson change
    if (isMounted.current && previousLessonId.current !== lesson.id) {
      setIsTransitioning(true);
      setIsVideoReady(false);

      // Small delay for smooth transition
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setIsVideoReady(true);
      }, 100);

      previousLessonId.current = lesson.id;
      return () => clearTimeout(timer);
    } else {
      // Initial load
      setIsVideoReady(true);
      isMounted.current = true;
    }
  }, [lesson.id]);

  const getYouTubeVideoId = (url: string) => {
    const youtubeRegex =
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  // Determine video type
  const videoUrl = lesson?.videoUrl;
  const isYouTubeVideo =
    videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");
  const isEmbeddedVideo = videoUrl?.startsWith("http") && !isYouTubeVideo;
  const isDirectVideo = videoUrl?.endsWith(".mp4");

  // Extract video ID for YouTube
  const youtubeVideoId = isYouTubeVideo ? getYouTubeVideoId(videoUrl) : null;

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const renderVideo = () => {
    if (!videoUrl) return null;

    if (isYouTubeVideo && youtubeVideoId) {
      return (
        <div className="relative aspect-w-16 aspect-h-9">
          <iframe
            key={`youtube-${lesson.id}`}
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&enablejsapi=1`}
            title="YouTube Video"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-md"
            style={{
              outline: "1.5px solid #C2E4E1",
              borderRadius: "8px",
            }}
            onLoad={() => setIsVideoReady(true)}
            loading="lazy"
          />
        </div>
      );
    }

    if (isEmbeddedVideo) {
      return (
        <div className="relative aspect-w-16 aspect-h-10">
          <iframe
            key={`embed-${lesson.id}`}
            className="w-full h-full rounded-md bg-brand/5"
            src={videoUrl}
            frameBorder="0"
            allowFullScreen
            title="Embedded Video"
            loading="lazy"
            onLoad={() => setIsVideoReady(true)}
          />
        </div>
      );
    }

    if (isDirectVideo) {
      return (
        <div className="relative aspect-w-16 aspect-h-9">
          <video
            key={`video-${lesson.id}`}
            className="w-full h-full rounded-md"
            controls
            autoPlay
            onLoadedData={() => setIsVideoReady(true)}
            onEnded={handleVideoEnd}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return (
      <VdocipherVideoPlayer
        key={`vdo-${lesson.id}`}
        chapterId={lesson.id}
        title={lesson.title}
        courseId={course?.id || ""}
        nextChapterId={nextLesson?.id}
        videoUrl={videoUrl}
        videoStatus={lesson.videoStatus || ""}
        isLocked={isLocked}
        completeOnEnd={completeOnEnd}
        onReady={() => setIsVideoReady(true)}
        onEnded={handleVideoEnd}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-md overflow-hidden aspect-video ">
        {activeTab === "content" && (
          <div className={`transition-opacity duration-300 mb-4`}>
            {renderVideo()}
          </div>
        )}
        {/* DYNAMIC LESSON CONTENT */}
        <div className="min-h-auto md:min-h-[250px] mt-10">
          {/* Lesson title with smooth transition */}
          <div className="flex flex-row flex-wrap items-center justify-between gap-x-4 mb-4">
            <h1
              key={lesson.id} // Force re-render with smooth transition
              className="text-2xl font-bold text-black capitalize truncate transition-opacity duration-300"
            >
              {lesson.title}
            </h1>
          </div>

          {/* Tab content */}
          <div className="pt-4">
            {activeTab === "content" && (
              <div className="mx-auto">
                <div className="w-full">
                  {lesson?.textContent ? (
                    <div
                      key={lesson.id} // Force re-render with smooth transition
                      className="transition-opacity duration-300"
                    >
                      <TextContent value={lesson.textContent} />
                    </div>
                  ) : (
                    <div className="min-h-[120px] sm:min-h-[400px] text-gray-400 border border-gray-200 rounded-md flex justify-center items-center w-full px-2 sm:px-4 text-center">
                      <p className="text-sm sm:text-base">
                        কোন কনটেন্ট পাওয়া যায়নি!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "description" && (
              <CourseDescription course={course} />
            )}

            {activeTab === "attachment" && (
              <>
                {course?.attachments?.length !== 0 ? (
                  <Attachment course={course} />
                ) : (
                  <div className="min-h-[120px] sm:min-h-[400px] text-gray-400 border border-gray-200 rounded-md flex justify-center items-center w-full px-2 sm:px-4 text-center">
                    <p className="text-sm sm:text-base">
                      কোন রিসোর্স পাওয়া যায়নি!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
