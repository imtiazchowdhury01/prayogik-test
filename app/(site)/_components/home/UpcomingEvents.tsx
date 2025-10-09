import EventCard from "@/components/EventCard";
import { buttonVariants } from "@/components/ui/button";
import { getFilteredEventsDBCall } from "@/lib/data-access-layer/events";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function UpcomingEvents() {
  const events = await getFilteredEventsDBCall();

  if (events?.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-0 max-w-7xl mx-auto ">
        <div className="mb-8">
          <h2 className="font-bold md:text-left text-center text-3xl sm:text-4xl md:text-[40px]">
            আপকামিং ইভেন্ট
          </h2>
          <p className="mt-2 md:mt-4 md:my-4 text-base text-fontcolor-subtitle text-center md:text-left">
            নতুন স্কিল শেখার ইভেন্ট শুরু হচ্ছে শীঘ্রই
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.slice(0, 8).map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>

        {/* Navigation Link */}
        <div className={`flex items-center justify-center  mt-12`}>
          {events?.length >= 8 && (
            <Link
              href="/events"
              className={`bg-secondary-button hover:bg-secondary-button hover:opacity-95 transition-all duration-300 py-4 h-12 md:flex ${buttonVariants(
                {
                  variant: "default",
                }
              )}`}
            >
              ইভেন্টগুলো দেখুন{" "}
              <ArrowRight className="w-5 h-5 ml-1 font-extralight" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
