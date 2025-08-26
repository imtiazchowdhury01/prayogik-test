// @ts-nocheck
"use client";
import { formatDuration } from "@/lib/formatDuration";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { SingleCardButton } from "./single-card-button";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { textChecker, textLangChecker } from "@/lib/utils/textLangChecker";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "./ui/dialog";
import VideoPopUp from "@/app/(course)/courses/[slug]/_components/VideoPopUp";
import { Button } from "./ui/button";

const PremiumCourseCard = ({
  variant = "dark",
  course,
  className,
  instructor,
  userId,
  purchasedCourseIds = [],
  userSubscription,
}: {
  variant?: "light" | "dark";
  className?: string;
  course: any;
  instructor?: string;
  userId?: string;
  purchasedCourseIds?: string[];
  userSubscription: any;
}) => {
  const {
    id,
    slug,
    imageUrl,
    title,
    prices,
    description,
    category,
    progress,
    purchases,
    lessons,
    isUnderSubscription,
  } = course;
  const [imgSrc, setImgSrc] = useState<string>(course?.imageUrl);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoPopupModal, setvideoPopupModal] = useState(false);

  const imgErrorHandler = () => setImgSrc("/default-image.jpg");
  const router = useRouter();

  const isPurchased =
    purchasedCourseIds && purchasedCourseIds?.includes(course?.id);
  const isAuthenticated = !!userId;

  const handleNavigateToCourse = () => {
    if (isPurchased) {
      return `/courses/${course?.slug}/${course?.lessons[0]?.slug}`;
    } else {
      return `/courses/${course?.slug}`;
    }
  };

  const freeLesson = lessons?.find(
    (lesson: any) => lesson?.isFree && lesson?.videoUrl
  );

  // Function to handle the play button click
  const handlePlayButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    setvideoPopupModal(true);
  };

  return (
    <div
      className={twMerge(
        `flex flex-col justify-between h-full relative overflow-hidden rounded-lg group transition-all duration-300 cursor-pointer, ${className} ${
          variant === "light"
            ? "bg-white hover:drop-shadow-md"
            : "bg-[#133b37] drop-shadow-md"
        } `
      )}
    >
      {variant === "dark" && (
        <div className="absolute inset-0 invisible transition-all duration-300 bg-no-repeat opacity-25 pointer-events-none group-hover:visible group-hover:bg-gradient-to-r group-hover:from-white/100 group-hover:to-white/50"></div>
      )}

      <Link
        href={handleNavigateToCourse()}
        className="w-full h-full cursor-pointer flex flex-col justify-between"
      >
        <div className="relative w-full h-40 overflow-hidden">
          {imgSrc && (
            <Image
              src={imgSrc}
              alt="course-image"
              width={0}
              height={0}
              sizes="100vw"
              onError={imgErrorHandler}
              className="object-cover w-full h-full rounded-t-lg"
              quality={75}
              priority={true}
            />
          )}

          {freeLesson && (
            <button
              onClick={handlePlayButtonClick}
              className="w-11 h-11 z-10 flex items-center justify-center rounded-full cursor-pointer bg-[#042F2B] transition-all duration-300 hover:opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Image
                src={"/icon/playFill.svg"}
                alt="play-icon"
                width={10}
                height={12}
              />
            </button>
          )}
        </div>
        <div className="flex flex-col justify-between px-4 py-3 min-h-28">
          <div className="">
            <p
              className={`my-2 text-base font-bold leading-6 ${
                variant === "light" ? "text-fontcolor-title" : "text-white "
              }`}
            >
              {textLangChecker(course?.title)}
            </p>
            <p
              className={`${
                variant === "light" ? "text-fontcolor-gray" : "text-[#CBD5E1] "
              }  text-sm`}
            >
              ইন্সট্রাক্টর {textLangChecker(instructor)}
            </p>
          </div>
        </div>
        {userSubscription?.status === "ACTIVE" && (
          <div className="bg-primary-brand w-full mt-4 text-white p-2 text-center">
            ফ্রি এক্সেস করুন
          </div>
        )}
      </Link>

      {course?.isUnderSubscription && (
        <div className="absolute top-3 right-3">
          <div className="text-sm bg-gradient-premium rounded-[3px] text-white font-bold px-2 py-0.5">
            প্রাইম এ ফ্রি
          </div>
        </div>
      )}

      {/* Dialog for video popup */}
      <Dialog
        open={videoPopupModal}
        onOpenChange={() => {
          setvideoPopupModal(false);
        }}
      >
        <DialogContent>
          <VideoPopUp
            course={{
              id: course.id,
              title: course.title,
              previewVideoUrl: freeLesson?.videoUrl,
              lesson: freeLesson, // Pass lesson details too
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PremiumCourseCard;
