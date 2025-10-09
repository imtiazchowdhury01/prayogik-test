// api/admin/users/route.ts
export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await getServerUserSession(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        avatarUrl: true,
        isAdmin: true,
        gender: true,
        role: true,
        createdAt: true,
        teacherProfile: {
          select: {
            teacherStatus: true,
            createdCourses: {
              select: {
                id: true,
              },
            },
          },
        },
        studentProfile: {
          select: {
            enrolledCourseIds: {
              select: {
                id: true,
              },
            },
            subscription: {
              select: {
                subscriptionPlan: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                status: true,
              },
            },
            purchases: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!users) {
      return NextResponse.json({ error: "Users not found!" }, { status: 404 });
    }
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
