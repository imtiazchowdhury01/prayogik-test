// api/teacher/apply/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const parseAndValidateYearsOfExperience = (yearsOfExperience: string) => {
  if (!yearsOfExperience) {
    return { valid: true, value: undefined };
  }
  return { valid: true, value: yearsOfExperience };
};

const processCommaSeparatedString = (str: string | string[]) => {
  if (Array.isArray(str)) {
    return str;
  }
  if (typeof str !== "string" || !str.trim()) {
    return [];
  }
  return str.split(",").map((s) => s.trim());
};

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

    if (!teacherId) {
      return NextResponse.json(
        { error: "teacherId is required." },
        { status: 400 }
      );
    }

    const { valid, value: parsedYearsOfExperience } =
      parseAndValidateYearsOfExperience(yearsOfExperience);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid years of experience." },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (dateOfBirth !== undefined)
      updateData.dateOfBirth = new Date(dateOfBirth);
    if (gender !== undefined) updateData.gender = gender;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (country !== undefined) updateData.country = country;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (education !== undefined) updateData.education = education;

    const updatedUser = await db.user.update({
      where: { id: teacherId },
      data: updateData,
    });

    const existingTeacherProfile = await db.teacherProfile.findUnique({
      where: { userId: teacherId },
    });

    const unsortedRanks = await db.teacherRank.findMany();
    const ranks = unsortedRanks.sort(
      (a, b) => a.numberOfSales - b.numberOfSales
    );

    if (existingTeacherProfile) {
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
  } catch (error: any) {
    console.error("Error processing teacher profile:", error);
    return NextResponse.json(
      { error: "Failed to submit details.", details: error.message },
      { status: 500 }
    );
  }
}
