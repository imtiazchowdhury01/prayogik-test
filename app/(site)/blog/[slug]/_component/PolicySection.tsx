import React from "react";

interface PolicySectionProps {
  title: string;
  content: string;
}

export function PolicySection({ title, content }: PolicySectionProps) {
  return (
    <section className="mt-10 w-full max-md:max-w-full">
      <h2 className="text-xl font-bold leading-snug text-slate-900 max-md:max-w-full">
        {title}
      </h2>
      <p className="mt-2 text-base font-medium leading-7 text-slate-600 max-md:max-w-full whitespace-pre-wrap">
        {content}
      </p>
    </section>
  );
}
