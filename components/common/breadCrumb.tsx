// @ts-nocheck
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadCrumb({ name, title, url }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-yellow-400 hover:text-yellow-500 font-semibold text-sm"
            href={url}
          >
            {name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-gray-100" />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-yellow-400 hover:text-yellow-500 font-semibold text-sm">
            {title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
