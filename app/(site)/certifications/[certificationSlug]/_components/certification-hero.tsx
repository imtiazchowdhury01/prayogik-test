import React from "react";
import Image from "next/image";
import CertificationPrayogikLogoOverlay from "./certification-prayogik-logo-overlay";
import CertificationEnrollButton from "./certification-enroll-button";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

const CertificationHeroSection = ({ data }: any) => {
  const enrolledStudents = data?.enrolledStudents?.slice(0, 3) || [];

  return (
    <div className="bg-brand/5">
      <div className="app-container relative overflow-hidden  py-20 max-md:p-6 flex items-center justify-between">
        <div className="flex flex-col justify-start items-start gap-5 max-w-screen-lg">
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative overflow-hidden gap-1 px-3 py-2.5 rounded bg-[#e7f5f4]">
            <p className="flex-grow-0 flex-shrink-0 text-sm text-center text-brand font-normal">
              প্রোফেশনাল সার্টিফিকেট
            </p>
          </div>
          <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 lg:gap-10 gap-4">
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-7">
              <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative lg:gap-4 md:gap-4 gap-3">
                <p className="flex-grow-0 flex-shrink-0 text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-bold text-left text-[#021614]">
                  {data?.title}
                </p>
                <p
                  className="flex-grow-0 flex-shrink-0 text-md md:text-lg text-left text-[#41504f] font-normal max-w-4xl md:pr-20"
                  dangerouslySetInnerHTML={{ __html: data?.excerpt || "" }}
                />
              </div>
            </div>
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-4 md:gap-6 w-full md:mt-0 mt-2">
              {/* enroll button */}
              <CertificationEnrollButton initialCertification={data} />

              {/* enrolled students and reviews section */}
              <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-4">
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                  <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative -space-x-2">
                    {enrolledStudents.map((student: any, index: number) => {
                      const avatarUrl =
                        student?.studentProfile?.user?.avatarUrl;
                      const userName =
                        student?.studentProfile?.user?.name || "Student";
                      const bgColors = [
                        "bg-[#f8d8d7]",
                        "bg-[#e2e7f5]",
                        "bg-[#d4f3f0]",
                      ];

                      return (
                        <div
                          key={student.id || index}
                          className={`w-[28.88px] h-[28.88px] relative overflow-hidden rounded-full ${
                            bgColors[index % bgColors.length]
                          } border-[0.6px] border-white`}
                        >
                          {avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt={userName}
                              width={29}
                              height={29}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-600">
                              {userName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Show +X more if there are more than 3 students */}
                    {data?.totalEnrolledStudents > 3 && (
                      <div className="w-[28.88px] h-[28.88px] relative overflow-hidden rounded-full bg-gray-200 border-[0.6px] border-white flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          +
                          {convertNumberToBangla(
                            data.totalEnrolledStudents - 3
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  {data.totalEnrolledStudents ? (
                    <p className="flex-grow-0 flex-shrink-0 text-base text-left">
                      <span className="flex-grow-0 flex-shrink-0 text-base text-left text-[#41504f]">
                        ইতিমধ্যে
                      </span>{" "}
                      <span className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-[#021614]">
                        {data?.totalEnrolledStudents > 0
                          ? `${convertNumberToBangla(
                              data?.totalEnrolledStudents
                            )}${data?.totalEnrolledStudents > 1 ? "+ " : ""}`
                          : null}
                      </span>
                      <span className="flex-grow-0 flex-shrink-0 text-base text-left text-[#41504f]">
                        {data?.totalEnrolledStudents === 1
                          ? "জন শিক্ষাথী এনরোল করেছে।"
                          : "শিক্ষাথী এনরোল করেছে।"}
                      </span>
                    </p>
                  ) : null}
                </div>

                {/* reviews */}
                {/* <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-3">
                  <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2">
                    <svg
                      width="107"
                      height="21"
                      viewBox="0 0 107 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0 w-[107px] h-5 relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g clipPath="url(#clip0_22426_50447)">
                        <path
                          d="M0 0.880325H20.0625V20.8697H0V0.880325ZM21.7344 0.880325H41.7969V20.8697H21.7344V0.880325ZM43.4688 0.880325H63.5312V20.8697H43.4688V0.880325ZM65.2031 0.880325H85.2656V20.8697H65.2031V0.880325ZM86.9375 0.880325H107V20.8697H86.9375V0.880325Z"
                          fill="#0D9488"
                        ></path>
                        <path
                          d="M10.0316 14.3523L13.0828 13.5819L14.3576 17.4965L10.0316 14.3523ZM17.0535 9.2925H11.6826L10.0316 4.25352L8.38066 9.2925H3.00977L7.35664 12.4158L5.70566 17.4548L10.0525 14.3315L12.7275 12.4158L17.0535 9.2925ZM31.766 14.3523L34.8172 13.5819L36.092 17.4965L31.766 14.3523ZM38.7879 9.2925H33.417L31.766 4.25352L30.115 9.2925H24.7441L29.091 12.4158L27.44 17.4548L31.7869 14.3315L34.4619 12.4158L38.7879 9.2925ZM53.5004 14.3523L56.5516 13.5819L57.8264 17.4965L53.5004 14.3523ZM60.5223 9.2925H55.1514L53.5004 4.25352L51.8494 9.2925H46.4785L50.8254 12.4158L49.1744 17.4548L53.5213 14.3315L56.1963 12.4158L60.5223 9.2925ZM75.2348 14.3523L78.2859 13.5819L79.5607 17.4965L75.2348 14.3523ZM82.2566 9.2925H76.8857L75.2348 4.25352L73.5838 9.2925H68.2129L72.5598 12.4158L70.9088 17.4548L75.2557 14.3315L77.9307 12.4158L82.2566 9.2925ZM96.9691 14.3523L100.02 13.5819L101.295 17.4965L96.9691 14.3523ZM103.991 9.2925H98.6201L96.9691 4.25352L95.3182 9.2925H89.9473L94.2941 12.4158L92.6432 17.4548L96.99 14.3315L99.665 12.4158L103.991 9.2925Z"
                          fill="white"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_22426_50447">
                          <rect
                            width="107"
                            height="20"
                            fill="white"
                            transform="translate(0 0.875)"
                          ></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                    <p className="flex-grow-0 flex-shrink-0 text-base text-left">
                      <span className="flex-grow-0 flex-shrink-0 text-base text-left text-[#41504f]">
                        (৭০+ রিভিউ -
                      </span>
                      <span className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-teal-600">
                        Trustpilot
                      </span>
                      <span className="flex-grow-0 flex-shrink-0 text-base text-left text-[#021614]">
                        )
                      </span>
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <CertificationPrayogikLogoOverlay className="z-[10] hidden md:block" />
      </div>
    </div>
  );
};

export default CertificationHeroSection;
