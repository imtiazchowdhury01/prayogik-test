import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust the import according to your project structure
import { getServerUserSession } from "@/lib/getServerUserSession";

export async function GET(
  req: Request,
  { params }: { params: { earningId: string } }
) {
  try {
    // Extract earningId from the URL parameters
    const { earningId } = params;

    if (!earningId) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    // Check if the requested user is an admin
    const { isAdmin } = await getServerUserSession();
    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized access!" },
        { status: 400 }
      );
    }

    // Fetch the earning details
    const earning = await db.teacherMonthlyEarnings.findUnique({
      where: {
        id: earningId,
      },
      include: {
        teacherProfile: true, // Include the teacherProfile relation
      },
    });

    if (!earning) {
      return NextResponse.json(
        { message: "Earning not found" },
        { status: 404 }
      );
    }

    // Extract the necessary details from the earning
    const { teacherProfileId, month, year } = earning;

    // Fetch the revenues for the specific month, year, and teacherProfileId
    const revenues = await db.teacherRevenue.findMany({
      where: {
        teacherProfileId: teacherProfileId,
        month: month,
        year: year,
        purchase: {
          course: {
            isNot: null,
          },
        },
      },
      include: {
        purchase: {
          include: {
            course: true, // Include the course relation
          },
        },
        teacherRank: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response data
    const formattedRevenues = revenues.map((revenue) => ({
      revenueDate: revenue.createdAt,
      month: revenue.month,
      year: revenue.year,
      amount: revenue.amount,
      revenueTeacherRank: revenue.teacherRank?.name || "N/A",
      revenuePercentage: revenue.teacherRank?.feePercentage || 0,
      course: revenue?.purchase?.course?.title || "N/A", // Get the course name or default to "N/A"
    }));

    return NextResponse.json(formattedRevenues, { status: 200 });
  } catch (error) {
    console.error("Error fetching revenues", error);
    return NextResponse.json(
      { message: "Failed to fetch monthly revenues" },
      { status: 500 }
    );
  }
}
