// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const data = await request.json();
    const {
      bio,
      dateOfBirth,
      gender,
      nationality,
      city,
      state,
      country,
      zipCode,
      education,
      linkedin,
      facebook,
      youtube,
      others,
      subjectSpecializations,
      expertiseLevel,
      yearsOfExperience,
      twitter,
      certifications,
      website,
      phoneNumber,
    } = data;

    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection error." },
        { status: 500 }
      );
    }

    // Fetch and sort teacher ranks
    const unsortedRanks = await db.teacherRank.findMany();
    const ranks = unsortedRanks.sort(
      (a, b) => a.numberOfSales - b.numberOfSales
    );

    // Construct the update data object dynamically
    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (dateOfBirth !== undefined)
      updateData.dateOfBirth = new Date(dateOfBirth);
    if (gender !== undefined) updateData.gender = gender;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (country !== undefined) updateData.country = country;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (education !== undefined) updateData.education = education;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (facebook !== undefined) updateData.facebook = facebook;
    if (youtube !== undefined) updateData.youtube = youtube;
    if (others !== undefined) updateData.others = others;
    if (website !== undefined) updateData.website = website;
    if (twitter !== undefined) updateData.twitter = twitter;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    // Find teacher if exist
    const exisitingTeacherProfile = await db.teacherProfile.findFirst({
      where: {
        userId: session.user.id
      }
    })

    // Update user information
    const updatedUser = await db.user.update({  
      where: { id: session.user.id },
      data: updateData,
    });
  

    if (exisitingTeacherProfile) {
      return NextResponse.json(
        { success: false, message: "Teacher already exist!" },
        { status: 400 }
      );
    }

    // Create a teacher profile
    const teacherProfile = await db.teacherProfile.create({
      data: {
        userId: session.user.id,
        subjectSpecializations: subjectSpecializations || [],
        expertiseLevel,
        teacherRankId: ranks[0]?.id,
        certifications,
        yearsOfExperience,
        teacherStatus: "PENDING",
      },
    });

    

    return NextResponse.json(
      { success: true, message: "Application submitted successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing teacher application:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
