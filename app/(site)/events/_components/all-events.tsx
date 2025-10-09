// @ts-nocheck
import CourseCard from "@/components/CourseCard";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { getEventsDBCall } from "@/lib/data-access-layer/events";
import { getLiveeventsDBCall } from "@/lib/data-access-layer/getHomeevents";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import LoadMoreEvents from "./load-more-events";

const AllEvents = async () => {
  const events = (await getEventsDBCall())?.filter(
    (event) => event.status === "UPCOMING"
  );

  if ((!events || events.length === 0)) return null;

  return (
    <section
      className="w-full bg-[#F3F9F9] py-16 md:py-20"
      data-testid="our-events-section"
    >
      <div className="app-container">
        <div
          className="flex items-center justify-center w-full mb-6 md:justify-between"
          data-testid="events-header"
        >
          <div>
            <h2 className="font-bold  md:text-left text-center text-3xl sm:text-4xl md:text-[40px]">
              ইভেন্টসমূহ
            </h2>
            <p className="mt-2 md:mt-4 md:my-4 text-base text-fontcolor-subtitle text-center md:text-left">
              ইন-ডিমান্ড ও ফিউচার-রেডি ডিজিটাল মার্কেটিং এক্সপার্টিজ তৈরি করুন।
              নিজেকে এগিয়ে রাখুন।
            </p>
          </div>
        </div>
        {/* course card-- */}
        <div className="grid grid-cols-1 gap-6 md:gap-y-[50px] gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.slice(0, 8).map((event) => {
            return <EventCard event={event} key={event.id} />;
          })}
        </div>
        {events?.length === 0 && (
          <div
            className="mt-8 text-center border-2 border-gray-400 border-dashed rounded-lg p-14"
            data-testid="no-events"
          >
            <h3 className="mb-2 text-xl font-semibold">
              কোনো কোর্স পাওয়া যায়নি
            </h3>
          </div>
        )}

        {/* see more button for both */}
        <LoadMoreEvents totalEvents={events.length} />
      </div>
    </section>
  );
};

export default AllEvents;
