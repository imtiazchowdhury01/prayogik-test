// @ts-nocheck
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { fetchCategories } from "@/services";
import { getCategoriesDBCall } from "@/lib/data-access-layer/categories";

export async function TeacherHero({ teacher, blurDataURL }) {
  const categories = await getCategoriesDBCall();
  return (
    <section
      className="relative w-full px-5 py-16 overflow-hidden"
      style={{
        backgroundImage: "url('/images/teacher/herobg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "auto",
      }}
    >
      <div className="z-0 mx-auto max-w-7xl">
        <div className="flex flex-col items-center w-full gap-8 md:flex-row">
          <Image
            src={
              teacher?.avatarUrl ||
              "/default-avatar.png" ||
              "/profile/blank-profile.webp"
            }
            alt="instructor"
            width={0}
            height={0}
            sizes="300px"
            className="w-[250px] h-[250px] rounded-lg object-cover"
            priority
            quality={75}
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL || undefined}
          />
          <div className="flex flex-col items-start justify-center flex-1">
            <div className="self-stretch w-full text-white">
              <div className="flex">
                <div
                  className="flex items-center justify-center px-3 py-1 mb-1 rounded-md"
                  style={{
                    backgroundColor: "rgba(249, 133, 26, 1)",
                  }}
                >
                  <span className="text-sm">শিক্ষক</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <h1 className="text-3xl md:text-[48px] font-bold leading-none">
                  {textLangChecker(teacher?.name)}
                </h1>
                {teacher?.teacherProfile?.teacherStatus === "VERIFIED" && (
                  <BadgeCheck className="w-6 h-6 text-teal-400 md:w-8 md:h-8" />
                )}
              </div>
              {teacher?.teacherProfile?.subjectSpecializations && (
                <div className="flex flex-wrap gap-2 my-4">
                  {teacher?.teacherProfile?.subjectSpecializations.map(
                    (sub, index) => (
                      <Link
                        key={index}
                        href={`/courses?category=${
                          categories?.find((c) => c.name === sub)?.slug
                        }`}
                        passHref
                        className="px-2 py-1 text-sm transition-colors bg-teal-600 rounded-sm cursor-pointer hover:bg-teal-500"
                      >
                        {textLangChecker(sub)}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-start gap-6 ">
              <div className="flex items-center gap-4">
                <div
                  className="p-2 rounded-md"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <img
                    loading="lazy"
                    src={"/images/teacher/user.webp"}
                    className="object-contain w-5 h-5 rounded-2xl"
                    alt={"img"}
                  />
                </div>
                <div className="flex flex-col justify-center text-white">
                  <div className="text-sm font-bold">
                    {" "}
                    {teacher?.teacherProfile?.totalSales} জন
                  </div>
                  <div className="text-xs leading-none">মোট শিক্ষার্থী</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              {[
                {
                  src: "/images/teacher/linkedin.webp",
                  alt: "LinkedIn",
                  link: teacher?.linkedin,
                },
                {
                  src: "/images/teacher/fb.webp",
                  alt: "Facebook",
                  link: teacher?.facebook,
                },
                {
                  src: "/images/teacher/yt.webp",
                  alt: "YouTube",
                  link: teacher?.youtube,
                },
              ]
                .filter((icon) => icon.link) // Filters out null or undefined links
                .map((icon, index) => (
                  <Link
                    key={index}
                    href={icon.link}
                    className="cursor-pointer"
                    target="_blank"
                    passHref
                  >
                    <img
                      loading="lazy"
                      src={icon.src}
                      className="object-contain w-6 rounded-2xl"
                      alt={icon.alt}
                    />
                  </Link>
                ))}
            </div>
          </div>
        </div>
        <p className="mt-10 text-lg leading-7 text-white max-md:max-w-full">
          {textLangChecker(teacher?.bio)}
        </p>
      </div>
    </section>
  );
}
