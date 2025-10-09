// @ts-nocheck
"use client";
import { useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import EmptyContent from "./EmptyContent";
import EventCard from "@/components/EventCard";
import { TabContentSkeleton } from "./dashboard-skeleton";
import { QueryKeys } from "@/constants/query-keys";
import {
  clientFetchCertificateCourses,
  clientFetchDashboardMetadata,
  clientFetchPurchasedCourses,
  clientFetchRegisteredEvents,
  clientFetchSubscriptionCourses,
} from "@/lib/utils/openai/client/user";

export type TabValue = "purchased" | "subscription" | "certificate" | "event";

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
  // State to track how many pages to show for each tab
  const [visiblePages, setVisiblePages] = useState<Record<TabValue, number>>({
    purchased: 1,
    subscription: 1,
    certificate: 1,
    event: 1,
  });

  const tabItems: TabValue[] = [
    { value: "purchased", label: "Purchased Courses" },
    { value: "subscription", label: "Prime Courses" },
    { value: "certificate", label: "Certification Courses" },
    { value: "event", label: "Registered Events" },
  ];

  // Fetch dashboard metadata (subscription status, purchased course IDs, etc.)
  const {
    data: metadata,
    isLoading: metadataLoading,
    error: metadataError,
  } = useQuery({
    queryKey: [QueryKeys.DASHBOARD_METADATA, userId],
    queryFn: clientFetchDashboardMetadata,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId,
  });

  // Purchased courses with infinite query
  const {
    data: purchasedData,
    fetchNextPage: fetchNextPurchased,
    hasNextPage: hasNextPurchased,
    isFetchingNextPage: isFetchingNextPurchased,
    isLoading: purchasedLoading,
    error: purchasedError,
  } = useInfiniteQuery({
    queryKey: [QueryKeys.PURCHASED_COURSES],
    queryFn: clientFetchPurchasedCourses,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.hasMore ? allPages.length : undefined;
    },
    staleTime: 5 * 60 * 1000,
    enabled: activeTab === "purchased",
    initialPageParam: 0,
  });

  // Subscription courses with infinite query
  const {
    data: subscriptionData,
    fetchNextPage: fetchNextSubscription,
    hasNextPage: hasNextSubscription,
    isFetchingNextPage: isFetchingNextSubscription,
    isLoading: subscriptionLoading,
    error: subscriptionError,
  } = useInfiniteQuery({
    queryKey: [QueryKeys.USER_SUBSCRIPTION_COURSES],
    queryFn: clientFetchSubscriptionCourses,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    staleTime: 5 * 60 * 1000,
    enabled: activeTab === "subscription" && metadata?.isSubscriber,
    initialPageParam: 0,
  });

  // Certificate courses with infinite query
  const {
    data: certificateData,
    fetchNextPage: fetchNextCertificate,
    hasNextPage: hasNextCertificate,
    isFetchingNextPage: isFetchingNextCertificate,
    isLoading: certificateLoading,
    error: certificateError,
  } = useInfiniteQuery({
    queryKey: [QueryKeys.CERTIFICATE_COURSES],
    queryFn: clientFetchCertificateCourses,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    staleTime: 5 * 60 * 1000,
    enabled: activeTab === "certificate",
    initialPageParam: 0,
  });

  console.log({ certificateData });

  // Events with infinite query
  const {
    data: eventsData,
    fetchNextPage: fetchNextEvents,
    hasNextPage: hasNextEvents,
    isFetchingNextPage: isFetchingNextEvents,
    isLoading: eventsLoading,
    error: eventsError,
  } = useInfiniteQuery({
    queryKey: [QueryKeys.REGISTERED_EVENTS, userId],
    queryFn: ({ pageParam }) =>
      clientFetchRegisteredEvents(userId, { pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    staleTime: 5 * 60 * 1000,
    enabled: activeTab === "event",
    initialPageParam: 0,
  });

  const handleTabChange = (tab: string) => {
    const tabValue = tab as TabValue;

    // Reset visible pages for the new tab to 1
    setVisiblePages((prev) => ({
      ...prev,
      [tabValue]: 1,
    }));

    onTabChange(tabValue);
  };

  // Helper function to flatten paginated data with limit
  const flattenPages = (data: any, tabType: TabValue) => {
    if (!data?.pages) return [];

    // Only take the number of pages specified in visiblePages
    const pagesToShow = data.pages.slice(0, visiblePages[tabType]);

    const allItems = pagesToShow.flatMap(
      (page: any) => page.courses || page.events || page.certifications || []
    );

    // Remove duplicates based on ID
    const uniqueItems = allItems.filter(
      (item: any, index: number, array: any[]) =>
        array.findIndex((i: any) => i.id === item.id) === index
    );
    return uniqueItems;
  };

  // Get total count from first page
  const getTotalCount = (data: any) => {
    return data?.pages?.[0]?.totalCount || 0;
  };

  const purchasedCourses = flattenPages(purchasedData, "purchased");
  const subscriptionCourses = flattenPages(subscriptionData, "subscription");
  const certificateCourses = flattenPages(certificateData, "certificate");
  const registeredEvents = flattenPages(eventsData, "event");

  // Load more handlers
  const handleLoadMorePurchased = () => {
    setVisiblePages((prev) => ({
      ...prev,
      purchased: prev.purchased + 1,
    }));

    // Only fetch if we don't have the data cached
    if (purchasedData && purchasedData.pages.length <= visiblePages.purchased) {
      fetchNextPurchased();
    }
  };

  const handleLoadMoreSubscription = () => {
    setVisiblePages((prev) => ({
      ...prev,
      subscription: prev.subscription + 1,
    }));

    if (
      subscriptionData &&
      subscriptionData.pages.length <= visiblePages.subscription
    ) {
      fetchNextSubscription();
    }
  };

  const handleLoadMoreCertificate = () => {
    setVisiblePages((prev) => ({
      ...prev,
      certificate: prev.certificate + 1,
    }));

    if (
      certificateData &&
      certificateData.pages.length <= visiblePages.certificate
    ) {
      fetchNextCertificate();
    }
  };

  const handleLoadMoreEvents = () => {
    setVisiblePages((prev) => ({
      ...prev,
      event: prev.event + 1,
    }));

    if (eventsData && eventsData.pages.length <= visiblePages.event) {
      fetchNextEvents();
    }
  };

  // Check if there are more pages to show (either cached or to fetch)
  const hasMorePurchasedToShow =
    purchasedData &&
    (visiblePages.purchased < purchasedData.pages.length || hasNextPurchased);

  const hasMoreSubscriptionToShow =
    subscriptionData &&
    (visiblePages.subscription < subscriptionData.pages.length ||
      hasNextSubscription);

  const hasMoreCertificateToShow =
    certificateData &&
    (visiblePages.certificate < certificateData.pages.length ||
      hasNextCertificate);

  const hasMoreEventsToShow =
    eventsData &&
    (visiblePages.event < eventsData.pages.length || hasNextEvents);

  return (
    <div className="w-full pt-5 bg-white p-5 rounded-lg">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        {/* Fixed TabsList */}
        <div className="w-full mb-6 sticky top-0 z-10 pb-2">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 bg-transparent max-w-full sm:max-w-2xl border-b rounded-none p-0 mb-12 lg:mb-0">
            {tabItems.map((item, index) => (
              <TabsTrigger
                key={index}
                value={item.value}
                className="flex-1 min-w-[120px] text-center transition-all duration-200 data-[state=active]:text-primary-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-b-brand py-2 px-3 text-md text-gray-600 hover:text-gray-900 font-medium rounded-none"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Purchased Courses */}
        <TabsContent value="purchased" className="w-full">
          {purchasedLoading ? (
            <TabContentSkeleton />
          ) : (
            <div className="space-y-6">
              {purchasedCourses.length > 0 && (
                <h2 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-600">
                  Your Purchased Courses ({getTotalCount(purchasedData)})
                </h2>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {purchasedCourses.map((item: any, index: number) => (
                  <CourseCard
                    key={`${item.id}-${index}`}
                    variant="light"
                    course={item}
                    userId={userId}
                    purchasedCourseIds={metadata?.purchasedCourseIds || []}
                    instructor={item?.teacherProfile?.user?.name}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMorePurchasedToShow && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleLoadMorePurchased}
                    disabled={isFetchingNextPurchased}
                    variant="outline"
                    className="px-8 py-2"
                  >
                    {isFetchingNextPurchased ? (
                      <Loader className="animate-spin size-5" />
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}

              {/* Error state */}
              {purchasedError && (
                <div className="text-center text-red-500 py-4">
                  Error loading courses: {purchasedError.message}
                </div>
              )}

              {purchasedCourses.length === 0 && !purchasedLoading && (
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
        <TabsContent value="subscription" className="w-full">
          {subscriptionLoading || metadataLoading ? (
            <TabContentSkeleton />
          ) : (
            <div className="space-y-6">
              {metadata?.isSubscriber ? (
                <>
                  {subscriptionCourses.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <h2 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-600">
                        Prime Courses ({getTotalCount(subscriptionData)})
                      </h2>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <span className="font-medium">Active Subscription</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                    {subscriptionCourses.map((item: any, index: number) => (
                      <CourseCard
                        key={`${item.id}-${index}`}
                        variant="light"
                        course={item}
                        userId={userId}
                        purchasedCourseIds={metadata?.purchasedCourseIds || []}
                        instructor={item?.teacherProfile?.user?.name}
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMoreSubscriptionToShow && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={handleLoadMoreSubscription}
                        disabled={isFetchingNextSubscription}
                        variant="outline"
                        className="px-8 py-2"
                      >
                        {isFetchingNextSubscription ? (
                          <Loader className="animate-spin size-5" />
                        ) : (
                          "Load More"
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Error state */}
                  {subscriptionError && (
                    <div className="text-center text-red-500 py-4">
                      Error loading courses: {subscriptionError.message}
                    </div>
                  )}

                  {subscriptionCourses.length === 0 && !subscriptionLoading && (
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
        <TabsContent value="certificate" className="w-full">
          {certificateLoading ? (
            <TabContentSkeleton />
          ) : (
            <div className="space-y-6">
              {certificateCourses.length > 0 && (
                <h2 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-600">
                  Your Purchased Certificate Courses (
                  {getTotalCount(certificateData)})
                </h2>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {certificateCourses.map((item: any, index: number) => (
                  <CourseCard
                    key={`${item.id}-${index}`}
                    variant="light"
                    course={item}
                    userId={userId}
                    purchasedCourseIds={metadata?.purchasedCourseIds || []}
                    instructor={item?.teacherProfile?.user?.name}
                    certificationslug={item?.slug}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreCertificateToShow && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleLoadMoreCertificate}
                    disabled={isFetchingNextCertificate}
                    variant="outline"
                    className="px-8 py-2"
                  >
                    {isFetchingNextCertificate ? (
                      <Loader className="animate-spin size-5" />
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}

              {certificateCourses.length === 0 && !certificateLoading && (
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
        <TabsContent value="event" className="w-full">
          {eventsLoading ? (
            <TabContentSkeleton />
          ) : (
            <div className="space-y-6">
              {registeredEvents.length > 0 && (
                <h2 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-600">
                  Your Registered Events ({getTotalCount(eventsData)})
                </h2>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {registeredEvents.map((item: any, index: number) => (
                  <EventCard key={`${item.id}-${index}`} event={item.event} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreEventsToShow && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleLoadMoreEvents}
                    disabled={isFetchingNextEvents}
                    variant="outline"
                    className="px-8 py-2"
                  >
                    {isFetchingNextEvents ? (
                      <Loader className="animate-spin size-5" />
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}

              {registeredEvents.length === 0 && !eventsLoading && (
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
