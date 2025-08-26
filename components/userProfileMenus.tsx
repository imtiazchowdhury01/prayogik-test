// @ts-nocheck
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  CirclePower,
  CircleUser,
  LayoutDashboard,
  LogOut,
  Menu,
  Power,
  ShieldEllipsis,
  User,
} from "lucide-react";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { formatDateToBangla } from "@/lib/utils/stringUtils";

export default function UserProfileMenus({ session, subscription }) {
  const router = useRouter();
  const displayName = session?.user?.name;
  const isSubscribed =
    session?.user?.info?.studentProfile?.subscription?.status === "ACTIVE";
  const subscriptionName = subscription?.name || "প্রায়োগিক প্রাইম";
  const userSubscription = session?.user?.info?.studentProfile?.subscription;
  // Prevent menu from closing when clicking on text elements
  const handleTextClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Menubar className="border-none">
      <MenubarMenu>
        <MenubarTrigger className="gap-1.5 text-base cursor-pointer ring-0 hover:bg-transparent pr-0">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={
                session?.user?.info?.avatarUrl || "/profile/blank-profile.webp"
              }
              alt={displayName}
            />

            <AvatarFallback>
              {displayName?.slice(0, 1)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <p className="max-md:hidden">{displayName}</p>
          <ChevronDown className="w-5 h-5" />
        </MenubarTrigger>
        <MenubarContent className="mr-2 max-w-[224px]">
          <MenubarItem
            className="flex flex-col items-start space-y-1 focus:bg-transparent"
            onSelect={(e) => e.preventDefault()}
          >
            <p className="text-[13px] text-gray-600" onClick={handleTextClick}>
              সাইন ইন করেছেন
            </p>
            <p
              className="text-xs font-medium select-text cursor-text"
              onClick={handleTextClick}
            >
              {session?.user?.email}
            </p>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            className={cn(
              "space-x-1 flex items-start group focus:bg-transparent",
              !isSubscribed && "cursor-pointer"
            )}
            onSelect={(e) => {
              if (!isSubscribed) {
                router.push("/prime");
              } else {
                router.push("/dashboard");
              }
            }}
          >
            <div className="space-y-1" onClick={handleTextClick}>
              <div className="flex gap-1">
                <ShieldEllipsis size={16} className="text-[#408B85]" />
                <p
                  className={cn(
                    !isSubscribed && "group-hover:text-primary-brand",
                    "select-text"
                  )}
                >
                  {subscriptionName}
                </p>
              </div>

              {isSubscribed ? (
                <>
                  <Badge className="ml-4 bg-[#408B85] hover:bg-[#408B85]">
                    সাবস্ক্রাইবড
                  </Badge>
                  {userSubscription?.expiresAt ? (
                    <p className="text-[.7rem] font-normal text-gray-500 select-text pl-4">
                      *মেয়াদ শেষ{" "}
                      {formatDateToBangla(
                        new Date(userSubscription?.expiresAt)
                      )}
                    </p>
                  ) : null}
                </>
              ) : (
                <div>
                  <p className="text-xs font-normal text-gray-500 select-text">
                    প্রায়োগিক প্রাইম সাবস্ক্রাইব করে আনলিমিটেড ফ্রি কোর্স
                    এক্সেস করুন
                  </p>
                </div>
              )}
            </div>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            className="cursor-pointer p-2 flex items-center gap-2"
            onSelect={() => router.push("/dashboard")}
          >
            <LayoutDashboard size={16} className="text-[#408B85]" />
            <span>ড্যাশবোর্ড</span>
          </MenubarItem>
          <MenubarItem
            className="cursor-pointer p-2 flex items-center gap-2"
            onSelect={() => router.push("/profile")}
          >
            <User size={16} className="text-[#408B85]" />
            <span>প্রোফাইল</span>
          </MenubarItem>

          <MenubarSeparator />
          <MenubarItem
            className="cursor-pointer p-2 flex items-center gap-2"
            onSelect={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut size={16} className="text-red-400" />
            <span>লগআউট</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
