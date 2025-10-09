import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { getCertificationCoursesDBCall } from "@/lib/data-access-layer/getCertificationCourses";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface AllCertificationCoursesProps {
  isCertificationPage?: boolean;
  bgColor?: string;
}

const CertificationCourses = async ({
  isCertificationPage = false,
  bgColor,
}: AllCertificationCoursesProps) => {
  const certifications = await getCertificationCoursesDBCall();

  if (certifications.length === 0 && !isCertificationPage) return null;

  return (
    <section className={`w-full py-16 md:py-20 ${bgColor}`}>
      <div className="app-container">
        <div
          className="flex items-center justify-center w-full mb-6 md:justify-between"
          data-testid="courses-header"
        >
          <div>
            <h2 className="font-bold md:text-left text-center text-3xl sm:text-4xl md:text-[40px]">
              সার্টিফিকেশন কোর্সসমূহ
            </h2>
            <p className="mt-2 md:mt-4 md:my-4 text-base text-fontcolor-subtitle text-center md:text-left">
              ইন-ডিমান্ড ও ফিউচার-রেডি ডিজিটাল মার্কেটিং এক্সপার্টিজ তৈরি করুন।
              নিজেকে এগিয়ে রাখুন।
            </p>
          </div>
        </div>
        {/* course card-- */}
        <div className="grid grid-cols-1 gap-6 md:gap-y-[50px] gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {certifications?.length === 0 ? (
            <div className="flex items-center justify-center px-20 py-40 border-2 border-gray-300 border-dashed rounded-lg col-span-full">
              <div className="text-center text-gray-500">
                দুঃখিত! কোনো কোর্স পাওয়া যায় নি।
              </div>
            </div>
          ) : (
            certifications?.map((data, ind) => {
              return (
                <CourseCard
                  variant="light"
                  key={ind}
                  course={data}
                  instructor={data?.teacherProfile?.user?.name}
                  certificationslug={data.slug}
                />
              );
            })
          )}
        </div>

        {/* see more button for both */}
        <div className="flex items-center justify-center mt-12">
          {certifications?.length >= 8 && (
            <Link href="/certifications">
              <Button
                variant={"outline"}
                className="text-gray-700 border-gray-300 transition-all duration-300 py-4 h-12 md:flex bg-transparent"
                data-testid="more-button-desktop"
              >
                আরও কোর্স দেখুন{" "}
                <ArrowRight className="w-5 h-5 ml-1 font-extralight" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CertificationCourses;
