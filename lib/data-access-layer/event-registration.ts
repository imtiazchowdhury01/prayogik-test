"use server";
import { db } from "../db";

const getEventRegisterUserByIdDBCall = async (
  userId: string,
  eventId: string
) => {
  const registerUser = await db.eventRegistration.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  });
  return registerUser;
};

const getAllRegisteredEventDBCall = async (userId: string) => {
  try {
    const allRegisterEvents = await db.eventRegistration.findMany({
      where: {
        userId,
      },
      include: {
        event: true,
      },
    });
    return allRegisterEvents;
  } catch (error) {
    console.error("Error fetching registered events:", error);
    return [];
  }
};

export { getEventRegisterUserByIdDBCall, getAllRegisteredEventDBCall };
