import { db } from "@/lib/db";

export async function GET(request: any) {
  const { searchParams }: any = new URL(request.url);
  const skip = parseInt(searchParams.get("skip")) || 0;
  const limit = parseInt(searchParams.get("limit")) || 12;

  try {
    // Get total count and teachers data in parallel
    const [totalCount, teachers] = await Promise.all([
      db.user.count({
        where: {
          teacherProfile: {
            teacherStatus: "VERIFIED",
          },
        },
      }),
      db.user.findMany({
        where: {
          teacherProfile: {
            teacherStatus: "VERIFIED",
          },
        },
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          emailVerified: true,
          role: true,
          bio: true,
          dateOfBirth: true,
          gender: true,
          education: true,
          nationality: true,
          phoneNumber: true,
          city: true,
          state: true,
          country: true,
          zipCode: true,
          accountStatus: true,
          facebook: true,
          linkedin: true,
          twitter: true,
          youtube: true,
          website: true,
          others: true,
          teacherProfile: {
            include: {
              createdCourses: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "asc", // Consistent ordering
        },
      }),
    ]);

    // Calculate pagination info
    const hasMore = skip + limit < totalCount;
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    // Prepare response data
    const responseData = {
      data: teachers,
      pagination: {
        skip,
        limit,
        hasMore,
        currentCount: teachers.length,
        totalCount,
        totalPages,
        currentPage,
      },
    };

    return new Response(JSON.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API Error:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch teachers",
        data: [],
        pagination: {
          skip,
          limit,
          hasMore: false,
          currentCount: 0,
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
