// "use client";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

// const FILTER_TYPES = ["recent", "prime"] as const;
// // const FILTER_TYPES = ["recent", "older", "prime"] as const;
// type FilterType = (typeof FILTER_TYPES)[number];

// const FILTER_OPTIONS: Record<FilterType, { label: string }> = {
//   recent: { label: "সাম্প্রতিক" },
//   // older: { label: "পুরাতন" },
//   prime: { label: "প্রাইম" },
// };

// // Component 1: For general filter pages (/courses/category/recent, /courses/category/older, etc.)
// // Always routes to /courses/category/{newFilter} (replaces current filter)
// export function GeneralFilterSelect() {
//   const pathname = usePathname();
//   const router = useRouter();

//   // Extract current filter from URL
//   const pathParts = pathname.split("/").filter(Boolean);
//   const currentFilter = pathParts.length === 3 && pathParts[2] && FILTER_TYPES.includes(pathParts[2] as FilterType)
//     ? (pathParts[2] as FilterType)
//     : undefined;

//   const handleValueChange = (value: FilterType) => {
//     router.push(`/courses/category/${value}`);
//   };

//   return (
//     <Select
//       value={currentFilter || ""}
//       onValueChange={handleValueChange}
//     >
//       <SelectTrigger className="w-[140px] sm:w-[120px] bg-white rounded-3xl focus:ring-0 focus:ring-offset-0 shadow-custom p-3">
//         <SelectValue placeholder="ফিল্টার করুন" className="font-secondary" />
//       </SelectTrigger>
//       <SelectContent className="bg-white">
//         {Object.entries(FILTER_OPTIONS).map(([value, { label }]) => {
//           const isActive = currentFilter === value;
//           return (
//             <SelectItem
//               key={value}
//               value={value}
//               className={`font-secondary ${isActive ? "text-brand" : ""}`}
//             >
//               {label}
//             </SelectItem>
//           );
//         })}
//       </SelectContent>
//     </Select>
//   );
// }

// // Component 2: For category-specific pages (with or without existing filter)
// // Always routes to /courses/category/{categorySlug}/{newFilter}
// interface CategoryFilterSelectProps {
//   categorySlug: string;
// }

// export function CategoryFilterSelect({ categorySlug }: CategoryFilterSelectProps) {
//   const pathname = usePathname();
//   const router = useRouter();

//   // Extract current filter from URL (should be the last segment if it's a filter)
//   const pathParts = pathname.split("/").filter(Boolean);
//   const lastSegment = pathParts[pathParts.length - 1];
//   const currentFilter = FILTER_TYPES.includes(lastSegment as FilterType)
//     ? (lastSegment as FilterType)
//     : undefined;

//   const handleValueChange = (value: FilterType) => {
//     router.push(`/courses/category/${categorySlug}/${value}`);
//   };

//   return (
//     <Select
//       value={currentFilter || ""}
//       onValueChange={handleValueChange}
//     >
//       <SelectTrigger className="w-[140px] sm:w-[120px] bg-white rounded-3xl focus:ring-0 focus:ring-offset-0 shadow-custom p-3">
//         <SelectValue placeholder="ফিল্টার করুন" className="font-secondary" />
//       </SelectTrigger>
//       <SelectContent className="bg-white">
//         {Object.entries(FILTER_OPTIONS).map(([value, { label }]) => {
//           const isActive = currentFilter === value;
//           return (
//             <SelectItem
//               key={value}
//               value={value}
//               className={`font-secondary ${isActive ? "text-brand" : ""}`}
//             >
//               {label}
//             </SelectItem>
//           );
//         })}
//       </SelectContent>
//     </Select>
//   );
// }

// ----------------------------------------------------
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

const FILTER_TYPES = ["recent", "prime"] as const;
// const FILTER_TYPES = ["recent", "older", "prime"] as const;
type FilterType = (typeof FILTER_TYPES)[number];

const FILTER_OPTIONS: Record<FilterType, { label: string }> = {
  recent: { label: "সাম্প্রতিক" },
  // older: { label: "পুরাতন" },
  prime: { label: "প্রাইম" },
};

// Custom SelectItem that wraps Link
interface CustomSelectItemProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}

function CustomSelectItem({ href, children, isActive }: CustomSelectItemProps) {
  return (
    <Link
      href={href}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-secondary ${
        isActive ? "text-brand" : ""
      }`}
    >
      {children}
    </Link>
  );
}

// Component 1: For general filter pages (/courses/category/recent, /courses/category/older, etc.)
// Always routes to /courses/category/{newFilter} (replaces current filter)
export function GeneralFilterSelect() {
  const pathname = usePathname();

  // Extract current filter from URL
  const pathParts = pathname.split("/").filter(Boolean);
  const currentFilter =
    pathParts.length === 3 &&
    pathParts[2] &&
    FILTER_TYPES.includes(pathParts[2] as FilterType)
      ? (pathParts[2] as FilterType)
      : undefined;

  return (
    <Select value={currentFilter ? FILTER_OPTIONS[currentFilter].label : "ফিল্টার করুন"}>
      <SelectTrigger className="w-[140px] sm:w-[120px] bg-white rounded-3xl focus:ring-0 focus:ring-offset-0 shadow-custom p-3">
        <SelectValue placeholder="ফিল্টার করুন" className="font-secondary">
          {currentFilter ? FILTER_OPTIONS[currentFilter].label : "ফিল্টার করুন"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        {Object.entries(FILTER_OPTIONS).map(([value, { label }]) => {
          const isActive = currentFilter === value;
          return (
            <CustomSelectItem
              key={value}
              href={`/courses/category/${value}`}
              isActive={isActive}
            >
              {label}
            </CustomSelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

// Component 2: For category-specific pages (with or without existing filter)
// Always routes to /courses/category/{categorySlug}/{newFilter}
interface CategoryFilterSelectProps {
  categorySlug: string;
}

export function CategoryFilterSelect({
  categorySlug,
}: CategoryFilterSelectProps) {
  const pathname = usePathname();

  // Extract current filter from URL (should be the last segment if it's a filter)
  const pathParts = pathname.split("/").filter(Boolean);
  const lastSegment = pathParts[pathParts.length - 1];
  const currentFilter = FILTER_TYPES.includes(lastSegment as FilterType)
    ? (lastSegment as FilterType)
    : undefined;

  return (
    <Select value={currentFilter ? FILTER_OPTIONS[currentFilter].label : "ফিল্টার করুন"}>
      <SelectTrigger className="w-[140px] sm:w-[120px] bg-white rounded-3xl focus:ring-0 focus:ring-offset-0 shadow-custom p-3">
        <SelectValue placeholder="ফিল্টার করুন" className="font-secondary">
          {currentFilter ? FILTER_OPTIONS[currentFilter].label : "ফিল্টার করুন"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        {Object.entries(FILTER_OPTIONS).map(([value, { label }]) => {
          const isActive = currentFilter === value;
          return (
            <CustomSelectItem
              key={value}
              href={`/courses/category/${categorySlug}/${value}`}
              isActive={isActive}
            >
              {label}
            </CustomSelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
