// @ts-nocheck 
import React from "react";
import ScheduleItem from "./ScheduleItem";

const scheduleData = [
  {
    time: "সকাল ১০:০০",
    description: "আরামদায়ক পরিবেশে, দিন শুরু করতে কফি এবং জলখাবার।",
  },
  {
    time: "সকাল ১০:৩০",
    description: "প্যানেল আলোচনা শুরু।",
  },
  {
    time: "দুপুর ০১:৩০",
    description: "দুপুরের খাবার",
  },
  {
    time: "দুপুর ০৩:৩০",
    description: "বক্তৃতা এবং ল্যাব চ্যালেঞ্জ",
  },
  {
    time: "বিকেল ০৪:৩০",
    description: "প্রকল্পের কাজ এবং একক প্রশিক্ষণ সেশন",
  },
  {
    time: "বিকেল ০৫:০০",
    description: "দিনের শেষে",
  },
];



export default function BootcampSchedule() {
  return (
    <section className="w-full mt-10">
      <h1 className="text-2xl font-bold text-slate-900">দৈনিক সময়সূচী</h1>

   
      <div className="p-6 mt-4 rounded-lg border border-slate-200">
        <div className="">
          {scheduleData.map((item, index) => (
            <ScheduleItem
              key={index}
              time={item.time}
              description={item.description}
              isFirst={index === 0}
              isLast={index === scheduleData.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
