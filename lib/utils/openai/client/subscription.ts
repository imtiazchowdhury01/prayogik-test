import { clientApi } from "../client";

export const clientFetchSubscriptions = async () => {
  const response = await clientApi.getAllSubscriptionPlans();
  if (response.status === 200) {
    return response.body;
  }

  throw new Error("Failed to fetch subscriptions");
};
