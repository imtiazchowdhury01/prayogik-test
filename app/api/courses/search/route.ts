// @ts-nocheck
export const dynamic = "force-dynamic"
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Helper function to create search terms for better matching
function createSearchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 1)
    .map((term) => term.trim());
}

async function performFuzzySearch(
  query: string,
  filters: any = {},
  page: number = 1,
  limit: number = 10,
  sortBy: string = "updatedAt",
  sortOrder: "asc" | "desc" = "desc"
) {
  const searchTerms = createSearchTerms(query);
  const skip = (page - 1) * limit;

  // MongoDB aggregation pipeline for advanced search
  const pipeline = [
    {
      $match: {
        $and: [
          {
            $or: [
              // Exact phrase matches (highest priority)
              { title: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
              {
                learningOutcomes: {
                  $elemMatch: { $regex: query, $options: "i" },
                },
              },
              {
                requirements: { $elemMatch: { $regex: query, $options: "i" } },
              },
              // Individual term matches (lower priority)
              ...(searchTerms.length > 1
                ? searchTerms.map((term) => ({
                    $or: [
                      { title: { $regex: term, $options: "i" } },
                      { description: { $regex: term, $options: "i" } },
                      {
                        learningOutcomes: {
                          $elemMatch: { $regex: term, $options: "i" },
                        },
                      },
                      {
                        requirements: {
                          $elemMatch: { $regex: term, $options: "i" },
                        },
                      },
                    ],
                  }))
                : []),
            ],
          },
          // Apply additional filters
          ...(filters.isPublished !== undefined
            ? [{ isPublished: filters.isPublished }]
            : []),
          ...(filters.isUnderSubscription !== undefined
            ? [{ isUnderSubscription: filters.isUnderSubscription }]
            : []),
          ...(filters.courseMode ? [{ courseMode: filters.courseMode }] : []),
          ...(filters.categoryId
            ? [{ categoryId: { $oid: filters.categoryId } }]
            : []),
          ...(filters.teacherProfileId
            ? [{ teacherProfileId: { $oid: filters.teacherProfileId } }]
            : []),
        ],
      },
    },
    {
      $addFields: {
        searchScore: {
          $add: [
            // Exact phrase matches in title (highest score)
            {
              $cond: [
                {
                  $regexMatch: { input: "$title", regex: query, options: "i" },
                },
                100, // Much higher score for exact phrase match
                0,
              ],
            },
            // Exact phrase matches in description
            {
              $cond: [
                {
                  $regexMatch: {
                    input: "$description",
                    regex: query,
                    options: "i",
                  },
                },
                50,
                0,
              ],
            },
            // Exact phrase matches in learning outcomes
            {
              $multiply: [
                {
                  $size: {
                    $filter: {
                      input: { $ifNull: ["$learningOutcomes", []] },
                      cond: {
                        $regexMatch: {
                          input: "$$this",
                          regex: query,
                          options: "i",
                        },
                      },
                    },
                  },
                },
                30,
              ],
            },
            // Exact phrase matches in requirements
            {
              $multiply: [
                {
                  $size: {
                    $filter: {
                      input: { $ifNull: ["$requirements", []] },
                      cond: {
                        $regexMatch: {
                          input: "$$this",
                          regex: query,
                          options: "i",
                        },
                      },
                    },
                  },
                },
                20,
              ],
            },
            // Bonus for multiple term matches (if searching for multiple words)
            ...(searchTerms.length > 1
              ? [
                  {
                    $multiply: [
                      // Count how many search terms match in title
                      {
                        $size: {
                          $filter: {
                            input: searchTerms,
                            cond: {
                              $regexMatch: {
                                input: "$title",
                                regex: "$$this",
                                options: "i",
                              },
                            },
                          },
                        },
                      },
                      // Score multiplier - more terms matched = higher score
                      {
                        $multiply: [
                          10,
                          { $divide: [1, searchTerms.length] }, // Normalize by number of terms
                        ],
                      },
                    ],
                  },
                ]
              : []),
            // Individual term matches (much lower scores)
            ...(searchTerms.length > 1
              ? searchTerms.map((term) => ({
                  $add: [
                    {
                      $cond: [
                        {
                          $regexMatch: {
                            input: "$title",
                            regex: term,
                            options: "i",
                          },
                        },
                        2, // Much lower score for individual terms
                        0,
                      ],
                    },
                    {
                      $cond: [
                        {
                          $regexMatch: {
                            input: "$description",
                            regex: term,
                            options: "i",
                          },
                        },
                        1,
                        0,
                      ],
                    },
                    {
                      $multiply: [
                        {
                          $size: {
                            $filter: {
                              input: { $ifNull: ["$learningOutcomes", []] },
                              cond: {
                                $regexMatch: {
                                  input: "$$this",
                                  regex: term,
                                  options: "i",
                                },
                              },
                            },
                          },
                        },
                        0.5,
                      ],
                    },
                    {
                      $multiply: [
                        {
                          $size: {
                            $filter: {
                              input: { $ifNull: ["$requirements", []] },
                              cond: {
                                $regexMatch: {
                                  input: "$$this",
                                  regex: term,
                                  options: "i",
                                },
                              },
                            },
                          },
                        },
                        0.3,
                      ],
                    },
                  ],
                }))
              : []),
          ],
        },
      },
    },
    // Lookup category information
    {
      $lookup: {
        from: "Category",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
        pipeline: [
          {
            $project: {
              id: "$_id",
              name: 1,
              slug: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    // Lookup teacher profile information
    {
      $lookup: {
        from: "TeacherProfile",
        localField: "teacherProfileId",
        foreignField: "_id",
        as: "teacherProfile",
        pipeline: [
          {
            $project: {
              id: "$_id",
              userId: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    // Lookup user information for teacher
    {
      $lookup: {
        from: "User",
        localField: "teacherProfile.userId",
        foreignField: "_id",
        as: "teacherUser",
        pipeline: [
          {
            $project: {
              name: 1,
              avatarUrl: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    // Lookup prices information
    {
      $lookup: {
        from: "Price",
        localField: "_id",
        foreignField: "courseId",
        as: "prices",
        pipeline: [
          {
            $project: {
              regularAmount: 1,
              discountedAmount: 1,
              isFree: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    // Transform the data to match Prisma structure
    {
      $addFields: {
        id: "$_id",
        category: { $arrayElemAt: ["$category", 0] },
        teacherProfile: {
          $cond: [
            { $gt: [{ $size: "$teacherProfile" }, 0] },
            {
              id: { $arrayElemAt: ["$teacherProfile.id", 0] },
              user: { $arrayElemAt: ["$teacherUser", 0] },
            },
            null,
          ],
        },
      },
    },
    // Remove temporary fields
    {
      $project: {
        _id: 0,
        teacherUser: 0,
      },
    },
    // Sort by search score first, then by specified field
    { $sort: { searchScore: -1, [sortBy]: sortOrder === "desc" ? -1 : 1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  // Use Prisma's raw query for MongoDB aggregation
  const courses = await db.$runCommandRaw({
    aggregate: "Course",
    pipeline,
    cursor: {},
  });

  // Get total count for pagination - also fix the match condition
  const countPipeline = [
    {
      $match: {
        $and: [
          {
            $or: [
              { title: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
              {
                learningOutcomes: {
                  $elemMatch: { $regex: query, $options: "i" },
                },
              },
              {
                requirements: { $elemMatch: { $regex: query, $options: "i" } },
              },
              ...(searchTerms.length > 1
                ? searchTerms.map((term) => ({
                    $or: [
                      { title: { $regex: term, $options: "i" } },
                      { description: { $regex: term, $options: "i" } },
                      {
                        learningOutcomes: {
                          $elemMatch: { $regex: term, $options: "i" },
                        },
                      },
                      {
                        requirements: {
                          $elemMatch: { $regex: term, $options: "i" },
                        },
                      },
                    ],
                  }))
                : []),
            ],
          },
          ...(filters.isPublished !== undefined
            ? [{ isPublished: filters.isPublished }]
            : []),
          ...(filters.isUnderSubscription !== undefined
            ? [{ isUnderSubscription: filters.isUnderSubscription }]
            : []),
          ...(filters.courseMode ? [{ courseMode: filters.courseMode }] : []),
          ...(filters.categoryId
            ? [{ categoryId: { $oid: filters.categoryId } }]
            : []),
          ...(filters.teacherProfileId
            ? [{ teacherProfileId: { $oid: filters.teacherProfileId } }]
            : []),
        ],
      },
    },
    { $count: "total" },
  ];

  const countResult = await db.$runCommandRaw({
    aggregate: "Course",
    pipeline: countPipeline,
    cursor: {},
  });

  return {
    courses: courses.cursor?.firstBatch || [],
    totalCount: countResult.cursor?.firstBatch?.[0]?.total || 0,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isPublished = searchParams.get("published");
    const useAdvanced = searchParams.get("advanced") === "true";

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    if (useAdvanced) {
      // Use MongoDB aggregation for advanced search
      const result = await performFuzzySearch(
        query.trim(),
        {
          ...(isPublished !== null && { isPublished: isPublished === "true" }),
        },
        page,
        limit
      );

      const totalPages = Math.ceil(result.totalCount / limit);

      return NextResponse.json({
        success: true,
        data: {
          courses: result.courses,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount: result.totalCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
          searchType: "advanced",
        },
      });
    }

    // Simple Prisma search - FIXED for scalar arrays
    const searchFilter: any = {
      OR: [
        {
          title: {
            contains: query.trim(),
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.trim(),
            mode: "insensitive",
          },
        },
      ],
    };

    // Add publication filter if specified
    if (isPublished !== null) {
      searchFilter.isPublished = isPublished === "true";
    }

    // For scalar array fields, use hasSome to check if array contains any matching elements
    const searchTerms = createSearchTerms(query);

    // Add array search conditions for learningOutcomes and requirements
    const arraySearchConditions: any[] = [];

    // Search for the full query in arrays
    arraySearchConditions.push(
      {
        learningOutcomes: {
          hasSome: [query.trim()], // Check if array contains the full query
        },
      },
      {
        requirements: {
          hasSome: [query.trim()], // Check if array contains the full query
        },
      }
    );

    // Also search for individual terms in arrays
    if (searchTerms.length > 0) {
      searchTerms.forEach((term) => {
        arraySearchConditions.push(
          {
            learningOutcomes: {
              hasSome: [term], // Check if array contains the term
            },
          },
          {
            requirements: {
              hasSome: [term], // Check if array contains the term
            },
          }
        );
      });
    }

    // Add array search conditions to main OR
    if (arraySearchConditions.length > 0) {
      searchFilter.OR.push(...arraySearchConditions);
    }

    // Execute search with pagination
    const [courses, totalCount] = await Promise.all([
      db.course.findMany({
        where: searchFilter,
        skip,
        take: limit,
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          teacherProfile: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  avatarUrl: true,
                },
              },
            },
          },
          prices: {
            select: {
              regularAmount: true,
              discountedAmount: true,
              isFree: true,
            },
          },
        },
      }),
      db.course.count({
        where: searchFilter,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        searchType: "simple",
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}