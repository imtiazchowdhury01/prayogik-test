import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const CoursesBreadcrumb = ({
  isCategoryPage = false,
}: {
  isCategoryPage?: boolean;
}) => {
  return (
    <div className="border-b border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-6 xl:px-6 2xl:px-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="text-sm font-medium underline  underline-offset-4 sm:text-base text-fontcolor-title hover:text-primary-brand"
                >
                  হোম
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/courses"
                  className="text-sm font-medium underline  underline-offset-4 sm:text-base text-fontcolor-title hover:text-primary-brand"
                >
                  কোর্স
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {isCategoryPage && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>ক্যাটাগরি</BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default CoursesBreadcrumb;
