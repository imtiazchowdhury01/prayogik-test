import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Zap, Award, CrownIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  revenue: number;
  type: "course" | "subscription" | "event" | "certification";
}

const iconMap = {
  course: BookOpen,
  subscription: CrownIcon,
  event: Zap,
  certification: Award,
};

const colorMap = {
  course: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
    icon: "text-blue-600 dark:text-blue-400",
    accent: "bg-blue-200 dark:bg-blue-800",
  },
  subscription: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
    icon: "text-purple-600 dark:text-purple-400",
    accent: "bg-purple-200 dark:bg-purple-800",
  },
  event: {
    bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
    icon: "text-orange-600 dark:text-orange-400",
    accent: "bg-orange-200 dark:bg-orange-800",
  },
  certification: {
    bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    icon: "text-green-600 dark:text-green-400",
    accent: "bg-green-200 dark:bg-green-800",
  },
};

export function SummaryCard({ title, value, revenue, type }: SummaryCardProps) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className={`p-6 ${colors.bg}`}>
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <p className="text-base font-medium text-muted-foreground">{title}</p>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">{value}</p>
              <p className="text-sm font-medium text-muted-foreground">
                ৳
                {revenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${colors.accent}`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
