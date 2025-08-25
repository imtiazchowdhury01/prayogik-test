// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Link href={`${process.env.NEXT_PUBLIC_APP_URL}` || "#"}>
          <span className="sr-only">প্রায়োগিক</span>
          <Image
            src="/prayogik-nav-logo.svg"
            width={130}
            height={130}
            className="h-auto w-[170px]"
            alt="prayogik logo"
            priority
          />
        </Link>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
