import * as React from "react";

interface AuthorInfoProps {
  name: string;
  date: string;
  avatarUrl: string;
}

export function AuthorInfo({ name, date, avatarUrl }: AuthorInfoProps) {
  return (
    <div className="flex gap-3 items-center mt-8 text-sm leading-none">
      <img
        loading="lazy"
        src={avatarUrl}
        alt={`Avatar of ${name}`}
        className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square"
      />
      <div className="self-stretch my-auto">
        <p className="font-bold mb-1 text-gray-900">{name}</p>
        <time className="text-slate-600">{date}</time>
      </div>
    </div>
  );
}
