// @ts-nocheck
"use client";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ExpertCard = ({ teacher }) => {
  const [imgSrc, setImgSrc] = useState(
    teacher?.avatarUrl || "/default-avatar.png"
  );
  const imageErrorHandler = () => setImgSrc("/default-avatar.png");

  return (
    <Link href={`/teachers/${teacher?.username}`} className="group">
      <div className="relative w-full rounded-lg transition-shadow duration-300 overflow-hidden">
        {/* Image Container - Made responsive */}
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
          <div className="relative w-full h-full transition-all duration-300 group-hover:scale-105">
            <Image
              src={imgSrc}
              alt={teacher?.name}
              fill
              sizes="(max-width: 375px) 160px, (max-width: 480px) 180px, (max-width: 640px) 200px, (max-width: 768px) 220px, 240px"
              onError={imageErrorHandler}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>

        {/* Content Below Image */}
        <div className="py-3">
          <p className="text-sm sm:text-[1.125rem] group-hover:text-brand transition-all duration-300 font-bold text-fontcolor-title mb-1 line-clamp-2">
            {textLangChecker(teacher?.name)}
          </p>
          <p className="text-xs sm:text-sm text-fontcolor-subtitle font-medium line-clamp-1">
            {textLangChecker(
              teacher?.teacherProfile?.subjectSpecializations[0]
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ExpertCard;
