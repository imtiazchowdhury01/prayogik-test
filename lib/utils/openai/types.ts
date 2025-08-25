import {
  bkashManualPaymentStatus,
  BkashManualPaymentType,
  CourseRoadmapStatus,
  DifficultyLevel,
  Role,
  TeacherExpertiseLevel,
  UserAccountStatus,
} from "@prisma/client";
import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _count: z.object({
    courses: z.number(),
  }),
});

export const CategoriesResponseSchema = z.object({
  msg: z.string(),
  data: z.array(CategorySchema),
});

export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  gender: z.string().nullable(),
  nationality: z.string().nullable(),
  bio: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  zipCode: z.string().nullable(),
  facebook: z.string().nullable(),
  linkedin: z.string().nullable(),
  twitter: z.string().nullable(),
  youtube: z.string().nullable(),
  website: z.string().nullable(),
  education: z.string().nullable(),
  others: z.string().nullable(),
  teacherProfile: z
    .object({
      id: z.string(),
      userId: z.string(),
      subjectSpecializations: z.array(z.string()).nullable(),
      certifications: z.array(z.string()).nullable(),
      yearsOfExperience: z.number().nullable(),
      expertiseLevel: z.string().nullable(),
      teacherRank: z.any().nullable(),
    })
    .nullable(),
});

export const ProgressSchema = z.object({
  id: z.string(),
  studentProfileId: z.string(),
  lessonId: z.string(),
  completed: z.boolean(),
  lesson: z.any(), // or better: a specific LessonSchema if you have one
});

export const LessonSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  totalDuration: z.number(),
  learningOutcomes: z.array(z.string()),
  requirements: z.array(z.string()),
  whoFor: z.array(z.string()),
  isPublished: z.boolean(),
  isUnderSubscription: z.boolean(),
  teacherProfileId: z.string(),
  ownership: z.enum(["TEACHER", "ADMIN", "ORGANIZATION"]),
  categoryId: z.string(),
  feePercentage: z.number(),
  feeAmount: z.number(),
  membershipPlanIds: z.array(z.string()),
  bundleIds: z.array(z.string()),
});

export const TeacherApplicationBody = z.object({
  bio: z.string().optional(),
  dateOfBirth: z.date().optional(), // ISO string format
  gender: z.string().optional(),
  nationality: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  education: z.array(z.string()).optional(),
  linkedin: z.string().url().optional(),
  facebook: z.string().url().optional(),
  youtube: z.string().url().optional(),
  others: z.string().optional(),
  subjectSpecializations: z.array(z.string()).optional(),
  expertiseLevel: z.enum([
    TeacherExpertiseLevel.ENTRY_LEVEL,
    TeacherExpertiseLevel.EXPERT,
    TeacherExpertiseLevel.MID_LEVEL,
  ]),
  yearsOfExperience: z.string().optional(),
  twitter: z.string().url().optional(),
  certifications: z.array(z.string()).optional(),
  website: z.string().url().optional(),
  phoneNumber: z.string().optional(),
});

export const TeacherApplicationResponse = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const SubscriptionDiscountSchema = z.object({
  id: z.string(),
  name: z.string(),
  discountPercentage: z.number().min(0).max(100),
  isDefault: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Create request bodies
export const CreateSubscriptionDiscountBody = z.object({
  name: z.string().min(1),
  discountPercentage: z.number().min(0).max(100),
});

export const UpdateSubscriptionDiscountBody = z.object({
  id: z.string(),
  name: z.string().min(1),
  discountPercentage: z.number().min(0).max(100),
});

// SubscriptionPlan Schema
export const SubscriptionPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  regularPrice: z.number(),
  subscriptionDiscountId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  subscriptionDiscount: SubscriptionDiscountSchema.nullable(),
});

// SubscriptionPlan
export const CreateSubscriptionPlanBody = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  regularPrice: z.number().min(0),
  subscriptionDiscountId: z.string().nullable().optional(),
});

// SubscriptionPlan
export const GetSubscriptionPlansResponse = z.array(SubscriptionPlanSchema);

// TeacherProfile schema
export const TeacherProfileSchema = z.object({
  id: z.string(),
  teacherStatus: z.string(),
  teacherRank: z.string().nullable(),
});

// User schema with teacher profile
export const TeacherUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.string().nullable(),
  teacherProfile: TeacherProfileSchema.nullable(),
});

export const TeacherRankSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  numberOfSales: z.number(),
  feePercentage: z.number(),
});

export const TeacherUpdateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  bio: z.string(),
  yearsOfExperience: z.string(),
  education: z.array(z.string()),
  subjectSpecializations: z.array(z.string()),
  expertiseLevel: z.enum([
    TeacherExpertiseLevel.ENTRY_LEVEL,
    TeacherExpertiseLevel.EXPERT,
    TeacherExpertiseLevel.MID_LEVEL,
  ]),
  dateOfBirth: z.date(),
  gender: z.string(),
  phoneNumber: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
  teacherRankId: z.string(),
  isAdmin: z.boolean(),
  isSuperAdmin: z.boolean(),
  teacherStatus: z.string(),
});

export const GetTeacherMonthlyEarningsRequest = z.object({
  teacherProfileId: z.string(),
});

export const MonthlyEarningsSummary = z.object({
  id: z.string(),
  month: z.number(),
  year: z.number(),
  earned: z.number(),
  paid: z.number(),
  remaining: z.number(),
  status: z.string(),
});

export const GetTeacherMonthlyEarningsResponse = z.array(
  MonthlyEarningsSummary
);

const SubscriptionSchema = z.object({
  id: z.string(),
  subscriptionPlan: SubscriptionPlanSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

// StudentProfile schema
const StudentProfileSchema = z.object({
  enrolledCourseIds: z.array(z.string()),
  subscription: SubscriptionSchema.nullable(),
  purchases: z.array(z.any()), // or define a Purchase schema if needed
});

// User schema for admin fetch
const AdminUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.string().nullable(),
  isAdmin: z.boolean(),
  gender: z.string().nullable(),
  role: z.string(),
  teacherProfile: TeacherProfileSchema.nullable(),
  studentProfile: StudentProfileSchema.nullable(),
});

// User schema
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  role: z.string(),
  teacherProfile: TeacherProfileSchema.nullable(),
  studentProfile: StudentProfileSchema.nullable(),
});

// Request for PUT (update teacher rank)
export const UpdateTeacherRankRequest = z.object({
  teacherRankId: z.string(),
  teacherRank: z.string().optional(),
});

// Response: array of users
export const GetAdminUsersResponse = z.array(AdminUserSchema);

// GET teachers response — array of users
export const GetTeachersResponse = z.array(TeacherUserSchema);

// Request schema for checking username availability
export const CheckUsernameRequest = z.object({
  username: z.string(),
});

// Response schema
export const CheckUsernameResponse = z.object({
  isAvailable: z.boolean(),
  message: z.string(),
});

export const AddUserRequest = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  username: z.string().optional(), // in your code it's generated sometimes, but accepting from request too
  sendCredentials: z.boolean().optional().default(false),
});

export const AddUserResponse = z.union([
  z.string(), // "Successfully created user and send to the user's email!"
  z.object({ error: z.string() }), // for error messages
]);

// Request body schema
export const RecordTeacherPaymentRequestSchema = z.object({
  earningId: z.string().uuid(),
  amount_paid: z.number().positive(),
  payment_status: z.enum(["PAID", "DUE", "PARTIAL"]),
});

// TypeScript type from schema
export type RecordTeacherPaymentRequest = z.infer<
  typeof RecordTeacherPaymentRequestSchema
>;

// Payment response type
export const TeacherPaymentSchema = z.object({
  id: z.string().uuid(),
  teacherProfileId: z.string().uuid(),
  amount_paid: z.number().positive(),
  month_paid_for: z.number().min(1).max(12),
  year_paid_for: z.number().int().min(2000).max(3000), // you can adjust year range
  payment_status: z.enum(["PAID", "DUE", "PARTIAL"]),
  payment_date: z.string().datetime(), // or z.string().refine(...) if custom format
});

// Response for successful creation
export const RecordTeacherPaymentResponse = z.object({
  message: z.string(),
  data: TeacherPaymentSchema,
});

// Error response (reuse)
export type ErrorResponse = {
  error: string;
};

export const CourseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  imageUrl: z.string().url(),
  totalDuration: z.number().nullable(),
  learningOutcomes: z.array(z.string()),
  requirements: z.array(z.string()),
  whoFor: z.array(z.string()),
  isPublished: z.boolean(),
  isUnderSubscription: z.boolean(),
  teacherProfileId: z.string().uuid(),
  ownership: z.enum(["TEACHER", "ADMIN", "ORGANIZATION"]),
  categoryId: z.string().uuid().nullable(),
  feePercentage: z.number().nullable(),
  feeAmount: z.number().nullable(),
  membershipPlanIds: z.array(z.string().uuid()),
  bundleIds: z.array(z.string().uuid()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CourseUpdateSchema = z.object({
  description: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  totalDuration: z.number().nullable(),
  learningOutcomes: z.array(z.string()),
  requirements: z.array(z.string()),
  whoFor: z.array(z.string()),
  isPublished: z.boolean(),
  isUnderSubscription: z.boolean(),
  teacherProfileId: z.string().uuid(),
  categoryId: z.string().uuid().nullable(),
  feePercentage: z.number().nullable(),
  feeAmount: z.number().nullable(),
});

// Define nested schemas first
const teacherProfileSchema = z.object({
  yearsOfExperience: z.union([z.string(), z.number()]).optional(),
  subjectSpecializations: z.array(z.string()).optional(),
  expertiseLevel: z.nativeEnum(TeacherExpertiseLevel).optional(),
  teacherRankId: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  teacherStatus: z.string().optional(),
});

const studentProfileSchema = z.object({
  enrolledCourseIds: z
    .array(
      z.object({
        courseId: z.string(),
      })
    )
    .optional(),
});

// Main schema
const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  role: z.nativeEnum(Role).default(Role.STUDENT),
  accountStatus: z
    .nativeEnum(UserAccountStatus)
    .default(UserAccountStatus.ACTIVE),
  yearsOfExperience: z.union([z.string(), z.number()]).optional(),
  education: z.array(z.string()).optional(),
  dateOfBirth: z.date().optional(),
  gender: z.string().optional(),
  phoneNumber: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  nationality: z.string().optional(),
  facebook: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  youtube: z.string().url().optional(),
  website: z.string().url().optional(),
  others: z.string().optional(),
  subjectSpecializations: z.array(z.string()).optional(),
  expertiseLevel: z
    .nativeEnum(TeacherExpertiseLevel)
    .default(TeacherExpertiseLevel.ENTRY_LEVEL),
  teacherRankId: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  isAdmin: z.boolean().optional(),
  isSuperAdmin: z.boolean().optional(),
  teacherStatus: z.string().optional(),
  enrolledCourseIds: z.array(z.string()).optional(),
});

// If you need to parse teacherProfile and studentProfile separately:
export const FullUserSchema = userSchema.extend({
  teacherProfile: teacherProfileSchema.optional(),
  studentProfile: studentProfileSchema.optional(),
});

//----Student dashboard-----
// PriceSchema
export const PriceSchema = z.object({
  regularAmount: z.number().nullable(),
  isFree: z.boolean(),
});

// CourseWithProgressSchema
export const CourseWithProgressSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  totalDuration: z.number().nullable(),
  imageUrl: z.string().nullable(),
  isPublished: z.boolean(),
  isUnderSubscription: z.boolean(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  category: CategorySchema.nullable(),
  teacherProfile: TeacherProfileSchema.nullable(),
  prices: PriceSchema.nullable(),
  lessons: z.array(LessonSchema),
  progress: z.number().nullable(),
  nextLessonSlug: z.string().nullable(),
  _count: z
    .object({
      enrolledStudents: z.number(),
    })
    .optional(),
});
// DashboardCoursesResponseSchema
export const DashboardCoursesResponseSchema = z.object({
  completedCourses: z.array(CourseWithProgressSchema),
  coursesInProgress: z.array(CourseWithProgressSchema),
  purchasedCourseIds: z.array(z.string()),
});

// reset password schemas
export const ResetPasswordRequestSchema = z.object({
  oldPassword: z.string().min(6, "পুরানো পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
  newPassword: z.string().min(6, "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

// Response schema for reset password
export const ResetPasswordResponseSchema = z.object({
  message: z.string(),
});
// Response schema for teacher with profile
export const TeacherWithProfileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  image: z.string().nullable(),
  teacherProfile: z
    .object({
      id: z.string(),
      bio: z.string().nullable(),
      teacherStatus: z.string(),
      teacherRank: z
        .object({
          id: z.string(),
          name: z.string(),
        })
        .nullable(),
      createdCourses: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          isPublished: z.boolean(),
        })
      ),
    })
    .nullable(),
});
// TypeScript type for TeacherWithProfile
export type TeacherWithProfile = z.infer<typeof TeacherWithProfileSchema>;
export const BkashManualPaymentBodySchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  user: z.object({
    name: z.string(),
    email: z.string(),
  }),
  course: z.object({
    title: z.string(),
  }),
  courseId: z.string(),
  payFrom: z.array(z.string()),
  trxId: z.array(z.string()),
  amount: z.number().optional(),
  payableAmount: z.number().optional(),
  type: z.enum([
    BkashManualPaymentType.REGULAR,
    BkashManualPaymentType.SUBSCRIPTION,
    BkashManualPaymentType.OFFER,
  ]),
  subscriptionPlan: z.object({
    name: z.string(),
  }),
  status: z
    .enum([
      bkashManualPaymentStatus.PENDING,
      bkashManualPaymentStatus.SUCCESS,
      bkashManualPaymentStatus.FAILED,
    ])
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Overview Schema
export const teacherOverviewQuerySchema = z.object({
  teacherId: z.string(),
});

export const teacherOverviewResponseSchema = z.object({
  remaining_balance: z.number(),
  total_earned: z.number(),
  total_payments: z.number(),
  last_transaction_date: z.string().nullable(),
  month: z.string(),
  year: z.string(),
});

// Payment History
export const teacherPaymentHistoryQuerySchema = z.object({
  teacherId: z.string(),
});

export const teacherPaymentHistoryResponseSchema = z.array(z.any()); // You can replace with a specific Zod schema if known

// Earnings
export const teacherEarningRequestSchema = z.object({
  teacherProfileId: z.string(),
});

export const teacherEarningResponseSchema = z.array(
  z.object({
    id: z.string(),
    month: z.number(),
    year: z.number(),
    earned: z.number(),
    paid: z.number(),
    remaining: z.number(),
    status: z.string(),
  })
);

export const freeCourseAccessSchema = z.object({
  courseId: z.string(),
  studentProfileId: z.string(),
  teacherProfileId: z.string(),
});

// subscribers schema
export const SubscribersSchema = z.object({
  id: z.string(),
  expiresAt: z.string().datetime(),
  status: z.enum(["ACTIVE", "INACTIVE", "EXPIRED", "CANCELLED", "PENDING"]), // Adjust as needed

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  subscriptionPlan: z.object({
    id: z.string(),
    name: z.string(),
  }),
  studentProfile: z.object({
    id: z.string(),
    userId: z.string(),
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      avatarUrl: z.string().url(),
      role: z.enum(["TEACHER", "STUDENT", "ADMIN"]), // Adjust as needed
    }),
  }),
});

export const courseRoadmapSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "Title must be at least 2 characters." })
      .max(100, { message: "Title must not exceed 100 characters." }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters." }),
    status: z.enum([
      CourseRoadmapStatus.PLANNED,
      CourseRoadmapStatus.IN_PROGRESS,
      CourseRoadmapStatus.COMPLETED,
    ]),
    category: z
      .string()
      .min(1, { message: "Please select a category." })
      .max(50, { message: "Category must not exceed 50 characters." }),
    estimatedDuration: z
      .string()
      .min(1, { message: "Please provide an estimated duration." })
      .max(50, { message: "Duration must not exceed 50 characters." }),
    targetDate: z.date().optional(),
    difficulty: z.enum([
      DifficultyLevel.BEGINNER,
      DifficultyLevel.INTERMEDIATE,
      DifficultyLevel.ADVANCED,
    ]),
    prerequisites: z
      .string()
      .max(500, { message: "Prerequisites must not exceed 500 characters." })
      .optional(),
    courseLink: z
      .string()
      .url({ message: "Please enter a valid URL." })
      .optional()
      .or(z.literal("")),
    teacherId: z
      .string()
      .min(1, { message: "Please select a teacher." })
      .nullable(),
  })
  .refine(
    (data) => {
      //validate if the status is completed then course link is required
      if (data.status === CourseRoadmapStatus.COMPLETED && !data.courseLink) {
        return false;
      }
      return true;
    },
    {
      message: "Course link is required when status is completed",
      path: ["courseLink"],
    }
  );
