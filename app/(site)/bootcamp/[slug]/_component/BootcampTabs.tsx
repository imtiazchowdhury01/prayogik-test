

"use client";

import React, { useState } from "react";

interface TabProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  const baseClasses =
    "px-3 py-2 whitespace-nowrap cursor-pointer min-h-10 max-sm:px-1.5 max-sm:py-2";
  const activeClasses =
    "font-semibold text-teal-800 bg-emerald-50 border-solid border-b-[3px] border-b-[color:var(--Primary-Main-500,#0d9488)] rounded-[8px_8px_0_0]";

  return (
    <button
      className={`${baseClasses} ${isActive ? activeClasses : ""}`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
    >
      {label}
    </button>
  );
};

export const BootcampTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    "সংক্ষিপ্ত বিবরণ",
    "সিলেবাস",
    "কোর্সে আরও যা থাকছে",
    "ইন্সট্রাক্টর পরিচিতি",
    "ফিডব্যাক",
    "প্রশ্ন ও উত্তর",
  ];

  return (
    <nav
      className="flex overflow-x-auto gap-5 items-center mt-6 w-full font-medium border-b border-solid border-b-[color:var(--Greyscale-200,#e2e8f0)] text-slate-600 max-sm:gap-3 max-sm:pb-2"
      role="tablist"
    >
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          label={tab}
          isActive={activeTab === index}
          onClick={() => setActiveTab(index)}
        />
      ))}
    </nav>
  );
};

