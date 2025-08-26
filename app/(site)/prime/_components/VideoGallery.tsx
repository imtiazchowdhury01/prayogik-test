//@ts-nocheck
"use client";
import { FC, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PlayIcon from "../_utils/PlayIcon";

interface VideoItem {
  src: string;
  alt: string;
  imageSrc?: string; // Optional image fallback
}

interface VideoGalleryProps {
  videos: VideoItem[];
}

// Helper function to detect video type
const getVideoType = (
  url: string
): "youtube" | "vimeo" | "direct" | "vdocipher" | "unknown" => {
  if (!url) return "unknown";

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  } else if (url.includes("vimeo.com")) {
    return "vimeo";
  } else if (url.includes("vdocipher.com")) {
    return "vdocipher";
  } else if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
    return "direct";
  }

  return "unknown";
};

// Extract YouTube ID from various URL formats
const getYouTubeId = (url: string): string | null => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

// Extract Vimeo ID from URL
const getVimeoId = (url: string): string | null => {
  const regExp =
    /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
  const match = url.match(regExp);
  return match ? match[5] : null;
};

const VideoGallery: FC<VideoGalleryProps> = ({ videos }) => {
  // Changed to track which single video is currently playing (null means none)
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState<
    number | null
  >(null);
  const [showControls, setShowControls] = useState<boolean[]>(
    Array(videos.length).fill(false)
  );

  // Play video at index (stop any other playing video)
  const handlePlay = (index: number) => {
    setCurrentlyPlayingIndex(index);
  };

  // Show controls on mouse enter if video is currently playing
  const handleMouseEnter = (index: number) => {
    if (currentlyPlayingIndex === index) {
      setShowControls((prev) => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
    }
  };

  // Hide controls on mouse leave if video is currently playing
  const handleMouseLeave = (index: number) => {
    if (currentlyPlayingIndex === index) {
      setShowControls((prev) => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
    }
  };

  // Reset video when it ends (for direct videos)
  const handleVideoEnded = (index: number) => {
    if (currentlyPlayingIndex === index) {
      setCurrentlyPlayingIndex(null);
      setShowControls((prev) => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
    }
  };

  // Render appropriate video player based on URL type
  const renderVideoPlayer = (video: VideoItem, index: number) => {
    const videoType = getVideoType(video.src);
    const isCurrentlyPlaying = currentlyPlayingIndex === index;

    if (videoType === "youtube") {
      const videoId = getYouTubeId(video.src);
      if (!videoId) return renderPlaceholder(video, index);

      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${
            isCurrentlyPlaying ? 1 : 0
          }&mute=1`}
          title={video.alt}
          className="w-full h-full object-cover"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    } else if (videoType === "vimeo") {
      const videoId = getVimeoId(video.src);
      if (!videoId) return renderPlaceholder(video, index);

      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=${
            isCurrentlyPlaying ? 1 : 0
          }&muted=1`}
          title={video.alt}
          className="w-full h-full object-cover"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    } else if (videoType === "vdocipher") {
      // VDOCipher videos - use proper embed with sandbox attributes
      return (
        <iframe
          src={video.src}
          title={video.alt}
          className="w-full h-full object-cover"
          frameBorder="0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      );
    } else if (videoType === "direct") {
      return (
        <video
          src={video.src}
          title={video.alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          muted
          playsInline
          controls={isCurrentlyPlaying && showControls[index]}
          preload="metadata"
          onEnded={() => handleVideoEnded(index)}
        />
      );
    }

    return renderPlaceholder(video, index);
  };

  // Render placeholder image for empty or invalid videos
  const renderPlaceholder = (video: VideoItem, index: number) => {
    return (
      <img
        src={video.imageSrc || "/images/prime/placeholder.jpg"}
        alt={video.alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    );
  };

  return (
    <section className="px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-0 max-w-7xl mx-auto">
      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 justify-items-center">
        {videos.map((video, idx) => {
          const isVideoEmpty = !video.src || video.src.trim() === "";
          const videoType = getVideoType(video.src);
          const isCurrentlyPlaying = currentlyPlayingIndex === idx;
          const shouldShowPlayButton =
            !isCurrentlyPlaying && !isVideoEmpty && videoType !== "unknown";

          return (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden bg-gray-100 xl:w-[290px] xl:h-[232px] xl:aspect-auto w-full h-[232px]"
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
            >
              {isVideoEmpty || videoType === "unknown"
                ? renderPlaceholder(video, idx)
                : renderVideoPlayer(video, idx)}

              {/* Play Button Overlay - only show if not currently playing and is valid video */}
              {shouldShowPlayButton && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                  <Button
                    size="lg"
                    onClick={() => handlePlay(idx)}
                    className="bg-brand hover:bg-brand/50 text-white rounded-full w-10 h-10 p-0 z-10 transition-all duration-300"
                    aria-label={`Play video ${video.alt}`}
                  >
                    <PlayIcon />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VideoGallery;
