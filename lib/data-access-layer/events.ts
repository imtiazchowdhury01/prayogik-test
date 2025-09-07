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

const getFilteredEventsDBCall = async () => {
  const events = db.event.findMany({
     where: {
      status: {
        in: ["UPCOMING", "WAITING"], 
      },
    },
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

const getEventBySlugDBCall = async (slug: string) => {
  const event = db.event.findUnique({
    where: { slug },
    include: {
      attendees: true,
    },
  });
  return event;
};
export { getEventsDBCall,getFilteredEventsDBCall, getEventByIdDBCall, getEventBySlugDBCall };
