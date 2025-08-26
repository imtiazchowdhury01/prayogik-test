
import React from "react";
import { StudentFeedbackCard } from "./StudentFeedbackCard";


export const StudentFeedback = () => {
  return (
    <section className="mt-10">
      <header className="flex flex-wrap gap-4 items-center w-full max-md:max-w-full">
        <h2 className="flex-1 shrink self-stretch my-auto text-2xl font-bold leading-none basis-0 text-slate-900 max-md:max-w-full">
          স্টুডেন্টদের ফিডব্যাক
        </h2>
        <nav className="flex items-center self-stretch my-auto rounded-md bg-slate-50">
          <button className="flex gap-2 items-center self-stretch p-1.5 my-auto w-8">
            <img src="/icon/arrow-left-black.png" alt="left-arrow" />
          </button>
          <div className="flex shrink-0 self-stretch w-px h-8 bg-zinc-100" />
          <button className="flex gap-2 items-center self-stretch p-1.5 my-auto w-8">
            <img src="/icon/arrow-right-black.png" alt="right-arrow" />
          </button>
        </nav>
      </header>
      <div className="flex flex-wrap gap-4 items-start mt-4 w-full max-md:max-w-full">
        <StudentFeedbackCard
          avatarSrc="/icon/student.png"
          name="আসলাম খান"
          course="ডিজিটাল মার্কেটিং"
          feedback="অফলাইনে শেখার মত সময় হয়ে উঠছিল না, তাই অনলাইন কোর্স কে বেছে নেওয়া, কোর্সটিতে খুব সুন্দর করে পড়ানো হয়েছে।"
        />
        <StudentFeedbackCard
          avatarSrc="/icon/student.png"
          name="আসলাম খান"
          course="ডিজিটাল মার্কেটিং"
          feedback="অফলাইনে শেখার মত সময় হয়ে উঠছিল না, তাই অনলাইন কোর্স কে বেছে নেওয়া, কোর্সটিতে খুব সুন্দর করে পড়ানো হয়েছে।"
        />
        <StudentFeedbackCard
          avatarSrc="/icon/student.png"
          name="আসলাম খান"
          course="ডিজিটাল মার্কেটিং"
          feedback="অফলাইনে শেখার মত সময় হয়ে উঠছিল না, তাই অনলাইন কোর্স কে বেছে নেওয়া, কোর্সটিতে খুব সুন্দর করে পড়ানো হয়েছে।"
        />
      </div>
    </section>
  );
};

export default StudentFeedback;
