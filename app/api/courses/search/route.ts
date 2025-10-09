// api/courses/search/route.ts
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|\\[\]]/g, "\\$&");
}

// Helper function to create search terms for better matching
function createSearchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 1)
    .map((term) => term.trim());
}

interface SearchFilters {
  isPublished?: boolean;
  isUnderSubscription?: boolean;
  courseMode?: string;
  categoryId?: string;
  teacherProfileId?: string;
}

async function performFuzzySearch(
  query: string,
  filters: SearchFilters = {},
  page: number = 1,
  limit: number = 10,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) {
  const searchTerms = createSearchTerms(query);
  const escapedQuery = escapeRegex(query);
  const escapedSearchTerms = searchTerms.map((term) => escapeRegex(term));
  const skip = (page - 1) * limit;

  // MongoDB aggregation pipeline for advanced search
  const pipeline: any[] = [
    {
      $match: {
        $and: [
          {
            $or: [
              // Exact phrase matches (highest priority)
              { title: { $regex: escapedQuery, $options: "i" } },
              { description: { $regex: escapedQuery, $options: "i" } },
              {
                learningOutcomes: {
                  $elemMatch: { $regex: escapedQuery, $options: "i" },
                },
              },
              {
                requirements: {
                  $elemMatch: { $regex: escapedQuery, $options: "i" },
                },
              },
              // Individual term matches (lower priority)
              ...(escapedSearchTerms.length > 1
                ? escapedSearchTerms.map((term) => ({
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
                  $regexMatch: {
                    input: "$title",
                    regex: escapedQuery,
                    options: "i",
                  },
                },
                100,
                0,
              ],
            },
            // Exact phrase matches in description
            {
              $cond: [
                {
                  $regexMatch: {
                    input: "$description",
                    regex: escapedQuery,
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
                          regex: escapedQuery,
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
                          regex: escapedQuery,
                          options: "i",
                        },
                      },
                    },
                  },
                },
                20,
              ],
            },
            // Bonus for multiple term matches
            ...(escapedSearchTerms.length > 1
              ? [
                  {
                    $multiply: [
                      {
                        $size: {
                          $filter: {
                            input: escapedSearchTerms,
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
                      {
                        $multiply: [
                          10,
                          { $divide: [1, escapedSearchTerms.length] },
                        ],
                      },
                    ],
                  },
                ]
              : []),
            // Individual term matches
            ...(escapedSearchTerms.length > 1
              ? escapedSearchTerms.map((term) => ({
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
                        2,
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
    // Transform the data
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
    // Sort
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

  // Get total count
  const countPipeline = [
    {
      $match: {
        $and: [
          {
            $or: [
              { title: { $regex: escapedQuery, $options: "i" } },
              { description: { $regex: escapedQuery, $options: "i" } },
              {
                learningOutcomes: {
                  $elemMatch: { $regex: escapedQuery, $options: "i" },
                },
              },
              {
                requirements: {
                  $elemMatch: { $regex: escapedQuery, $options: "i" },
                },
              },
              ...(escapedSearchTerms.length > 1
                ? escapedSearchTerms.map((term) => ({
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
    courses: (courses as any).cursor?.firstBatch || [],
    totalCount: (countResult as any).cursor?.firstBatch?.[0]?.total || 0,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isPublished = searchParams.get("published");
    const isUnderSubscription = searchParams.get("isUnderSubscription");
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
          ...(isUnderSubscription !== null && {
            isUnderSubscription: isUnderSubscription === "true",
          }),
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

    // Simple Prisma search
    const searchFilter: Prisma.CourseWhereInput = {
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

    // Add publication filter
    if (isPublished !== null) {
      searchFilter.isPublished = isPublished === "true";
    }

    // Add subscription filter
    if (isUnderSubscription !== null) {
      searchFilter.isUnderSubscription = isUnderSubscription === "true";
    }

    // Search in array fields
    const searchTerms = createSearchTerms(query);
    const arraySearchConditions: Prisma.CourseWhereInput[] = [];

    arraySearchConditions.push(
      {
        learningOutcomes: {
          hasSome: [query.trim()],
        },
      },
      {
        requirements: {
          hasSome: [query.trim()],
        },
      }
    );

    if (searchTerms.length > 0) {
      searchTerms.forEach((term) => {
        arraySearchConditions.push(
          {
            learningOutcomes: {
              hasSome: [term],
            },
          },
          {
            requirements: {
              hasSome: [term],
            },
          }
        );
      });
    }

    if (arraySearchConditions.length > 0) {
      searchFilter.OR = [...(searchFilter.OR || []), ...arraySearchConditions];
    }

    // Execute search
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
    console.error("[SEARCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
