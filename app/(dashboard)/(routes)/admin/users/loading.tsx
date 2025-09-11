import React from "react";
import Loader from "../../teacher/accounts/_components/Loader";
import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = () => {
  return (
    <div className="space-y-6 bg-white shadow-sm rounded-lg p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24" /> {/* "All Users" title */}
        <Skeleton className="h-10 w-24" /> {/* "Add User" button */}
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64" /> {/* Search input */}
        <Skeleton className="h-10 w-20" /> {/* Status filter */}
        <Skeleton className="h-10 w-20" /> {/* Admin filter */}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="border-b bg-muted/50 p-4">
          <div className="grid grid-cols-7 gap-4">
            <Skeleton className="h-4 w-12" /> {/* Name */}
            <Skeleton className="h-4 w-12" /> {/* Email */}
            <Skeleton className="h-4 w-16" /> {/* Gender */}
            <Skeleton className="h-4 w-24" /> {/* Teacher Status */}
            <Skeleton className="h-4 w-28" /> {/* Created Courses */}
            <Skeleton className="h-4 w-28" /> {/* Enrolled Courses */}
            <Skeleton className="h-4 w-24" /> {/* Subscription */}
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="p-4">
              <div className="grid grid-cols-7 gap-4 items-center">
                {/* Name column with avatar */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
                  <Skeleton className="h-4 w-20" /> {/* Name */}
                </div>
                {/* Email column */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" /> {/* Email */}
                  <Skeleton className="h-3 w-3 rounded-full" />{" "}
                  {/* Status dot */}
                </div>
                {/* Gender column */}
                <Skeleton className="h-4 w-12" />
                {/* Teacher Status column */}
                <Skeleton className="h-6 w-16 rounded-full" />{" "}
                {/* Status badge */}
                {/* Created Courses column */}
                <Skeleton className="h-4 w-4" />
                {/* Enrolled Courses column */}
                <Skeleton className="h-4 w-4" />
                {/* Subscription column */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-6 w-6" /> {/* Menu dots */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" /> {/* "0 of 186 row(s) selected" */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" /> {/* "Rows per page" */}
            <Skeleton className="h-8 w-16" /> {/* Dropdown */}
          </div>
          <Skeleton className="h-4 w-20" /> {/* "Page 1 of 19" */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8" /> {/* First page */}
            <Skeleton className="h-8 w-8" /> {/* Previous page */}
            <Skeleton className="h-8 w-8" /> {/* Next page */}
            <Skeleton className="h-8 w-8" /> {/* Last page */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
