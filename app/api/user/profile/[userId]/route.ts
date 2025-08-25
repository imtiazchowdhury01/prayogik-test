// @ts-nocheck

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerUserSession } from "@/lib/getServerUserSession";

// PUT
export async function PUT(req, { params }) {
  const { userId } = params;

  try {
    const { userId: sessionUserId } = await getServerUserSession();

    if (sessionUserId !== userId) {
      return NextResponse.json(
        { message: "Unauthorize access!" },
        { status: 404 }
      );
    }

    // Parse the request body
    const formData = await req.json();

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the current user
    const currentUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: true, // Include teacherProfile to check if it exists
      },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Prepare update data for the User table
    const userUpdateData = {};
    const userFields = [
      "name",
      "dateOfBirth",
      "gender",
      "nationality",
      "bio",
      "phoneNumber",
      "city",
      "state",
      "country",
      "zipCode",
      "facebook",
      "linkedin",
      "twitter",
      "youtube",
      "website",
      "education",
      "others",
    ];

    // Populate userUpdateData with fields that have changed
    userFields.forEach((field) => {
      if (
        formData[field] !== undefined &&
        formData[field] !== currentUser[field] // Check if the field has changed
      ) {
        userUpdateData[field] = formData[field];
      }
    });

    // Prepare update data for the TeacherProfile table
    const teacherProfileUpdateData = {};
    const teacherProfileFields = [
      "subjectSpecializations",
      "certifications",
      "yearsOfExperience",
      "expertiseLevel",
    ];

    // Populate teacherProfileUpdateData with fields that have changed
    if (currentUser.teacherProfile) {
      teacherProfileFields.forEach((field) => {
        if (
          formData[field] !== undefined &&
          JSON.stringify(formData[field]) !==
            JSON.stringify(currentUser.teacherProfile[field]) // Deep comparison for arrays/objects
        ) {
          teacherProfileUpdateData[field] = formData[field];
        }
      });
    } else {
      // If no TeacherProfile exists, include all provided fields
      teacherProfileFields.forEach((field) => {
        if (formData[field] !== undefined) {
          teacherProfileUpdateData[field] = formData[field];
        }
      });
    }

    // Perform updates in a transaction to ensure data consistency
    await db.$transaction(async (prisma) => {
      // Update the User table if there are changes
      if (Object.keys(userUpdateData).length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      // Update or create the TeacherProfile if there are changes
      if (Object.keys(teacherProfileUpdateData).length > 0) {
        if (currentUser.teacherProfile) {
          // Update existing TeacherProfile
          await prisma.teacherProfile.update({
            where: { userId: userId },
            data: teacherProfileUpdateData,
          });
        } else {
          // Create new TeacherProfile
          await prisma.teacherProfile.create({
            data: {
              userId: userId,
              ...teacherProfileUpdateData,
            },
          });
          console.log("TeacherProfile created successfully");
        }
      }
    });

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET
export async function GET(request, { params }) {
  const { userId } = params;

  // Validate userId
  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
      { error: "Invalid user ID provided" },
      { status: 400 }
    );
  }

  try {
    // Fetch the user
    const currentUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: {
          include: {
            teacherRank: true,
          },
        },
      },
    });

    // Check if the user exists
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Exclude sensitive fields
    const { emailVerificationToken, resetToken, password, ...userData } =
      currentUser;

    // Return the user data with teacher profile if it exists
    return NextResponse.json({...userData, hasPassword: !!password});
  } catch (error) {
    console.error("Error fetching user details:", error);

    // Return a generic error message
    return NextResponse.json(
      { error: "An error occurred while fetching user details" },
      { status: 500 }
    );
  }
}
