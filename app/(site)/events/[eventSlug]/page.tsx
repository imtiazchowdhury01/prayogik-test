//@ts-nocheck
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import {
  getEventBySlugDBCall,
  getFilteredEventsDBCall,
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
import {
  Calendar,
  CalendarDays,
  Clock,
  Globe,
  MapPin,
  Wallet,
} from "lucide-react";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import EventRegisterForm from "./_components/EventRegisterForm";
import EventSpeakers from "./_components/EventSpeakers";
import FaqComponent from "@/components/FaqComponent";
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

export async function generateStaticParams() {
  const events = await getFilteredEventsDBCall();

  return events.map((event) => ({
    eventSlug: event.slug,
  }));
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

  // Create a client-side safe date formatter for Bangla
  function formatEventDateTime(eventDate: Date | string) {
    if (!dateObj) {
      return ""; // or any fallback string
    }
    const dateObj =
      typeof eventDate === "string" ? new Date(eventDate) : eventDate;

    // Get the date in Bangladesh timezone (Asia/Dhaka)
    const bangladeshTime = new Intl.DateTimeFormat("bn-BD", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(dateObj);

    return bangladeshTime;
  }

  function formatEventBanglaTime(eventDate: Date | string) {
    if (!dateObj) {
      return ""; // or any fallback string
    }
    const dateObj =
      typeof eventDate === "string" ? new Date(eventDate) : eventDate;

    // Get time components in Bangladesh timezone
    const bangladeshDateTime = new Date(
      dateObj?.toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    );
    const hour = bangladeshDateTime.getHours();
    const minute = bangladeshDateTime.getMinutes();

    let period = "";
    if (hour >= 4 && hour < 12) {
      period = "সকাল";
    } else if (hour >= 12 && hour < 16) {
      period = "দুপুর";
    } else if (hour >= 16 && hour < 19) {
      period = "বিকেল";
    } else {
      period = "রাত";
    }

    // convert to 12-hour format
    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12;

    // Bangla number formatter
    const numberFormatter = new Intl.NumberFormat("bn-BD");
    const hourText = numberFormatter.format(displayHour);
    const minuteText =
      minute > 0 ? `:${numberFormatter.format(minute).padStart(2, "০")}` : "";

    return `${period} ${hourText}${minuteText} টা`;
  }

  // Alternative function that works better for consistent timezone handling
  function getConsistentBangladeshTime(eventDate: Date | string) {
    const dateObj =
      typeof eventDate === "string" ? new Date(eventDate) : eventDate;
    if (!dateObj) {
      return "Invalid date"; // or any fallback string
    }
    // Create date formatter for Bangladesh timezone
    const timeFormatter = new Intl.DateTimeFormat("bn-BD", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });

    const dateFormatter = new Intl.DateTimeFormat("bn-BD", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    // Get the hour in Bangladesh timezone for period determination
    const bangladeshHour = parseInt(
      dateObj?.toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        hour12: false,
      })
    );

    const bangladeshMinute = parseInt(
      dateObj.toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        minute: "2-digit",
      })
    );

    let period = "";
    if (bangladeshHour >= 4 && bangladeshHour < 12) {
      period = "সকাল";
    } else if (bangladeshHour >= 12 && bangladeshHour < 16) {
      period = "দুপুর";
    } else if (bangladeshHour >= 16 && bangladeshHour < 19) {
      period = "বিকেল";
    } else {
      period = "রাত";
    }

    // Convert to 12-hour format
    let displayHour = bangladeshHour % 12;
    if (displayHour === 0) displayHour = 12;

    // Format numbers in Bangla
    const numberFormatter = new Intl.NumberFormat("bn-BD");
    const hourText = numberFormatter.format(displayHour);
    const minuteText =
      bangladeshMinute > 0
        ? `:${numberFormatter.format(bangladeshMinute).padStart(2, "০")}`
        : "";

    const timeString = `${period} ${hourText}${minuteText} টা`;
    const dateString = dateFormatter.format(dateObj);

    return { timeString, dateString };
  }

  const { timeString, dateString } = getConsistentBangladeshTime(event?.date);

  // console.log("event.date result:", event);

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
        <div className="w-full md:mt-10 mt-8 lg:w-[65%]">
          <div
            className={`flex gap-1 items-center flex-row bg-brand-primary-light text-brand text-xs font-semibold px-2 py-1 rounded-md w-fit lg:mt-0`}
          >
            <CalendarDays size={14} />
            <p className="mt-1"> ইভেন্ট</p>
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-fontcolor-title md:leading-[3.2rem] leading-[2.6rem]">
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

            {!event.date &&
            !event.location &&
            (!event.price || event.price <= 0) ? (
              <p className="font-semibold text-gray-600">
                তারিখ, সময়, স্থান এবং ফি এখনও নির্ধারণ হয়নি
              </p>
            ) : (
              <>
                <p className="font-semibold flex items-center gap-2 text-gray-600 mb-4">
                  <Clock size={16} />
                  {event.date ? timeString : "সময় এখনও নির্ধারণ হয়নি"}
                </p>

                <p className="font-semibold flex items-center gap-2 text-gray-600 mb-4">
                  <Calendar size={16} />
                  {event.date ? dateString : "তারিখ এখনও নির্ধারণ হয়নি"}
                </p>

                <p className="font-semibold flex items-center gap-2 text-gray-600 mb-4">
                  {event.isOnline ? (
                    <>
                      <Globe size={16} />
                      <span>অনলাইন ইভেন্ট</span>
                    </>
                  ) : (
                    <>
                      <MapPin size={16} />
                      <span>
                        {event.location
                          ? `ভেন্যু: ${event.location}`
                          : "ভেন্যু এখনও নির্ধারণ হয়নি"}
                      </span>
                    </>
                  )}
                </p>

                {/* {event.type && (
                  <p className="font-semibold flex items-center gap-2 text-gray-600 mb-4">
                    {event?.type === EventType.PAID ? (
                      event?.price && event.price > 0 ? (
                        <>
                          <Wallet size={16} />
                          {convertNumberToBangla(event?.price)}
                        </>
                      ) : (
                        <>
                          <span className="text-[17px] pl-0.5">৳</span>
                          <span className="">ফি এখনও নির্ধারণ হয়নি</span>
                        </>
                      )
                    ) : event?.type === EventType.FREE ? (
                      <span className="">ফ্রি</span>
                    ) : event?.type === EventType.EOI ? (
                      event?.price && event.price > 0 ? (
                        <>
                          <span className="text-[17px] pl-0.5">৳</span>
                          {convertNumberToBangla(event?.price)}
                        </>
                      ) : (
                        <>
                          <span className="text-[17px] pl-0.5">৳</span>
                          <span className="">ফি এখনও নির্ধারণ হয়নি</span>
                        </>
                      )
                    ) : null}
                  </p>
                )} */}
                {event.type && (
                  <p className="font-semibold flex items-center gap-2 text-gray-600 mb-4">
                    <Wallet size={16} />
                    {event?.type === EventType.FREE ? (
                      <span className="">ফ্রি</span>
                    ) : event?.type === EventType.PAID ||
                      event?.type === EventType.EOI ? (
                      <>
                        {event?.price && event.price > 0 ? (
                          `${convertNumberToBangla(event?.price)}৳`
                        ) : (
                          <span className="">ফি নির্ধারণ হয়নি</span>
                        )}
                      </>
                    ) : null}
                  </p>
                )}
              </>
            )}
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
