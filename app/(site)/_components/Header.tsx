//@ts-nocheck

"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { generateSlug, slugToReadable } from "@/lib/generateSlug";
import { SubscriptionCheck } from "./home/SubscriptionCheck";
import OfferHeader from "./OfferHeader";
import { clientApi } from "@/lib/utils/openai/client";
import UserProfileMenus from "@/components/userProfileMenus";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: "কোর্স সমূহ", href: "/courses" },
  { name: "প্রাইম", href: "/prime" },
  { name: "কোর্স রোডম্যাপ", href: "/course-roadmap" },
  { name: "শেখাতে চাই", href: "/become-a-teacher" },
  // { name: "টেস্টিমোনিয়াল", href: "/testimonial" },
  // { name: "যোগাযোগ", href: "/contact" },
  // { name: "ব্লগ", href: "/blog" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const searchParams = useSearchParams();
  const searchParamValue = searchParams.get("search") || "";

  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await clientApi.getSession();
      if (response.status === 200) {
        const sub =
          response.body?.user?.info?.studentProfile?.subscription || null;
        setSubscription(sub);
      }
    })();
  }, []);

  
  const [searchTerm, setSearchTerm] = useState<string>(
    slugToReadable(searchParamValue)
  );

  const path = usePathname();
  const router = useRouter();

  const { data: session, status } = useSession();

  const searchHandler = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (searchTerm.trim()) {
      const searchQuery = encodeURIComponent(searchTerm.trim());
      router.push(`/courses/search/${searchQuery}`);
      setSearchTerm("");
    }
  };

  return (
    <>
      {/* {(path === "/home" || path === "/prayogik-home") && <OfferHeader />} */}
      <header
        className={`${
          path === "/offer"
            ? "fixed bg-brand backdrop-blur-xl border-b border-[#4AAFA6]"
            : "sticky bg-white"
        } top-0 z-50 w-full shadow-sm  `}
      >
        {session && <SubscriptionCheck />}

        <nav
          className="flex items-center justify-between h-[72px] app-container gap-x-6 "
          aria-label="Global"
        >
          <div className="flex items-center space-x-12">
            <Link href="/" className="relative">
              {/* Main Logo */}
              <Image
                src={
                  path === "/offer"
                    ? "/Prayogik-nav-logo-white.svg"
                    : "/prayogik-nav-logo.svg"
                }
                width={900}
                height={900}
                className="w-[152px] h-[80px]"
                alt="prayogik logo"
                priority
              />
              {/* Beta Tag */}
              <Image
                src="/beta.svg"
                width={50}
                height={50}
                quality={75}
                alt="beta"
                className="absolute top-[25px] -right-[43px] z-10 w-[42px] h-[20px]"
                loading="eager"
              />
            </Link>
            {/* menu items */}
            <div className="hidden mr-4 xl:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  id={item.href}
                  prefetch={true}
                  className={`text-base font-medium px-4 py-2 rounded-md leading-6 ${
                    path === "/offer"
                      ? "text-white hover:bg-teal-500/25"
                      : "text-fontcolor-title hover:bg-[#F1F5F9]"
                  } transition-all duration-300`}
                >
                  {item.name}{" "}
                  <span className="bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] bg-clip-text text-transparent">
                    {item.href === "/prime" && "*"}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="items-center justify-end hidden xl:flex gap-x-3">
            <form
              onSubmit={searchHandler}
              className={`${
                path === "/offer"
                  ? "border-gray-400/85 hidden"
                  : "border-[#E2E8F0]"
              } border-[1px] rounded-md px-3 w-[280px] py-3 flex items-center space-x-1`}
            >
              <CiSearch
                className={`${
                  path === "/offer" ? "text-white" : "text-slate-600"
                } text-xl`}
              />
              <input
                type="text"
                placeholder="কোর্স সার্চ করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`flex-1 p-0 text-sm ${
                  path === "/offer"
                    ? "placeholder:text-white caret-white text-white"
                    : "text-slate-600"
                } bg-transparent border-none outline-none focus-visible:ring-0`}
              />
            </form>

            {status === "authenticated" && session?.user?.id ? (
              <>
                <UserProfileMenus
                  session={session}
                  subscription={subscription}
                  pathName={path}
                />
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  // className="block rounded-md px-5 py-3 transition-all duration-300 font-medium text-sm"
                  className={` ${
                    path === "/offer"
                      ? " bg-white "
                      : "bg-brand hover:bg-teal-700 text-white"
                  }  block rounded-md px-5 py-3 transition-all duration-300   shadow-sm font-medium text-sm`}
                >
                  লগইন
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2 xl:hidden">
            <button
              type="button"
              className={`inline-flex items-center justify-center ${
                path === "/offer" ? "text-white" : "text-slate"
              } rounded-md`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </nav>

        {/* mobile menu */}
        <Dialog
          className="block overflow-hidden xl:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed z-10 inset-10" />
          <DialogPanel className="fixed inset-y-0 right-0 z-[100] w-full py-4 pl-3 overflow-y-auto bg-primary-900">
            <div className="flex items-center justify-between gap-x-6">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">প্রায়োগিক</span>
                <Image
                  src="/logo-light.svg"
                  width={100}
                  height={100}
                  className="h-auto w-[170px]"
                  alt="prayogik logo"
                  priority
                />
              </Link>
              <Button
                className="text-white bg-transparent rounded-md hover:bg-transparent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              </Button>
            </div>
            <div className="flow-root pr-4 mt-6">
              <form
                onSubmit={searchHandler}
                className="border-greyscale-600 border-[1px] mb-4 rounded-md px-3 w-full py-3 flex items-center space-x-1"
              >
                <input
                  type="text"
                  placeholder="কোর্স সার্চ করুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 p-0 text-sm text-white bg-transparent border-none outline-none focus-visible:ring-0"
                />
                <CiSearch className="text-xl text-white" />
              </form>
              <div className="-my-6">
                <div className="py-6 space-y-1">
                  {navigation.map((item) => (
                    <Button
                      key={item.name}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push(item.href);
                      }}
                      className="bg-transparent hover:bg-transparent block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-white transition-all duration-300 rounded-lg hover:opacity-70"
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>

                <div className="flex flex-col items-start xl:hidden gap-y-4">
                  {status === "authenticated" && session?.user?.id ? (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block px-5 py-3 text-sm font-medium text-white transition-all duration-300 rounded-md shadow-sm bg-primary-brand hover:bg-primary-700"
                      >
                        লগআউট
                      </button>
                      <Link
                        href="/dashboard"
                        className="block px-5 py-3 text-sm font-medium text-white transition-all duration-300 rounded-md shadow-sm bg-primary-brand hover:bg-primary-700"
                      >
                        ড্যাশবোর্ড
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link
                        href="/signin"
                        className="block px-5 py-3 text-sm font-medium text-white transition-all duration-300 rounded-md shadow-sm bg-primary-brand hover:bg-primary-700"
                      >
                        লগইন
                      </Link>
                      {/* <Link
                        href="/signup"
                        className="block px-5 py-3 text-sm font-medium text-white transition-all duration-300 rounded-md shadow-sm bg-primary-brand hover:bg-primary-700"
                      >
                        সাইন আপ
                      </Link> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </>
  );
}
