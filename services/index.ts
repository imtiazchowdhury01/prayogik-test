"use server";

import { Urls } from "@/constants/urls";
import { Category, SubscriptionDiscount } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { cache } from "react";

/**
 * Fetches all categories with proper error handling and caching
 * @returns Promise containing array of categories
 */
const fetchCategories = cache(async (): Promise<Category[]> => {
  try {
    const response = await fetch(Urls.categories, {
      method: "GET",
      next: {
        tags: ["categories"],
      },
      cache: "force-cache",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`,
        { cause: errorData }
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
});

const fetchSubscriptionDisounts = cache(
  async (): Promise<SubscriptionDiscount[]> => {
    try {
      const response = await fetch(Urls.subscriptionDiscounts, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies().toString(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subscription discounts");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching subscription discounts:", error);
      throw error;
    }
  }
);

/**
 * Invalidates the categories cache
 */
export async function revalidateCategories() {
  revalidateTag("categories");
}

export { fetchCategories, fetchSubscriptionDisounts };
