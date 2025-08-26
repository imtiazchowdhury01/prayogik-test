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

export const BootcampBreadcrumb: React.FC = () => {
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
                    href="/bootcamp"
                    className="text-sm font-medium underline sm:text-base text-fontcolor-title"
                  >
                    বুটক্যাম্প
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-greyscale-500 text-sm sm:text-base font-medium">
                  ডিজিটাল মার্কেটিং বুটক্যাম্প
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </>
  );
};
