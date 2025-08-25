// @ts-nocheck
"use client";

import * as z from "zod";
import Uploader2 from "@/components/uploader";
import VdocipherPlayer from "@/components/VdocipherPlayer";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Lesson } from "@prisma/client";
import { Pencil, PlusCircle, Video, RefreshCw, Trash } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "./confirm-delete-video-dialog";
import { deleteVideo } from "@/lib/utils/vdeocipher";

interface LessonVideoFormProps {
  initialData: Lesson;
  courseId: string;
  lessonId: string;
  onUpdate?: (updatedData: any) => void;
  setIsUploadLoading?: (loading: boolean) => void;
}

// Helper function to check if the URL is a YouTube or embedded video URL
const isYouTubeUrl = (url: string) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
  const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\//;

  return youtubeRegex.test(url) || vimeoRegex.test(url);
};

const formSchema = z.object({
  videoUrl: z.string().min(1, "Video URL is required"),
  duration: z.number().min(0, "Duration must be a positive number").optional(),
});

export default function VdocipherVideoForm({
  initialData,
  courseId,
  lessonId,
  onUpdate,
  setIsUploadLoading,
}: LessonVideoFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [videoStatus, setVideoStatus] = useState(initialData.videoStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadLoading, setisUploadLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Confirmation dialog states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'replace' | 'delete' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if videoUrl is a YouTube URL and set it to null if so
  const [videoUrl, setVideoUrl] = useState(() => {
    const initialUrl = isYouTubeUrl(initialData.videoUrl)
      ? null
      : initialData.videoUrl;
    return initialUrl;
  });

  // Prevent page unload when uploading
  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (isUploading) {
        const message =
          "Video upload is in progress. Are you sure you want to leave? Your upload will be cancelled.";
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    },
    [isUploading]
  );

  // Set up beforeunload event listener
  useEffect(() => {
    if (isUploading) {
      window.addEventListener("beforeunload", handleBeforeUnload);

      const handleRouteChange = () => {
        if (isUploading) {
          const confirmLeave = window.confirm(
            "Video upload is in progress. Are you sure you want to leave? Your upload will be cancelled."
          );
          if (!confirmLeave) {
            throw "Route change aborted by user";
          }
        }
      };

      if (router.events) {
        router.events.on("routeChangeStart", handleRouteChange);
      }

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        if (router.events) {
          router.events.off("routeChangeStart", handleRouteChange);
        }
      };
    }
  }, [isUploading, handleBeforeUnload, router]);

  useEffect(() => {
    setIsUploadLoading?.(isUploadLoading);
  }, [isUploadLoading, setIsUploadLoading]);

  const toggleEdit = () => setIsEditing((current) => !current);

  // Enhanced edit handler with confirmation for existing videos
  const handleEditClick = () => {
    if (videoUrl && videoStatus === "READY") {
      setPendingAction('replace');
      setShowConfirmDialog(true);
    } else {
      toggleEdit();
    }
  };

  // Enhanced delete handler with confirmation
  const handleDeleteClick = () => {
    if (videoUrl) {
      setPendingAction('delete');
      setShowConfirmDialog(true);
    }
  };

  // Handle confirmation dialog confirmation
  const handleConfirmSwitch = async () => {
    if (!pendingAction) return;

    setIsProcessing(true);

    try {
      if (pendingAction === 'delete') {
        // Delete the video
        if (videoUrl) {
          const { lessonResponse } = await deleteVideo(
            videoUrl,
            courseId,
            lessonId
          );
          
          // Update local state
          setVideoUrl(null);
          setVideoStatus("PROCESSING");
          
          // Call parent update if available
          if (onUpdate) {
            onUpdate(lessonResponse);
          }
          
          toast.success("Video deleted successfully");
        }
      } else if (pendingAction === 'replace') {
        // For replace, just enter edit mode
        // The actual replacement will happen when user uploads new video
        toggleEdit();
      }

      router.refresh();
    } catch (error) {
      console.error("Error processing video action:", error);
      toast.error("Something went wrong");
    } finally {
      setShowConfirmDialog(false);
      setPendingAction(null);
      setIsProcessing(false);
    }
  };

  // Handle confirmation dialog cancellation
  const handleCancelSwitch = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  // Function to handle upload start
  const handleUploadStart = () => {
    setIsUploading(true);
    handleVideoReplaceStart();
  };

  // Function to handle upload completion (success or error)
  const handleUploadComplete = () => {
    setIsUploading(false);
  };

  // Function to handle video URL and duration update on upload
  const handleVideoUpdate = async (videoId: string, duration: number) => {
    try {
      const values = {
        videoUrl: videoId,
        duration: duration,
      };

      formSchema.parse(values);

      const { data: lessonResponse } = await axios.patch(
        `/api/courses/${courseId}/lessons/${lessonId}`,
        values
      );

      toast.success("Lesson video updated successfully");

      // Update the local state with the new video data immediately
      const newVideoUrl = lessonResponse.videoUrl || videoId;
      // const newVideoStatus = lessonResponse.videoStatus || "PROCESSING";

      // console.log("Updating state with new video:", {
      //   newVideoUrl,
      // });
      // console.log("Previous state:", { videoUrl, videoStatus });
      

      setVideoUrl(newVideoUrl);
      setVideoStatus("PROCESSING");

      // Call parent update if available
      if (onUpdate) {
        onUpdate(lessonResponse);
      }

      router.refresh();
      toggleEdit();
      handleUploadComplete();
    } catch (error) {
      console.error("Error updating video URL or duration:", error);
      if (error instanceof z.ZodError) {
        toast.error("Invalid video URL or duration");
      } else {
        toast.error("Something went wrong");
      }
      setVideoStatus("ERROR");
      handleUploadComplete();
    }
  };

  // Function to handle video replacement start
  const handleVideoReplaceStart = () => {
    setVideoStatus("PROCESSING");
  };

  // Function to refresh video status manually
  const refreshVideoStatus = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/api/courses/${courseId}/lessons/${lessonId}`
      );
      setVideoStatus(data.videoStatus);
      if (data.videoUrl && !isYouTubeUrl(data.videoUrl)) {
        setVideoUrl(data.videoUrl);
      }
    } catch (error) {
      console.error("Error fetching video status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh video status every time the component renders
  useEffect(() => {
    refreshVideoStatus();
  }, []);

  useEffect(() => {
    if (videoStatus !== "READY" && videoUrl) {
      const interval = setInterval(refreshVideoStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [videoStatus, videoUrl, courseId, lessonId]);

  // Handle cancel editing - but prevent if uploading
  const handleCancelEdit = () => {
    if (isUploading) {
      const confirmCancel = window.confirm(
        "Video upload is in progress. Are you sure you want to cancel? Your upload will be cancelled."
      );
      if (confirmCancel) {
        setIsUploading(false);
        toggleEdit();
      }
    } else {
      toggleEdit();
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div>Lesson video</div>
        <div className="flex items-center gap-1 mb-1">
          {isEditing && (
            <Button
              disabled={isUploadLoading}
              onClick={handleCancelEdit}
              variant="ghost"
            >
              Cancel
            </Button>
          )}

          {!isEditing && !videoUrl && (
            <Button onClick={toggleEdit} variant="ghost">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </Button>
          )}

          {!isEditing && videoUrl && videoStatus === "READY" && (
            <Button onClick={handleEditClick} variant="ghost">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          
          {!isEditing && videoUrl && (
            <Button 
              onClick={handleDeleteClick} 
              size="sm" 
              disabled={isLoading || isProcessing}
              variant="ghost"
            >
              <Trash className="h-4 w-4 "/>
            </Button>
          )}
        </div>
      </div>

      {!isEditing &&
        (!videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : videoStatus === "READY" ? (
          <div className="relative aspect-w-16 aspect-h-9 mt-2">
            <VdocipherPlayer key={videoUrl} videoId={videoUrl} />
          </div>
        ) : (
          <div className="flex flex-col gap-2 border border-gray-300 items-center justify-center h-60 bg-slate-100 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
            <p className="text-gray-500 text-sm">
              Video is processing. It may take a few minutes!
            </p>
            <p className="text-gray-500 text-sm">
              Current Status:{" "}
              <span className="font-semibold">{videoStatus}</span>
            </p>

            <Button
              onClick={refreshVideoStatus}
              disabled={isLoading}
              variant="ghost"
              className="mt-1"
              title="Refresh"
            >
              {isLoading ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                <RefreshCw className="h-6 w-6 text-slate-500" />
              )}
            </Button>
          </div>
        ))}

      {isEditing && (
        <div className="mt-2">
          <Uploader2
            videoTitle={initialData?.title || "Title of video"}
            isUploading={isUploading}
            onUploaded={handleVideoUpdate}
            onUploadStart={handleUploadStart}
            videoId={videoUrl || ""}
            isReplacing={!!videoUrl}
            setIsUploadLoading={setisUploadLoading}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video. Only{" "}
            <span className="font-bold">MP4</span> videos are allowed.
          </div>
        </div>
      )}

      {videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if the
          video does not appear.
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={handleCancelSwitch}
        onConfirm={handleConfirmSwitch}
        title={pendingAction === 'delete' ? "Delete Video?" : "Replace Video?"}
        description={
          pendingAction === 'delete' 
            ? "Are you sure you want to delete this video? This action cannot be undone."
            : "Are you sure you want to replace this video? The current video will be permanently deleted and this action cannot be undone."
        }
        confirmText={pendingAction === 'delete' ? "Delete" : "Replace"}
        cancelText="Cancel"
        isLoading={isProcessing}
      />
    </div>
  );
}