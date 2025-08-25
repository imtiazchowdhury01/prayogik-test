"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import FeedbackCard from "./FeedbackCard";

const StudentFeedback = () => {
  return (
    <section id="feedback" className="my-16">
      <h4 className="mb-6 text-2xl font-bold text-fontcolor-title">
        স্টুডেন্টদের ফিডব্যাক
      </h4>
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
          }}
        >
          {[...Array(10)].map((content, ind) => {
            return (
              <SwiperSlide key={ind}>
                <FeedbackCard />
              </SwiperSlide>
            );
          })}
        </Swiper>
        {/* navigation arrows-- */}
        <div className="absolute right-0 flex -top-16">
          <button className="slide-prev  w-10 h-10 flex items-center justify-center  bg-[#F8FAFC] text-[25px] cursor-pointer hover:scale-[1.1] transition-all duration-300 rounded-l-md ">
            <FaAngleLeft className="text-lg text-[#525468]" />
          </button>
          <button className="slide-next w-10 h-10  flex items-center justify-center bg-[#F8FAFC] text-base text-[25px]  cursor-pointer hover:scale-[1.1] transition-all duration-300 rounded-r-md">
            <FaAngleRight className="text-lg text-[#525468]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default StudentFeedback;
