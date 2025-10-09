// app/api/courses/access/free/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import {
  updateTeacherBalance,
  updateTeacherMonthlyEarnings,
  enrollStudentToTheCourse,
} from "@/lib/utils/purchase";
import { checkCourseAccess } from "@/actions/get-course-access";
import { handleTrialPurchase } from "@/lib/utils/checkout/server";
import PurchaseEmailService from "@/lib/utils/checkout/mailer";
import { getOrCreateUser } from "@/services/user";
import { UserWithProfile } from "@/types/user";

// Constants
const PURCHASE_TYPE_SINGLE_COURSE = "SINGLE_COURSE";
const TEACHER_REVENUE_FREE_COURSE = 0;

// Response messages in Bangla
const MESSAGES = {
  MISSING_DATA: "কোর্স আইডি বা ইমেইল অনুপস্থিত",
  COURSE_NOT_FOUND: "ব্যবহারকারী বা কোর্স খুঁজে পাওয়া যায়নি",
  ALREADY_ENROLLED: "আপনার এই কোর্সে ইতিমধ্যেই প্রবেশাধিকার রয়েছে",
  TEACHER_NOT_FOUND:
    "শিক্ষক খুঁজে পাওয়া যায়নি বা কোনো র‍্যাঙ্ক নির্ধারণ করা হয়নি",
  STUDENT_PROFILE_ERROR: "ছাত্র প্রোফাইল খুঁজে পাওয়া যায়নি!",
  ENROLLMENT_SUCCESS: "সফলভাবে কোর্সে তালিকাভুক্ত হয়েছেন",
  GENERAL_ERROR: "কোর্সে বিনামূল্যে প্রবেশে সমস্যা হয়েছে",
};

interface CourseAccessRequest {
  courseId: string;
  email: string;
}


export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const requestBody: CourseAccessRequest = await req.json();
    const { courseId, email } = requestBody;

    // Input validation
    if (!courseId?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: MESSAGES.MISSING_DATA },
        { status: 400 }
      );
    }
    // Get or create user
    const user = await getOrCreateUser(email);

    // Get course with related data
    const course = await getCourseWithDetails(courseId);
    if (!course) {
      return NextResponse.json(
        { error: MESSAGES.COURSE_NOT_FOUND },
        { status: 404 }
      );
    }

    // Check if user already has access
    const hasAccess = await checkExistingAccess(course.slug, user.id);
    if (hasAccess) {
      return NextResponse.json(
        { error: MESSAGES.ALREADY_ENROLLED },
        { status: 400 }
      );
    }

    // ==============
    // uncomment this if you are givig the trial access for free
    // ==============
    // Ensure user has trial subscription
    // await ensureTrialSubscription(user, courseId);

    // Get teacher details with rank
    const teacher = await getTeacherWithRank(course.teacherProfileId);
    if (!teacher) {
      return NextResponse.json(
        { error: MESSAGES.TEACHER_NOT_FOUND },
        { status: 404 }
      );
    }

    // Process free enrollment
    await processFreeEnrollment(user, course, teacher);

    const mailer = new PurchaseEmailService();
    await mailer.handlePurchaseEmails(
      {
        email: user.email,
        purchaseType: PURCHASE_TYPE_SINGLE_COURSE,
        subscriptionPlanId: null,
        courseId,
        eventId: null,
      },
      null,
      null,
      user,
      user.isNewUser,
      user.temporaryPassword,
      user.username
    );
    // send success message to user
    return NextResponse.json(
      { success: MESSAGES.ENROLLMENT_SUCCESS },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FREE_COURSE_ACCESS_ERROR]", error);
    // send error message to user
    return NextResponse.json(
      { error: MESSAGES.GENERAL_ERROR },
      { status: 400 }
    );
  }
}

async function getCourseWithDetails(courseId: string) {
  return await db.course.findUnique({
    where: { id: courseId, isPublished: true },
    include: {
      lessons: {
        orderBy: { position: "asc" },
      },
      enrolledStudents: true,
    },
  });
}

async function checkExistingAccess(
  courseSlug: string,
  userId: string
): Promise<boolean> {
  const courseAccess = await checkCourseAccess(courseSlug, userId);
  return courseAccess.access;
}

async function ensureTrialSubscription(
  user: UserWithProfile,
  courseId: string
): Promise<void> {
  if (!user.studentProfile.subscription) {
    await handleTrialPurchase({}, user.studentProfile);
    const mailer = new PurchaseEmailService();
    await mailer.handlePurchaseEmails(
      {
        email: user.email,
        purchaseType: PURCHASE_TYPE_SINGLE_COURSE,
        subscriptionPlanId: null,
        courseId,
        eventId: null,
      },
      null,
      null,
      user,
      user.isNewUser,
      user.temporaryPassword,
      user.username
    );
  }
}

async function getTeacherWithRank(teacherProfileId: string) {
  return await db.teacherProfile.findUnique({
    where: { id: teacherProfileId },
    include: { teacherRank: true },
  });
}

async function processFreeEnrollment(
  user: UserWithProfile,
  course: any,
  teacher: any
): Promise<void> {
  const studentProfileId = await useStudentProfile(user.id);

  if (!studentProfileId) {
    throw new Error(MESSAGES.STUDENT_PROFILE_ERROR);
  }

  // Get teacher ranks for enrollment process
  const ranks = await db.teacherRank.findMany({
    orderBy: { numberOfSales: "asc" },
  });

  // Create purchase record with revenue tracking
  const newPurchase = await db.purchase.create({
    data: {
      studentProfileId,
      teacherProfileId: course.teacherProfileId,
      courseId: course.id,
      purchaseType: PURCHASE_TYPE_SINGLE_COURSE,
      TeacherRevenue: {
        create: {
          teacherProfileId: course.teacherProfileId,
          amount: TEACHER_REVENUE_FREE_COURSE,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          teacherRankId: teacher.teacherRank?.id || "",
        },
      },
    },
  });

  // Process enrollment and update teacher data
  await Promise.all([
    enrollStudentToTheCourse(
      course,
      studentProfileId,
      course.teacherProfileId,
      ranks
    ),
    updateTeacherMonthlyEarnings(
      course.teacherProfileId,
      TEACHER_REVENUE_FREE_COURSE
    ),
    updateTeacherBalance(course.teacherProfileId),
  ]);
}
