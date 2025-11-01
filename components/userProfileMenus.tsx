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
  LayoutDashboard,
  LogOut,
  ShieldEllipsis,
  User,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { formatDateToBangla } from "@/lib/utils/stringUtils";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/query-keys";
import { clientSidefetchUserSubscription } from "@/lib/utils/openai/client/user";

export default function UserProfileMenus({ session, pathName }: any) {
  const { data: subscription } = useQuery<any>({
    queryKey: [QueryKeys.USER_SUBSCRIPTION],
    queryFn: clientSidefetchUserSubscription,
    staleTime: 5 * 60 * 1000,
    enabled: !!session,
  });

  const router = useRouter();

  // Function to format display name based on word count
  const formatDisplayName = (name: string) => {
    if (!name || typeof name !== "string") return "";

    const words = name.trim().split(/\s+/); // Split by whitespace and remove empty strings

    if (words.length > 2) {
      // More than 2 words: show first 2 words
      return words.slice(0, 2).join(" ");
    } else {
      // 1 or 2 words: show all words
      return words.join(" ");
    }
  };

  // Use the formatter function for display name
  const displayName = formatDisplayName(session?.user?.name);
  const fullName = session?.user?.name; // Keep full name for avatar fallback

  // console.log("subscription result:", subscription);
  const isSubscribed = subscription?.status === "ACTIVE";
  const isTrial = subscription?.subscriptionPlan?.isTrial;
  const isExpired = subscription?.status === "EXPIRED";
  const subscriptionName =
    subscription?.subscriptionPlan?.name || "সাবস্ক্রিপশন";

  // console.log("subscription result:", session);

  // Prevent menu from closing when clicking on text elements
  const handleTextClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle navigation and close menu
  const handleNavigation = (path: any) => {
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
              {fullName?.slice(0, 1)?.toUpperCase()}
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
            className={cn("space-x-1 flex items-start group")}
            onSelect={() => {
              if (isSubscribed) {
                handleNavigation("/prime");
              }
            }}
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
                    {`${subscriptionName} `}
                  </p>
                </div>

                {/* Show badge for both active and expired subscriptions */}
                {(isSubscribed || isExpired) && (
                  <>
                    <Badge
                      className={`ml-4 ${
                        isExpired
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-[#408B85] hover:bg-[#408B85]"
                      }`}
                    >
                      {isExpired ? "মেয়াদ শেষ" : "সাবস্ক্রাইবড"}
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

                    {/* Show upgrade link for trial OR renew link for non-trial expired */}
                    {(() => {
                      const label = isTrial
                        ? "প্ল্যান আপগ্রেড করুন"
                        : isExpired &&
                          subscription?.subscriptionPlan?.type === "YEARLY"
                        ? "রিনিউ করুন"
                        : "";

                      return label ? (
                        <Link href="/prime">
                          <span className="bg-transparent text-brand underline text-xs ml-4 cursor-pointer mt-1">
                            {label}
                          </span>
                        </Link>
                      ) : null;
                    })()}
                  </>
                )}

                {/* Show default message when no subscription */}
                {!isSubscribed && !isExpired && (
                  <div>
                    <p
                      className="text-xs font-normal text-gray-500 select-text"
                      onClick={handleTextClick}
                    >
                      প্রায়োগিকে সাবস্ক্রাইব করে আনলিমিটেড ফ্রি কোর্স এক্সেস
                      করুন
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
            <span>
              প্রোফাইল{" "}
              {`(${
                session?.user?.info?.isSuperAdmin
                  ? "সুপার অ্যাডমিন"
                  : session.user.role === "ADMIN"
                  ? "অ্যাডমিন"
                  : session.user.role === "TEACHER"
                  ? "প্রশিক্ষক"
                  : "শিক্ষার্থী"
              })`}
            </span>
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
