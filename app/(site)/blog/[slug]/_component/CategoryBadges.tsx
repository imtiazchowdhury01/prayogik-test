import React from "react";

export function CategoryBadges() {
  const categories = [
    { name: "Product", className: "bg-sky-50 border-[#C9EBF4] text-slate-500" },
    { name: "Tools", className: "bg-orange-50 border-[#FBE6C4]" },
    { name: "SaaS", className: "bg-orange-50 border-[#FBE6C4]" },
  ];

  return (
    <div className="flex gap-2 items-start self-stretch my-auto text-sm font-medium leading-none text-center text-yellow-700 whitespace-nowrap">
      {categories.map((category) => (
        <span
          className={`self-stretch px-4 py-1 rounded-full border border-solid ${category?.className}`}
        >
          {category?.name}
        </span>
      ))}
    </div>
  );
}
