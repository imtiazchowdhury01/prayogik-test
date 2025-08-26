"use client";
import { Button } from "@/components/ui/button";
import { FaAngleRight, FaAngleUp } from "react-icons/fa6";

// Client component for the button interaction
export function ShowAllButton({ showAll }: { showAll: boolean }) {
  return (
    <Button
      onClick={() => {
        // Use Next.js App Router navigation
        window.location.href = showAll ? "/courses" : "/courses?showAll=true";
      }}
      className="items-center px-4 py-3 space-x-2 text-base font-semibold text-center text-white transition-all duration-300 rounded-lg cursor-pointer md:flex hover:bg-primary-700 bg-primary-brand"
    >
      {showAll ? (
        <>
          <span>কম দেখুন</span> <FaAngleUp />
        </>
      ) : (
        <>
          <span>সবগুলো দেখুন</span> <FaAngleRight />
        </>
      )}
    </Button>
  );
}
