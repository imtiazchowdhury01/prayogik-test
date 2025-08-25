"use server";

import { Urls } from "@/constants/urls";
import { TeacherRank } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { cache } from "react";

const getRanks = cache(async (): Promise<TeacherRank[]> => {
  try {
    const response = await fetch(Urls.teacher.ranks, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ranks");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching ranks:", error);
    return [];
  }
});

async function updateTeacher(teacherId: string, formData: any) {
  try {
    // You would replace this with your actual DB update logic
    const response = await fetch(Urls.teacher.upDatedetails(teacherId), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      body: JSON.stringify(formData),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to save changes");
    }

    // Revalidate the path to update the UI
    revalidatePath(`/admin/teachers/details/${teacherId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export { getRanks, updateTeacher };
