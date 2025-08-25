"use client";

import axios from "axios";
import { Loader2, Lock, Video, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import VdocipherPlayer from "@/components/VdocipherPlayer";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Button } from "@/components/ui/button";

interface VdocipherVideoPlayerProps {
  videoUrl: string;
  videoStatus: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VdocipherVideoPlayer = ({
  videoUrl,
  videoStatus,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VdocipherVideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Progress updated");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const refreshVideoStatus = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/api/courses/${courseId}/chapters/${chapterId}`
      );
      setIsReady(data.videoStatus === "READY");
    } catch (error) {
      console.error("Error fetching video status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isReady) {
        refreshVideoStatus();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isReady, courseId, chapterId]);

  return (
    <div className="relative aspect-w-16 aspect-h-9">
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center h-full bg-slate-800 gap-y-2 text-secondary-brand">
          <Lock className="w-8 h-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && videoUrl && videoStatus === "READY" ? (
        <VdocipherPlayer videoId={videoUrl || ""} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2 border border-gray-300 rounded-md bg-slate-100">
          <Video className="w-10 h-10 text-slate-500" />
          <p className="text-sm text-gray-500">
            Video is processing. It may take a few minutes!
          </p>
          <p className="text-sm text-gray-500">
            Current Status: <span className="font-semibold">{videoStatus}</span>
          </p>
          <Button
            onClick={refreshVideoStatus}
            disabled={isLoading}
            variant="ghost"
            className="mt-1"
            title="Refresh"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <RefreshCw className="w-6 h-6 text-slate-500" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
