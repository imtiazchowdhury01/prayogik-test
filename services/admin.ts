"use server";
import { Urls } from "@/constants/urls";
import {
  Course,
  SubscriptionDiscount,
  TeacherProfile,
  User,
} from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { cache } from "react";

/**
 * Fetches all courses for admin users with proper error handling and caching
 * @returns Promise containing array of courses
 */
const getCoursesByAdmin = async (): Promise<Course[]> => {
  try {
    const response = await fetch(Urls.admin.courses, {
      method: "GET",
      headers: {
        Cookie: cookies().toString(),
      },
      next: {
        tags: ["admin-courses"],
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Failed to fetch courses: ${response.status} ${response.statusText}`,
        { cause: errorData }
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching admin courses:", error);
    throw error;
  }
};

const getUsersByAdmin = async (): Promise<User[]> => {
  try {
    const response = await fetch(Urls.admin.users, {
      method: "GET",
      headers: {
        Cookie: cookies().toString(),
      },
      next: {
        tags: ["admin-users"],
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Failed to fetch users: ${response.status} ${response.statusText}`,
        { cause: errorData }
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching admin users:", error);
    throw error;
  }
};

const getUserDataById = async (userId: string) => {
  try {
    const response = await fetch(Urls.admin.users + userId, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const getTeachersByAdmin = async (): Promise<TeacherProfile[]> => {
  try {
    const response = await fetch(Urls.admin.teachers, {
      method: "GET",
      headers: {
        Cookie: cookies().toString(),
      },
      next: {
        tags: ["admin-users"],
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Failed to fetch users: ${response.status} ${response.statusText}`,
        { cause: errorData }
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching admin users:", error);
    throw error;
  }
};

const updateTeacherByAdmin = async (teacherId: string, formData: any) => {
  try {
    // You would replace this with your actual DB update logic
    const response = await fetch(Urls.admin.teacherById(teacherId), {
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
    revalidatePath(`/admin/teachers/${teacherId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const getSubscriptionDiscounts = cache(
  async (): Promise<SubscriptionDiscount[]> => {
    try {
      const response = await fetch(Urls.subscriptionDiscounts, {
        method: "GET",
        headers: {
          Cookie: cookies().toString(),
        },
        next: {
          tags: ["admin-subscription-discounts"],
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Failed to fetch subscription discounts: ${response.status} ${response.statusText}`,
          { cause: errorData }
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching admin subscription discounts:", error);
      throw error;
    }
  }
);

const createOrupdateSubscriptionDiscount = async (
  method: any,
  salesData: any,
  data: any
) => {
  const response = await fetch(Urls.subscriptionDiscounts, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: salesData?.id,
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  revalidatePath("/admin/manage/subscription-discounts");
  return response.json();
};

const deleteSubscriptionDiscount = async (id: any) => {
  const response = await fetch(Urls.subscriptionDiscounts + `/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete sales");
  }

  revalidatePath("/admin/manage/subscription-discounts");
  return response.json();
};

const subscriptionPlan = async (url: any, method: any, data: any) => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
    body: JSON.stringify(data),
  });

 const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to create or update subscription plan!");
  }

  revalidatePath("/admin/subscription-plans");
  return responseData;
};

const deleteSubscriptionPlan = async (deletingSubscriptionId: any) => {
  const url = `${Urls.subscriptions}/${deletingSubscriptionId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Cookie: cookies().toString(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete subscription plan!");
  }

  revalidatePath("/admin/subscription-plans");
  return response.json();
};

export const rankCreateOrUpdateByAdmin = async (
  url: string,
  method: string,
  data: any
) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create or update rank!");
  }

  revalidatePath("/admin/ranks");
  return response.json();
};

export const deleteRankByAdmin = async (deletingRankId: any) => {
  const url = Urls.admin.rankById(deletingRankId);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete rank!");
  }

  revalidatePath("/admin/ranks");
  return response.json();
};

export const getTeacherEarningsByAdmin = async (teacherId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/teachers/earnings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teacherProfileId: teacherId }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch monthly earnings");
  }

  return response.json();
};

export const getTeacherPaymentsByAdmin = async (teacherProfileId: string) => {
  const response = await fetch(Urls.admin.teacherPayments, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
    body: JSON.stringify({ teacherProfileId }),
    next: {
      tags: ["admin-teachers"],
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch monthly earnings");
  }

  return response.json();
};

export const payTeacherEarnings = async (data: any, earningId: string) => {
  const response = await fetch(Urls.admin.teacherPay, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, earningId }),
    next: {
      tags: ["admin-teachers"],
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch monthly earnings");
  }

  return response.json();
};

export const createCategoryByAdmin = async (data: any) => {
  const response = await fetch(Urls.categories, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
    body: JSON.stringify(data),
    next: {
      tags: ["admin-categories"],
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  revalidatePath("/admin/categories");
  return response.json();
};

export const updateCategoryByAdmin = async (data: any) => {
  const response = await fetch(Urls.categories, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
    body: JSON.stringify(data),
    next: {
      tags: ["admin-categories"],
    },
  });

  if (!response.ok) {
    throw new Error("Failed to update category");
  }

  revalidatePath("/admin/categories");
  return response.json();
};

export const deleteCategoryByAdmin = async (deletingCategoryId: any) => {
  const url = Urls.categories;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
    body: JSON.stringify({ id: deletingCategoryId }),
    next: {
      tags: ["admin-categories"],
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete category");
  }

  revalidatePath("/admin/categories");
  return response.json();
};

export {
  getCoursesByAdmin,
  getUsersByAdmin,
  getUserDataById,
  getTeachersByAdmin,
  deleteSubscriptionDiscount,
  createOrupdateSubscriptionDiscount,
  getSubscriptionDiscounts,
  subscriptionPlan,
  updateTeacherByAdmin,
  deleteSubscriptionPlan,
};
