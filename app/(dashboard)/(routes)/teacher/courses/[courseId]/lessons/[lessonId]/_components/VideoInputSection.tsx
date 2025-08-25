// @ts-nocheck
"use client";

import { IconBadge } from "@/components/icon-badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Video, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import VdocipherVideoForm from "./lesson-vdocipher-video-form"; // Adjust the path as necessary
import URLInputForm from "./URLInputForm"; // Adjust the path as necessary
import { deleteVideo } from "@/lib/utils/vdeocipher";
import axios from "axios";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "./confirm-delete-video-dialog";

interface VideoInputSectionProps {
  lesson: any; // Replace 'any' with your actual lesson type
  courseId: string;
  lessonId: string;
}

const VideoInputSection: React.FC<VideoInputSectionProps> = ({
  lesson: initialLesson,
  courseId,
  lessonId,
}) => {
  const [lesson, setLesson] = useState(initialLesson);
  const [currentView, setCurrentView] = useState<"upload" | "url">("upload");
  const [pendingView, setPendingView] = useState<"upload" | "url" | null>(null);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const router = useRouter();
  // console.log(lesson);

  const handleSelection = (selection: "upload" | "url") => {
    // If there's existing video content and user is switching modes
    if (lesson?.videoUrl && selection !== currentView) {
      setPendingView(selection);
      setShowWarningDialog(true);
    } else {
      setCurrentView(selection);
    }
  };

  const handleConfirmSwitch = async () => {
    if (!pendingView) return;

    setIsProcessing(true);

    try {
      // Clear the videoUrl from lesson state first
      const clearedLessonData = {
        ...lesson,
        videoUrl: null,
        videoDuration: null,
        videoThumbnail: null,
        // Add any other video-related fields that should be cleared
      };

      setLesson(clearedLessonData);

      if (pendingView === "url") {
        if (lesson.videoUrl) {
          try {
            const { lessonResponse } = await deleteVideo(
              lesson.videoUrl,
              courseId,
              lessonId
            );
            // console.log("lessonResponse after deleting video:", lessonResponse);

            setLesson(lessonResponse);
          } catch (deleteError) {
            console.error("Error deleting video:", deleteError);
            // Continue even if delete fails - we don't want to block the switch
          }
        }
      } else if (pendingView === "upload") {
        // For upload switch, we might need similar database cleanup
        const { data: lessonResponse } = await axios.patch(
          `/api/courses/${courseId}/lessons/${lessonId}`,
          {
            videoUrl: "",
            duration: 0,
            videoStatus: "PROCESSING",
          }
        );

        setLesson(lessonResponse);
      }

      // Switch the view after all operations complete successfully
      setCurrentView(pendingView);
      // console.log("Successfully switched to:", pendingView);
    } catch (error) {
      console.error("Error switching video input method:", error);
      // Revert lesson state if there was an error
      setLesson(lesson);
      // You might want to show an error toast here
    } finally {
      // Close dialog and reset state
      setShowWarningDialog(false);
      setPendingView(null);
      setIsProcessing(false);
      router.refresh();
    }
  };

  const handleCancelSwitch = () => {
    setShowWarningDialog(false);
    setPendingView(null);
  };

  const updateLesson = (updatedData: any) => {
    setLesson((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  useEffect(() => {
    if (
      lesson?.videoUrl?.includes("youtube.com") ||
      lesson?.videoUrl?.includes("youtu.be") ||
      lesson?.videoUrl?.includes("vimeo.com")
    ) {
      setCurrentView("url");
    } else if (lesson?.videoUrl) {
      // If there's a videoUrl but it's not from external sources, it's an upload
      setCurrentView("upload");
    }
    // If no videoUrl, keep current view as is
  }, [lesson?.videoUrl]);

  // Update local state when prop changes
  useEffect(() => {
    setLesson(initialLesson);
  }, [initialLesson]);

  if (!lesson) {
    return <Loader className="animate-spin h-4 w-4" />;
  }

  return (
    <div>
      <div>
        <div className="flex flex-row flex-wrap gap-6 lg:gap-2 justify-between items-center w-full">
          <div className="flex items-center justify-between gap-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl min-w-max">Customize your video</h2>
          </div>

          <div className="mt-4">
            <RadioGroup
              value={currentView}
              onValueChange={handleSelection}
              className="flex gap-3 flex-wrap w-fit"
              disabled={isProcessing || isUploadLoading}
            >
              <label className="flex items-center space-x-1 cursor-pointer">
                <RadioGroupItem value="upload" />
                <span>Upload</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <RadioGroupItem value="url" />
                <span>External URL</span>
              </label>
            </RadioGroup>
          </div>
        </div>

        {/* Render forms based on dropdown selection */}
        {currentView === "upload" && (
          <VdocipherVideoForm
            initialData={lesson}
            lessonId={lessonId}
            courseId={courseId}
            onUpdate={updateLesson}
            setIsUploadLoading={setIsUploadLoading}
          />
        )}
        {currentView === "url" && (
          <URLInputForm
            initialData={lesson}
            courseId={courseId}
            lessonId={lessonId}
            onUpdate={updateLesson}
            setIsUploadLoading={setIsUploadLoading}
          />
        )}
      </div>
      <ConfirmationDialog
        isOpen={showWarningDialog}
        onClose={handleCancelSwitch}
        onConfirm={handleConfirmSwitch}
        title="Are you sure?"
        description="Switching will permanently delete your current video, and this action cannot be undone."
        confirmText="Continue"
        cancelText="Cancel"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default VideoInputSection;
