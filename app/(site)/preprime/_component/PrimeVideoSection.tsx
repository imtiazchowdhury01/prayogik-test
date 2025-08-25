"use client";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";

const PrimeVideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const videoSrc = "/images/prime/sample_video.mp4";
  const imageSrc = "/images/prime/video-frame-bg.webp";

  const handlePlay = () => {
    const video = videoRef.current;
    if (video) {
      video.play().then(() => {
        setHasPlayed(true);
      });
    }
  };

  const handleMouseEnter = () => {
    if (hasPlayed) {
      setShowControls(true);
    }
  };

  const handleMouseLeave = () => {
    if (hasPlayed) {
      setShowControls(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0; // reset to start frame
      }
      setHasPlayed(false);
      setShowControls(false);
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto pb-16 px-6 md:px-8 lg:px-5 xl:px-5 2xl:px-1">
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-[400px] lg:h-[500px] object-cover rounded-xl"
            muted
            playsInline
            // controls={hasPlayed && showControls}
          />
        ) : (
          <Image
            src={imageSrc}
            alt="Professional man in blazer"
            width={1920}
            height={500}
            className="w-full h-[400px] lg:h-[500px] object-cover rounded-xl"
            quality={75}
            priority
          />
        )}

        {/* Overlay color */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ backgroundColor: "#92AEB8", opacity: 0.25 }}
        />

        {/* Play Button (only before playing or after video ends) */}
        {!hasPlayed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              onClick={handlePlay}
              className="bg-primary-brand hover:bg-primary-brand hover:opacity-85 text-white rounded-full w-16 h-16 p-0 z-10"
            >
              <Play className="w-6 h-6 ml-1" fill="currentColor" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PrimeVideoSection;
