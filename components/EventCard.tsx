import Image from "next/image";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Calendar, Globe, MapPin } from "lucide-react";
import eventImage1 from "@/public/images/event/event-1.webp";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import { getPlainTextFromHtml } from "@/lib/convertNumberToBangla";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { formatEventTime } from "@/lib/utils/formatLiveCourseTime";

const EventCard = ({ event }: any) => {
  return (
    <Card key={event.id} className="bg-white rounded-lg shadow-sm flex flex-col">
      <CardHeader className="p-0">
        <div
          className="relative w-full overflow-hidden rounded-t-lg"
          style={{ aspectRatio: "16/9" }}
        >
          <Image
            src={eventImage1}
            alt="event image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="lazy"
            placeholder="blur"
            quality={75}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {textLangChecker(event?.title)}
        </h3>
        {event?.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {getPlainTextFromHtml(event?.description, 125)}
          </p>
        )}
        <div className="space-y-2">
          <p className="text-[14px] font-semibold flex items-center gap-1">
            <Calendar size={16} className="text-gray-800" />
            {formatEventTime(event.date)}
          </p>
          <div className="flex items-center text-base text-gray-600">
            {!event.isOnline ? (
              <MapPin className="w-4 h-4 mr-1 text-gray-800" />
            ) : (
              <Globe className="w-4 h-4 mr-1 text-gray-800" />
            )}
            <span>{event.location ? event.location : "অনলাইন"}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Link
          href={`/events/${event.id}?type=${event.type}`}
          className={`w-full h-12 text-base mt-auto ${buttonVariants({
            variant: "default",
          })}`}
        >
          বিস্তারিত দেখুন
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
