import EventCard from "@/components/EventCard";
import { getEventsDBCall } from "@/lib/data-access-layer/events";

export default async function UpcomingEvents() {
  const events = await getEventsDBCall();
 

  return (
    <section className="px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-0 py-24 max-w-7xl mx-auto ">
      <div className="mb-8">
        <h2 className="font-bold md:text-left text-center text-3xl sm:text-4xl md:text-[40px]">
          আপকামিং ইভেন্ট
        </h2>
        <p className="mt-2 md:mt-4 md:my-4 text-base text-fontcolor-subtitle text-center md:text-left">
          নতুন স্কিল শেখার ইভেন্ট শুরু হচ্ছে শিগগিরই
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </section>
  );
}
