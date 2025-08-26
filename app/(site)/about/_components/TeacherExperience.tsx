import Image from "next/image";
import React from "react";
const TeacherExperience = () => {
  return (
    <section className="py-16 md:py-[100px] bg-background-gray">
      <div className="flex flex-col items-center md:flex-row app-container">
        <div className="w-full md:w-1/2 lg:w-[40%] xl:w-[35%]">
          <Image
            src="/ceo1.png"
            alt="ceo-image"
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover w-full h-auto max-h-[400px] rounded-t-xl rounded-b-none md:rounded-xl md:rounded-br-none md:max-h-max"
          />
        </div>
        <div className="w-full  md:w-1/2  lg:w-[60%] xl:w-[65%] px-6 lg:px-16 py-10 xl:py-20 bg-primary-700 self-center md:self-end rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl space-y-5">
          <blockquote className="italic text-lg font-medium text-white lg:text-2xl">
            "একজন প্রশিক্ষক হিসেবে আমি শুধু শেখাই না, বরং নিজেও নতুন কিছু শিখি।
            এই পেশায় আমার সবচেয়ে বড় অর্জন হলো—অন্যের সাথে নিজের জ্ঞান ও অভিজ্ঞতা
            ভাগ করে নেওয়ার সুযোগ। এখানে প্রশিক্ষক হিসেবে কাজ করার অভিজ্ঞতা শুধু
            পেশাগত নয়, ব্যক্তিগত উন্নয়নের জন্যও অসাধারণ।"
          </blockquote>
          <p className="text-base">
            <span className="font-bold text-white">আবুল কাসেম, </span>
            <span className="text-greyscale-200">
              এসইও স্পেশালিস্ট, এক্সপোনেন্ট -এর প্রতিষ্ঠাতা
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeacherExperience;
