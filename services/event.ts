import { db } from "@/lib/db";

export const createEventRegistration = async (
  userId: string,
  eventId: string
) => {
  const registration = await db.eventRegistration.create({
    data: {
      userId,
      eventId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          date: true,
          type: true,
          price: true,
          isOnline: true,
          location: true,
          zoomLink: true,
        },
      },
    },
  });
  return registration;
};

export const checkEventAccess = async (userId: string, eventId: string) => {
  try {
    const registration = await db.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    return !!registration; // true if registered, false otherwise
  } catch (error) {
    console.error("Error checking event access:", error);
    throw new Error("Could not check event access");
  }
};
