// // @ts-nocheck
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// export const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
//   return (
//     <div className="flex border-b border-gray-300">
//       {tabs.map((tab) => (
//         <button
//           key={tab.value}
//           className={`flex-1 py-3 transition duration-200 ${
//             activeTab === tab.value
//               ? "border-b-2 border-teal-700 text-teal-700"
//               : "text-gray-600 hover:text-teal-600 focus:outline-none"
//           }`}
//           onClick={() => onTabChange(tab.value)}
//         >
//           {tab.label}
//         </button>
//       ))}
//     </div>
//   );
// };

"use client";

interface Tab {
  value: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <div
      className="flex items-center overflow-x-auto hide-scrollbar space-x-5"
    >
      {tabs.map((tab, ind) => {
        return (
          <button
            key={ind}
            onClick={() => onTabChange(tab.value)}
            className={`text-[#475569] inline-block text-nowrap hover:bg-brand-accent-deep font-semibold p-2 transition-all ${
              activeTab === tab.value &&
              "border-b-[3px] border-primary-brand bg-brand-accent-deep text-primary-700"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
