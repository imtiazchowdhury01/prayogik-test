// import Image from "next/image";
// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Calendar, Globe, MapPin } from "lucide-react";
// import { textLangChecker } from "@/lib/utils/textLangChecker";
// import { getPlainTextFromHtml } from "@/lib/convertNumberToBangla";
// import Link from "next/link";
// import { buttonVariants } from "./ui/button";
// import { formatEventTime } from "@/lib/utils/formatLiveCourseTime";
// import { EventStatus } from "@prisma/client";

// const badgeStyles = (status: string) => {
//   switch (status) {
//     case "DRAFT":
//       return { className: "bg-slate-500 text-white", text: "ড্রাফট" };
//     case "UPCOMING":
//       return { className: "bg-brand text-white", text: "রেজিস্ট্রেশন চলছে" };
//     case "WAITING":
//       return { className: "bg-secondary-button text-white", text: "শীঘ্রই আসছে" };
//     case "CLOSED":
//       return { className: "bg-red-500 text-white", text: "রেজিস্ট্রেশন বন্ধ" };
//     default:
//       return { className: "bg-gray-500", text: "" };
//   }
// };

// const EventCard = ({ event }: any) => {
//   return (
//     <Card
//       key={event.id}
//       className="bg-white rounded-lg shadow-sm flex flex-col"
//     >
//       <CardHeader className="p-0">
//         <div
//           className="relative w-full overflow-hidden rounded-t-lg"
//           style={{ aspectRatio: "16 / 9" }}
//         >
//           <Image
//             src={event?.imageUrl || "/default-image.jpg"}
//             alt="course-card-image"
//             fill
//             className="object-cover w-full h-full rounded-t-lg bg-[#F9FAFB]"
//             sizes="(max-width: 768px) 100vw, 400px"
//             priority
//             quality={75}
//           />

//           {/* Live course badge - positioned at top right */}
//           {event?.status && (
//             <div
//               className={`absolute top-2 left-2 rounded-md px-2 py-1 text-xs font-semibold ${
//                 badgeStyles(event.status).className
//               }`}
//             >
//               {badgeStyles(event.status).text}
//             </div>
//           )}
//         </div>
//       </CardHeader>
//       <CardContent className="p-4 flex-1">
//         <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1 leading-tight">
//           {textLangChecker(event?.title)}
//         </h3>
//         {event?.description && (
//           <p className="text-sm text-gray-700 mb-4 line-clamp-2">
//             {getPlainTextFromHtml(event?.description, 125)}
//           </p>
//         )}
//         <div className="space-y-2">
//           <p className="text-[14px] font-semibold flex items-center gap-1">
//             <Calendar size={16} className="text-gray-800" />
//             {formatEventTime(event.date)}
//           </p>
//           <div className="flex items-center text-base text-gray-600">
//             {!event.isOnline ? (
//               <MapPin className="w-4 h-4 mr-1 text-gray-800" />
//             ) : (
//               <Globe className="w-4 h-4 mr-1 text-gray-800" />
//             )}
//             <span className="text-[14px]">
//               {!event.isOnline ? event.location : "অনলাইন"}
//             </span>
//           </div>
//         </div>
//       </CardContent>

//       <CardFooter className="p-4 pt-0 mt-auto">
//         {event?.status !== EventStatus.CLOSED ? (
//           <Link
//             href={`/events/${event.slug}`}
//             className={`w-full h-12 text-base mt-auto ${buttonVariants({
//               variant: "default",
//             })}`}
//           >
//             বিস্তারিত দেখুন
//           </Link>
//         ) : (
//           <div
//             className={`w-full h-12 text-base mt-auto ${buttonVariants({
//               variant: "disabled",
//             })}`}
//           >
//             বিস্তারিত দেখুন
//           </div>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default EventCard;

import Image from "next/image";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Calendar, Globe, MapPin } from "lucide-react";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { getPlainTextFromHtml } from "@/lib/convertNumberToBangla";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { EventStatus } from "@prisma/client";

const badgeStyles = (status: string) => {
  switch (status) {
    case "DRAFT":
      return { className: "bg-slate-500 text-white", text: "ড্রাফট" };
    case "UPCOMING":
      return { className: "bg-brand text-white", text: "রেজিস্ট্রেশন চলছে" };
    case "CLOSED":
      return { className: "bg-red-500 text-white", text: "রেজিস্ট্রেশন বন্ধ" };
    default:
      return { className: "bg-gray-500", text: "" };
  }
};

// Fixed timezone-aware date formatting function
const formatEventTimeBangladesh = (eventDate: Date | string) => {
  const dateObj =
    typeof eventDate === "string" ? new Date(eventDate) : eventDate;

  if (!dateObj || isNaN(dateObj.getTime())) {
    return "তারিখ নির্ধারিত হয়নি";
  }

  // Get the hour in Bangladesh timezone for period determination
  const bangladeshHour = parseInt(
    dateObj.toLocaleString("en-US", {
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

  // Format date in Bangladesh timezone
  const dateFormatter = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

  return `${dateString}, ${timeString}`;
};

const EventCard = ({ event }: any) => {
  return (
    <Card
      key={event.id}
      className="bg-white rounded-lg shadow-sm flex flex-col"
    >
      <CardHeader className="p-0">
        <div
          className="relative w-full overflow-hidden rounded-t-lg"
          style={{ aspectRatio: "16 / 9" }}
        >
          <Image
            src={event?.imageUrl || "/default-image.jpg"}
            alt="course-card-image"
            fill
            className="object-cover w-full h-full rounded-t-lg bg-[#F9FAFB]"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
            quality={75}
          />

          {/* Live course badge - positioned at top right */}
          {event?.status && (
            <div
              className={`absolute top-2 left-2 rounded-md px-2 py-1 text-xs font-semibold ${
                badgeStyles(event.status).className
              }`}
            >
              {badgeStyles(event.status).text}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
          {textLangChecker(event?.title)}
        </h3>
        {event?.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {getPlainTextFromHtml(event?.description, 125)}
          </p>
        )}
        <div className="space-y-2">
          <p className="text-[14px] font-semibold flex items-center gap-1">
            <Calendar size={16} className="text-gray-800 mb-1" />
            {formatEventTimeBangladesh(event.date)}
          </p>
          {event?.location ? (
            <div className="flex items-center text-base text-gray-600">
              {!event.isOnline ? (
                <MapPin className="w-4 h-4 mr-1 text-gray-800 mb-1" />
              ) : (
                <Globe className="w-4 h-4 mr-1 text-gray-800 mb-1" />
              )}
              <span className="text-[14px]">
                {!event.isOnline ? event.location : "অনলাইন"}
              </span>
            </div>
          ): null}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        {event?.status !== EventStatus.CLOSED ? (
          <Link
            href={`/events/${event.slug}`}
            className="block w-full px-4 py-2 text-base font-semibold text-center text-white transition-all duration-300 rounded-sm hover:bg-primary-700 sm:px-6 sm:py-3 bg-primary-brand"
          >
            বিস্তারিত দেখুন
          </Link>
        ) : (
          <div
            className={`w-full h-12 text-base mt-auto ${buttonVariants({
              variant: "disabled",
            })}`}
          >
            বিস্তারিত দেখুন
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
