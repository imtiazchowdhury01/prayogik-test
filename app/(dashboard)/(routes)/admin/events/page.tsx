import React from "react";
import { EventTable } from "./_components/event-table";
import { getEventsDBCall } from "@/lib/data-access-layer/events";
import { getAllEventRegistrationDBCall } from "@/lib/data-access-layer/event-registration";

const EventsPage = async () => {
  const events = await getEventsDBCall();

  const eventLeads = await getAllEventRegistrationDBCall();

  return (
    <div>
      <EventTable data={events || []} eventLeads={eventLeads || []} />
    </div>
  );
};

export default EventsPage;
