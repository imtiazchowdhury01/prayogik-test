"use client";
import { useRef, useState } from "react";
import { Download, File, Loader2 } from "lucide-react";
import { getPresignedUrl } from "@/actions/upload-aws";

export type CachedUrl = {
  url: string;
  expiresAt: number; // Timestamp in ms
};

const Attachment = ({ course }: { course: any }) => {
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const urlCache = useRef<Record<string, CachedUrl>>({});
  const handleDownload = async (attachment: any) => {
    const now = Date.now();
    const cacheEntry = urlCache.current[attachment.id];

    // Use cached URL if valid (with 10-second buffer)
    if (cacheEntry?.expiresAt > now + 10_000) {
      window.open(cacheEntry.url, "_blank", "noopener,noreferrer");
      return;
    }

    setLoadingMap((prev) => ({ ...prev, [attachment.id]: true }));

    try {
      
      const { url, expiresAt } = await getPresignedUrl(attachment);

      // Cache with expiration (6 minutes from now)
      urlCache.current[attachment.id] = {
        url,
        expiresAt,
      };

      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Download failed:", error);
      // Optional: Show error to user
    } finally {
      setLoadingMap((prev) => ({ ...prev, [attachment.id]: false }));
    }
  };

  if (!course.attachments?.length) return null;

  return (
    <div className="space-y-2">
      {course.attachments.map((attachment: any) => (
        <div
          key={attachment.id}
          className="flex items-center p-3 w-full bg-brand-primary-lighter border-brand-primary-light border text-brand rounded-md"
        >
          <button
            onClick={() => handleDownload(attachment)}
            disabled={loadingMap[attachment.id]}
            className="w-full flex items-center justify-between disabled:opacity-75"
          >
            <div className="flex flex-1 gap-1 items-center">
              <File className="h-4 w-4 flex-shrink-0" />
              <div className="text-left mt-1">
                <div>{attachment.name.split("?")[0]?.split("-")[1]}</div>
              </div>
            </div>

            {loadingMap[attachment.id] ? (
              <Loader2 className="h-4 w-4 ml-2 flex-shrink-0 animate-spin" />
            ) : (
              <Download className="h-4 w-4 ml-2 flex-shrink-0" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Attachment;
