

"use client";
import * as React from "react";
import { useState } from "react";

export default function NewsletterCard() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    // Handle subscription logic here
    // console.log("Subscribing with email:", email);
  };

  return (
    <article
      className="gap-32 px-8 pt-8 pb-10 rounded-lg border-solid shadow-sm border-[1.5px] border-[color:var(--Primary-Light-300,#5DB7AF)] "
      style={{
        background:
          "linear-gradient(0deg, rgba(13, 148, 136, 0.10) 0%, rgba(13, 148, 136, 0.10) 100%), #FFF",
      }}
    >
      <div className="bg-white rounded-lg inline-block p-4">
        <img
          loading="lazy"
          src="/images/blog/plane.svg"
          className="object-contain w-8 shadow-sm aspect-square"
          alt="Newsletter subscription icon"
        />
      </div>
      <div className="mt-8 w-full">
        <header className="w-full">
          <h2 className="text-2xl font-bold leading-none text-gray-900">
            সাপ্তাহিক নিউজলেটার
          </h2>
          <p className="mt-2 text-base leading-6 text-slate-600">
            কোন স্প্যাম নেই। প্রতি সপ্তাহে আপনার ইনবক্সে কেবল সর্বশেষতম রিলিজ
            এবং টিপস, আকর্ষণীয় নিবন্ধ এবং একচেটিয়া সাক্ষাত্কার।
          </p>
        </header>
        <section className="mt-8 w-full">
          <div className="w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="আপনার ইমেল লিখুন..."
              className="overflow-hidden flex-1 shrink gap-2 self-stretch py-3 pr-2.5 pl-3 w-full text-sm leading-none bg-white rounded border border-solid shadow-sm border-[color:var(--Greyscale-300,#CBD5E1)] min-h-10 text-ellipsis text-slate-500"
              aria-label="Email subscription input"
            />
            <p className="flex-1 shrink gap-1 py-0.5 mt-1 w-full text-xs leading-none text-slate-600">
              আমাদের গোপনীয়তা নীতি সম্পর্কে পড়ুন।
            </p>
          </div>
          <button
            onClick={handleSubscribe}
            className="flex overflow-hidden gap-1 justify-center items-center px-2.5 py-3 mt-4 w-full text-base font-semibold text-center text-white bg-teal-600 rounded-md shadow-sm min-h-12"
            aria-label="Subscribe to newsletter"
          >
            <span className="gap-2 self-stretch px-1 my-auto">
              সাবস্ক্রাইব করুন
            </span>
          </button>
        </section>
      </div>
    </article>
  );
}
