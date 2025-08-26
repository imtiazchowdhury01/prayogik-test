

import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex overflow-hidden flex-wrap gap-2 items-center mb-2 w-full font-medium text-slate-900">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <img src="/icon/arrow-right.png" />
          )}
          {item.href ? (
            <a
              href={item.href}
              className="underline cursor-pointer text-slate-900"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-slate-600">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
