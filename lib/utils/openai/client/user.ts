import { clientApi } from "@/lib/utils/openai/client";

export const clientSidefetchUserSubscription = async () => {
  try {
    const response = await clientApi.getUserSubscriptions({});
    return response?.body ?? null;
  } catch (error) {
    console.error("Failed to fetch user subscription:", error);
    return null;
  }
};
