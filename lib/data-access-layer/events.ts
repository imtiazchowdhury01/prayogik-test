import { db } from "../db";

const getEventsDBCall = async () => {
  const events = await db.event.findMany({
    include: {
      attendees: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  // Get waiting counts for all events
  const waitingCounts = await db.lead.groupBy({
    by: ['eventId'],
    where: {
      status: 'WAITING',
      eventId: {
        not: null
      }
    },
    _count: {
      id: true
    }
  });

  // Create a map for quick lookup and add waitingCount to events using reduce
  const waitingCountMap = waitingCounts.reduce((acc, item) => {
    if (item.eventId) { // Type guard to ensure eventId is not null
      acc[item.eventId] = item._count.id;
    }
    return acc;
  }, {} as Record<string, number>);

  // Add waitingCount to each event using reduce with proper typing
  const eventsWithWaitingCount = events.reduce((acc, event) => {
    acc.push({
      ...event,
      waitingCount: waitingCountMap[event.id] || 0
    });
    return acc;
  }, [] as Array<typeof events[0] & { waitingCount: number }>);

  return eventsWithWaitingCount;
};

const getFilteredEventsDBCall = async () => {
  const events = await db.event.findMany({
    where: {
      status: {
        in: ["UPCOMING", "WAITING"],
      },
      isPublished: true,
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
  const event = await db.event.findUnique({
    where: { id },
    include: {
      attendees: true,
    },
  });
  return event;
};

const getEventBySlugDBCall = async (slug: string) => {
  const event = await db.event.findUnique({
    where: { slug },
    include: {
      attendees: true,
    },
  });
  return event;
};
export {
  getEventsDBCall,
  getFilteredEventsDBCall,
  getEventByIdDBCall,
  getEventBySlugDBCall,
};
