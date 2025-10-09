import CertificationLinkedinIcon from "@/components/common/CertificationLinkedinIcon";
import CertificationTwitterIcon from "@/components/common/CertificationTwitterIcon";
import CertificationUserIcon from "@/components/common/CertificationUserIcon";
import { Separator } from "@/components/ui/separator";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import parse from "html-react-parser";
import CertificationSectionTitle from "./certification-section-title";

const CertificationInstructors = ({ data }: any) => {
  // Extract teacher information from data
  const mainTeacher = data?.teacherProfile;
  const coTeachers = data?.coTeachers || [];

  // Combine main teacher and co-teachers
  const allTeachers = mainTeacher
    ? [
        {
          ...mainTeacher.user,
          yearsOfExperience: mainTeacher.yearsOfExperience,
          subjectSpecializations: mainTeacher.subjectSpecializations,
          isMainTeacher: true,
        },
      ]
    : [];

  if (coTeachers.length > 0) {
    allTeachers.push(
      ...coTeachers.map((teacher: any) => ({
        ...teacher.user,
        yearsOfExperience: teacher.yearsOfExperience,
        subjectSpecializations: teacher.subjectSpecializations,
        isMainTeacher: false,
      }))
    );
  }

  // If no teachers found, return null or a message
  if (allTeachers.length === 0) {
    return null;
  }

  return (
    <div id="instructor" className="flex flex-col max-w-4xl justify-start items-start relative gap-4">
      <CertificationSectionTitle title="ইন্সট্রাক্টরের পরিচিতি" />

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {allTeachers.map((teacher, index) => (
          <div
            key={index}
            className="flex flex-col justify-start items-start relative gap-[18px] px-4 pt-4 pb-[18px] rounded-lg bg-white border-[1.2px] border-[#dfedeb] h-fit"
            style={{ boxShadow: "0px 4px 4px 0 rgba(2,22,20,0.02)" }}
          >
            <div className="flex justify-start items-start relative gap-4 w-full">
              <Image
                src={teacher.avatarUrl || "/profile/blank-profile.webp"}
                alt={teacher.name || "Instructor"}
                width={100}
                height={90}
                className="w-[100px] h-[90px] rounded-md object-cover"
              />
              <div className="flex flex-col justify-start items-start relative gap-3 w-full">
                <div className="flex justify-between w-full">
                  <div className="space-y-1">
                    <p className="text-md font-semibold text-left text-[#021614] capitalize">
                      {teacher.name}
                    </p>
                    <p className="text-xs text-left text-[#41504f]">
                      {teacher.yearsOfExperience ? (
                        <span>
                          {convertNumberToBangla(
                            teacher.yearsOfExperience.split("-")[0]
                          )}
                          -
                          {convertNumberToBangla(
                            teacher.yearsOfExperience
                              .split("-")[1]
                              .split(" ")[0]
                          )}{" "}
                          বছরের অভিজ্ঞতা সম্পন্ন
                        </span>
                      ) : (
                        <span>অভিজ্ঞতা সম্পন্ন</span>
                      )}
                    </p>
                  </div>
                </div>
                {/* <div className="flex justify-start items-center relative gap-1">
                  <CertificationUserIcon />
                  <p className="text-sm text-left text-[#41504f]">
                    {convertNumberToBangla(data.totalEnrolledStudents || 0)}{" "}
                    শিক্ষার্থী
                  </p>
                </div> */}
                <div className="flex justify-start items-center gap-3 rounded-md">
                  {/* Social links - only show if available in data */}
                  {teacher.linkedin && (
                    <Link
                      href={teacher.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-start items-center relative gap-2.5 p-2 rounded bg-[#f3f9f9] hover:bg-[#e5f1f1] transition-colors"
                    >
                      <CertificationLinkedinIcon />
                    </Link>
                  )}
                  {teacher.twitter && (
                    <Link
                      href={teacher.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-start items-center relative gap-2.5 p-2 rounded bg-[#f3f9f9] hover:bg-[#e5f1f1] transition-colors"
                    >
                      <CertificationTwitterIcon />
                    </Link>
                  )}
                  {teacher.youtube && (
                    <Link
                      href={teacher.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-start items-center relative gap-2.5 p-2 rounded bg-[#f3f9f9] hover:bg-[#e5f1f1] transition-colors"
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
                  {teacher.facebook && (
                    <Link
                      href={teacher.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-start items-center relative gap-2.5 p-2 rounded bg-[#f3f9f9] hover:bg-[#e5f1f1] transition-colors"
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
                  {teacher.website && (
                    <Link
                      href={teacher.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-start items-center relative gap-2.5 p-2 rounded bg-[#f3f9f9] hover:bg-[#e5f1f1] transition-colors"
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
                </div>
              </div>
            </div>

            {teacher.bio && (
              <>
                <Separator />
                <p className="text-base text-justify text-[#41504f] line-clamp-3">
                  {parse(teacher?.bio || "")}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationInstructors;
