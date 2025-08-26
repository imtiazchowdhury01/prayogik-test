import React from "react";

interface SkillButtonProps {
  text: string;
}

const SkillButton: React.FC<SkillButtonProps> = ({ text }) => {
  return (
    <button
      className="flex overflow-hidden gap-0.5 justify-center items-center px-2.5 py-2 rounded border border-solid border-[color:var(--Greyscale-200,#E2E8F0)] min-h-8"
      aria-label={text}
    >
      <span className="gap-2 self-stretch px-1 my-auto">{text}</span>
    </button>
  );
};

const RelatedSkills: React.FC = () => {
  const skills = [
    "ডিজাইন হ্যান্ডঅফ",
    "পোর্টফোলিও ডেভেলপমেন্ট",
    "ডিজাইন প্রেসেন্টেশনস",
  ];

  return (
    <section className="mt-10 text-slate-900">
      <h2 className="text-2xl font-bold leading-none max-md:max-w-full">
        রিলেটেড স্কিল
      </h2>
      <div className="flex flex-wrap gap-3 items-start mt-4 w-full text-sm font-medium leading-none text-center max-md:max-w-full">
        {skills.map((skill, index) => (
          <SkillButton key={index} text={skill} />
        ))}
      </div>
    </section>
  );
};

export default RelatedSkills;
