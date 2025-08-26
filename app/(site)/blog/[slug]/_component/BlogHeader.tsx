import * as React from "react";
import { AuthorInfo } from "./AuthorInfo";

export default function HeaderSection() {
  return (
    <header className="pt-10">
      <div className="flex flex-col items-start w-full max-md:max-w-full">
        <article className="w-full md:max-w-[803px]">
          <div className="w-full max-md:max-w-full">
            <p className="text-base font-bold text-violet-700 max-md:max-w-full">
              ডিজাইন
            </p>
            <h1 className="mt-3 text-5xl font-bold leading-none text-gray-900 max-md:max-w-full max-md:text-4xl">
              UX পর্যালোচনা উপস্থাপনা
            </h1>
          </div>
          <p className="mt-5 text-xl leading-8 text-slate-600 max-md:max-w-full">
            আপনি কীভাবে আকর্ষণীয় উপস্থাপনা তৈরি করবেন যা আপনার সহকর্মীদের বাহ
            এবং আপনার পরিচালকদের প্রভাবিত করে?
          </p>
        </article>
       
      </div>
    </header>
  );
}
