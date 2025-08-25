"use client";
import React, { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import CreativeCourseCard from "./CreativeCourseCard";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import CreativeCourseCardSkeleton from "./CreativeCourseCardSkeleton";
import { Category } from "@prisma/client";

const CreativeCourses = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/courses/categories");
        const data = await response.json();
        setCategories(
          data?.map((category: Category) => ({
            ...category,
            image: `/categories/${category.slug}.webp`,
          }))
        );
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHandler();
  }, []);

  return (
    <section
      className="w-full bg-background-primary-dark py-16 sm:py-[100px]"
      data-testid="creative-courses-section"
    >
      <div className="app-container">
        <div
          className="flex items-center justify-center w-full mb-6 md:justify-between"
          data-testid="creative-courses-header"
        >
          <div>
            <h4
              className="font-bold text-white md:text-left text-center text-3xl sm:text-4xl md:text-[40px]"
              data-testid="creative-courses-title"
            >
              কোর্স ক্যাটেগরি সমূহ
            </h4>
            <p
              className="mt-2 text-base text-center text-white md:text-left"
              data-testid="creative-courses-subtitle"
            >
              নিজের লক্ষ্য অনুযায়ী ক্যাটেগরি বাছাই করুন, ক্যারিয়ার গড়ে তুলুন
              শক্ত ভিতের উপর।
            </p>
          </div>
        </div>
        {categories?.length > 0 && (
          <div className="relative">
            <Swiper
              navigation={{
                nextEl: ".slide-next",
                prevEl: ".slide-prev",
              }}
              slidesPerView={1.4}
              spaceBetween={5}
              modules={[Navigation]}
              className="course-swiper"
              breakpoints={{
                576: { slidesPerView: 2 },
                768: { slidesPerView: 3, spaceBetween: 10 },
                992: { slidesPerView: 3, spaceBetween: 16 },
                1200: { slidesPerView: 5, spaceBetween: 16 },
              }}
              data-testid="creative-courses-swiper"
            >
              {isLoading &&
                [...Array(6)].map((_, ind) => {
                  return (
                    <SwiperSlide key={ind}>
                      <CreativeCourseCardSkeleton />
                    </SwiperSlide>
                  );
                })}

              {categories?.map((category, ind) => {
                return (
                  <SwiperSlide key={ind}>
                    <CreativeCourseCard data={category} />
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* navigation arrows-- */}
            <button
              className="slide-prev lg:flex hidden absolute top-1/2 -left-4 z-10 w-8 h-8 transform bg-white/20 backdrop-blur-sm  -translate-y-1/2 text-[25px] cursor-pointer hover:scale-[1.1] transition-all duration-300 rounded-full  items-center justify-center "
              data-testid="creative-courses-prev-button"
            >
              <FaAngleLeft className="text-base text-white" />
            </button>
            <button
              className="slide-next w-8 h-8 hidden lg:flex items-center justify-center backdrop-blur-sm rounded-full absolute top-1/2 z-10 transform  bg-white/20 text-base -translate-y-1/2 -right-4 text-[25px]  cursor-pointer hover:scale-[1.1] transition-all duration-300"
              data-testid="creative-courses-next-button"
            >
              <FaAngleRight className="text-base text-white" />
            </button>
          </div>
        )}

        {categories?.length === 0 && (
          <div
            className="mt-8 text-center border-2 border-gray-400 border-dashed rounded-lg p-14"
            data-testid="no-categories-message"
          >
            <h3 className="mb-2 text-xl font-semibold text-white">
              দুঃখিত! কোনো কোর্স ক্যাটাগরি পাওয়া যায়নি
            </h3>
          </div>
        )}
      </div>
    </section>
  );
};

export default CreativeCourses;
