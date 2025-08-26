// @ts-nocheck
import React from "react";
import ExpertCard from "@/components/ExpertCard";
import MoreBtn from "@/components/more-btn";

export function OtherMentors({ allTeacher, blurDataMap }) {
  return (
    <section className="w-full pb-16">
      <div className="app-container">
        <div className="flex items-center justify-center w-full mb-6 md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-center md:text-left">
              অন্যান্য শিক্ষক
            </h2>
          </div>
          {allTeacher?.length > 4 && (
            <MoreBtn
              href="/teachers"
              title="আরো দেখুন"
              variant="underline"
              className="hidden md:flex"
            />
          )}
        </div>
        {/* experts card-- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {allTeacher &&
            allTeacher.slice(0, 4)?.map((teacher, index) => {
              const blurDataURL = teacher?.avatarUrl
                ? blurDataMap[teacher.avatarUrl]
                : null;
              return (
                <ExpertCard
                  key={index}
                  teacher={teacher}
                  blurDataURL={blurDataURL}
                />
              );
            })}
        </div>
        {allTeacher?.length > 4 && (
          <div className="flex items-center justify-center mt-5">
            <MoreBtn
              href="/teachers"
              title="আরো দেখুন"
              className="flex md:hidden"
            />
          </div>
        )}
      </div>
    </section>
  );
}
