import { any, z } from "zod";
import {
  CategorySchema,
  CreateSubscriptionDiscountBody,
  CreateSubscriptionPlanBody,
  GetAdminUsersResponse,
  GetSubscriptionPlansResponse,
  GetTeachersResponse,
  ProgressSchema,
  SubscriptionDiscountSchema,
  SubscriptionPlanSchema,
  TeacherApplicationBody,
  TeacherApplicationResponse,
  UpdateSubscriptionDiscountBody,
  UserProfileSchema,
  UpdateTeacherRankRequest,
  UserSchema,
  CheckUsernameResponse,
  CheckUsernameRequest,
  AddUserResponse,
  AddUserRequest,
  GetTeacherMonthlyEarningsRequest,
  TeacherUpdateSchema,
  TeacherRankSchema,
  GetTeacherMonthlyEarningsResponse,
  RecordTeacherPaymentRequestSchema,
  RecordTeacherPaymentResponse,
  CourseSchema,
  CourseUpdateSchema,
  LessonSchema,
  FullUserSchema,
  CourseWithProgressSchema,
  ResetPasswordRequestSchema,
  ResetPasswordResponseSchema,
  TeacherWithProfileSchema,
  BkashManualPaymentBodySchema,
  TeacherUserSchema,
  teacherOverviewQuerySchema,
  teacherPaymentHistoryQuerySchema,
  teacherOverviewResponseSchema,
  teacherPaymentHistoryResponseSchema,
  teacherEarningRequestSchema,
  teacherEarningResponseSchema,
  freeCourseAccessSchema,
  SubscribersSchema,
  courseRoadmapSchema,
} from "./types";
import { initContract } from "@ts-rest/core";
import { cookies } from "next/headers";
import { BkashManualPaymentType } from "@prisma/client";

const c = initContract();

export const ApiContractV1 = c.router({
  // Auth
  signup: {
    method: "POST",
    path: "/api/auth/signup",
    body: z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      username: z.string(),
    }),
    responses: {
      200: z.string(),
      400: z.string(),
      500: z.string(),
    },
    summary: "Signup",
  },
  checkUsername: {
    method: "POST",
    path: "/api/auth/check-username",
    body: CheckUsernameRequest,
    responses: {
      200: CheckUsernameResponse,
      400: CheckUsernameResponse,
      500: CheckUsernameResponse,
    },
    summary: "Check if a ইউজারনেমটি ব্যবহারযোগ্য।",
  },
  addUser: {
    method: "POST",
    path: "/api/auth/adduser",
    body: AddUserRequest,
    responses: {
      201: AddUserResponse,
      400: AddUserResponse,
      500: AddUserResponse,
    },
    summary: "Add new user, optionally send credentials by email.",
  },
  // Admin get course roadmaps
  getCourseRoadmaps: {
    method: "GET",
    path: "/api/admin/manage/course-roadmap",
    responses: {
      200: z.object({
        msg: z.string(),
        data: z.array(
          z.object({
            title: z.string().min(1),
            description: z.string().min(1),
            status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]),
            category: z.string().min(1),
            estimatedDuration: z.string().min(1),
            targetDate: z.date().optional(),
            difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
            prerequisites: z.string().optional(),
            courseLink: z.string().optional(),
          })
        ),
      }),
      400: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Fetch all course roadmaps (Admin only)",
  },
  // Admin create course roadmap
  createCourseRoadmap: {
    method: "POST",
    path: "/api/admin/manage/course-roadmap",
    body: courseRoadmapSchema,
    responses: {
      201: z.object({
        msg: z.string(),
        data: z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]),
          category: z.string(),
          estimatedDuration: z.string(),
          targetDate: z.date().optional(),
          difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
          prerequisites: z.string().optional(),
          courseLink: z.string().optional(),
        }),
      }),
      400: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Create a new course roadmap (Admin only)",
  },
  // Admin update course roadmap
  updateCourseRoadmap: {
    method: "PUT",
    path: "/api/admin/manage/course-roadmap/:id",
    body: courseRoadmapSchema,
    responses: {
      200: z.object({
        msg: z.string(),
        data: z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]),
          category: z.string(),
          estimatedDuration: z.string(),
          targetDate: z.date().optional(),
          difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
          prerequisites: z.string().optional(),
          courseLink: z.string().optional(),
        }),
      }),
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Update a course roadmap (Admin only)",
  },
  // Admin delete course roadmap
  deleteCourseRoadmap: {
    method: "DELETE",
    path: "/api/admin/manage/course-roadmap/:id",
    responses: {
      200: z.object({ msg: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Delete a course roadmap (Admin only)",
  },
  // Categories
  getCategories: {
    method: "GET",
    path: "/api/courses/categories",
    responses: {
      200: z.object({
        msg: z.string(),
        data: z.array(CategorySchema), // Define what your categories look like
      }),
    },
    summary: "Fetch all categories.",
  },

  createCategory: {
    method: "POST",
    contentType: "application/json",
    path: "/api/courses/categories",
    body: z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
    }),
    responses: {
      201: z.object({
        msg: z.string(),
        data: CategorySchema,
      }),
      400: z.object({
        msg: z.string(),
      }),
    },
    summary: "Create a new category (Admin only)",
    metadata: {
      tags: ["Categories"],
    },
  },
  updateCategory: {
    method: "PUT",
    contentType: "application/json",
    path: "/api/courses/categories",
    body: z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
    }),
    responses: {
      200: z.object({
        msg: z.string(),
        data: CategorySchema,
      }),
      400: z.object({
        msg: z.string(),
      }),
      404: z.object({
        msg: z.string(),
      }),
    },
    summary: "Update a category by ID (Admin only)",
  },
  deleteCategory: {
    method: "DELETE",
    path: "/api/courses/categories",
    body: z.object({
      id: z.string().min(1),
    }),
    responses: {
      200: z.object({
        msg: z.string(),
      }),
      404: z.object({
        msg: z.string(),
      }),
    },
    summary: "Delete a category by ID (Admin only)",
  },
  // /api/courses
  getCoursesQuery: {
    method: "GET",
    path: "/api/courses",
    query: z.object({
      page: z.number().min(1).max(50).optional().default(1),
      limit: z.number().min(1).max(50).optional().default(10),
      title: z.string().optional(),
      category: z.string().optional(),
      teacher: z.string().optional(),
      sort: z.enum(["asc", "desc"]).optional().default("desc"),
    }),

    responses: {
      200: z.object({
        courses: z.array(CourseSchema),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          totalCourses: z.number(),
          totalPages: z.number(),
          hasNextPage: z.boolean(),
          hasPrevPage: z.boolean(),
        }),
      }),
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Fetch courses with filtering, pagination and search",
  },
  // /api/courses
  postCourses: {
    method: "POST",
    path: "/api/courses",
    body: z.object({
      title: z.string(),
      slug: z.string(),
    }),
    responses: {
      200: z.object({}),
      400: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Create a new course",
  },
  // /api/teacher/courses
  getTeacherCoursesQuery: {
    method: "GET",
    path: "/api/teacher/courses",
    query: z.object({
      page: z.number().min(1).max(50).optional().default(1),
      limit: z.number().min(1).max(50).optional().default(10),
      title: z.string().optional(),
      category: z.string().optional(),
      sort: z.enum(["asc", "desc"]).optional().default("desc"),
    }),

    responses: {
      200: z.object({
        courses: z.array(CourseSchema),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          totalCourses: z.number(),
          totalPages: z.number(),
          hasNextPage: z.boolean(),
          hasPrevPage: z.boolean(),
        }),
      }),
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Fetch courses with filtering, pagination and search",
  },

  //  /api/teacher/courses/:courseId
  getTeacherCourseByIdQuery: {
    method: "GET",
    path: "/api/teacher/courses/:courseId",
    pathParams: z.object({
      courseId: z.string(),
    }),
    responses: {
      200: CourseSchema,
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Fetch course by course id",
  },

  //  /api/teacher/courses/lesson/:lessonId
  getTeacherCourseLesson: {
    method: "GET",
    path: "/api/teacher/courses/:courseId/lessons/:lessonId",
    pathParams: z.object({
      lessonId: z.string(),
      courseId: z.string(),
    }),
    responses: {
      200: CourseSchema,
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Fetch course by course id",
  },

  // / api/teacher
  getTeacherProfiles: {
    method: "GET",
    path: "/api/teacher",

    responses: {
      200: z.array(TeacherUserSchema),
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Fetch teachers",
  },

  // /api/teacher/analytics
  getTeacherAnalytics: {
    method: "GET",
    path: "/api/teacher/analytics",
    responses: {
      200: z.object({
        totalRevenue: z.number(),
        totalSalesCount: z.number(),
        courseSales: z.array(
          z.object({
            name: z.string(),
            total: z.number(),
          })
        ),
      }),
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Fetch teacher analytics",
  },

  // /api/teacher/account/overview
  getAccountOverview: {
    method: "GET",
    path: "/api/teacher/account/overview",
    query: teacherOverviewQuerySchema,
    responses: {
      200: teacherOverviewResponseSchema,
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Fetch teacher account overview",
  },

  // /api/teacher/payment/paymentHistory
  getPaymentHistory: {
    method: "GET",
    path: "/api/teacher/payment/paymentHistory",
    query: teacherPaymentHistoryQuerySchema,
    responses: {
      200: teacherPaymentHistoryResponseSchema,
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Fetch teacher payment history",
  },

  // /api/teacher/earnings
  getEarningHistory: {
    method: "POST",
    path: "/api/teacher/earnings",
    body: teacherEarningRequestSchema,
    responses: {
      200: teacherEarningResponseSchema,
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Fetch teacher earning history",
  },

  getCoursesByAdminQuery: {
    method: "GET",
    path: "/api/admin/courses",
    query: z.object({
      page: z.number().min(1).max(50).optional().default(1),
      limit: z.number().min(1).max(50).optional().default(10),
      title: z.string().optional(),
      category: z.string().optional(),
      sort: z.enum(["asc", "desc"]).optional().default("desc"),
    }),

    responses: {
      200: z.object({
        courses: z.array(CourseSchema),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          totalCourses: z.number(),
          totalPages: z.number(),
          hasNextPage: z.boolean(),
          hasPrevPage: z.boolean(),
        }),
      }),
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Fetch courses with filtering, pagination and search",
  },
  // Users
  getAdminUsers: {
    method: "GET",
    path: "/api/admin/users",
    responses: {
      200: GetAdminUsersResponse,
      401: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Fetch all users (Admin only)",
  },
  getUserById: {
    method: "GET",
    path: "/api/admin/users/:userId",
    pathParams: z.object({
      userId: z.string(),
    }),
    responses: {
      200: FullUserSchema,
      404: z.object({ error: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: "Get single user details by userId (Admin only)",
  },
  updateUserById: {
    method: "PUT",
    path: "/api/admin/users/:userId",
    pathParams: z.object({
      userId: z.string(),
    }),
    body: FullUserSchema,
    responses: {
      200: z.object({ message: z.string() }),
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: "Update user by userId (Admin only)",
  },
  getUserProfile: {
    method: "GET",
    path: "/api/user/profile/:userId",
    pathParams: z.object({
      userId: z.string(),
    }),
    responses: {
      200: UserProfileSchema,
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
    },
    summary: "Fetch user profile by ID",
  },
  updateUserProfile: {
    method: "PUT",
    contentType: "application/json",
    path: "/api/user/profile/:userId",
    body: z.record(z.any()), // you can optionally refine this
    responses: {
      200: z.object({ message: z.string() }),
      400: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: "Update user profile by ID",
    metadata: {
      tags: ["User Profile"],
    },
  },

  // get user progress
  getUserProgress: {
    method: "GET",
    path: "/api/user/userprogress",
    query: z.object({
      userId: z.string(),
      courseId: z.string(),
    }),
    responses: {
      200: z.object({
        msg: z.string(),
        data: z.array(ProgressSchema),
      }),
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Fetch user's progress in a course",
  },

  // get user's subscriptions
  getUserSubscriptions: {
    method: "GET",
    path: "/api/user/subscription",
    responses: {
      200: SubscriptionPlanSchema,
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Fetch user's subscription.",
  },

  // get user profile
  switchUserRole: {
    method: "POST",
    path: "/api/auth/role",
    contentType: "application/json",
    body: z.object({
      role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
    }),
    responses: {
      200: z.object({
        msg: z.string(),
        data: z.object({
          role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
        }),
      }),
      400: z.object({ error: z.string() }),
      401: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Switch user role",
  },

  // Teachers
  getTeachers: {
    method: "GET",
    path: "/api/admin/teachers",
    responses: {
      200: GetTeachersResponse,
      401: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Fetch all teacher users (Admin only)",
    metadata: {
      tags: ["Admin", "Teachers"],
    },
  },
  // Update teacher by teacherId
  updateTeacherByAdmin: {
    method: "PUT",
    path: "/api/admin/teachers/{teacherId}",
    pathParams: z.object({
      teacherId: z.string(),
    }),
    body: TeacherUpdateSchema,
    responses: {
      200: z.object({ message: z.string() }),
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: "Update teacher by teacherId (Admin only)",
  },
  // Get teacher by teacherId
  getTeacherByAdmin: {
    method: "GET",
    path: "/api/admin/teachers/{teacherId}",
    pathParams: z.object({
      teacherId: z.string(),
    }),
    responses: {
      200: TeacherUpdateSchema,
      404: z.object({ error: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: "Get teacher by teacherId (Admin only)",
  },

  // Apply as a teacher
  applyAsTeacher: {
    method: "POST",
    path: "/api/teacher/apply-for-teacher",
    contentType: "application/json",
    body: TeacherApplicationBody,
    responses: {
      201: TeacherApplicationResponse,
      400: TeacherApplicationResponse,
      401: TeacherApplicationResponse,
      500: TeacherApplicationResponse,
    },
    summary: "Apply as a teacher",
    metadata: {
      tags: ["Teacher"],
    },
  },

  // Teacher ranks
  getTeacherRanks: {
    method: "GET",
    path: "/api/teacher/ranks",
    responses: {
      200: z.object({
        msg: z.string(),
        data: z.array(TeacherRankSchema),
      }),
    },
    summary: "Fetch all teacher ranks",
  },

  // Rank create by admin
  createRankByAdmin: {
    method: "POST",
    path: "/api/admin/teachers/ranks",
    body: z.object({
      name: z.string(),
      description: z.string(),
      feePercentage: z.number().min(0).max(100),
      numberOfSales: z.number().min(0),
    }),
    responses: {
      201: TeacherRankSchema,
      400: z.object({ message: z.string() }),
      500: z.object({ message: z.string(), error: z.any() }),
    },
    summary: "Create a new teacher rank (Admin only)",
  },

  // Rank update by admin
  updateRankByAdmin: {
    method: "PUT",
    path: "/api/admin/teachers/ranks/:id",
    body: z.object({
      name: z.string(),
      description: z.string(),
      feePercentage: z.number().min(0).max(100),
      numberOfSales: z.number().min(0),
    }),
    responses: {
      200: TeacherRankSchema,
      400: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
      500: z.object({ message: z.string(), error: z.any() }),
    },
    summary: "Update a teacher rank by ID (Admin only)",
  },

  // Rank delete by admin
  deleteRankByAdmin: {
    method: "DELETE",
    path: "/api/admin/teachers/ranks/:id",
    responses: {
      200: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
      500: z.object({ message: z.string(), error: z.any() }),
    },
    summary: "Delete a teacher rank by ID (Admin only)",
  },
  // Fetch teacher monthly earnings & payments summary
  getTeacherMonthlyEarnings: {
    method: "POST",
    path: "/api/admin/teachers/earnings",
    body: GetTeacherMonthlyEarningsRequest,
    responses: {
      200: GetTeacherMonthlyEarningsResponse, // array of monthly earnings summary objects
      400: z.object({ message: z.string() }),
      500: z.object({ message: z.string(), error: z.any() }),
    },
    summary: "Get teacher's monthly earnings. (Admin only)",
  },

  // /api/teacher/earnings/[earningId]/revenues
  getTeacherEarningRevenues: {
    method: "GET",
    path: "/api/teacher/earnings/:earningId/revenues",
    pathParams: z.object({
      earningId: z.string(),
    }),
    responses: {
      200: z.object({
        earningId: z.string(),
        revenues: z.array(
          z.object({
            month: z.string(),
            revenue: z.number(),
            totalRevenue: z.number(),
          })
        ),
      }), // array of monthly earnings summary objects
      400: z.object({ message: z.string() }),
      500: z.object({ message: z.string(), error: z.any() }),
    },
    summary: "Get teacher's earning revenues. (Admin only)",
  },

  // `/api/teacher/earnings/:earningId`
  getTeacherEarningById: {
    method: "GET",
    path: "/api/teacher/earnings/:earningId",
    pathParams: z.object({
      earningId: z.string(),
    }),
    responses: {
      200: z.object({
        id: z.string(),
        teacherProfileId: z.string(),
        month: z.number(),
        year: z.number(),
        total_earned: z.number(),
        createdAt: z.string(),
      }),
      404: z.object({ message: z.string() }),
      500: z.object({ message: z.string(), error: z.any() }),
    },
    summary: "Get teacher's earning by ID.",
  },

  // Pay teacher earnings
  payTeacherEarnings: {
    method: "POST",
    path: "/api/admin/teachers/earnings/pay",
    body: RecordTeacherPaymentRequestSchema,
    responses: {
      201: RecordTeacherPaymentResponse, // array of monthly earnings summary objects
      400: z.object({ message: z.string() }),
      500: z.object({ message: z.string(), error: z.any() }),
    },
    summary: "Pay teacher earnings (Admin only)",
  },

  // Subscription plans
  createSubscriptionPlan: {
    method: "POST",
    path: "/api/subscriptions",
    contentType: "application/json",
    body: CreateSubscriptionPlanBody,
    responses: {
      201: SubscriptionPlanSchema,
      403: z.object({ message: z.string() }),
      500: z.object({ message: z.string(), error: z.any() }),
    },
    summary: "Create a new subscription plan (Admin only)",
  },

  getAllSubscriptionPlans: {
    method: "GET",
    path: "/api/subscriptions",
    responses: {
      200: GetSubscriptionPlansResponse,
      500: z.object({ message: z.string(), error: z.any() }),
    },
    summary: "Fetch all subscription plans with their discounts",
  },
  // GET all discounts
  getSubscriptionDiscounts: {
    method: "GET",
    path: "/api/subscriptions/discounts",
    responses: {
      200: z.array(SubscriptionDiscountSchema),
      500: z.object({ message: z.string() }),
    },
    summary: "Fetch all subscription discounts",
  },

  // POST create new discount
  createSubscriptionDiscount: {
    method: "POST",
    path: "/api/subscriptions/discounts",
    contentType: "application/json",
    body: CreateSubscriptionDiscountBody,
    responses: {
      201: SubscriptionDiscountSchema,
      400: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: "Create a new subscription discount (Admin only)",
  },

  // PUT update discount
  updateSubscriptionDiscount: {
    method: "PUT",
    path: "/api/subscriptions/discounts",
    contentType: "application/json",
    body: UpdateSubscriptionDiscountBody,
    responses: {
      200: SubscriptionDiscountSchema,
      400: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: "Update a subscription discount (Admin only)",
  },

  // DELETE delete discount
  deleteSubscriptionDiscount: {
    method: "DELETE",
    path: "/api/subscriptions/discounts/:id",
    responses: {
      200: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: "Delete a subscription discount by ID (Admin only)",
  },

  // /api/front/lessons/lesson
  getLesson: {
    method: "POST",
    path: "/api/front/lessons/lesson",
    contentType: "application/json",
    body: z.object({
      courseSlug: z.string(),
      lessonSlug: z.string(),
      userId: z.string(),
    }),
    responses: {
      200: z.object({
        msg: z.string(),
        data: z.array(LessonSchema),
      }),
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Fetch lesson by course slug and lesson slug",
  },
  // /api/courses/{courseId}/lessons/reorder
  reorderLessons: {
    method: "PUT",
    path: "/api/courses/:courseId/lessons/reorder",
    pathParams: z.object({
      courseId: z.string(),
    }),
    body: z.object({
      list: z.array(
        z.object({
          id: z.string(),
          position: z.number(),
        })
      ),
    }),
    responses: {
      200: z.object({ msg: z.string() }),
      400: z.object({ error: z.string() }),
      401: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Reorder lessons",
  },
  // /api/courses/freecourse
  postFreeCourse: {
    method: "POST",
    path: "/api/courses/freecourse",
    contentType: "application/json",
    body: z.object({
      userId: z.string(),
    }),
    query: z.object({
      courseId: z.string(),
    }),
    responses: {
      200: z.object({
        msg: z.string(),
        data: z.object({
          success: z.boolean(),
          message: z.string(),
        }),
      }),
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Purchase a free course",
  },

  // /api/courses/{courseId}/publish
  publishCourse: {
    method: "PATCH",
    path: "/api/courses/:courseId/publish",
    body: z.object({}),
    pathParams: z.object({
      courseId: z.string(),
    }),
    responses: {
      200: CourseSchema,
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Publish a course",
  },

  // /api/courses/{courseId}/unpublish
  unpublishCourse: {
    method: "PATCH",
    path: "/api/courses/:courseId/unpublish",
    body: z.object({}),
    pathParams: z.object({
      courseId: z.string(),
    }),
    responses: {
      200: CourseSchema,
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Unpublish a course",
  },

  // /api/courses/{courseId}/publish
  publishCourseLesson: {
    method: "PATCH",
    path: "/api/courses/:courseId/lessons/:lessonId/publish",
    body: z.object({}),
    pathParams: z.object({
      courseId: z.string(),
    }),
    responses: {
      200: CourseSchema,
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Publish a course",
  },

  // /api/courses/{courseId}/unpublish
  unpublishCourseLesson: {
    method: "PATCH",
    path: "/api/courses/:courseId/lessons/:lessonId/unpublish",
    body: z.object({}),
    pathParams: z.object({
      courseId: z.string(),
    }),
    responses: {
      200: CourseSchema,
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
    summary: "Unpublish a course",
  },

  // /api/teacher/payment/paymentMethods
  getPaymentMethods: {
    method: "GET",
    path: "/api/teacher/payment/paymentMethods",
    query: z.object({
      teacherId: z.string(), //It is acutally User id
    }),
    responses: {
      200: z.object({
        type: z.string().nullable(),
        id: z.string(),
        createdAt: z.date().nullable(),
        updatedAt: z.date().nullable(),
        teacherProfileId: z.string(),
        bankName: z.string().nullable(),
        accountNumber: z.string().nullable(),
        branch: z.string().nullable(),
        routingNo: z.string().nullable(),
        accName: z.string().nullable(),
        active: z.boolean(),
      }),
      400: z.string(),
      500: z.string(),
    },
    summary: "Fetch all payment methods",
  },
  // /api/teacher/payment/paymentMethods
  createPaymentMethod: {
    method: "POST",
    path: "/api/teacher/payment/paymentMethods",
    body: z.object({
      teacherId: z.string(),
      accountNumber: z.string(),
      type: z.string(),
      bankName: z.string(),
      branch: z.string(),
      routingNo: z.string(),
      accName: z.string(),
      active: z.boolean(),
    }),
    responses: {
      201: z.object({
        id: z.string(),

        teacherId: z.string(),
        accountNumber: z.string(),
        type: z.string(),
        bankName: z.string(),
        branch: z.string(),
        routingNo: z.string(),
        accName: z.string(),
        active: z.boolean(),
      }),
      400: z.string(),
      500: z.string(),
    },
    summary: "Create a new payment method",
  },
  // /api/teacher/payment/paymentMethods/{id}
  updatePaymentMethod: {
    method: "PATCH",
    path: "/api/teacher/payment/paymentMethods/:id",
    body: z.object({
      active: z.boolean(),
    }),
    responses: {
      200: z.object({
        id: z.string(),
        teacherId: z.string(),
        accountNumber: z.string(),
        type: z.string(),
        bankName: z.string(),
        branch: z.string(),
        routingNo: z.string(),
        accName: z.string(),
        active: z.boolean(),
      }),
      400: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
      500: z.object({ message: z.string(), error: z.any() }),
    },
    summary: "Update a payment method",
  },

  // /api/teacher/payment/paymentMethods/{id}
  deletePaymentMethod: {
    method: "DELETE",
    path: "/api/teacher/payment/paymentMethods/:id",
    responses: {
      200: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
      500: z.object({ message: z.string(), error: z.any() }),
    },
    summary: "Delete a payment method",
  },

  // /api/auth/reset-password
  resetPassword: {
    method: "POST",
    path: "/api/auth/reset-password",
    body: z.object({
      email: z.string(),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
      400: z.object({
        message: z.string(),
      }),
      500: z.object({
        message: z.string(),
      }),
    },
    summary: "Reset password",
  },

  // /api/auth/reset-password-submit
  resetPasswordSubmit: {
    method: "POST",
    path: "/api/auth/reset-password-submit",
    body: z.object({
      token: z.string(),
      password: z.string(),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
      400: z.object({
        message: z.string(),
      }),
      500: z.object({
        message: z.string(),
      }),
    },
    summary: "Reset password submit",
  },

  // /api/auth/session
  getSession: {
    method: "GET",
    path: "/api/auth/session",
    responses: {
      200: z.object({
        userId: z.string(),
        username: z.string(),
        email: z.string(),
        role: z.string(),
        isVerified: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Get session",
  },
  // /api/user/courses/dashboard
  getDashboardCourses: {
    method: "GET",
    path: "/api/user/courses/dashboard",
    responses: {
      200: z.object({
        completedCourses: z.array(CourseWithProgressSchema),
        coursesInProgress: z.array(CourseWithProgressSchema),
        subscribedCourses: z.array(CourseWithProgressSchema),
        purchasedCourseIds: z.array(z.string()),
        isSubscriber: z.boolean(),
        subscription: z.any(),
      }),
      401: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Get user's dashboard courses with progress",
  },
  // /api/user/profile/reset-password
  resetProfilePassword: {
    method: "POST",
    path: "/api/user/profile/reset-password",
    summary: "Reset the profile password for the current user",
    body: ResetPasswordRequestSchema,
    responses: {
      200: ResetPasswordResponseSchema,
      400: z.object({ error: z.string() }),
      401: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },
  // /api/teachers/verified
  getVerifiedTeachers: {
    method: "GET",
    path: "/api/teacher/verified",
    responses: {
      200: z.array(TeacherWithProfileSchema),
      401: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
    summary: "Fetch verified teachers with published courses",
  },
  // bkash manual payment
  createBkashPayment: {
    method: "POST",
    path: "/api/bkash-manual-payment",
    body: z.object({
      courseId: z.string().optional(),
      subscriptionId: z.string().optional(),
      payFrom: z.array(z.string()),
      trxId: z.array(z.string()),
      payableAmount: z.number(),
      type: z.enum([
        BkashManualPaymentType.REGULAR,
        BkashManualPaymentType.SUBSCRIPTION,
        BkashManualPaymentType.OFFER,
      ]),
      title: z.string(),
    }),
    responses: {
      201: z.object({
        msg: z.string(),
        data: z.object({
          success: z.boolean(),
          message: z.string(),
        }),
      }),
      500: z.object({
        error: z.boolean(),
        message: z.string(),
      }),
    },
  },

  // get all bkashpayments for admin
  getBkashPaymentsForAdmin: {
    method: "GET",
    path: "/api/bkash-manual-payment",
    responses: {
      200: z.object({
        msg: z.string(),
        data: z.array(BkashManualPaymentBodySchema),
      }),
      400: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },

  // update bkash manual payment by id
  updateBkashPaymentById: {
    method: "PUT",
    path: "/api/bkash-manual-payment/:id",
    body: BkashManualPaymentBodySchema,
    responses: {
      200: z.object({
        msg: z.string(),
        data: BkashManualPaymentBodySchema,
      }),
      400: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },
  // delete bkash manual payment by id
  deleteBkashPaymentById: {
    method: "DELETE",
    path: "/api/bkash-manual-payment/:id",
    responses: {
      200: z.object({
        msg: z.string(),
        deletedId: z.string(), // or z.number() depending on your ID type
      }),
      404: z.object({ error: z.string() }), // For not found
      500: z.object({ error: z.string() }),
    },
  },
  // get all subscribers
  getSubscribers: {
    method: "GET",
    path: "/api/subscribers",
    responses: {
      200: z.object({
        msg: z.string(),
        data: z.array(SubscribersSchema),
      }),
      400: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },

  // get single subscriber
  getSubscriber: {
    method: "GET",
    path: "/api/subscribers/:id",
    responses: {
      200: z.object({
        msg: z.string(),
        data: z.array(SubscribersSchema),
      }),
      400: z.object({ error: z.string() }),
    },
  },

  // update single subscriber
  updateSubscriber: {
    method: "PUT",
    path: "/api/subscribers/:id",
    body: z.object({
      name: z.string().min(1, "Name is required").optional(),
      email: z.string().email("Invalid email address").optional(),
      status: z
        .enum(["ACTIVE", "INACTIVE", "EXPIRED", "CANCELLED", "PENDING"])
        .optional(),
      subscriptionCreatedAt: z.string().optional(),
      subscriptionExpiresAt: z.string().optional(),
    }),

    responses: {
      200: z.object({
        message: z.string(),
        data: SubscribersSchema,
      }),
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },

  // get bkash manual payment by id
  getBkashManualSinglePayment: {
    method: "GET",
    path: "/api/bkash-manual-payment/:paymentId",
    pathParams: z.object({
      paymentId: z.string(),
    }),
    responses: {
      200: BkashManualPaymentBodySchema,
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },
  // Access course for free
  createFreeCourseAccess: {
    method: "POST",
    path: "/api/courses/access/free",
    body: freeCourseAccessSchema,
    responses: {
      200: z.any(),
      400: z.object({ error: z.string() }),
      500: z.object({ message: z.string(), error: z.any() }),
    },
  },
});
