//@ts-nocheck
import { BreadCrumb } from "@/components/common/breadCrumb";
import { BadgeCheckIcon } from "lucide-react";

export default function Hero({ course, ratingData }) {
  const date = new Date(course.updatedAt);
  const formattedDate = `${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

  const { averageRating, ratingsCount, enrolledStudents } = ratingData || {};

  return (
    <div className="bg-[#115E57]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <div className="max-w-2xl py-4">
          {/* breadcrumb */}
          <div className="mb-6">
            <BreadCrumb
              name={course?.category?.name}
              title={course?.title}
              url={"/courses/category"}
            />
          </div>

          {/* title */}
          <h1 className="text-3xl font-bold mb-6 text-white">
            {course?.title}
          </h1>

          {/* description */}
          <p
            className="text-lg mb-6 text-white"
            dangerouslySetInnerHTML={{
              __html: course?.description
                ? course?.description.slice(0, 140) +
                  (course?.description.length > 140 ? "" : "")
                : "No Description Found",
            }}
          />

          {/* ratings */}
          <div className="flex items-center mb-3">
            <h2 className="text-lg font-bold text-white mr-2">
              {averageRating?.toFixed(1) || "N/A"}
            </h2>
            {averageRating > 0 ? (
              <div className="flex">
                {[...Array(Math.floor(averageRating))].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
                {averageRating % 1 !== 0 && (
                  <span className="text-yellow-400 text-lg">☆</span>
                )}
                {[...Array(5 - Math.ceil(averageRating))].map((_, i) => (
                  <span key={i} className="text-gray-300 text-lg">
                    ★
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gray-300 text-lg">
                    ★
                  </span>
                ))}
              </div>
            )}
            <span className="ml-2 text-yellow-300 underline">
              ({ratingsCount || 0} ratings)
            </span>
            {/* <span className="ml-2 text-white">
              {enrolledStudents || 0} students
            </span> */}
          </div>

          {/* created by */}
          <p className="mb-3 text-white text-sm">
            Created by -
            <a href="#" className="text-yellow-400 underline ml-2">
              {course?.teacherProfile?.user?.name}
            </a>
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-100">
            <BadgeCheckIcon className="w-4 h-4" />
            <span>
              Last updated
              <span className="ml-1 text-white">{formattedDate}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
