import { courseCategories } from "@/data";
import Link from "next/link";
import React from "react";
import { FaAngleDown } from "react-icons/fa6";

const CourseCategoriesPrev = () => {
  const categoriesData = [
    { slug: "digital-marketing", title: "ডিজিটাল মার্কেটিং" },
    { slug: "design", title: "ডিজাইন" },
    { slug: "development", title: "ডেভেলপমেন্ট" },
    { slug: "film-video", title: "ফিল্ম & ভিডিও" },
  ];
  const categoriesHandler = (categorySlug: string) => {
    const categories = courseCategories.find(
      (category) => category.categorySlug === categorySlug
    );
    return categories;
  };

  return (
    <section className="w-full py-20 bg-[#F8FAFC]">
      <div className="app-container">
        <h2 className="mb-10 text-3xl font-semibold text-center md:text-left text-fontcolor-title">
          আমাদের কোর্স ক্যাটাগরি সমূহ
        </h2>
        <div className="grid grid-cols-2 place-items-center md:place-items-start gap-7 sm:gap-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoriesData.map(({ slug, title }) => (
            <div key={slug}>
              <h6 className="mb-6 text-xl font-bold text-fontcolor-title">
                {title}
              </h6>
              <ul>
                {categoriesHandler(slug)?.categories.map((category, ind) => (
                  <li key={ind} className="mb-3">
                    <Link
                      href={category.path}
                      className="text-lg text-fontcolor-title hover:text-primary-brand hover:underline"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/"
                    className="text-lg font-bold text-primary-brand hover:underline"
                  >
                    আরো দেখুন
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center pt-16 space-x-5">
          <span className="border-[1px] border-[#E2E8F0] flex-1"></span>
          <button className="flex items-center space-x-2 hover:border-transparent hover:text-fontcolor-title hover:bg-[#F1F5F9] transition-all duration-300 rounded-lg text-[#475569] border-[1px] p-3 border-[#E2E8F0]">
            <span>আরও দেখুন</span>
            <FaAngleDown className="text-[#475569]" />
          </button>
          <span className="border-[1px] border-[#E2E8F0] flex-1"></span>
        </div>
      </div>
    </section>
  );
};

export default CourseCategoriesPrev;
