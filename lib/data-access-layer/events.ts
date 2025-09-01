import { db } from "../db";

const getEventsDBCall = async () => {
  const events = db.event.findMany({
    include: {
      attendees: true,
    },
    orderBy: {
      date: "desc",
    },
  });
  return events;
};

const getEventByIdDBCall = async (id: string) => {
  const event = db.event.findUnique({
    where: { id },
    include: {
      attendees: true,
    },
  });
  return event;
};
export { getEventsDBCall, getEventByIdDBCall };
