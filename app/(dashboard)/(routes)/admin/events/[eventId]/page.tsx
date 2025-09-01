import React from "react";
import { getEventByIdDBCall } from "@/lib/data-access-layer/events";
import { EventForm } from "../_components/EventForm";

const EventFormEditPage = async({ params }: { params: { eventId: string } }) => {
  const initialData = await getEventByIdDBCall(params.eventId);
  return (
    <div>
      <EventForm mode="update" initialData={initialData} />
    </div>
  );
};

export default EventFormEditPage;
