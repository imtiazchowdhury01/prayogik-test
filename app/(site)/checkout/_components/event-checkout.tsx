// @ts-nocheck
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Calendar, MapPin, Globe } from "lucide-react";

import {
  convertNumberToBangla,
  getPlainTextFromHtml,
} from "@/lib/convertNumberToBangla";

import Image from "next/image";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { EventType } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PaymentMessage from "./payment-message";
import { getEventByIdDBCall } from "@/lib/data-access-layer/events";
import EventCheckoutForm from "./event-checkout-form";

const EventCheckout = async ({
  cartData,
  errorMessage,
  isPaymentSuccessful,
  transactionId,
  amount,
}: any) => {
  const { eventId } = cartData?.items[0];
  const event = await getEventByIdDBCall(eventId);
  const { userId } = await getServerUserSession();

  if (!cartData || !event) {
    return <div>ইভেন্ট খুঁজে পাওয়া যায়নি</div>;
  }

  // Format event date
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-[#F3F9F9] flex justify-center items-center p-6 xl:p-14 border-b">
      <Card className="app-container mx-auto bg-white p-6 md:p-10 border-0">
        {/* title and description */}
        <div>
          <h1 className="md:text-4xl text-3xl font-bold">চেকআউট </h1>
          <p className="sm:text-base text-sm font-normal text-gray-600">
            সব তথ্য যাচাই করুন এবং নিশ্চিন্তে পেমেন্ট করুন।
          </p>
        </div>
        {/* divider */}
        <hr className="my-4 border-gray-200" />
        {/* message for success or failed */}
        <PaymentMessage
          errorMessage={errorMessage}
          isPaymentSuccessful={isPaymentSuccessful}
          transactionId={transactionId}
          amount={amount}
        />

        <div className="flex lg:flex-row flex-col justify-between gap-10 pt-2">
          {/* Left Side - Event Details */}
          <div className="lg:w-[45%] w-full">
            <Card className="relative p-6">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={event.imageUrl || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="mb-0 pb-6 px-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={
                      event.type === EventType.FREE
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {event.type === EventType.FREE ? "ফ্রি" : "পেইড"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {event.isOnline ? "অনলাইন" : "অফলাইন"}
                  </Badge>
                </div>
                <CardTitle className="sm:text-2xl text-xl font-semibold ">
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-gray-700 space-y-3 px-0">
                {/* Event Date and Time */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{formattedDate}</p>
                    <p className="text-sm text-gray-600">
                      সময়: {formattedTime}
                    </p>
                  </div>
                </div>

                {/* Event Location */}
                <div className="flex items-center gap-2">
                  {event.isOnline ? (
                    <Globe className="h-4 w-4 text-gray-500" />
                  ) : (
                    <MapPin className="h-4 w-4 text-gray-500" />
                  )}
                  <p>
                    {event.isOnline
                      ? "অনলাইন ইভেন্ট"
                      : event.location || "স্থান জানানো হবে"}
                  </p>
                </div>

                {/* Attendees Count */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <p>
                    {convertNumberToBangla(event.attendees?.length || 0)} জন
                    অংশগ্রহণকারী
                  </p>
                </div>

                {/* Event Description */}
                {event.description && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {getPlainTextFromHtml(event?.description, 150)}
                    </p>
                  </div>
                )}

                {/* Event Price */}
                {event.type === EventType.PAID && event.price && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        রেজিস্ট্রেশন ফি:
                      </span>
                      <span className="text-xl font-bold text-brand">
                        ৳{convertNumberToBangla(event.price)}
                      </span>
                    </div>
                  </div>
                )}

                {event.type === EventType.FREE && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        রেজিস্ট্রেশন ফি:
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        ফ্রি
                      </span>
                    </div>
                  </div>
                )}

                {/* Speakers Section */}
                {event.speakers && event.speakers.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 mb-2">স্পিকার:</p>
                    <div className="space-y-2">
                      {event.speakers.map((speaker, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                            <img
                              src={
                                speaker.avatarUrl || "/placeholder-avatar.svg"
                              }
                              alt={speaker.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {speaker.name}
                            </p>
                            {speaker.designation && (
                              <p className="text-xs text-gray-500">
                                {speaker.designation}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* desktop screen */}
            <div className="w-fit hidden lg:block">
              <Link href="/events">
                <Button
                  variant="link"
                  className="flex flex-row gap-1 text-brand pt-8 hover:no-underline px-0 font-normal"
                >
                  <ArrowLeft className="w-4 h-4" />
                  ইভেন্ট পেজে ফিরে যান
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Checkout Form */}
          <div className="lg:w-[55%] w-full">
            <EventCheckoutForm
              event={event}
              isSignedIn={!!userId}
              isPaymentSuccessful={isPaymentSuccessful}
            />
          </div>
          {/* MOBILE screen */}
          <div className="w-fit lg:hidden block">
            <Link href="/events">
              <Button
                variant="link"
                className="flex flex-row gap-1 text-brand hover:no-underline px-0 font-normal"
              >
                <ArrowLeft className="w-4 h-4" />
                ইভেন্ট পেজে ফিরে যান
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EventCheckout;
