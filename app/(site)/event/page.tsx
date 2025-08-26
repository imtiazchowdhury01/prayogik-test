import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventCard from "@/components/EventCard";
const EventPage = () => {
  return (
    <main className="w-full min-h-[70vh] ">
      {/* hero section */}
      <section className="w-full bg-[url('/gradient-hero-bg.svg')] px-3 bg-cover flex flex-col items-center justify-center object-cover bg-center bg-no-repeat h-72">
        <h2 className="text-3xl font-bold text-white md:text-5xl">
          ইন্ডাস্ট্রি ফোকাসড <span className="text-secondary-500">ইভেন্ট</span>
        </h2>
        <p className="mt-4 text-base md:text-lg font-medium text-center text-white leading-[1.6]">
          ডিজিটাল মার্কেটিংয়ে ক্যারিয়ার গড়ার জন্য দ্রুত গতিতে যান। এই
          সার্টিফিকেট প্রোগ্রামে, আপনি <br className="hidden md:block" /> আপনার
          নিজস্ব গতিতে চাহিদার মধ্যে দক্ষতা শিখবেন
        </p>
      </section>
      <div className="py-20 app-container">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h4 className="text-2xl font-bold text-fontcolor-title">
            আপকামিং ইভেন্ট সমূহ
          </h4>
          <Select>
            <SelectTrigger className="w-[120px] bg-white sm:w-[200px] self-end rounded-3xl focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Sort by" className="font-secondary" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="popular" className="font-secondary">
                জনপ্রিয়
              </SelectItem>
              <SelectItem value="latest" className="font-secondary">
                সাম্প্রতিক
              </SelectItem>
              <SelectItem value="oldest" className="font-secondary">
                পুরাতন
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* event list-- */}
        <div className="grid grid-cols-1 gap-4 my-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(12)].map((_, ind) => {
            return <EventCard key={ind} />;
          })}
        </div>
      </div>
    </main>
  );
};

export default EventPage;
