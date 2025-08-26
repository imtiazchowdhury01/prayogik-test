export const BaseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/`;

export const Urls = {
  auth: {
    checkUsername: `${BaseUrl}auth/check-username`,
    addUser: `${BaseUrl}auth/adduser`,
  },
  categories: `${BaseUrl}courses/categories`,
  subscriptions: `${BaseUrl}subscriptions`,
  subscriptionDiscounts: `${BaseUrl}subscriptions/discounts`,
  subscriptionWebhook: `${BaseUrl}subscriptions/webhook`,
  vdoCipherWebhook: `${BaseUrl}vdocipher/webhook`,
  vdoCipherOtp: `${BaseUrl}vdocipher/otp`,
  admin: {
    courses: `${BaseUrl}/admin/courses`,
    users: `${BaseUrl}/admin/users`,
    teachers: `${BaseUrl}/admin/teachers`,
    teacherById: (teacherId: string) =>
      `${BaseUrl}/admin/teachers/${teacherId}`,
    ranks: `${BaseUrl}admin/teachers/ranks`,
    rankById: (rankId: string) => `${BaseUrl}admin/teachers/ranks/${rankId}`,
    teacherEarnings: `${BaseUrl}/admin/teachers/earnings`,
    teacherPay: `${BaseUrl}/admin/teachers/earnings/pay`,
    teacherPayments: `${BaseUrl}/admin/teachers/payments`,
  },
  user: {
    profile: (userId: string) => `${BaseUrl}user/profile/${userId}`,
    subscription: `${BaseUrl}user/subscription`,
  },
  teacher: {
    ranks: `${BaseUrl}teacher/ranks`,
    details: (teacherId: string) => `${BaseUrl}teacher/${teacherId}`,
    upDatedetails: (teacherId: string) =>
      `${BaseUrl}teacher/details/${teacherId}`,
  },
  courses: `${BaseUrl}courses`,
  courseRoadmap: {
    getAll: `${BaseUrl}admin/manage/course-roadmap`,
    create: `${BaseUrl}admin/manage/course-roadmap`,
    update: (id: string) => `${BaseUrl}admin/manage/course-roadmap/${id}`,
    delete: (id: string) => `${BaseUrl}admin/manage/course-roadmap/${id}`,
  },
  vdocipherDevUrl: `https://dev.vdocipher.com/api/videos`,
};
