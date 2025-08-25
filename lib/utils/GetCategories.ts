// @ts-nocheck
"use server";

import { db } from "@/lib/db";

export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
    // throw new Error("Failed to fetch categories");
  }
}
