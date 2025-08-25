import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { cn } from "@/lib/utils";
import React from "react";

export function VideoDuration({
  videoUrl,
  className,
}: {
  videoUrl: string;
  className?: string;
}): React.ReactElement {
  const [duration, setDuration] = React.useState<string | null>(null);

  React.useEffect(() => {
    
    const videoId = "video-element-id";

    const videoElement = document.getElementById(videoId) as HTMLVideoElement;

    if (videoElement) {
      const handleLoadedMetadata = () => {
        const totalSeconds = Math.floor(videoElement.duration);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setDuration(
          [hours, minutes, seconds]
            .map((unit) => String(unit).padStart(2, "0"))
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")
        );
      };

      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      };
    }
  }, [videoUrl]);

  return (
    <>
      <video id="video-element-id" src={videoUrl} style={{ display: "none" }} />
      <p className={cn(className)}>
        {duration
          ? `সময় ${convertNumberToBangla(duration)} মিনিট`
          : "Loading..."}
      </p>
    </>
  );
}
