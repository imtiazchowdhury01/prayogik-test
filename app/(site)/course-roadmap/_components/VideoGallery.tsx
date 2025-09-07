//@ts-nocheck
"use client";
import { FC, useRef, useState, useEffect } from "react";

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
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|shorts|embed)\/|.*[?&]v=)|youtu\.be\/)([^#&?]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// Extract Vimeo ID from URL
const getVimeoId = (url: string): string | null => {
  const regExp =
    /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
  const match = url.match(regExp);
  return match ? match[5] : null;
};

const VideoGallery: FC<VideoGalleryProps> = ({ videos }) => {
  // Render appropriate video player based on URL type
  const renderVideoPlayer = (video: VideoItem, index: number) => {
    const videoType = getVideoType(video.src);

    if (videoType === "youtube") {
      const videoId = getYouTubeId(video.src);
      if (!videoId) return renderPlaceholder(video, index);

      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={video.alt}
          className="w-full h-full object-cover"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ objectFit: "cover" }}
        />
      );
    } else if (videoType === "vimeo") {
      const videoId = getVimeoId(video.src);
      if (!videoId) return renderPlaceholder(video, index);

      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          title={video.alt}
          className="w-full h-full object-cover"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ objectFit: "cover" }}
          loading="lazy"
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
          style={{ objectFit: "cover" }}
        />
      );
    } else if (videoType === "direct") {
      return (
        <video
          src={video.src}
          title={video.alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          controls
          preload="metadata"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 justify-items-center">
        {videos.map((video, idx) => {
          const isVideoEmpty = !video.src || video.src.trim() === "";
          const videoType = getVideoType(video.src);

          return (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden bg-gray-100 w-full aspect-[9/16] xl:max-w-[300px] max-w-full"
            >
              {isVideoEmpty || videoType === "unknown"
                ? renderPlaceholder(video, idx)
                : renderVideoPlayer(video, idx)}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VideoGallery;
