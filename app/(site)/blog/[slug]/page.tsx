import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import HeaderSection from "./_component/BlogHeader";
import { BlogContent } from "./_component/BlogContent";
import { RecentBlogs } from "./_component/RecentBlogs";
export default function BlogDetails() {
  return (
    <div className="flex flex-col overflow-hidden bg-background-gray">
      <div className="app-container">
        <div className="">
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
                    href="/courses"
                    className="text-sm font-medium underline sm:text-base text-fontcolor-title"
                  >
                    ব্লগ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#475569] text-sm sm:text-base font-medium">
                  UX পর্যালোচনা উপস্থাপনা
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <HeaderSection />
        <BlogContent />
      </div>
      <RecentBlogs />
    </div>
  );
}
