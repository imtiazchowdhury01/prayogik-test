// @ts-nocheck
import { db } from "@/lib/db";
import { courseEnrollmentNotificationTemplate } from "@/lib/utils/emailTemplates/course-enrollment-notification-template";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { enrolledCourseIds } = await req.json();
    const { userId } = params;

    if (!enrolledCourseIds || !Array.isArray(enrolledCourseIds)) {
      return NextResponse.json(
        { message: "Valid course IDs are required" },
        { status: 400 }
      );
    }

    // Get user information
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    });
    // console.log('userInfo result:', user);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Get course information
    const courses = await db.course.findMany({
      where: {
        id: { in: enrolledCourseIds },
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });
    // console.log('Get courses info:', courses);

    if (courses.length === 0) {
      return NextResponse.json(
        { message: "No valid courses found" },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.SMTP_USERNAME || !process.env.SMTP_APP_PASS) {
      throw new Error("SMTP configuration is missing");
    }

    // Create nodemailer transporter
     const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_APP_PASS,
          },
        });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const courseData = courses.map(course => ({
      title: course.title,
      slug: course.slug
    }));


    // Send enrollment confirmation email to user
    const enrollmentMailOptions = {
      from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
      to: user.email,
      subject: "কোর্স এনরোলমেন্ট নিশ্চিতকরণ - প্রায়োগিক",
      html: courseEnrollmentNotificationTemplate(
        user.email,
        user.name || "শিক্ষার্থী",
        courseData,
        baseUrl
      ),
    };
    // console.log('enrollmentMailOptions result:', enrollmentMailOptions);
    await transporter.sendMail(enrollmentMailOptions);

    return NextResponse.json({
      success: true,
      message: "Enrollment confirmation email sent successfully",
    });
  } catch (error) {
    console.error("Course enrollment email error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send enrollment email",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}