import React from "react";
import { EventTable } from "./_components/event-table";
import { getEventsDBCall } from "@/lib/data-access-layer/events";

const EventsPage = async () => {
  const events = await getEventsDBCall();

  return (
    <div>
      <EventTable data={events || []} />
    </div>
  );
};

export default EventsPage;
