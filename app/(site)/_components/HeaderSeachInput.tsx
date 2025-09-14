"use client";
import UserProfileMenus from "@/components/userProfileMenus";
import Link from "next/link";

import React from "react";
import { CiSearch } from "react-icons/ci";

const HeaderSeachInput = ({
  setMobileMenuOpen,
  session,
  path,
  searchHandler,
  setSearchTerm,
  searchTerm,
}: any) => {
  return (
    <div className="items-center justify-end hidden xl:flex gap-x-3">
      <form
        onSubmit={searchHandler}
        className={`${
          path === "/offer" ? "border-gray-400/85 hidden" : "border-[#E2E8F0]"
        } border-[1px] rounded-md px-3 w-[240px] py-3 flex items-center space-x-1`}
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
          <UserProfileMenus session={session} pathName={path} />
        </>
      ) : (
        <>
          <Link
            href="/signin"
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
  );
};

export default HeaderSeachInput;
