"use client";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import PlayIcon from "../_utils/PlayIcon";

const OfferVideoSection = ({ dataSrc, customOpacity }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showControls, setShowControls] = useState(false);

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
    <section className="w-full max-w-4xl mx-auto px-6 lg:px-0">
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {dataSrc?.videoSrc ? (
          <video
            ref={videoRef}
            src={dataSrc?.videoSrc}
            className="w-full h-[400px] lg:h-[500px] object-cover rounded-xl"
            muted
            playsInline
            // controls={hasPlayed && showControls}
          />
        ) : (
          <Image
            src={dataSrc?.imageSrc}
            alt="Professional man in blazer"
            width={1920}
            height={500}
            className="w-full h-[400px] lg:h-[500px] object-cover rounded-xl"
            quality={75}
          />
        )}

        {/* Overlay color */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none z-0"
          style={{ backgroundColor: "#92AEB8", opacity: customOpacity }}
        />

        {/* Play Button (only before playing or after video ends) */}
        {!hasPlayed && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Button
              size="lg"
              onClick={handlePlay}
              className="bg-primary-brand hover:bg-primary-brand hover:opacity-85 text-white rounded-full w-14 h-14 p-0 z-10"
            >
              <PlayIcon />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default OfferVideoSection;
