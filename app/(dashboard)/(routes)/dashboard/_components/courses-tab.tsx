//@ts-nocheck
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Category, Course } from "@prisma/client";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import EmptyContent from "./EmptyContent";

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
          <TabsList className="grid grid-cols-2 gap-2 bg-gray-50 rounded-lg max-w-md p-0 m-0">
            <TabsTrigger
              value="purchased"
              className="w-full border transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:border-primary-50 data-[state=active]:text-primary-700 data-[state=active]:shadow-sm rounded-md py-2.5 px-4 text-gray-600 hover:text-gray-900 font-medium"
            >
              Purchased Courses
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="w-full border transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:shadow-sm rounded-md py-2.5 px-4 text-gray-600 hover:text-gray-900 font-medium"
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
              //empty state for courses
              <EmptyContent
                title="কোন কেনা কোর্স পাওয়া যায়নি!"
                description="আপনি এখনো কোনো কোর্স কিনেননি। আমাদের কোর্স ক্যাটালগ দেখুন এবং আপনার পছন্দের কোর্স কিনুন।"
                buttonText="কোর্স দেখুন"
                buttonHref="/courses"
                showButton={true} // optional, defaults to true
              />
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
                  //empty state
                  <>
                    <EmptyContent
                      title="কোন সাবস্ক্রিপশন কোর্স পাওয়া যায়নি!"
                      description="এই বিভাগে কোনো কোর্স উপলব্ধ নেই। শীঘ্রই নতুন কোর্স যোগ করা হবে।"
                      showButton={false}
                    />
                  </>
                )}
              </>
            ) : (
              // empty state for subscription
              <>
                <EmptyContent
                  variant="premium"
                  title="আপনার কোনো সক্রিয় সাবস্ক্রিপশন নেই!"
                  description="এই কোর্সগুলো দেখতে হলে একটি সাবস্ক্রিপশন কিনুন এবং কোর্সে অ্যাক্সেস পান। আমাদের প্রিমিয়াম কন্টেন্ট উপভোগ করুন।"
                  buttonText="সাবস্ক্রিপশন কিনুন"
                  buttonHref="/prime"
                  showButton={true} // optional, defaults to true
                />
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
