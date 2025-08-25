"use client";
import { Urls } from "@/constants/urls";
// import Loading from "@/app/(dashboard)/loading";
import { Loader, LoaderCircle, Video } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

const getVdoChiperOtp = async (videoId) => {
  const response = await fetch(Urls.vdoCipherOtp, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ videoId }),
  });
  const data = await response.json();

  if (data.error) {
    return {
      error: true,
      message: "ত্রুটি হয়েছে, অনুগ্রহ করে রিফ্রেশ করুন।",
    };
  }
  return data;
};

const VdocipherPlayer = ({ videoId }) => {
  const [otp, setOtp] = useState(null);
  const [playbackInfo, setPlaybackInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOtp = async () => {
      setLoading(true);
      try {
        const data = await getVdoChiperOtp(videoId);
        if (data.error) {
          setError(data.message);
        } else {
          setOtp(data.otp);
          setPlaybackInfo(data.playbackInfo);
        }
      } catch (err) {
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchOtp();
  }, [videoId]);

  if (error) {
    return (
      <div
        // style={{ minHeight: "410px" }}
        className="flex gap-2 flex-col items-center justify-center bg-brand-primary-lighter rounded-md"
      >
        <Video className="h-10 w-10 text-slate-500" />
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      // <div
      //   style={{ minHeight: "410px" }}
      //   className="flex gap-2 flex-col items-center justify-center bg-slate-200 rounded-md"
      // >
      //   <Video className="h-10 w-10 text-slate-500 animate-pulse" />
      //   <p className="text-gray-600">Loading video...</p>
      // </div>
      <Skeleton className="h-auto w-full rounded-md flex justify-center items-center">
        <Loader className="w-6 h-6 animate-spin text-gray-400" />
      </Skeleton>
    );
  }

  return (
    <div className="h-full">
      <iframe
        src={`https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`}
        style={{
          outline: "2px solid #f2f2f2",
          width: "100%",
          height: "100%",
          borderRadius: "5px",
          // filter: "drop-shadow(0 2px 10px rgba(0, 0, 0, 0.1))",
        }}
        allow="encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VdocipherPlayer;
