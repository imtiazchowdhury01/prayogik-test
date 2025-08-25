import { generateOpenApi } from "@ts-rest/open-api";
import { ApiContractV1 } from ".";

export const OpenAPIV1 = generateOpenApi(ApiContractV1, {
  info: {
    title: "Prayogik LMS",
    version: "1.0.0",
    description: "",
  },
  tags: [
    { name: "Auth", description: "Auth" },
    { name: "User", description: "User" },
    { name: "Teacher", description: "Teacher" },
    { name: "TeacherCourse", description: "Teacher Course" },
    { name: "TeacherEarnings", description: "Teacher Earnings" },
    { name: "Course", description: "Course" },
    { name: "CourseLessons", description: "CourseLessons" },
    { name: "AdminCourse", description: "Admin Course" },
    { name: "AdminUser", description: "Admin User" },
    { name: "AdminTeacher", description: "Admin Teacher" },
    { name: "CourseRoadmap", description: "Course Roadmap" },
    { name: "Categories", description: "Categories" },
    { name: "Subscription", description: "Subscription" },
  ],
});

// Auth endpoints
OpenAPIV1.paths["/api/auth/session"].get.tags = ["Auth"];
OpenAPIV1.paths["/api/auth/check-username"].post.tags = ["Auth"];
OpenAPIV1.paths["/api/auth/adduser"].post.tags = ["Auth"];
OpenAPIV1.paths["/api/auth/signup"].post.tags = ["Auth"];
OpenAPIV1.paths["/api/auth/reset-password"].post.tags = ["Auth"];
OpenAPIV1.paths["/api/auth/reset-password-submit"].post.tags = ["Auth"];

// Admin User
OpenAPIV1.paths["/api/admin/users"].get.tags = ["AdminUser"];
OpenAPIV1.paths["/api/admin/users/{userId}"].get.tags = ["AdminUser"];
OpenAPIV1.paths["/api/admin/users/{userId}"].put.tags = ["AdminUser"];

//Users endpoints
OpenAPIV1.paths["/api/user/profile/{userId}"].get.tags = ["User"];
OpenAPIV1.paths["/api/user/profile/{userId}"].put.tags = ["User"];
OpenAPIV1.paths["/api/user/userprogress"].get.tags = ["User"];
OpenAPIV1.paths["/api/user/subscription"].get.tags = ["User"];
OpenAPIV1.paths["/api/auth/role"].post.tags = ["User"];

// Courses endpoints
OpenAPIV1.paths["/api/courses"].get.tags = ["Course"];
OpenAPIV1.paths["/api/courses"].post.tags = ["Course"];
OpenAPIV1.paths["/api/courses/freecourse"].post.tags = ["Course"];
OpenAPIV1.paths["/api/courses/{courseId}/publish"].patch.tags = ["Course"];
OpenAPIV1.paths["/api/courses/{courseId}/unpublish"].patch.tags = ["Course"];
OpenAPIV1.paths["/api/courses/access/free"].post.tags = ["Course"];

// Course Lessons
OpenAPIV1.paths["/api/front/lessons/lesson"].post.tags = ["CourseLessons"];
OpenAPIV1.paths["/api/courses/{courseId}/lessons/reorder"].put.tags = [
  "CourseLessons",
];
OpenAPIV1.paths[
  "/api/courses/{courseId}/lessons/{lessonId}/publish"
].patch.tags = ["CourseLessons"];
OpenAPIV1.paths[
  "/api/courses/{courseId}/lessons/{lessonId}/unpublish"
].patch.tags = ["CourseLessons"];

// Admin Course
OpenAPIV1.paths["/api/admin/courses"].get.tags = ["AdminCourse"];

// Courses Roadmap endpoints
OpenAPIV1.paths["/api/admin/manage/course-roadmap"].get.tags = [
  "CourseRoadmap",
];
OpenAPIV1.paths["/api/admin/manage/course-roadmap"].post.tags = [
  "CourseRoadmap",
];
OpenAPIV1.paths["/api/admin/manage/course-roadmap/{id}"].put.tags = [
  "CourseRoadmap",
];
OpenAPIV1.paths["/api/admin/manage/course-roadmap/{id}"].delete.tags = [
  "CourseRoadmap",
];

// Categories endpoints
OpenAPIV1.paths["/api/courses/categories"].get.tags = ["Categories"];
OpenAPIV1.paths["/api/courses/categories"].post.tags = ["Categories"];
OpenAPIV1.paths["/api/courses/categories"].put.tags = ["Categories"];
OpenAPIV1.paths["/api/courses/categories"].delete.tags = ["Categories"];

// Admin Teacher
OpenAPIV1.paths["/api/admin/teachers"].get.tags = ["AdminTeacher"];
OpenAPIV1.paths["/api/admin/teachers/{teacherId}"].get.tags = ["AdminTeacher"];
OpenAPIV1.paths["/api/admin/teachers/{teacherId}"].put.tags = ["AdminTeacher"];
OpenAPIV1.paths["/api/admin/teachers/earnings"].post.tags = ["AdminTeacher"];
OpenAPIV1.paths["/api/admin/teachers/earnings/pay"].post.tags = [
  "AdminTeacher",
];
OpenAPIV1.paths["/api/admin/teachers/ranks"].post.tags = ["AdminTeacher"];
OpenAPIV1.paths["/api/admin/teachers/ranks/{id}"].put.tags = ["AdminTeacher"];
OpenAPIV1.paths["/api/admin/teachers/ranks/{id}"].delete.tags = [
  "AdminTeacher",
];

// Teacher
OpenAPIV1.paths["/api/teacher"].get.tags = ["Teacher"];
OpenAPIV1.paths["/api/teacher/ranks"].get.tags = ["Teacher"];
OpenAPIV1.paths["/api/teacher/apply-for-teacher"].post.tags = ["Teacher"];

// Teacher Payments
OpenAPIV1.paths["/api/teacher/earnings/{earningId}/revenues"].get.tags = [
  "TeacherEarnings",
];
OpenAPIV1.paths["/api/teacher/earnings/{earningId}"].get.tags = [
  "TeacherEarnings",
];
OpenAPIV1.paths["/api/teacher/payment/paymentMethods"].get.tags = [
  "TeacherEarnings",
];
OpenAPIV1.paths["/api/teacher/payment/paymentMethods"].post.tags = [
  "TeacherEarnings",
];
OpenAPIV1.paths["/api/teacher/payment/paymentMethods/{id}"].patch.tags = [
  "TeacherEarnings",
];
OpenAPIV1.paths["/api/teacher/payment/paymentMethods/{id}"].delete.tags = [
  "TeacherEarnings",
];
OpenAPIV1.paths["/api/teacher/analytics"].get.tags = ["TeacherEarnings"];
OpenAPIV1.paths["/api/teacher/account/overview"].get.tags = ["TeacherEarnings"];
OpenAPIV1.paths["/api/teacher/payment/paymentHistory"].get.tags = [
  "TeacherEarnings",
];
OpenAPIV1.paths["/api/teacher/earnings"].post.tags = ["TeacherEarnings"];

// Teacher Courses endpoints
OpenAPIV1.paths["/api/teacher/courses"].get.tags = ["TeacherCourse"];
OpenAPIV1.paths["/api/teacher/courses/{courseId}"].get.tags = ["TeacherCourse"];
OpenAPIV1.paths["/api/teacher/courses/{courseId}/lessons/{lessonId}"].get.tags =
  ["TeacherCourse"];
// Subscription discount
OpenAPIV1.paths["/api/subscriptions"].get.tags = ["Subscription"];
OpenAPIV1.paths["/api/subscriptions"].post.tags = ["Subscription"];
OpenAPIV1.paths["/api/subscriptions/discounts"].get.tags = ["Subscription"];
OpenAPIV1.paths["/api/subscriptions/discounts"].post.tags = ["Subscription"];
OpenAPIV1.paths["/api/subscriptions/discounts"].put.tags = ["Subscription"];
OpenAPIV1.paths["/api/subscriptions/discounts/{id}"].delete.tags = [
  "Subscription",
];

// student dashboard
OpenAPIV1.paths["/api/user/courses/dashboard"].get.tags = ["Student"];
OpenAPIV1.paths["/api/user/profile/reset-password"].post.tags = [
  "User",
  "Profile",
];
OpenAPIV1.paths["/api/teacher/verified"].get.tags = ["Teacher"];

// Bkash payment
OpenAPIV1.paths["/api/bkash-manual-payment"].post.tags = ["BkashPayment"];
OpenAPIV1.paths["/api/bkash-manual-payment/{id}"].delete.tags = [
  "BkashPayment",
];
// subscribers
OpenAPIV1.paths["/api/subscribers"].get.tags = ["Subscribers"];
OpenAPIV1.paths["/api/subscribers/{id}"].get.tags = ["Subscribers"];
OpenAPIV1.paths["/api/subscribers/{id}"].put.tags = ["Subscribers"];
