"use server";
import { Urls } from "@/constants/urls";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { cache } from "react";

export const fetchUserProfile = cache(async (userId: string) => {
  const response = await fetch(Urls.user.profile(userId));
  if (!response.ok) throw new Error("Failed to fetch user profile");
  return response.json();
});

export async function revalidateCategories() {
  revalidateTag("userProfile");
}

export const fetchUserSubscription = cache(async () => {
  const response = await fetch(Urls.user.subscription, {
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
  });
  if (!response.ok) throw new Error("Failed to fetch user subscriptions");
  return response.json();
});
