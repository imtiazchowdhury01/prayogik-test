"use client";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ExpertCard from "@/components/ExpertCard";
import { TeacherWithProfileSchema } from "@/lib/utils/openai/types";
import { z } from "zod";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TeacherWithProfile = z.infer<typeof TeacherWithProfileSchema>;

interface TeacherCarousalProps {
  teachers: TeacherWithProfile[];
}

const TeacherCarousal = ({ teachers }: TeacherCarousalProps) => {
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const swiperRef = useRef<any>(null);

  if (!teachers || teachers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-fontcolor-subtitle">কোন শিক্ষক পাওয়া যায়নি।</p>
      </div>
    );
  }

  const updateNavButtons = (swiper: any) => {
    const { activeIndex, slides, params } = swiper;
    const slidesPerView = swiper.params.slidesPerView as number;

    setShowPrev(activeIndex > 0);
    setShowNext(activeIndex + slidesPerView < slides.length);
  };

  return (
    <div className="relative experts-carousel px-2 sm:px-4">
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          updateNavButtons(swiper); // initialize
        }}
        onSlideChange={(swiper) => updateNavButtons(swiper)}
        navigation={{
          nextEl: ".experts-slide-next",
          prevEl: ".experts-slide-prev",
        }}
        slidesPerView={1.2}
        spaceBetween={12}
        modules={[Navigation]}
        className="experts-swiper"
        loop={false}
        breakpoints={{
          240: {
            slidesPerView: 1,
            spaceBetween: 4,
          },
          375: {
            slidesPerView: 1,
            spaceBetween: 12,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
          1536: {
            slidesPerView: 4,
            spaceBetween: 28,
          },
        }}
      >
        {teachers.map((teacher, index) => (
          <SwiperSlide key={teacher.id || index} className="h-auto">
            <div className="h-full">
              <ExpertCard teacher={teacher} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      {teachers.length > 1 && (
        <>
          {/* Prev Button — always rendered, but hidden when not needed */}
          <button
            className={`experts-slide-prev group flex absolute top-1/2 md:top-1/2 xl:top-32 -left-1 sm:-left-2 z-10 w-7 h-7 sm:w-8 sm:h-8 transform bg-white/90 hover:bg-white shadow hover:shadow-md backdrop-blur-sm -translate-y-1/2 cursor-pointer hover:scale-105 transition-all duration-300 rounded-full items-center justify-center border border-gray-100 ${
              showPrev ? "" : "hidden"
            }`}
            aria-label="Previous expert"
          >
            <ChevronLeft className="text-base text-fontcolor-title group-hover:text-primary transition-colors" />
          </button>

          {/* Next Button — always rendered, but hidden when not needed */}
          <button
            className={`experts-slide-next group flex w-7 h-7 sm:w-8 sm:h-8 items-center justify-center backdrop-blur-sm rounded-full absolute top-1/2 md:top-1/2 xl:top-32 z-10 transform bg-white/90 hover:bg-white -translate-y-1/2 -right-1 sm:-right-2 cursor-pointer hover:scale-105 transition-all duration-300 shadow hover:shadow-md border border-gray-100 ${
              showNext ? "" : "hidden"
            }`}
            aria-label="Next expert"
          >
            <ChevronRight className="text-base text-fontcolor-title group-hover:text-primary transition-colors" />
          </button>
        </>
      )}

      <style jsx>{`
        .experts-swiper {
          padding: 8px 2px;
          overflow: visible;
        }

        .experts-swiper .swiper-slide {
          transition: transform 0.3s ease;
        }

        .experts-swiper .swiper-slide:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
};

export default TeacherCarousal;
