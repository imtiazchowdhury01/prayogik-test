import { clientApi } from "../client";

export const clientGetEventRegisterByUser = async (eventId: string) => {
  const response = await clientApi.getEventRegisterByUser({
    params: {
      eventId,
    },
  });
  if (response.status === 200) {
    return response.body;
  }

  throw new Error("Failed to fetch user event registration details");
};
