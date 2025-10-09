import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, GraduationCap } from "lucide-react";
import courseCapIcon2 from "../_icons/courseCapIcon2";
import courseCapIcon from "../_icons/courseCapIcon";
import certificationIcon from "../_icons/certificationIcon";
import eventsIcon from "../_icons/eventsIcon";
import { TabValue } from "./courses-tab";

interface SummaryCardsProps {
  purchasedCourses?: number;
  subscriptionCourses?: number;
  purchasedCertificationCoursesCount?: number;
  registeredEvents?: number;
  trends?: {
    purchasedCoursesLastMonth: number;
    newSubscriptionCourses: number;
    eventsThisWeek: number;
  };
  onTabChange?: (tab: TabValue) => void;
}

export function SummaryCards({
  purchasedCourses = 0,
  subscriptionCourses = 0,
  purchasedCertificationCoursesCount = 0,
  registeredEvents = 0,
  trends,
  onTabChange,
}: SummaryCardsProps) {
  // Generate trend messages based on actual data
  const getTrendMessage = (type: string, value: number) => {
    switch (type) {
      case "purchased":
        return value > 0 ? `+${value} from last month` : "No new purchases";
      case "subscription":
        return value > 0
          ? `${value} courses available`
          : "No active subscription";
      case "certificate":
        return value > 0
          ? `${value} certificate courses this week`
          : "certificate courses this week";
      case "events":
        return value > 0 ? `${value} events this week` : "No events this week";
      default:
        return "No data available";
    }
  };

  const handleCardClick = (tab: TabValue) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const metrics = [
    {
      title: "Purchased Courses",
      value: purchasedCourses,
      icon: courseCapIcon,
      description: "Total courses",
      trend: getTrendMessage(
        "purchased",
        trends?.purchasedCoursesLastMonth || 0
      ),
      hasPositiveTrend: (trends?.purchasedCoursesLastMonth || 0) > 0,
      tabValue: "purchased" as TabValue,
      bgColor: "bg-[#FBF2E6]",
      iconColor: "text-[#94600D]",
    },
    {
      title: "Prime Courses",
      value: subscriptionCourses,
      icon: courseCapIcon2,
      description: "Active prime courses",
      trend: getTrendMessage("subscription", subscriptionCourses),
      hasPositiveTrend: subscriptionCourses > 0,
      tabValue: "subscription" as TabValue,
      bgColor: "bg-brand/10",
      iconColor: "text-brand",
    },
    {
      title: "Certification Courses",
      value: purchasedCertificationCoursesCount,
      icon: certificationIcon,
      description: "Active certification courses",
      trend: getTrendMessage("certificate", 0),
      hasPositiveTrend: purchasedCertificationCoursesCount > 0,
      tabValue: "certificate" as TabValue,
      bgColor: "bg-[#E6FBEA]",
      iconColor: "text-[#0D942A]",
    },
    {
      title: "Registered Events",
      value: registeredEvents,
      icon: eventsIcon,
      description: "Upcoming events registered",
      trend: getTrendMessage("events", trends?.eventsThisWeek || 0),
      hasPositiveTrend: (trends?.eventsThisWeek || 0) > 0,
      tabValue: "event" as TabValue,
      bgColor: "bg-[#F3E7F5]",
      iconColor: "text-[#630D94]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.title}
              className="transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer border border-slate-200 shadow-none"
              onClick={() => handleCardClick(metric.tabValue)}
            >
              <CardHeader className=" 2xl:p-6 xl:p-4 p-6 flex flex-row items-start 2xl:items-center 2xl:gap-x-4 xl:gap-x-3 gap-x-4 space-y-0 pb-3">
                <div className={`p-4 rounded-lg ${metric.bgColor}`}>
                  <Icon />
                </div>

                <CardTitle>
                  <p className="font-semibold text-base">{metric.title}</p>
                  <p className="text-gray-500 text-xs pt-2 font-normal">
                    {metric.description}
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-foreground mt-2">
                    {metric.value}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      metric.hasPositiveTrend
                        ? "text-secondary-button"
                        : "text-gray-500"
                    }`}
                  ></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
