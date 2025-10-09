import React from "react";
import { EventRegistrationTable } from "../../../event-attendees/_components/data-table";
import { getEventRegistrationsByIdDBCall } from "@/lib/data-access-layer/event-registration";

const page = async ({ params }: { params: { eventId: string } }) => {
  const attendees = await getEventRegistrationsByIdDBCall(params.eventId);

  return (
    <div>
      <EventRegistrationTable data={attendees || []} />
    </div>
  );
};

export default page;
