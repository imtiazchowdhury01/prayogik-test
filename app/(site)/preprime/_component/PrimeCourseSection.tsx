//@ts-nocheck
import PrimeCoursesSlider from "./PrimeCoursesSlider";
import { getSubscriptionCoursesDBCall } from "@/lib/data-access-layer/subscriptions";

// This function fetches data server-side
const PrimeCourseSection = async () => {
  const displayCourses = (await getSubscriptionCoursesDBCall(10)) || [];

  return (
    <section className="max-w-full mx-auto px-1 pt-8 pb-16">
      <div className="text-center">
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          শেখার জন্য প্রাইম কোর্স
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-12">
          শুধু থিওরি নয়, প্র্যাকটিকাল স্কিল শেখাতেই তৈরি আমাদের প্রাইম
          কোর্সগুলো।
        </p>

        {/* ------Prime slider------ */}
        <PrimeCoursesSlider displayCourses={displayCourses} />
      </div>
    </section>
  );
};

export default PrimeCourseSection;
