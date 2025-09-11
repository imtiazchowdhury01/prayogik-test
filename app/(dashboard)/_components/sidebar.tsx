// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-full flex flex-col overflow-y-auto bg-white">
      <div className="flex flex-col w-full shadow-sm h-full">
        <div className="p-4 px-6 border-b border-gray-100 ">
          <Link href={`${process.env.NEXT_PUBLIC_APP_URL}` || "#"}>
            <span className="sr-only">প্রায়োগিক</span>
            <Image
              src="/prayogik-nav-logo.svg"
              width={130}
              height={130}
              className="h-auto w-[160px]"
              alt="prayogik logo"
              priority
            />
          </Link>
        </div>
        <div className="p-6">
          <SidebarRoutes />
        </div>
      </div>
    </div>
  );
};
