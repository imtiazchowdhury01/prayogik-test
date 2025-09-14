"use client"
import { Bars3Icon } from "@heroicons/react/24/outline";
import React from "react";

const MobileMenu = ({setMobileMenuOpen, path}:any) => {
  return (
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

  );
};

export default MobileMenu;
