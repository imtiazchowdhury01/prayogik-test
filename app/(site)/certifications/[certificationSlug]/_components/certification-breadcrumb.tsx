import {
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Breadcrumb,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

const CertificationBreadCrumb = ({ title }: { title: any }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/"
              className="text-sm font-medium underline underline-offset-4 sm:text-base text-fontcolor-title hover:text-primary-brand"
            >
              হোম
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Link
            href="/certifications"
            className="text-sm font-medium underline underline-offset-4 sm:text-base text-fontcolor-title hover:text-primary-brand"
          >
            সার্টিফিকেশন কোর্স
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{title}</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CertificationBreadCrumb;
