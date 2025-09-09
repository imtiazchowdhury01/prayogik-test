import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getEventBySlugDBCall } from "@/lib/data-access-layer/events";
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
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { EventStatus, EventType } from "@prisma/client";

export async function generateMetadata({
  params,
}: {
  params: { eventSlug: string };
}): Promise<Metadata> {
  const event = await getEventBySlugDBCall(params.eventSlug);

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
  params: { eventSlug: string };
  searchParams: { type: string };
}) => {
  const event = await getEventBySlugDBCall(params.eventSlug);

  if (
    !event ||
    event.status === EventStatus.DRAFT ||
    event.status === EventStatus.CLOSED ||
    !event.isPublished
  ) {
    return notFound();
  }

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

          <EventOverview event={event} />

          {!!event?.speakers?.length && (
            <EventSpeakers speakers={event.speakers} />
          )}

          {!!event?.faqs?.length && (
            <div className="my-20">
              <h4 className="text-2xl font-bold text-fontcolor-title mb-6">
                ইভেন্ট সম্পর্কিত সাধারণ প্রশ্ন
              </h4>
              <FaqComponent faqItems={event.faqs} showRightSection={false} />
            </div>
          )}
        </div>

        {/* right grid-- */}
        <div className="w-full md:mt-8 mb-16 lg:top-20 lg:sticky lg:w-[35%] p-2 space-y-8">
          {/* Date and Time  */}
          <div className="bg-brand-primary-light p-6 rounded-[10px]">
            <h2 className="text-2xl mb-4 font-bold">তারিখ এবং সময়</h2>
            <p className="font-semibold flex items-center gap-2 text-gray-600 mb-4">
              <Calendar size={16} />
              {formatEventTime(String(event.date))}
            </p>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-700">
                  ইভেন্ট ফি:
                </span>
                <div className="flex items-baseline gap-1">
                  {event?.type === EventType.PAID ? (
                    <>
                      <span className="text-2xl font-bold text-primary-brand">
                        {convertNumberToBangla(event?.price || 0)}
                      </span>
                      <span className="text-sm text-gray-600">টাকা</span>
                    </>
                  ) : (
                    <p>ফ্রি</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* form Part */}
          <div className="bg-brand-primary-light p-6 rounded-[10px]">
            <EventRegisterForm
              eventId={event?.id}
              eventType={event.type}
              eventPrice={100}
              eventStatus={event.status}
            />
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
