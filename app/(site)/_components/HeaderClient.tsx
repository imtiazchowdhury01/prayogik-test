// @ts-nocheck
"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import React, { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { slugToReadable } from "@/lib/generateSlug";
import { SubscriptionCheck } from "./home/SubscriptionCheck";
import UserProfileMenus from "@/components/userProfileMenus";
import PurchasePlanButton from "../prime/_components/PurchasePlanButton";
import { trialPlanStaticData } from "@/constants/trial-plan";
import TrialCheckoutButton from "@/components/trial-checkout-button";

interface ClientHeaderProps {
  navigation: { name: string; href: string }[];
}

export default function ClientHeader({ navigation }: ClientHeaderProps) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const searchParamValue = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(
    slugToReadable(searchParamValue)
  );
  const router = useRouter();

  const searchHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (searchTerm.trim()) {
      const searchQuery = encodeURIComponent(searchTerm.trim());
      router.push(`/courses/search/${searchQuery}`);
      setSearchTerm("");
    }
  };

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Subscription Check - only renders if session exists */}
      {session && <SubscriptionCheck />}

      {/* Desktop Search and User Menu */}
      <div className="flex items-center justify-end gap-x-0">
        {/* Search Form */}
        {/* <form
          onSubmit={searchHandler}
          className="border-[#E2E8F0] border-[1px] rounded-md px-3 w-[240px] py-3 flex items-center space-x-1"
        >
          <CiSearch className="text-slate-600 text-xl" />
          <input
            type="text"
            placeholder="কোর্স সার্চ করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-0 text-sm text-slate-600 bg-transparent border-none outline-none focus-visible:ring-0"
          />
        </form> */}
        {/* Search Form */}
        <div className="flex items-center justify-center gap-2">
          <div className="relative">
            {!isSearchExpanded ? (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="p-2 border-[#E2E8F0] border-[1px] rounded-md  hover:bg-gray-100 transition-colors"
              >
                <CiSearch className="text-slate-600 text-xl" />
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  searchHandler(e);
                  setIsSearchExpanded(false);
                }}
                className="absolute right-0 z-50 border-[#E2E8F0] border-[1px] rounded-md px-3 w-[240px] py-3 flex items-center space-x-1 bg-white shadow-lg -top-6"
              >
                <CiSearch className="text-slate-600 text-xl" />
                <input
                  type="text"
                  placeholder="কোর্স সার্চ করুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 p-0 text-sm text-slate-600 bg-transparent border-none outline-none focus-visible:ring-0"
                  autoFocus
                  onBlur={() => {
                    // Delay to allow form submission if clicking search icon
                    setTimeout(() => {
                      if (!searchTerm.trim()) {
                        setIsSearchExpanded(false);
                      }
                    }, 100);
                  }}
                />
              </form>
            )}
          </div>
          {/* User Authentication */}
          <div className="hidden xl:flex items-center">
            {status === "authenticated" && session?.user?.id ? (
              <>
                <UserProfileMenus session={session} pathName="" />
              </>
            ) : (
              <>
                <Link href="/signin" className="px-5">
                  লগইন
                </Link>

                <TrialCheckoutButton
                  size={"lg"}
                  variant={"primary"}
                  className="bg-brand hover:bg-teal-700 text-white block rounded-md transition-all duration-300 shadow-sm font-medium text-sm"
                >
                  <span>প্রাইম লাইট</span>
                </TrialCheckoutButton>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center space-x-2 xl:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center text-slate rounded-md"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Menu Dialog */}
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
            {/* Mobile Search */}
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

              {/* Mobile Auth Buttons */}
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}
