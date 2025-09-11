import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { getServerUserSession } from "@/lib/getServerUserSession";
import {
  ArrowLeft,
  Calendar,
  FileCheck,
  HelpCircle,
  LayoutDashboard,

  User,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getEventByIdDBCall } from "@/lib/data-access-layer/events";
import Link from "next/link";
import { EventTitleForm } from "./_components/title-form";
import { EventSlugTitleForm } from "./_components/slug-title-form";
import { EventDescriptionForm } from "./_components/description-form";
import { EventImageForm } from "./_components/image-form";
import { EventTypeForm } from "./_components/event-type-form";
import { EventLocationForm } from "./_components/event-location-form";
import { EventDateForm } from "./_components/event-date-form";
import { EventStatusForm } from "./_components/event-status-form";
import { EventSpeakersForm } from "./_components/event-speakers-form";
import { EventFAQForm } from "./_components/event-faq-form";
import { EventActions } from "./_components/actions";

const EventIdPage = async ({ params }: { params: { eventId: string } }) => {
  const { isAdmin, userId } = await getServerUserSession();

  // If no user is logged in, redirect to home page
  if (!isAdmin) {
    return redirect("/");
  }

  // Fetch the course data and ensure the user is the owner (teacher)
  const event = await getEventByIdDBCall(params.eventId);
 
  if (!event) return notFound();

  // Define required fields for the event setup completion
  const requiredFields = [event.title, event.slug, event?.description, event.type, event.date];

  // Calculate course setup progress
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!event.isPublished && (
        <Banner label="This event is unpublished. It will not be visible to the students." />
      )}
      <div className="mt-4">
        <Link
          href={`/admin/events`}
          className="w-fit flex items-center mb-6 text-sm transition hover:opacity-75"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to events
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Event setup</h1>
            <span className="text-sm text-slate-700">
              Complete all required fields {completionText}
            </span>
          </div>
          <EventActions
            disabled={!isComplete}
            eventId={params.eventId}
            isPublished={event.isPublished}
            eventSlug={event.slug}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 mt-16 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your event</h2>
            </div>
            <EventTitleForm initialData={event} eventId={event.id} />
            <EventSlugTitleForm initialData={event} eventId={event.id} />
            <EventDescriptionForm initialData={event} eventId={event.id} />
            <EventImageForm initialData={event} eventId={event.id} />
            <EventTypeForm initialData={event} eventId={event.id} />
            <EventLocationForm initialData={event} eventId={event.id} />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Calendar} />
                <h2 className="text-xl">Schedule</h2>
              </div>
              <EventDateForm initialData={event} eventId={event.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={FileCheck} />
                <h2 className="text-xl">Status</h2>
              </div>
              <EventStatusForm initialData={event} eventId={event.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={User} />
                <h2 className="text-xl">Speakers</h2>
              </div>
              <EventSpeakersForm initialData={event} eventId={event.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={HelpCircle} />
                <h2 className="text-xl">FAQs</h2>
              </div>
              <EventFAQForm initialData={event} eventId={event.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventIdPage;
