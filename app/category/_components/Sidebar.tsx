// @ts-nocheck
import { CategoryItem } from "@/app/(dashboard)/(routes)/search/_components/category-item";

export default function Sidebar({
  items = [],
}: {
  items?: Array<{ id: string; name: string }>;
}) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="w-full md:w-1/6 md:mb-0">
      <div>
        {/* category */}
        <h2 className="font-bold text-lg mb-2 sm:mb-4">ক্যাটাগরি</h2>
        <ul className="flex md:items-start items-center gap-1 sm:gap-0 sm:flex-col md:gap-x-0 gap-x-2  md:overflow-x-visible overflow-x-auto md:pb-0 pb-2 md:min-w-fit">
          {[{ id: "all", name: "All" }, ...safeItems].map((item) => (
            <li
              key={item.id}
              className="text-sm px-2 sm:text-base sm:px-0 sm:mb-2"
            >
              <CategoryItem label={item.name} value={item.id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
