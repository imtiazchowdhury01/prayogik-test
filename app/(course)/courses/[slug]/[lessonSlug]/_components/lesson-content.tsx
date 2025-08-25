// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import CourseDescription from "../../_components/course-description";
import NotificationHandler from "@/components/notificationHandler/NotificationHandler";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";
import { VdocipherVideoPlayer } from "../../_components/vdocipher-video-player";
import { CourseProgressButton } from "../../_components/course-progress-button";
import { TextContent } from "@/components/TextContent";
import { Skeleton } from "@/components/ui/skeleton";
import Attachement from "../../_components/Attachement";
import { useSession } from "next-auth/react";
import { createPortal } from "react-dom";
import { useTab } from "@/hooks/use-tab";

interface LessonContentProps {
  lessonData: any;
}

export const LessonContent = ({ lessonData }: LessonContentProps) => {
  const { activeTab, setActiveTab } = useTab();

  const { lesson, course, nextLesson, progress, purchase, userId } = lessonData;
  const [loading, setLoading] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(lesson?.videoUrl);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [progressButtonContainer, setProgressButtonContainer] = useState(null);
  const session = useSession();

  const isLocked =
    !lesson.isFree &&
    !purchase &&
    session?.data?.user?.info?.studentProfile?.subscription?.status !==
      "ACTIVE";

  const completeOnEnd = !!purchase && !progress?.isCompleted;

  // Find the progress button container after component mounts
  useEffect(() => {
    const container = document.getElementById(
      "course-progress-button-container"
    );
    setProgressButtonContainer(container);
  }, []);

  // Only show loading when video URL actually changes
  useEffect(() => {
    if (lesson.videoUrl !== currentVideoUrl) {
      setLoading(true);
      setCurrentVideoUrl(lesson.videoUrl);

      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [lesson.videoUrl, currentVideoUrl]);

    // Fetch rating
    // useEffect(() => {
    //   const fetchRating = async () => {
    //     try {
    //       const response = await fetch(
    //         `/api/courses/ratings?courseId=${course.id}&userId=${userId}`
    //       );

    //       if (!response.ok) {
    //         const errorData = await response.json();
    //         throw new Error(errorData.message || "Error fetching rating");
    //       }

    //       const ratingData = await response.json();
    //       setRatingValue(ratingData.value || 0);
    //     } catch (err: any) {
    //       setError(err.message || "Failed to fetch rating");
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    //   fetchRating();
    // }, []);

    // const handleRatingSubmit = async (newRating: number) => {
    //   try {
    //     const response = await fetch("/api/courses/ratings", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         value: newRating,
    //         courseId: course?.id,
    //         userId,
    //       }),
    //     });

    //     if (!response.ok) {
    //       const errorData = await response.json();
    //       throw new Error(errorData.message || "Error submitting rating");
    //     }

    //     setRatingValue(newRating);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const failed = searchParams.get("failed");

  useEffect(() => {
    if (success) {
      setNotificationMessage("Enrollment successful!");
    } else if (canceled) {
      setNotificationMessage("Enrollment canceled");
    } else if (failed) {
      setNotificationMessage("Enrollment failed");
    } else {
      setNotificationMessage(null);
    }
  }, [success, canceled, failed]);

  const getYouTubeVideoId = (url: string) => {
    const youtubeRegex =
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  // Determine video type
  const isYouTubeVideo =
    currentVideoUrl?.includes("youtube.com") ||
    currentVideoUrl?.includes("youtu.be");
  const isEmbeddedVideo = currentVideoUrl?.startsWith("http");
  const isVdoCipherVideo = currentVideoUrl?.includes("vdocipher.com");
  const isDirectVideo = currentVideoUrl?.endsWith(".mp4");

  // Extract video ID for YouTube
  const youtubeVideoId = isYouTubeVideo
    ? getYouTubeVideoId(currentVideoUrl)
    : null;

  return (
    <>
      {notificationMessage && (
        <NotificationHandler message={notificationMessage} />
      )}

      {/* Portal the CourseProgressButton to the tab navigation area */}
      {progressButtonContainer &&
        createPortal(
          <CourseProgressButton
            course={course}
            lessonId={lesson.id}
            courseId={course.id}
            nextLessonId={nextLesson?.id}
            isCompleted={progress?.isCompleted}
            userId={userId}
          />,
          progressButtonContainer
        )}

      {/* DYNAMIC VIDEO SECTION - Only shows loading when video changes */}
      {activeTab === "content" && (
        <div className="mb-12">
          {loading ? (
            <div className="mb-4">
              <div className="relative aspect-w-16 aspect-h-9">
                <Skeleton
                  className="w-full h-[400px] rounded-md flex justify-center items-center bg-gray-100"
                  style={{
                    outline: "1.5px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Loader className="w-8 h-8 animate-spin text-gray-400" />
                    <p className="text-sm text-gray-500 font-medium">
                      ভিডিও লোড হচ্ছে...
                    </p>
                  </div>
                </Skeleton>
              </div>
            </div>
          ) : (
            currentVideoUrl && (
              <div className="mb-4 transition-opacity duration-300 ease-in-out">
                {isYouTubeVideo && youtubeVideoId ? (
                  <div className="relative aspect-w-16 aspect-h-9">
                    <iframe
                      key={youtubeVideoId} // Force re-render when video changes
                      src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&rel=0&modestbranding=1&showinfo=0`}
                      title="YouTube Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full rounded-md"
                      style={{
                        outline: "1.5px solid #C2E4E1",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                ) : isEmbeddedVideo ? (
                  <div className="relative aspect-w-16 aspect-h-9">
                    <iframe
                      key={currentVideoUrl} // Force re-render when video changes
                      className="w-full rounded-md"
                      src={currentVideoUrl}
                      frameBorder="0"
                      allowFullScreen
                      title="Embedded Video"
                    />
                  </div>
                ) : isDirectVideo ? (
                  <div className="relative aspect-w-16 aspect-h-9">
                    <video
                      key={currentVideoUrl} // Force re-render when video changes
                      className="w-full h-full"
                      controls
                      autoPlay
                      muted
                    >
                      <source src={currentVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <VdocipherVideoPlayer
                    key={lesson.id} // Force re-render when lesson changes
                    chapterId={lesson.id}
                    title={lesson.title}
                    courseId={course.id || ""}
                    nextChapterId={null}
                    videoUrl={currentVideoUrl}
                    videoStatus={lesson.videoStatus || ""}
                    isLocked={isLocked}
                    completeOnEnd={completeOnEnd}
                  />
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* DYNAMIC LESSON CONTENT */}
      <div className="min-h-auto md:min-h-[250px]">
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

          {activeTab === "description" && <CourseDescription course={course} />}

          {activeTab === "attachment" && (
            <>
              {course?.attachments.length !== 0 ? (
                <Attachement course={course} />
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
    </>
  );
};
