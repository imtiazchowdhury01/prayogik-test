// @ts-nocheck
"use client";

import {
  Award,
  BarChart,
  BookHeart,
  ChevronDown,
  CircleDollarSign,
  Cog,
  Compass,
  Contact,
  CreditCard,
  Layers,
  Layers2,
  Layout,
  LayoutList,
  List,
  Percent,
  SquareEqual,
  User,
  Users,
  Bell,
  Tags,
  Mailbox,
  Megaphone,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-item";
import { SidebarSubitem } from "./sidebar-subitem";
import { useEffect, useState } from "react";

const studentRoutes = [
  { icon: Layout, label: "Dashboard", href: "/dashboard", isParent: true },
  { icon: Compass, label: "Browse", href: "/search", isParent: true },
  { icon: User, label: "Profile", href: "/profile", isParent: true },
];

const onboardRoute = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/dashboard",
    isParent: true,
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
    isParent: true,
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
    isParent: true,
  },
  {
    icon: CreditCard,
    label: "Accounts",
    href: "/teacher/accounts",
    isParent: true,
  },
];

const adminRoute = [
  {
    icon: Users,
    label: "Users",
    href: "/admin/users",
    isParent: true,
  },
  {
    icon: Layers,
    label: "Courses",
    isParent: true,
    subroutes: [
      {
        icon: List,
        label: "Categories",
        href: "/admin/categories",
      },
      {
        icon: LayoutList,
        label: "All Courses",
        href: "/admin/courses",
      },
    ],
  },
  {
    icon: Contact,
    label: "Teachers",
    isParent: true,
    subroutes: [
      {
        icon: Award,
        label: "Ranks",
        href: "/admin/ranks",
      },
      {
        icon: LayoutList,
        label: "All Teachers",
        href: "/admin/teachers",
      },
    ],
  },
  {
    icon: BookHeart,
    label: "Subscription",
    isParent: true,
    subroutes: [
      {
        icon: Layers2,
        label: "Plans",
        href: "/admin/subscription-plans",
      },
      {
        icon: Percent,
        label: "Discounts",
        href: "/admin/manage/subscription-discounts",
      },
      {
        icon: Bell,
        label: "Subscribers",
        href: "/admin/subscribers",
      },
    ],
  },
  {
    icon: Layers,
    label: "Course Roadmap",
    href: "/admin/manage/course-roadmap",
  },
  {
    icon: CircleDollarSign,
    label: "Manual Payment",
    href: "/admin/manual-payments",
  },
  {
    icon: Cog,
    label: "Manage",
    isParent: true,
    subroutes: [
      {
        icon: SquareEqual,
        label: "Monthly Earnings",
        href: "/admin/manage/monthly-earnings",
      },
    ],
  },
  // {
  //   icon: Megaphone,
  //   label: "Marketing",
  //   isParent: true,
  //   subroutes: [
  //     {
  //       icon: Tags,
  //       label: "Tags",
  //       href: "/admin/manage/tags",
  //     },
  //     {
  //       icon: Mailbox,
  //       label: "NewsLetters",
  //       href: "/admin/manage/news-letters",
  //     },
  //   ],
  // },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [openItems, setOpenItems] = useState({});

  // Determine the user routes based on roles
  const isTeacherPage = pathname?.includes("/teacher");
  const isAdminPage = pathname?.includes("/admin");

  const routes = isAdminPage
    ? adminRoute
    : isTeacherPage
    ? teacherRoutes
    : studentRoutes;

  // Function to check if any subroute matches the current pathname
  const isSubrouteActive = (subroutes) => {
    if (!subroutes) return false;
    return subroutes.some((subroute) => pathname?.startsWith(subroute.href));
  };

  // Check if a subroute is the current active route
  const isRouteActive = (href) => {
    return pathname === href || pathname?.startsWith(href);
  };

  // Initialize open state based on active routes
  useEffect(() => {
    const initialOpenItems = {};
    routes.forEach((route) => {
      // Open the parent if any of its subroutes match the current path
      if (route.subroutes && isSubrouteActive(route.subroutes)) {
        initialOpenItems[route.label] = true;
      }
    });
    setOpenItems(initialOpenItems);
  }, [pathname, routes]);

  // Handle open state change
  const handleOpenChange = (label, isOpen) => {
    setOpenItems((prev) => ({
      ...prev,
      [label]: isOpen,
    }));
  };

  return (
    <div className="flex flex-col w-full">
      {routes.map((route, index) => (
        <div key={index} className="mb-3">
          {/* Check for subroutes to render the dropdown */}
          {route.subroutes ? (
            <Collapsible
              key={route.label}
              open={openItems[route.label]}
              onOpenChange={(isOpen) => handleOpenChange(route.label, isOpen)}
            >
              <CollapsibleTrigger className="w-full flex items-center gap-x-2 pl-6 py-2 text-sm text-slate-500 hover:text-slate-600 justify-between">
                <div className="flex items-center gap-x-2">
                  <route.icon className="text-slate-500" size="20" />
                  <span
                    className={`${route.isParent ? "text-base" : "text-sm"} ${
                      isSubrouteActive(route.subroutes)
                        ? "font-medium text-slate-700"
                        : ""
                    }`}
                  >
                    {route.label}
                  </span>
                </div>
                <div className="ms-2 size-5 mr-2 overflow-hidden transition-transform duration-300">
                  <ChevronDown
                    className={`transform transition-transform duration-300 ease-in-out ${
                      openItems[route.label] ||
                      isSubrouteActive(route.subroutes)
                        ? "rotate-0"
                        : "-rotate-90"
                    }`}
                    size={20}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-4">
                  {route.subroutes.map((subroute, subIndex) => (
                    <SidebarSubitem
                      key={subIndex}
                      icon={subroute.icon}
                      label={subroute.label}
                      href={subroute.href}
                      active={isRouteActive(subroute.href)}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
              active={isRouteActive(route.href)}
            />
          )}
        </div>
      ))}
    </div>
  );
};
