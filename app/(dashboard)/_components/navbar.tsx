// @ts-nocheck
import { NavbarRoutes } from "@/components/navbar-routes";

import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = ({ session, status }) => {
  return (
    <div className="p-4 px-6 h-full flex items-center bg-white border-b border-gray-100">
      <MobileSidebar />
      <NavbarRoutes session={session} status={status} />
    </div>
  );
};
