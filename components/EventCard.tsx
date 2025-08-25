import Image from "next/image";
import Link from "next/link";
import React from "react";
const EventCard = () => {
  const eventDetails = [
    {
      id: "type",
      title: "ফ্রি ইভেন্ট",
      icon: "/icon/money.svg",
    },
    {
      id: "location",
      title: "জিইসি, চট্টগ্রাম",
      icon: "/icon/location.svg",
    },
    {
      id: "date",
      title: "০৬ ফেব্রুয়ারী ২০২৫",
      icon: "/icon/calendar.svg",
    },
    {
      id: "time",
      title: "৯:৩০ am - ১১:৩০ pm",
      icon: "/icon/clock.svg",
    },
  ];
  return (
    <div className="overflow-hidden bg-white shadow-sm rounded-2xl">
      <div className="relative w-full h-40 overflow-hidden">
        <Image
          src={"/course.svg"}
          alt="course-image"
          width={0}
          height={0}
          sizes="10vw"
          className="object-cover w-full h-full "
        />
      </div>
      <div className="px-5 py-4">
        <p className="text-lg font-bold sm:text-xl text-primary-brand">
          ডিজিটাল মার্কেটিং ইভেন্ট
        </p>
        <div className="flex flex-col my-4 space-y-2">
          {eventDetails.map((detail) => {
            return (
              <div className="flex items-center space-x-2">
                <Image
                  src={detail.icon}
                  alt={detail.title}
                  width={20}
                  height={20}
                />
                <p className="text-base text-fontcolor-description">
                  {detail.title}
                </p>
              </div>
            );
          })}
        </div>
        <Link
          href={"/event/digital-marketing-event"}
          className="block w-full py-3 text-sm text-center text-white transition-all duration-300 rounded-lg bg-primary-brand hover:bg-primary-700"
        >
          রেজিস্ট্রেশন করুন
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
