import Image from "next/image";
import Link from "next/link";
import React from "react";
import parse from "html-react-parser";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { CourseMode } from "@prisma/client";

interface TeacherIntroProps {
  course: any;
  blurDataURL: any;
}

const TeacherIntro = ({ course, blurDataURL }: TeacherIntroProps) => {
  const avatarSrc =
    course?.teacherProfile?.user?.avatarUrl || "/default-avatar.png";

  return (
    <section id="instructor" className="my-16">
      <h4 className="mb-4 text-xl font-bold text-fontcolor-title">
        ইন্সট্রাক্টর পরিচিতি
      </h4>

      {course?.courseMode === CourseMode.RECORDED ? (
        <div className="p-4 rounded-lg border-[1px] shadow-sm border-greyscale-200">
          <div className="flex flex-col items-start pb-4 space-y-2 xm:space-y-0 xm:space-x-4 xm:flex-row ">
            {/* teacher profile image */}
            <div className="w-[100px] h-[100px] min-h-[100px] min-w-[100px]">
              <Image
                src={avatarSrc}
                alt="instructor"
                width={100}
                height={100}
                className="object-cover w-full h-full rounded-lg"
                placeholder={blurDataURL ? "blur" : "empty"}
                blurDataURL={blurDataURL || undefined}
              />
            </div>

            <div className="w-full">
              <div className="text-lg font-bold text-fontcolor-title flex md:flex-row flex-col justify-between items-start">
                {/* instructor name and experienced */}
                <div>
                  <Link
                    href={`/teachers/${course?.teacherProfile?.user?.username}`}
                    className="hover:underline hover:text-primary-brand"
                  >
                    {textLangChecker(course?.teacherProfile?.user?.name)}{" "}
                  </Link>
                  <p className="text-sm font-medium text-gray-600 mt-2 mb-3">
                    {course?.teacherProfile?.yearsOfExperience && (
                      <span>
                        {convertNumberToBangla(
                          course?.teacherProfile?.yearsOfExperience.split(
                            " "
                          )[0]
                        )}{" "}
                        বছরের অভিজ্ঞতা সম্পন্ন
                      </span>
                    )}
                  </p>
                </div>
                {/* social contact for teacher */}
                <div className="flex items-center space-x-3 md:mb-0 mb-3">
                  {course?.teacherProfile?.user?.linkedin && (
                    <Link
                      href={course?.teacherProfile?.user?.linkedin}
                      target="_blank"
                      className="bg-[#F3F9F9] p-2 rounded"
                    >
                      <Image
                        src="/icon/social/linkedin.svg"
                        width={16.5}
                        height={16.5}
                        alt="linkedin-logo"
                        className="object-cover transition-all duration-300 max-w-5 max-h-5 md:max-w-6 md:max-h-6 hover:opacity-70"
                      />
                    </Link>
                  )}
                  {course?.teacherProfile?.user?.facebook && (
                    <Link
                      href={course?.teacherProfile?.user?.facebook}
                      target="_blank"
                      className="bg-[#F3F9F9] p-2 rounded"
                    >
                      <Image
                        src="/icon/social/Facebook.svg"
                        width={16.5}
                        height={16.5}
                        alt="facebook-logo"
                        className="object-cover transition-all duration-300 max-w-5 max-h-5 md:max-w-6 md:max-h-6 hover:opacity-70"
                      />
                    </Link>
                  )}
                  {course?.teacherProfile?.user?.youtube && (
                    <Link
                      href={course?.teacherProfile?.user?.youtube}
                      target="_blank"
                      className="bg-[#F3F9F9] p-2 rounded"
                    >
                      <Image
                        src="/icon/social/Youtube.svg"
                        width={16.5}
                        height={16.5}
                        alt="youtube-logo"
                        className="object-cover transition-all duration-300 max-w-5 max-h-5 md:max-w-6 md:max-h-6 hover:opacity-70"
                      />
                    </Link>
                  )}
                  {course?.teacherProfile?.user?.twitter && (
                    <Link
                      href={course?.teacherProfile?.user?.twitter}
                      target="_blank"
                      className="bg-[#F3F9F9] p-2 rounded"
                    >
                      <Image
                        src="/icon/social/twitter.svg"
                        width={16.5}
                        height={16.5}
                        alt="twitter-logo"
                        className="object-cover transition-all duration-300 max-w-5 max-h-5 md:max-w-6 md:max-h-6 hover:opacity-70"
                      />
                    </Link>
                  )}
                  {course?.teacherProfile?.user?.website && (
                    <Link
                      href={course?.teacherProfile?.user?.website}
                      target="_blank"
                      className="bg-[#F3F9F9] p-2 rounded"
                    >
                      <Image
                        src="/icon/social/globe.svg"
                        width={16.5}
                        height={16.5}
                        alt="website-logo"
                        className="object-cover transition-all duration-300 max-w-5 max-h-5 md:max-w-6 md:max-h-6 hover:opacity-70"
                      />
                    </Link>
                  )}
                  {course?.teacherProfile?.user?.others && (
                    <Link
                      href={course?.teacherProfile?.user?.others}
                      target="_blank"
                      className="bg-[#F3F9F9] p-2 rounded"
                    >
                      <Image
                        src="/icon/social/link.svg"
                        width={16.5}
                        height={16.5}
                        alt="others-logo"
                        className="object-cover transition-all duration-300 max-w-5 max-h-5 md:max-w-6 md:max-h-6 hover:opacity-70"
                      />
                    </Link>
                  )}
                </div>
              </div>

              {/* expertise badges */}
              <p className="flex flex-wrap items-center gap-2">
                {course?.teacherProfile?.subjectSpecializations?.map(
                  (subject: string, index: number) => {
                    return (
                      <span
                        key={index}
                        className="px-2 py-1 text-[13px] rounded-sm bg-[#F2F3F3]"
                      >
                        {textLangChecker(subject)}{" "}
                      </span>
                    );
                  }
                )}
              </p>
            </div>
          </div>
          {/* teacher bio details */}
          <div className="border-t-[1px] border-greyscale-200">
            <p className="pt-4 text-sm md:text-base text-fontcolor-description line-clamp-3">
              {parse(course?.teacherProfile?.user?.bio || "")}
            </p>
          </div>
        </div>
      ) : null}

      {course?.courseMode === CourseMode.LIVE ? (
        <div className="w-full">
          {/* Grid container with responsive columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* main author */}
            <div className="p-6 rounded-lg border border-greyscale-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Teacher profile image */}
                <div className="flex-shrink-0">
                  <Image
                    src={avatarSrc}
                    alt={course?.teacherProfile?.user?.name}
                    width={100}
                    height={100}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover"
                  />
                </div>

                {/* Teacher information */}
                <div className="flex-grow min-w-0">
                  {/* Name and link */}
                  <div className="mb-3">
                    <Link
                      href={`/teachers/${course?.teacherProfile?.user?.username}`}
                      className="text-lg font-bold text-fontcolor-title hover:underline hover:text-primary-brand transition-colors duration-200 line-clamp-2"
                    >
                      {textLangChecker(course?.teacherProfile?.user?.name)}
                    </Link>
                  </div>

                  {/* Years of experience */}
                  {course?.teacherProfile?.yearsOfExperience && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-600 flex items-center">
                        <span className="inline-block w-2 h-2 bg-brand rounded-full mr-2"></span>
                        {convertNumberToBangla(
                          course?.teacherProfile?.yearsOfExperience.split(
                            " "
                          )[0] || 1
                        )}{" "}
                        বছরের অভিজ্ঞতা সম্পন্ন
                      </p>
                    </div>
                  )}

                  {/* Expertise badges */}
                  <div className="flex flex-wrap gap-2">
                    {course?.teacherProfile?.subjectSpecializations
                      ?.slice(0, 3)
                      ?.map((subject: string, subjectIndex: number) => (
                        <span
                          key={subjectIndex}
                          className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                        >
                          {textLangChecker(subject)}
                        </span>
                      ))}

                    {/* Show more indicator if there are more specializations */}
                    {course?.teacherProfile?.subjectSpecializations?.length >
                      3 && (
                      <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary-brand/10 text-primary-brand">
                        +
                        {course?.teacherProfile?.subjectSpecializations.length -
                          3}{" "}
                        আরও
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* co authors */}
            {course?.coTeachers?.map((coTeacher: any, index: number) => {
              console.log(coTeacher);

              return (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-greyscale-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Teacher profile image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={coTeacher?.user?.avatarUrl}
                        alt={`${coTeacher?.user?.name} profile`}
                        width={100}
                        height={100}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover"
                      />
                    </div>

                    {/* Teacher information */}
                    <div className="flex-grow min-w-0">
                      {/* Name and link */}
                      <div className="mb-3">
                        <Link
                          href={`/teachers/${coTeacher?.user?.username}`}
                          className="text-lg font-bold text-fontcolor-title hover:underline hover:text-primary-brand transition-colors duration-200 line-clamp-2"
                        >
                          {textLangChecker(coTeacher?.user?.name)}
                        </Link>
                      </div>

                      {/* Years of experience */}
                      {coTeacher?.user?.teacherProfile?.yearsOfExperience && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-600 flex items-center">
                            <span className="inline-block w-2 h-2 bg-brand rounded-full mr-2"></span>
                            {convertNumberToBangla(
                              coTeacher?.user?.teacherProfile?.yearsOfExperience.split(
                                " "
                              )[0] || 1
                            )}{" "}
                            বছরের অভিজ্ঞতা সম্পন্ন
                          </p>
                        </div>
                      )}

                      {/* Expertise badges */}
                      <div className="flex flex-wrap gap-2">
                        {coTeacher?.user?.teacherProfile?.subjectSpecializations
                          ?.slice(0, 3)
                          ?.map((subject: string, subjectIndex: number) => (
                            <span
                              key={subjectIndex}
                              className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                            >
                              {textLangChecker(subject)}
                            </span>
                          ))}

                        {/* Show more indicator if there are more specializations */}
                        {coTeacher?.user?.teacherProfile?.subjectSpecializations
                          ?.length > 3 && (
                          <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary-brand/10 text-primary-brand">
                            +
                            {coTeacher?.user?.teacherProfile
                              ?.subjectSpecializations.length - 3}{" "}
                            আরও
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state when no co-teachers */}
          {(!course?.coTeachers || course?.coTeachers?.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">কোন সহ-শিক্ষক তথ্য পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
};

export default TeacherIntro;
