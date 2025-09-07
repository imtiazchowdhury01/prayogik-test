import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Calendar, TrendingUp, GraduationCap } from "lucide-react"
import { TabValue } from "./dashbooard-wrapper";




interface DashboardSummaryProps {
  purchasedCourses?: number;
  subscriptionCourses?: number;
  registeredEvents?: number;
  trends?: {
    purchasedCoursesLastMonth: number;
    newSubscriptionCourses: number;
    eventsThisWeek: number;
  };
  onTabChange?: (tab: TabValue) => void;
}

export function DashboardSummary({
  purchasedCourses = 0,
  subscriptionCourses = 0,
  registeredEvents = 0,
  trends,
  onTabChange
}: DashboardSummaryProps) {
  // Generate trend messages based on actual data
  const getTrendMessage = (type: string, value: number) => {
    switch (type) {
      case 'purchased':
        return value > 0 ? `+${value} from last month` : 'No new purchases'
      case 'subscription':
        return value > 0 ? `${value} courses available` : 'No active subscription'
      case 'certificate':
        return value > 0 ? `${value} certificate courses this week` : 'certificate courses this week'
      case 'events':
        return value > 0 ? `${value} events this week` : 'No events this week'
      default:
        return 'No data available'
    }
  }

  const handleCardClick = (tab: TabValue) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  }

  const metrics = [
    {
      title: "Purchased Courses",
      value: purchasedCourses,
      icon: BookOpen,
      description: "Total courses purchased",
      trend: getTrendMessage('purchased', trends?.purchasedCoursesLastMonth || 0),
      hasPositiveTrend: (trends?.purchasedCoursesLastMonth || 0) > 0,
      tabValue: "purchased" as TabValue
    },
    {
      title: "Prime Courses",
      value: subscriptionCourses,
      icon: GraduationCap,
      description: "Active prime courses",
      trend: getTrendMessage('subscription', subscriptionCourses),
      hasPositiveTrend: subscriptionCourses > 0,
      tabValue: "subscription" as TabValue
    },
    {
      title: "Certification Courses",
      value: 0,
      icon: Users,
      description: "Active certification courses",
      trend: getTrendMessage('certificate', 0),
      hasPositiveTrend: 0 > 0,
      tabValue: "certificate" as TabValue // Since there's no certification tab, default to purchased
    },
    {
      title: "Registered Events",
      value: registeredEvents,
      icon: Calendar,
      description: "Upcoming events registered",
      trend: getTrendMessage('events', trends?.eventsThisWeek || 0),
      hasPositiveTrend: (trends?.eventsThisWeek || 0) > 0,
      tabValue: "event" as TabValue
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card
              key={metric.title}
              className="transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer border-border/50"
              onClick={() => handleCardClick(metric.tabValue)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                <div className="p-2 bg-brand-accent rounded-lg">
                  <Icon className="h-4 w-4 text-gray-700" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                  <div className={`flex items-center gap-1 text-xs ${metric.hasPositiveTrend ? 'text-secondary-button' : 'text-gray-500'}`}>
                    <TrendingUp className={`h-3 w-3 ${metric.hasPositiveTrend ? 'text-secondary-button' : 'text-gray-400'}`} />
                    <span className="font-medium">
                      {metric.hasPositiveTrend ? 'Growth' : 'Status'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                  <p className={`text-xs font-medium ${metric.hasPositiveTrend ? 'text-secondary-button/80' : 'text-gray-500/70'}`}>
                    {metric.trend}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}