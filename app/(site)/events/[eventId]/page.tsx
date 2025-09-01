import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { generateMultipleBlurDataURLs } from "@/lib/blurGenerator";
import {
  getEventByIdDBCall,
  getEventsDBCall,
} from "@/lib/data-access-layer/events";
import {
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Breadcrumb,
} from "@/components/ui/breadcrumb";
import EventOverview from "./_components/EventOverview";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import EventRegisterForm from "./_components/EventRegisterForm";
import EventSpeakers from "./_components/EventSpeakers";
import FaqComponent from "@/components/FaqComponent";
import { formatEventTime } from "@/lib/utils/formatLiveCourseTime";

// // Generate static params for all events
// export async function generateStaticParams() {
//   try {
//     const events = await getEventsDBCall();
//     return events.map((event) => ({ slug: event.id }));
//   } catch (error) {
//     console.error("Error generating static params:", error);
//     return [];
//   }
// }

export async function generateMetadata({
  params,
}: {
  params: { eventId: string };
}): Promise<Metadata> {
  const event = await getEventByIdDBCall(params.eventId);

  if (!event) {
    return {
      title: "প্রায়োগিক ইভেন্ট",
      description:
        "প্রায়োগিক থেকে সর্বশেষ ইভেন্ট, প্রজেক্ট এবং শিখন কার্যক্রম দেখুন।",
    };
  }

  return {
    title: `${event.title} | প্রায়োগিক`,
    description: `প্রায়োগিক থেকে "${event.title}" ইভেন্টে যোগ দিন। ${
      event.isOnline
        ? "অনলাইনে অংশগ্রহণ করুন"
        : `লোকেশন: ${event.location ?? "অনুগ্রহ করে বিস্তারিত দেখুন"}`
    }। অভিজ্ঞ স্পিকারদের সাথে হাতে-কলমে শেখা ও আধুনিক টেকনোলজি আয়ত্ত করার সুযোগ মিস করবেন না!`,
  };
}

const EventDetailsPage = async ({
  params,
  searchParams,
}: {
  params: { eventId: string };
  searchParams: {type: string};
}) => {
  console.log(searchParams, "search");
  const event = await getEventByIdDBCall(params.eventId);

  if (!event) {
    redirect("/");
  }

  // Collect all image URLs from the course (filtering out null values)
  //   const imageUrls = [
  //     event?.imageUrl,
  //     ...(event?.lessons
  //       ?.map((lesson: any) => lesson.thumbnailUrl)
  //       .filter(Boolean) || []),
  //     event?.teacherProfile?.user?.avatarUrl,
  //   ].filter((url): url is string => url !== null && url !== undefined);

  // Generate blur data for all images in parallel
  //   const blurDataMap = await generateMultipleBlurDataURLs(imageUrls);

  return (
    <section className="min-h-[70vh] w-full">
      {/* breadcrumbs */}
      <div className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-6 xl:px-6 2xl:px-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-sm font-medium underline underline-offset-4 sm:text-base text-fontcolor-title hover:text-primary-brand"
                  >
                    হোম
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link
                  href="/events"
                  className="text-sm font-medium underline underline-offset-4 sm:text-base text-fontcolor-title hover:text-primary-brand"
                >
                  ইভেন্ট
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{event?.title}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-start lg:space-x-12 lg:flex-row app-container">
        {/* left grid-- */}
        <div className="w-full md:mt-6 sm:mt-8 lg:w-[65%]">
          <h2
            style={{
              lineHeight: "3.2rem",
            }}
            className="mt-4 text-3xl sm:text-4xl font-bold text-fontcolor-title"
          >
            {textLangChecker(event?.title)}
          </h2>

          <EventOverview
            event={event}
            // blurDataURL={
            //   event?.imageUrl ? blurDataMap[event.imageUrl] : undefined
            // }
          />

          <EventSpeakers speakers={event.speakers} />

          <div className="my-20">
            <h4 className="text-2xl font-bold text-fontcolor-title mb-6">
              ইভেন্ট সম্পর্কিত সাধারণ প্রশ্ন
            </h4>
            <FaqComponent faqItems={event.faqs} showRightSection={false} />
          </div>
        </div>

        {/* right grid-- */}
        <div className="w-full md:mt-8 mb-16 lg:top-20 lg:sticky lg:w-[35%] p-2 space-y-8">
          {/* Date and Time  */}
          <div className="bg-brand-primary-light p-6 rounded-[10px]">
            <h2 className="text-2xl mb-4 font-bold">তারিখ এবং সময়</h2>
            <p className="font-semibold flex items-center gap-2 text-gray-600">
              <Calendar size={16} />
              {formatEventTime(String(event.date))}
            </p>
          </div>
          {/* form Part */}
          <div className="bg-brand-primary-light p-6 rounded-[10px]">
            <EventRegisterForm eventId={event?.id} />
          </div>
          {/* Location */}
          {event.mapLocation && (
            <div>
              <h2 className="text-2xl mb-6 font-bold">ইভেন্ট লোকেশন</h2>
              <div className="relative w-full h-96">
                <iframe
                  src={event.mapLocation}
                  width="100%"
                  height="100%"
                  className="border-none rounded-md h-[188px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="EUVAT Location Map"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
