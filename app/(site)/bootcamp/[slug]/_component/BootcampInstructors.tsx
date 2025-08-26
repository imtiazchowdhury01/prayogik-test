// @ts-nocheck
import ExpertCard from "@/components/ExpertCard";

const instructors = [
  {
    id: 1,
    name: "মাহমুদ হাসান",
    role: "সোশ্যাল মিডিয়া মার্কেটিং",
    image: "/images/teacher/teacher1.webp",
  },
  {
    id: 2,
    name: "আব্দুল্লাহ রহমান",
    role: "ই-কমার্স মার্কেটিং",
    image: "/images/teacher/teacher1.webp",
  },
  {
    id: 3,
    name: "রাশেদ আমিন",
    role: "এসইও ও কনটেন্ট মার্কেটিং",
    image: "/images/teacher/teacher1.webp",
  },
];

export const BootcampInstructors = () => {
  return (
    <section className="mt-14 max-md:mt-10">
      <h1 className="text-2xl font-bold leading-none max-sm:text-lg">
        বুটক্যাম্প ইন্সট্রাক্টর
      </h1>
      <div className="grid items-start grid-cols-1 gap-4 mt-10 sm:grid-cols-2 md:grid-cols-3">
        {instructors.map((instructor) => {
          return <ExpertCard key={instructor?.id} />;
        })}
      </div>
    </section>
  );
};
