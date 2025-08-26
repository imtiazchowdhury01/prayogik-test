import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
export const WorkshopBreadcrumb: React.FC = () => {
  return (
    <>
      <div className=" border-b border-solid border-b-[color:var(--Greyscale-200,#e2e8f0)]">
        <div className="app-container">
          <Breadcrumb className="py-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/courses"
                    className="text-sm font-medium underline sm:text-base text-fontcolor-title"
                  >
                    হোম
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/workshop"
                    className="text-sm font-medium underline sm:text-base text-fontcolor-title"
                  >
                    ওয়ার্কসপ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-greyscale-500 text-sm sm:text-base font-medium">
                  ডিজিটাল মার্কেটিং ওয়ার্কসপ
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </>
  );
};
