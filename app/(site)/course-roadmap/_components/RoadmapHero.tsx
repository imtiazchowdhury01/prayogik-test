// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import React from "react";
import StatsRoadmap from "./StatsRoadmap";

const RoadmapHero = ({
  roadmaps,
  plannedRoadmaps,
  inProgressRoadmaps,
  completedRoadmaps,
}: {
  roadmaps: CourseRoadmap[];
  plannedRoadmaps: CourseRoadmap[];
  inProgressRoadmaps: CourseRoadmap[];
  completedRoadmaps: CourseRoadmap[];
}) => {
  return (
    <section className="bg-primary-brand">
      <div className="container mx-auto px-4 py-20 lg:py-14">
        <div className="flex md:flex-row gap-12 md:items-center mx-auto max-w-7xl p-6 lg:px-1">
          {/* Hero Details */}
          <div className="w-full">
            <div className="bg-[#119D90] mb-6 w-fit mx-auto md:inline-block px-3 py-1 rounded text-white font-thin text-md">
              <p>আজকেই শেখা শুরু করুন </p>
            </div>
            <h1 className="text-4xl md:text-6xl leading-normal font-bold text-white md:text-start text-center ">
              শুরু করো আজ, শেখার <br /> দুনিয়ায় এগিয়ে চলো
            </h1>
            <p className="text-lg text-center md:text-start md:text-xl text-gray-100 font-light max-w-3xl leading-relaxed mt-6">
              পরিকল্পনা অনুযায়ী প্রতিটি কোর্স সফলভাবে সম্পন্ন করো, নিজের অগ্রগতি
              নিয়মিত মাপো, দক্ষতা বাড়াও এবং ক্যারিয়ার গড়ার পথ দৃঢ়ভাবে এগিয়ে চলো
            </p>
            <div className="flex flex-row gap-4 mt-10">
              <Link
                href={"/course-roadmap"}
                className="block w-full px-4 py-3 text-sm md:text-base font-semibold text-center transition-all duration-300 rounded-lg sm:w-auto sm:inline-block  sm:px-6 sm:py-3 bg-white text-primary-brand"
              >
                শেখা শুরু করুন
              </Link>
              <Link
                href={"/course-roadmap"}
                className="block w-full px-4 py-3 text-sm md:text-base font-semibold text-center text-white transition-all duration-300 rounded-lg sm:w-auto sm:inline-block  sm:px-6 sm:py-3 bg-primary-brand border"
              >
                কোর্স অন্বেষণ করুন
              </Link>
            </div>
          </div>
          {/* image */}
          <div className="relative w-full items-center justify-end hidden lg:flex">
            <Image
              src={"/roadmap-hero.webp"}
              alt={"roadmap-hero-image"}
              width={544}
              height={474}
              priority={false}
              className="object-cover min-w-96 min-h-96"
            />
            {/* states cards */}
            <div className="absolute bottom-0 w-full">
              <div className="mx-5 my-4">
                <StatsRoadmap
                  roadmaps={roadmaps}
                  plannedRoadmaps={plannedRoadmaps}
                  inProgressRoadmaps={inProgressRoadmaps}
                  completedRoadmaps={completedRoadmaps}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapHero;
