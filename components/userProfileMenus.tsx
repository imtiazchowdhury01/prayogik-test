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
import Link from "next/link";

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
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function UserProfileMenus({ session, subscription, pathName }) {
  const router = useRouter();
  const displayName = session?.user?.name;
  const isSubscribed = subscription?.status === "ACTIVE";


  const subscriptionName =
    subscription?.subscriptionPlan?.name || "সাবস্ক্রিপশন";

  // Prevent menu from closing when clicking on text elements
  const handleTextClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle navigation and close menu
  const handleNavigation = (path) => {
    // Menu will close automatically due to onSelect
    router.push(path);
  };

  return (
    <Menubar
      className={`${
        pathName === "/offer" ? "bg-transparent text-white" : ""
      } border-none`}
    >
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
              className="text-xs font-medium select-text cursor-text break-all"
              onClick={handleTextClick}
            >
              {session?.user?.email}
            </p>
          </MenubarItem>

          <MenubarSeparator />

          {/* Subscription Item - Menu closes on click */}
          <MenubarItem
            className={cn(
              "space-x-1 flex items-start group"
              // isSubscribed
              //   ? "cursor-not-allowed pointer-events-none"
              //   : "cursor-pointer hover:bg-muted"
            )}
            onSelect={() => {
              if (isSubscribed) {
                handleNavigation("/prime");
              }
            }}
            // tabIndex={isSubscribed ? -1 : 0}
            // aria-disabled={isSubscribed}
          >
            <div className="w-full p-0">
              <div className="space-y-1">
                <div className="flex gap-1">
                  <ShieldEllipsis size={16} className="text-[#408B85]" />
                  <p
                    className={cn(
                      !isSubscribed && "group-hover:text-primary-brand",
                      "select-text"
                    )}
                  >
                    {`প্রাইম - ${subscriptionName} `}
                  </p>
                </div>

                {isSubscribed ? (
                  <>
                    <Badge
                      className={`ml-4 ${
                        subscription?.status === "EXPIRED"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-[#408B85] hover:bg-[#408B85]"
                      }  `}
                    >
                      {subscription?.status === "EXPIRED" ? "মেয়াদ শেষ" : "সাবস্ক্রাইবড"}
                    </Badge>

                    {subscription?.expiresAt ? (
                      <p
                        className="text-xs font-normal text-gray-500 select-text pl-4"
                        onClick={handleTextClick}
                      >
                        *মেয়াদ শেষ{" "}
                        {formatDateToBangla(new Date(subscription?.expiresAt))}
                      </p>
                    ) : null}
                    <Link href="/prime">
                      <span className="bg-transparent text-brand underline text-xs ml-4 cursor-pointer mt-1">
                        প্ল্যান আপগ্রেড করুন
                      </span>
                    </Link>
                  </>
                ) : (
                  <div>
                    <p
                      className="text-xs font-normal text-gray-500 select-text"
                      onClick={handleTextClick}
                    >
                      {subscription?.expiresAt
                        ? `*মেয়াদ শেষ ${formatDateToBangla(
                            new Date(subscription?.expiresAt)
                          )}`
                        : "প্রায়োগিকে সাবস্ক্রাইব করে আনলিমিটেড ফ্রি কোর্স এক্সেস করুন"}
                    </p>
                    <Link href="/prime">
                      <span className="bg-transparent text-brand underline text-xs ml-1 mt-1">
                        প্ল্যান আপগ্রেড করুন
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </MenubarItem>

          <MenubarSeparator />

          {/* Dashboard Item - Now properly handles navigation */}
          <MenubarItem
            className="cursor-pointer flex items-center gap-2 py-2"
            onSelect={() => handleNavigation("/dashboard")}
          >
            <LayoutDashboard size={16} className="text-[#408B85]" />
            <span>ড্যাশবোর্ড</span>
          </MenubarItem>

          {/* Profile Item - Now properly handles navigation */}
          <MenubarItem
            className="cursor-pointer flex items-center gap-2 py-2"
            onSelect={() => handleNavigation("/profile")}
          >
            <User size={16} className="text-[#408B85]" />
            <span>প্রোফাইল</span>
          </MenubarItem>

          <MenubarSeparator />

          {/* Logout - Keep as is since it's not navigation */}
          <MenubarItem
            className="cursor-pointer flex items-center gap-2 py-2"
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
