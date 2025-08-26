import Image from "next/image";
import Link from "next/link";
import React from "react";

const BecomeAnInstructor = ({ variant = "dark" }) => {
  return (
    <section
      className={`w-full  pb-16 md:pb-[100px] ${
        variant === "dark" ? "bg-background-primary-darker" : ""
      }`}
    >
      <div className="flex flex-col h-auto overflow-hidden rounded-lg md:flex-row app-container">
        <div className="w-full md:w-1/2 ">
          <Image
            src={"/instructor.webp"}
            alt="instructor"
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col items-start justify-center w-full h-auto p-8 md:w-1/2 md:p-16 bg-primary-900">
          <h4 className="font-bold text-white text-3xl sm:text-4xl md:text-[40px] leading-10 md:leading-[48px]">
            প্রায়োগিকে প্রশিক্ষক হতে চান?
          </h4>
          <p className="mt-2 text-base text-white">
            আমরা খুঁজছি রিয়েল এক্সপার্টদের, যারা নিজেদের অভিজ্ঞতা ও দক্ষতা
            শেখাবেন সহজ উপায়ে। যদি আপনার মাঝে শেখানোর প্রেরণা থাকে, তাহলে আজই
            যুক্ত হোন আমাদের সাথে।
          </p>
          <ul className="mt-6 mb-8 ml-10 text-base font-bold text-white list-disc">
            <li>নিশ্চিত এককালীন আয়</li>
            <li>আপনার নামেই কোর্স পাবলিশ হবে</li>
            <li>ব্যক্তিগত ব্র্যান্ডিং ও কর্তৃত্ব প্রতিষ্ঠা</li>
          </ul>
          <Link
            href={"/become-a-teacher"}
            className="block w-full px-4 py-2 text-base font-semibold text-center text-white duration-300 rounded-lg hover:bg-secondary-700 sm:px-6 sm:py-3 bg-secondary-brand"
          >
            প্রশিক্ষক হতে চাই
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BecomeAnInstructor;
