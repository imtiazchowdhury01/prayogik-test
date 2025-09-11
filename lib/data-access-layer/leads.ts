"use server"
import { db } from "../db";

const getEventLeadByEmailDBCall = async (email: string, eventId: string) => {
  const lead = await db.lead.findUnique({
    where: {
      eventId,
      email,
    },
  });
  console.log("lead", lead);
  return lead;
};

export { getEventLeadByEmailDBCall };
