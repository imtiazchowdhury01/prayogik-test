"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelRightClose } from "lucide-react";
import CoursesSidebar from "./CoursesSidebar";

interface SidebarSheetProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  categories: any[];
  toggleSidebarHandler: () => void;
}

const SidebarSheetComponent = ({
  showSidebar,
  setShowSidebar,
  categories,
  toggleSidebarHandler,
}: SidebarSheetProps) => {
  return (
    <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 lg:hidden py-2 px-1"
        >
          <PanelRightClose className="text-slate-600" size={18} />
          <span className="font-medium text-slate-600">ক্যাটাগরি সমূহ</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-96 p-0 overflow-y-auto">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left text-lg font-semibold">
            কোর্স ক্যাটাগরি
          </SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <CoursesSidebar
            toggleSidebar={toggleSidebarHandler}
            categories={categories}
            isMobile={true}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarSheetComponent;
