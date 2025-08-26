import React from "react";

interface FeedbackCardProps {
  avatarSrc: string;
  name: string;
  course: string;
  feedback: string;
}

export const StudentFeedbackCard: React.FC<FeedbackCardProps> = ({
  avatarSrc,
  name,
  course,
  feedback,
}) => {
  return (
    <article className="overflow-hidden flex-1 shrink p-5 rounded-lg border border-solid basis-0 border-[color:var(--Greyscale-200,#E2E8F0)] min-w-60">
      <p className="text-base leading-6 text-slate-900">{feedback}</p>
      <footer className="flex gap-2 items-center mt-5 w-full">
        <img
          loading="lazy"
          src={avatarSrc}
          alt={`${name}'s avatar`}
          className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square"
        />
        <div className="flex-1 shrink self-stretch my-auto basis-0">
          <h3 className="text-base font-bold text-slate-900">{name}</h3>
          <p className="text-xs leading-none text-slate-600">{course}</p>
        </div>
      </footer>
    </article>
  );
};
