// CategorySidebar.tsx - Server Component
import React from "react";
import { getCategoriesDBCall } from "@/lib/data-access-layer/categories";
import CategorySidebarClient from "./CategorySidebarClient";


const CategorySidebar = async () => {
  const categories = await getCategoriesDBCall();
  
  return <CategorySidebarClient categories={categories} />;
};

export default CategorySidebar;