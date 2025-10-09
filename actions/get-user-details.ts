// actions/get-user-details.ts
"use server";

import { db } from "@/lib/db";

export async function getUserDetails(userId: string) {
  try {
    if (!userId) {
      return { access: false, error: "Unauthorized" };
    }

    // Find the user with the given ID
    const userProfile = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        emailVerified: true,
        isAdmin: true,
        isSuperAdmin: true,
        role: true,
        accountStatus: true,
        bio: true,
        dateOfBirth: true,
        gender: true,
        education: true,
        nationality: true,
        phoneNumber: true,
        profession: true,
        city: true,
        state: true,
        country: true,
        zipCode: true,
        facebook: true,
        linkedin: true,
        twitter: true,
        youtube: true,
        website: true,
        others: true,
        currentPlan: true,
        referralCode: true,
        upgradeOfferExpiresAt: true,
        primeUpgradedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userProfile) {
      return { access: false, error: "User profile not found" };
    }

    return {
      access: true,
      info: userProfile,
    };
  } catch (error) {
    console.error("Error fetching user details", error);
    return { access: false, error: "Internal Server Error" };
  }
}
