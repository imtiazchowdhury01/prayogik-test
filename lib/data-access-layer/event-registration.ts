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
    include: {
      event: {
        select: {
          purchase: true,
        },
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
        event: {
          status: {
            in: ["UPCOMING", "CLOSED"],
          },
        },
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

const getAllEventRegistrationDBCall = async () => {
  try {
    const allRegisterEvents = await db.eventRegistration.findMany({
      where: {
        AND: [
          {
            user: {
              id: {
                not: undefined,
              },
            },
          },
          {
            event: {
              id: {
                not: undefined,
              },
            },
          },
        ],
      },
      select: {
        event: {
          select: {
            title: true,
            slug: true,
            type: true,
            purchase: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
            facebook: true,
            linkedin: true,
          },
        },
        registeredAt: true,
      },
    });
    // Get purchase data for events
    const eventIds = allRegisterEvents.map((reg) => reg.event.slug);
    const eventPurchases = await db.purchase.findMany({
      where: {
        event: {
          slug: {
            in: eventIds,
          },
        },
      },
      select: {
        eventId: true,
        purchaseType: true,
        studentProfile: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });
    const combinedData = allRegisterEvents.map((registration) => {
      const userEmail = registration.user.email;

      const eventPurchase = eventPurchases.find(
        (purchase) => purchase.studentProfile.user.email === userEmail
      );

      return {
        ...registration,
        purchase: eventPurchase
          ? {
              purchaseType: eventPurchase.purchaseType,
              purchasedAt: eventPurchase.createdAt,
            }
          : null,
      };
    });

    return combinedData;
  } catch (error) {
    console.error("Error fetching events registration:", error);
    return [];
  }
};

// Updated function to get registrations by event ID
const getEventRegistrationsByIdDBCall = async (eventId: string) => {
  try {
    const eventRegistrations = await db.eventRegistration.findMany({
      where: {
        eventId: eventId, // Filter by specific event ID
        AND: [
          {
            user: {
              id: {
                not: undefined,
              },
            },
          },
          {
            event: {
              id: {
                not: undefined,
              },
            },
          },
        ],
      },
      select: {
        event: {
          select: {
            title: true,
            slug: true,
            type: true,
            purchase: true,
            location: true,
            price: true,
            isOnline: true,
            date: true,
            zoomLink: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            facebook: true,
            linkedin: true,
          },
        },
        registeredAt: true,
        isApproved: true,
        id: true,
      },
    });

    // Get purchase data for this specific event
    const eventSlug = eventRegistrations[0]?.event.slug;

    if (!eventSlug) return eventRegistrations;

    const eventPurchases = await db.purchase.findMany({
      where: {
        event: {
          slug: eventSlug,
        },
      },
      select: {
        eventId: true,
        purchaseType: true,
        studentProfile: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });

    const combinedData = eventRegistrations.map((registration) => {
      const userEmail = registration.user.email;

      const eventPurchase = eventPurchases.find(
        (purchase) => purchase.studentProfile.user.email === userEmail
      );

      return {
        ...registration,
        purchase: eventPurchase
          ? {
              purchaseType: eventPurchase.purchaseType,
              purchasedAt: eventPurchase.createdAt,
            }
          : null,
      };
    });

    return combinedData;
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return [];
  }
};

export {
  getEventRegisterUserByIdDBCall,
  getAllRegisteredEventDBCall,
  getAllEventRegistrationDBCall,
  getEventRegistrationsByIdDBCall,
};
