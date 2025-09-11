//@ts-nocheck
"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Category, Course } from "@prisma/client";
import CourseCard from "@/components/CourseCard";
import EmptyContent from "./EmptyContent";
import EventCard from "@/components/EventCard";
import { clientApi } from "@/lib/utils/openai/client";
import { TabContentSkeleton } from "./dashboard-skeleton";

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

type TabData = {
  purchasedCourses?: CourseWithProgressWithCategory[];
  subscribedCourses?: CourseWithProgressWithCategory[];
  certificateCourses?: any[];
  registeredEvents?: any[];
  purchasedCourseIds?: string[];
  isSubscriber?: boolean;
  subscription?: any;
};

type CoursesTabProps = {
  userId: string;
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
};

export function CoursesTab({
  userId,
  activeTab,
  onTabChange,
}: CoursesTabProps) {
  const [tabData, setTabData] = useState<TabData>({});
  const [loadingTabs, setLoadingTabs] = useState<Set<TabValue>>(new Set());
  const [loadedTabs, setLoadedTabs] = useState<Set<TabValue>>(new Set());

  // console.log("tabData result:", tabData);

  const tabItems = [
    { value: "purchased", label: "Purchased Courses" },
    { value: "subscription", label: "Prime Courses" },
    { value: "certificate", label: "Certification Courses" },
    { value: "event", label: "Registered Events" },
  ];

  const loadTabData = useCallback(
    async (tab: TabValue) => {
      if (loadedTabs.has(tab) || loadingTabs.has(tab)) {
        return;
      }

      setLoadingTabs((prev) => new Set(prev).add(tab));

      try {
        switch (tab) {
          case "purchased": {
            // Only fetch courses data for purchased tab
            const coursesResponse = await clientApi.getDashboardCourses();
            if (coursesResponse.status === 200) {
              const coursesData = coursesResponse.body;
              setTabData((prev) => ({
                ...prev,
                purchasedCourses: [
                  ...(coursesData.coursesInProgress || []),
                  ...(coursesData.completedCourses || []),
                ],
                purchasedCourseIds: coursesData.purchasedCourseIds || [],
              }));
            }
            break;
          }

          case "subscription": {
            // Only fetch subscription data for subscription tab
            const coursesResponse = await clientApi.getDashboardCourses();
            if (coursesResponse.status === 200) {
              const coursesData = coursesResponse.body;
              setTabData((prev) => ({
                ...prev,
                subscribedCourses: coursesData.subscribedCourses || [],
                purchasedCourseIds: coursesData.purchasedCourseIds || [],
                isSubscriber: coursesData.isSubscriber,
                subscription: coursesData.subscription,
              }));
            }
            break;
          }

          case "certificate": {
            // Add certificate courses loading logic here
            // For now, setting empty array - replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
            setTabData((prev) => ({
              ...prev,
              certificateCourses: [], // Replace with actual API call
            }));
            break;
          }

          case "event": {
            // Import and use getAllRegisteredEventDBCall
            const { getAllRegisteredEventDBCall } = await import(
              "@/lib/data-access-layer/event-registration"
            );
            const eventsData = await getAllRegisteredEventDBCall(userId);
            setTabData((prev) => ({
              ...prev,
              registeredEvents: eventsData || [],
            }));
            break;
          }
        }

        // Only mark the specific tab as loaded
        setLoadedTabs((prev) => new Set(prev).add(tab));
      } catch (error) {
        console.error(`Failed to load data for tab ${tab}:`, error);
        // Set empty data on error for the specific tab
        switch (tab) {
          case "purchased":
            setTabData((prev) => ({ ...prev, purchasedCourses: [] }));
            break;
          case "subscription":
            setTabData((prev) => ({ ...prev, subscribedCourses: [] }));
            break;
          case "certificate":
            setTabData((prev) => ({ ...prev, certificateCourses: [] }));
            break;
          case "event":
            setTabData((prev) => ({ ...prev, registeredEvents: [] }));
            break;
        }
        setLoadedTabs((prev) => new Set(prev).add(tab));
      } finally {
        setLoadingTabs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(tab);
          return newSet;
        });
      }
    },
    [userId, loadedTabs, loadingTabs]
  );

  // Load data when tab becomes active
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab, loadTabData]);

  const handleTabChange = (tab: string) => {
    const tabValue = tab as TabValue;
    onTabChange(tabValue);
  };

  const isTabLoading = (tab: TabValue) => loadingTabs.has(tab);
  const isTabLoaded = (tab: TabValue) => loadedTabs.has(tab);

  return (
    <div className="w-full pt-5 bg-white p-5 rounded-lg">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        {/* Fixed TabsList */}
        <div className="w-full mb-6 sticky top-0 z-10 pb-2">
          <TabsList className="flex flex-wrap gap-2 bg-transparent max-w-full sm:max-w-2xl border-b rounded-none p-0">
            {tabItems.map((item, index) => (
              <TabsTrigger
                key={index}
                value={item.value}
                className="flex-1 min-w-[120px] text-center  transition-all duration-200 data-[state=active]:text-primary-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-b-brand py-2 px-3 text-md text-gray-600 hover:text-gray-900 font-medium rounded-none"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Purchased Courses */}
        <TabsContent value="purchased" className="w-full mt-0">
          {isTabLoading("purchased") ? (
            <TabContentSkeleton />
          ) : (
            <div className="space-y-6">
              {isTabLoaded("purchased") &&
                tabData.purchasedCourses &&
                tabData.purchasedCourses.length > 0 && (
                  <h2 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-600">
                    Your Purchased Courses ({tabData.purchasedCourses.length})
                  </h2>
                )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {tabData.purchasedCourses?.map((item) => (
                  <CourseCard
                    key={item.id}
                    variant="light"
                    course={item}
                    userId={userId}
                    purchasedCourseIds={tabData.purchasedCourseIds || []}
                    instructor={item?.teacherProfile?.user?.name}
                  />
                ))}
              </div>

              {isTabLoaded("purchased") &&
                (!tabData.purchasedCourses ||
                  tabData.purchasedCourses.length === 0) && (
                  <EmptyContent
                    title="কোন কেনা কোর্স পাওয়া যায়নি!"
                    description="আপনি এখনো কোনো কোর্স কিনেননি। আমাদের কোর্স ক্যাটালগ দেখুন এবং আপনার পছন্দের কোর্স কিনুন।"
                    buttonText="কোর্স দেখুন"
                    buttonHref="/courses"
                  />
                )}
            </div>
          )}
        </TabsContent>

        {/* Subscription Courses */}
        <TabsContent value="subscription" className="w-full mt-0">
          {isTabLoading("subscription") ? (
            <TabContentSkeleton />
          ) : (
            <div className="space-y-6">
              {tabData.isSubscriber ? (
                <>
                  {isTabLoaded("subscription") &&
                    tabData.subscribedCourses &&
                    tabData.subscribedCourses.length > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h2 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-600">
                          Prime Courses ({tabData.subscribedCourses.length})
                        </h2>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span className="font-medium">
                            Active Subscription
                          </span>
                        </div>
                      </div>
                    )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {tabData.subscribedCourses?.map((item) => (
                      <CourseCard
                        key={item.id}
                        variant="light"
                        course={item}
                        userId={userId}
                        purchasedCourseIds={tabData.purchasedCourseIds || []}
                        instructor={item?.teacherProfile?.user?.name}
                      />
                    ))}
                  </div>

                  {isTabLoaded("subscription") &&
                    (!tabData.subscribedCourses ||
                      tabData.subscribedCourses.length === 0) && (
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
          )}
        </TabsContent>

        {/* Certificate Courses */}
        <TabsContent value="certificate" className="w-full mt-0">
          {isTabLoading("certificate") ? (
            <TabContentSkeleton />
          ) : (
            <div className="space-y-6">
              {isTabLoaded("certificate") &&
                tabData.certificateCourses &&
                tabData.certificateCourses.length > 0 && (
                  <h2 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-600">
                    Your Purchased Certificate Courses (
                    {tabData.certificateCourses.length})
                  </h2>
                )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {tabData.certificateCourses?.map((item: any) => (
                  <CourseCard
                    key={item.id}
                    variant="light"
                    course={item}
                    userId={userId}
                    purchasedCourseIds={tabData.purchasedCourseIds || []}
                    instructor={item?.teacherProfile?.user?.name}
                  />
                ))}
              </div>

              {isTabLoaded("certificate") &&
                (!tabData.certificateCourses ||
                  tabData.certificateCourses.length === 0) && (
                  <EmptyContent
                    title="কোন সার্টিফিকেট কোর্স পাওয়া যায়নি!"
                    description="আপনি এখনো কোনো সার্টিফিকেট কোর্সে ভর্তি হননি। আমাদের সার্টিফিকেট কোর্স ক্যাটালগ দেখুন এবং আপনার পছন্দের কোর্সে ভর্তি হন।"
                    buttonText="সার্টিফিকেট কোর্স দেখুন"
                    buttonHref="/certificate-courses"
                  />
                )}
            </div>
          )}
        </TabsContent>

        {/* Registered Events */}
        <TabsContent value="event" className="w-full mt-0">
          {isTabLoading("event") ? (
            <TabContentSkeleton />
          ) : (
            <div className="space-y-6">
              {isTabLoaded("event") &&
                tabData.registeredEvents &&
                tabData.registeredEvents.length > 0 && (
                  <h2 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-600">
                    Your Registered Events ({tabData.registeredEvents.length})
                  </h2>
                )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {tabData.registeredEvents?.map((item: any) => (
                  <EventCard key={item.id} event={item.event} />
                ))}
              </div>

              {isTabLoaded("event") &&
                (!tabData.registeredEvents ||
                  tabData.registeredEvents.length === 0) && (
                  <EmptyContent
                    title="কোন কেনা ইভেন্ট পাওয়া যায়নি!"
                    description="আপনি এখনো কোনো ইভেন্ট কিনেননি। আমাদের ইভেন্ট ক্যাটালগ দেখুন এবং আপনার পছন্দের ইভেন্ট কিনুন।"
                    buttonText="ইভেন্ট দেখুন"
                    buttonHref="/events"
                    showButton={false}
                  />
                )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
