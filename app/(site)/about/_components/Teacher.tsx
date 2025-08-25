import React from "react";

interface TeacherCardProps {
  imageSrc: string;
  quote: string;
  name: string;
  title: string;
}
const TeacherCard = ({ imageSrc, quote, name, title }: TeacherCardProps) => (
  <div className="flex flex-col items-center gap-5 p-4">
    <img
      className="w-32 h-32 border rounded-full border-slate-300"
      src={imageSrc}
      alt={name}
    />
    <div className="text-lg font-semibold leading-relaxed text-center text-fontcolor-title">
      {quote}
    </div>
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold leading-7 text-center text-fontcolor-title">
        {name}
      </div>
      <div className="text-base leading-normal text-center text-fontcolor-description">
        {title}
      </div>
    </div>
  </div>
);

const TeachersList = () => {
  const teachers = [
    {
      imageSrc: "/images/teacher/user1.webp",
      quote:
        "শিক্ষক হিসেবে যোগদান করার মাধ্যমে আমি শুধু শেখাই না, আমি নিজেও প্রতিনিয়ত শিখছি।",
      name: "আসলাম খান",
      title: "ডিজিটাল মার্কেটিং ইন্সট্রাক্টর",
    },
    {
      imageSrc: "/images/teacher/user2.webp",
      quote:
        "একজন শিক্ষক হিসেবে, আমি আমার পেশাগত দক্ষতাকে অন্যদের সঙ্গে ভাগ করে নেওয়ার অসাধারণ সুযোগ পেয়েছি।",
      name: "মাহাবুব হাসান",
      title: "ডিজিটাল মার্কেটিং ইন্সট্রাক্টর",
    },
    {
      imageSrc: "/images/teacher/user3.webp",
      quote:
        "এখানে শিক্ষক হিসেবে কাজ করার অভিজ্ঞতা শুধু পেশাগত নয়, ব্যক্তিগত উন্নয়নের জন্যও অসাধারণ।",
      name: "কামরুল ইসলাম",
      title: "ডিজিটাল মার্কেটিং ইন্সট্রাক্টর",
    },
  ];

  return (
    <div className="w-full bg-background-gray">
      <div className="grid grid-cols-1 gap-10 app-container sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((teacher, index) => (
          <TeacherCard
            key={index}
            imageSrc={teacher.imageSrc}
            quote={teacher.quote}
            name={teacher.name}
            title={teacher.title}
          />
        ))}
      </div>
    </div>
  );
};

export default TeachersList;
