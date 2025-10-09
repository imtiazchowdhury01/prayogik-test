// api/user/profile/[userId]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const { userId: sessionUserId } = await getServerUserSession();

    if (sessionUserId !== userId) {
      return NextResponse.json(
        { message: "Unauthorized access!" },
        { status: 401 }
      );
    }

    const formData = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const currentUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userUpdateData: any = {};
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

    userFields.forEach((field) => {
      if (
        formData[field] !== undefined &&
        formData[field] !== currentUser[field as keyof typeof currentUser]
      ) {
        userUpdateData[field] = formData[field];
      }
    });

    const teacherProfileUpdateData: any = {};
    const teacherProfileFields = [
      "subjectSpecializations",
      "certifications",
      "yearsOfExperience",
      "expertiseLevel",
    ];

    if (currentUser.teacherProfile) {
      teacherProfileFields.forEach((field) => {
        if (
          formData[field] !== undefined &&
          JSON.stringify(formData[field]) !==
            JSON.stringify(
              currentUser.teacherProfile![
                field as keyof typeof currentUser.teacherProfile
              ]
            )
        ) {
          teacherProfileUpdateData[field] = formData[field];
        }
      });
    } else {
      teacherProfileFields.forEach((field) => {
        if (formData[field] !== undefined) {
          teacherProfileUpdateData[field] = formData[field];
        }
      });
    }

    await db.$transaction(async (prisma) => {
      if (Object.keys(userUpdateData).length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      if (Object.keys(teacherProfileUpdateData).length > 0) {
        if (currentUser.teacherProfile) {
          await prisma.teacherProfile.update({
            where: { userId: userId },
            data: teacherProfileUpdateData,
          });
        } else {
          await prisma.teacherProfile.create({
            data: {
              userId: userId,
              ...teacherProfileUpdateData,
            },
          });
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

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
      { error: "Invalid user ID provided" },
      { status: 400 }
    );
  }

  try {
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

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { emailVerificationToken, resetToken, password, ...userData } =
      currentUser;

    return NextResponse.json({ ...userData, hasPassword: !!password });
  } catch (error) {
    console.error("Error fetching user details:", error);

    return NextResponse.json(
      { error: "An error occurred while fetching user details" },
      { status: 500 }
    );
  }
}
