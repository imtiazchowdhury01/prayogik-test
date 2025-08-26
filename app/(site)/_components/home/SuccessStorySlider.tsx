//@ts-nocheck
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SuccessStorySlider = ({
  testimonials,
  swiperRef,
  setIsBeginning,
  setIsEnd,
}) => {
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          // Set initial state
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        loop={false}
        breakpoints={{
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
        className="testimonials-swiper"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <Card
              className={`${testimonial.bgColor} border-0 shadow-sm h-full`}
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Quote Icon */}
                <div className="mb-4">
                  <svg
                    width="25"
                    height="19"
                    viewBox="0 0 25 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.211166 17.5798C1.28327 13.1103 4.87003 4.79703 6.84922 0.5096C6.99345 0.197162 7.30567 0 7.64979 0H10.7283C11.3328 0 11.7806 0.593271 11.6261 1.17774C10.7736 4.40195 8.73682 12.8535 7.67508 17.8955C7.58842 18.3071 7.22666 18.6 6.8061 18.6H1.04555C0.498233 18.6 0.0835014 18.112 0.211166 17.5798Z"
                      fill="#414B4A"
                    />
                    <path
                      d="M24.3031 1.02028C23.231 5.48975 19.6442 13.8031 17.6651 18.0905C17.5208 18.4029 17.2086 18.6001 16.8645 18.6001H13.786C13.1815 18.6001 12.7336 18.0068 12.8882 17.4224C13.7407 14.1981 15.7775 5.74658 16.8392 0.704559C16.9259 0.29302 17.2876 9.72748e-05 17.7082 9.72748e-05H23.4687C24.016 9.72748e-05 24.4308 0.488056 24.3031 1.02028Z"
                      fill="#414B4A"
                    />
                  </svg>
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-900 mb-6 leading-relaxed text-base flex-grow md:line-clamp-3 md:overflow-hidden md:text-ellipsis">
                  {testimonial.text}
                </p>

                <hr className="mb-6"/>
                {/* Profile Section */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="relative aspect-square w-10 h-10">
                    <Image
                      src={testimonial.avatar}
                      alt={`${testimonial.name}'s profile picture`}
                      width={80}
                      height={80}
                      quality={85}
                      className="rounded-full object-cover w-full h-full"
                      loading="eager"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SuccessStorySlider;
