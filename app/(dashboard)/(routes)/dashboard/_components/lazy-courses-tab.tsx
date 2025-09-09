// // _components/lazy-courses-tab.tsx
// "use client";

// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useEffect, useState } from "react";
// import { CoursesTab } from "./courses-tab";
// import { CoursesTabSkeleton } from "./dashboard-loading";
// import { getDashboardCourses } from "@/actions/get-dashboard-courses"; // Import your existing action
// import { getAllRegisteredEventDBCall } from "@/lib/data-access-layer/event-registration"; // Import events action

// export type TabValue = "purchased" | "subscription" | "certificate" | "event";

// interface LazyCoursesTabProps {
//   userId: string;
//   initialTab?: TabValue;
// }

// export function LazyCoursesTab({
//   userId,
//   initialTab = "purchased",
// }: LazyCoursesTabProps) {
//   const [activeTab, setActiveTab] = useState<TabValue>(initialTab);
//   const [coursesData, setCoursesData] = useState<any>(null);
//   const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [loadedTabs, setLoadedTabs] = useState<Set<TabValue>>(new Set());

//   // Load data when tab changes
//   useEffect(() => {
//     if (!loadedTabs.has(activeTab)) {
//       loadTabData(activeTab);
//     }
//   }, [activeTab, loadedTabs]);

//   const loadTabData = async (tab: TabValue) => {
//     setLoading(true);

//     try {
//       // Load courses data if not already loaded using your existing action
//       if (!coursesData) {
//         const data = await getDashboardCourses(userId);
//         setCoursesData(data);
//       }

//       // Load events data specifically for events tab using your existing action
//       if (tab === "event" && registeredEvents.length === 0) {
//         const events = await getAllRegisteredEventDBCall(userId);
//         setRegisteredEvents(events);
//       }

//       setLoadedTabs((prev) => new Set([...prev, tab]));
//     } catch (error) {
//       console.error("Failed to load tab data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabChange = (tab: TabValue) => {
//     setActiveTab(tab);
//   };

//   const tabItems = [
//     { value: "purchased", label: "Purchased Courses" },
//     { value: "subscription", label: "Prime Courses" },
//     { value: "certificate", label: "Certification Courses" },
//     { value: "event", label: "Registered Events" },
//   ];

//   if (!coursesData && activeTab !== "event") {
//     return <CoursesTabSkeleton />;
//   }

//   return (
//     <div className="w-full pt-5">
//       <Tabs
//         value={activeTab}
//         onValueChange={handleTabChange}
//         className="w-full"
//       >
//         <div className="w-full mb-6">
//           <TabsList className="flex flex-wrap gap-2 bg-gray-50 rounded-lg max-w-full sm:max-w-2xl p-1">
//             {tabItems.map((item, index) => (
//               <TabsTrigger
//                 key={index}
//                 value={item.value}
//                 className="flex-1 min-w-[120px] text-center border-b-2 transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:shadow-sm data-[state=active]:border-b-brand py-2 px-3 text-sm text-gray-600 hover:text-gray-900 font-medium rounded-none"
//               >
//                 {item.label}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         </div>

//         {loading && <CoursesTabSkeleton />}

//         {!loading && coursesData && (
//           <CoursesTab
//             userId={userId}
//             purchasedCourses={[
//               ...(coursesData.coursesInProgress || []),
//               ...(coursesData.completedCourses || []),
//             ]}
//             purchasedCourseIds={coursesData.purchasedCourseIds || []}
//             isSubscriber={false} // You might need to add this to your getDashboardCourses return type
//             subscription={null} // You might need to add this to your getDashboardCourses return type
//             subscribedCourses={[]} // You might need to add this to your getDashboardCourses return type
//             RegisterEvents={registeredEvents}
//             activeTab={activeTab}
//             onTabChange={setActiveTab}
//           />
//         )}
//       </Tabs>
//     </div>
//   );
// }
