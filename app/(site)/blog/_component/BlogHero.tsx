import React from "react";
import Image from "next/image";
import Link from "next/link";

export function BlogHero() {
  return (
    <section className="overflow-hidden relative px-5 w-full bg-cover bg-center bg-[url('/images/teacher/herobg.webp')]">
      <div className="max-w-xl mx-auto py-[130px] ">
        <p className="text-3xl md:text-5xl font-bold  text-white text-center">
          সাম্প্রতিক ব্লগ গুলো
        </p>
        <p className="mt-5 text-base md:text-lg text-white font-medium text-center">
          সর্বশেষ শিল্প সংবাদ, সাক্ষাৎকার, প্রযুক্তি এবং সম্পদ।
        </p>
      </div>
    </section>
  );
}
