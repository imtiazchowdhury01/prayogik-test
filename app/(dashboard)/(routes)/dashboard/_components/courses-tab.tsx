import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Category, Course } from "@prisma/client";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
  teacherProfile?: {
    user?: {
      name: string;
    };
  };
};

type TCoursesTabProps = {
  purchasedCourses: CourseWithProgressWithCategory[];
  subscribedCourses: CourseWithProgressWithCategory[];
  userId: string | null;
  purchasedCourseIds: string[];
  isSubscriber: boolean;
  subscription?: any;
};

export function CoursesTab({
  purchasedCourses,
  subscribedCourses,
  userId,
  purchasedCourseIds,
  isSubscriber,
  subscription,
}: TCoursesTabProps) {
  return (
    <div className="w-full">
      <Tabs defaultValue="purchased" className="w-full">
        <div className="w-full mb-8">
          <TabsList className="grid grid-cols-2 bg-gray-50 rounded-lg max-w-md p-0 m-0">
            <TabsTrigger
              value="purchased"
              className="w-full transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:shadow-sm rounded-md py-2.5 px-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Purchased Courses
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="w-full transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:shadow-sm rounded-md py-2.5 px-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Subscription Courses
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Purchases courses */}
        <TabsContent value="purchased" className="w-full mt-0">
          <div className="space-y-6">
            {purchasedCourses.length > 0 && (
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Your Purchased Courses ({purchasedCourses.length})
                </h2>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
              {purchasedCourses.map((item) => (
                <div key={item.id} className="h-full">
                  <CourseCard
                    variant="light"
                    key={item.id}
                    course={item}
                    userId={userId!}
                    purchasedCourseIds={purchasedCourseIds}
                    instructor={item?.teacherProfile?.user?.name}
                  />
                </div>
              ))}
            </div>

            {purchasedCourses.length === 0 && (
              <div className="py-16 px-8">
                <div className="max-w-md mx-auto text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    কোন কেনা কোর্স পাওয়া যায়নি!
                  </h3>
                  <p className="text-gray-500 mb-6">
                    আপনি এখনো কোনো কোর্স কিনেননি। আমাদের কোর্স ক্যাটালগ দেখুন
                    এবং আপনার পছন্দের কোর্স কিনুন।
                  </p>
                  <Button
                    asChild
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Link href="/courses">কোর্স দেখুন</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        {/* subscribed courses*/}
        <TabsContent value="subscription" className="w-full mt-0">
          <div className="space-y-6">
            {isSubscriber ? (
              <>
                {subscribedCourses.length > 0 && (
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Subscription Courses ({subscribedCourses.length})
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span className="font-medium">Active Subscription</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                  {subscribedCourses.map((item) => (
                    <div key={item.id} className="h-full">
                      <CourseCard
                        variant="light"
                        key={item.id}
                        course={item}
                        userId={userId!}
                        purchasedCourseIds={purchasedCourseIds}
                        instructor={item?.teacherProfile?.user?.name}
                      />
                    </div>
                  ))}
                </div>

                {subscribedCourses.length === 0 && (
                  <div className="py-16 px-8">
                    <div className="max-w-md mx-auto text-center">
                      <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-10 h-10 text-teal-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        কোন সাবস্ক্রিপশন কোর্স পাওয়া যায়নি!
                      </h3>
                      <p className="text-gray-500">
                        এই বিভাগে কোনো কোর্স উপলব্ধ নেই। শীঘ্রই নতুন কোর্স যোগ
                        করা হবে।
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 px-8">
                <div className="max-w-lg mx-auto text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg
                      className="w-12 h-12 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    আপনার কোনো সক্রিয় সাবস্ক্রিপশন নেই!
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    এই কোর্সগুলো দেখতে হলে একটি সাবস্ক্রিপশন কিনুন এবং সীমাহীন
                    কোর্সে অ্যাক্সেস পান। আমাদের প্রিমিয়াম কন্টেন্ট উপভোগ করুন।
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Link href="/prime" className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>সাবস্ক্রিপশন কিনুন</span>
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
