// @ts-nocheck
"use client";

import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface SidebarSubitemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isParent?: boolean;
}

export const SidebarSubitem = ({
  icon: Icon,
  label,
  href,
  isParent,
}: SidebarSubitemProps) => {
  const pathname = usePathname();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "w-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-primary-700 rounded-md hover:text-primary-700 bg-brand/10 hover:bg-[#F1F5F9]"
      )}
    >
      <div className={`flex items-center gap-x-2 py-2`}>
        <Icon
          size={isParent ? 16 : 14}
          className={cn("text-slate-500", isActive && "text-primary-700")}
        />
        <span className={`${isParent ? "text-base" : "text-sm"}`}>{label}</span>
      </div>
    </Link>
  );
};
