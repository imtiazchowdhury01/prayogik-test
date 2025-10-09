// @ts-nocheck
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper function to validate and parse data
const parseAndValidateYearsOfExperience = (yearsOfExperience: string) => {
  const parsedYears = parseInt(yearsOfExperience, 10);
  if (isNaN(parsedYears)) {
    return { valid: false, error: "Invalid years of experience." };
  }
  return { valid: true, value: parsedYears };
};

// Helper function to process comma-separated strings
const processCommaSeparatedString = (str: string) => {
  if (typeof str !== "string" || !str.trim()) {
    return str; // Return an empty array if the input is not a valid string or is empty
  }
  return str.split(",").map((s) => s.trim());
};

// Main POST handler
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      teacherId,
      name,
      email,
      yearsOfExperience,
      bio,
      subjectSpecializations,
      certifications,
      education,
      dateOfBirth,
      gender,
      nationality,
      phoneNumber,
      city,
      state,
      country,
      zipCode,
    } = data;

    // Check for required fields
    if (!teacherId) {
      return NextResponse.json(
        { error: "teacherId is required." },
        { status: 400 }
      );
    }

    // Validate years of experience
    const { valid, value: parsedYearsOfExperience } =
      parseAndValidateYearsOfExperience(yearsOfExperience);
    if (!valid) {
      return NextResponse.json(
        { error: parsedYearsOfExperience },
        { status: 400 }
      );
    }

    // Update the User model fields
    const updatedUser = await db.user.update({
      where: { id: teacherId },
      data: {
        name,
        email,
        bio,

        dateOfBirth: new Date(dateOfBirth),
        gender,
        nationality,
        phoneNumber,
        city,
        state,
        country,
        zipCode,
        education,
      },
    });

    // Check if TeacherProfile exists
    const existingTeacherProfile = await db.teacherProfile.findUnique({
      where: { userId: teacherId },
    });

    // Fetch all ranks
    const unsortedRanks = await db.teacherRank.findMany();
    const ranks = unsortedRanks.sort(
      (a, b) => a.numberOfSales - b.numberOfSales
    );

    if (existingTeacherProfile) {
      // Update existing TeacherProfile
      const updatedTeacherProfile = await db.teacherProfile.update({
        where: { userId: teacherId },
        data: {
          teacherStatus: "PENDING",
          subjectSpecializations: processCommaSeparatedString(
            subjectSpecializations
          ),
          certifications: processCommaSeparatedString(certifications),
          yearsOfExperience: parsedYearsOfExperience,
        },
      });

      return NextResponse.json(
        {
          message: "Teacher profile updated successfully.",
          teacherProfile: updatedTeacherProfile,
        },
        { status: 200 }
      );
    } else {
      // Create a new TeacherProfile
      const newTeacherProfile = await db.teacherProfile.create({
        data: {
          userId: teacherId,
          subjectSpecializations: processCommaSeparatedString(
            subjectSpecializations
          ),
          certifications: processCommaSeparatedString(certifications),
          yearsOfExperience: parsedYearsOfExperience,
          teacherRankId: ranks[0]?.id,
          teacherStatus: "PENDING",
        },
      });

      return NextResponse.json(
        {
          message: "Teacher profile created successfully.",
          teacherProfile: newTeacherProfile,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error processing teacher profile:", error);
    return NextResponse.json(
      { error: "Failed to submit details.", details: error.message },
      { status: 500 }
    );
  }
}
