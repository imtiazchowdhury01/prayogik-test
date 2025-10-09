import { getAllEventRegistrationDBCall } from "@/lib/data-access-layer/event-registration";
import React from "react";
import { EventRegistrationTable } from "./_components/data-table";

const EventLeadsPage = async () => {
  const eventLeads = await getAllEventRegistrationDBCall();

  return (
    <div>
      <EventRegistrationTable data={eventLeads || []} />
    </div>
  );
};

export default EventLeadsPage;
