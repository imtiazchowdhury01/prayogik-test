import Image from "next/image";
import Link from "next/link";
import React from "react";
import parse from "html-react-parser";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

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
                        course?.teacherProfile?.yearsOfExperience.split(" ")[0]
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
    </section>
  );
};

export default TeacherIntro;
