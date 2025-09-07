//@ts-nocheck
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Category, Course } from "@prisma/client";
import CourseCard from "@/components/CourseCard";
import EmptyContent from "./EmptyContent";
import EventCard from "@/components/EventCard";

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
  certificateCourses?: any;
  userId: string | null;
  purchasedCourseIds: string[];
  isSubscriber: boolean;
  subscription?: any;
  RegisterEvents: any;
  activeTab?: TabValue;
  onTabChange?: (tab: TabValue) => void;
};

export function CoursesTab({
  purchasedCourses,
  subscribedCourses,
  certificateCourses = [],
  userId,
  purchasedCourseIds,
  isSubscriber,
  subscription,
  RegisterEvents,
  activeTab = "purchased",
  onTabChange,
}: TCoursesTabProps) {
  const tabItems = [
    { value: "purchased", label: "Purchased Courses" },
    { value: "subscription", label: "Prime Courses" },
    { value: "certificate", label: "Certification Courses" },
    { value: "event", label: "Registered Events" },
  ];

  return (
    <div className="w-full pt-5">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="w-full mb-6">
          <TabsList className="flex flex-wrap gap-2 bg-gray-50 rounded-lg max-w-full sm:max-w-2xl p-1">
            {tabItems.map((item, index) => (
              <TabsTrigger
                key={index}
                value={item.value}
                className="flex-1 min-w-[120px] text-center border-b-2 transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:shadow-sm data-[state=active]:border-b-brand py-2 px-3 text-sm text-gray-600 hover:text-gray-900 font-medium rounded-none"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Purchased Courses */}
        <TabsContent value="purchased" className="w-full mt-0">
          <div className="space-y-6">
            {purchasedCourses.length > 0 && (
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                Your Purchased Courses ({purchasedCourses.length})
              </h2>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {purchasedCourses.map((item) => (
                <CourseCard
                  key={item.id}
                  variant="light"
                  course={item}
                  userId={userId!}
                  purchasedCourseIds={purchasedCourseIds}
                  instructor={item?.teacherProfile?.user?.name}
                />
              ))}
            </div>

            {purchasedCourses.length === 0 && (
              <EmptyContent
                title="কোন কেনা কোর্স পাওয়া যায়নি!"
                description="আপনি এখনো কোনো কোর্স কিনেননি। আমাদের কোর্স ক্যাটালগ দেখুন এবং আপনার পছন্দের কোর্স কিনুন।"
                buttonText="কোর্স দেখুন"
                buttonHref="/courses"
              />
            )}
          </div>
        </TabsContent>

        {/* Subscription Courses */}
        <TabsContent value="subscription" className="w-full mt-0">
          <div className="space-y-6">
            {isSubscriber ? (
              <>
                {subscribedCourses.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                      Prime Courses ({subscribedCourses.length})
                    </h2>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span className="font-medium">Active Subscription</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {subscribedCourses.map((item) => (
                    <CourseCard
                      key={item.id}
                      variant="light"
                      course={item}
                      userId={userId!}
                      purchasedCourseIds={purchasedCourseIds}
                      instructor={item?.teacherProfile?.user?.name}
                    />
                  ))}
                </div>

                {subscribedCourses.length === 0 && (
                  <EmptyContent
                    title="কোন সাবস্ক্রিপশন কোর্স পাওয়া যায়নি!"
                    description="এই বিভাগে কোনো কোর্স উপলব্ধ নেই। শীঘ্রই নতুন কোর্স যোগ করা হবে।"
                    showButton={false}
                  />
                )}
              </>
            ) : (
              <EmptyContent
                variant="premium"
                title="আপনার কোনো সক্রিয় সাবস্ক্রিপশন নেই!"
                description="এই কোর্সগুলো দেখতে হলে একটি সাবস্ক্রিপশন কিনুন এবং কোর্সে অ্যাক্সেস পান। আমাদের প্রিমিয়াম কন্টেন্ট উপভোগ করুন।"
                buttonText="সাবস্ক্রিপশন কিনুন"
                buttonHref="/prime"
              />
            )}
          </div>
        </TabsContent>

        {/* Certificate Courses */}
        <TabsContent value="certificate" className="w-full mt-0">
          <div className="space-y-6">
            {certificateCourses.length > 0 && (
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                Your Purchased Certificate Courses ({certificateCourses.length})
              </h2>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {certificateCourses.map((item: any) => (
                <CourseCard
                  key={item.id}
                  variant="light"
                  course={item}
                  userId={userId!}
                  purchasedCourseIds={purchasedCourseIds}
                  instructor={item?.teacherProfile?.user?.name}
                />
              ))}
            </div>

            {certificateCourses.length === 0 && (
              <EmptyContent
                title="কোন সার্টিফিকেট কোর্স পাওয়া যায়নি!"
                description="আপনি এখনো কোনো সার্টিফিকেট কোর্সে ভর্তি হননি। আমাদের সার্টিফিকেট কোর্স ক্যাটালগ দেখুন এবং আপনার পছন্দের কোর্সে ভর্তি হন।"
                buttonText="সার্টিফিকেট কোর্স দেখুন"
                buttonHref="/certificate-courses"
              />
            )}
          </div>
        </TabsContent>

        {/* Registered Events */}
        <TabsContent value="event" className="w-full mt-0">
          <div className="space-y-6">
            {RegisterEvents.length > 0 && (
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                Your Registered Events ({RegisterEvents.length})
              </h2>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {RegisterEvents.map((item: any) => (
                <EventCard key={item.id} event={item.event} />
              ))}
            </div>

            {RegisterEvents.length === 0 && (
              <EmptyContent
                title="কোন কেনা ইভেন্ট পাওয়া যায়নি!"
                description="আপনি এখনো কোনো ইভেন্ট কিনেননি। আমাদের ইভেন্ট ক্যাটালগ দেখুন এবং আপনার পছন্দের ইভেন্ট কিনুন।"
                buttonText="ইভেন্ট দেখুন"
                buttonHref="/events"
                showButton={false}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
