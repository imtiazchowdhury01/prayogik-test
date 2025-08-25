"use client";
import MoreBtn from "@/components/more-btn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Navigation } from "swiper/modules";
import BootcampCard from "@/components/BootcampCard";
import EventsCard from "./EventsCard";
import WorkshopCard from "./WorkshopCard";
const UpcomingSession = () => {
  const tabs = [
    {
      value: "bootcamp",
      title: "বুটক্যাম্প",
      description:
        "ডিজিটাল মার্কেটিং শেখার জন্য ইন্ডাস্ট্রি ফোকাসড বুটক্যাম্প। আপনি আপনার নিজস্ব গতিতে শিখবেন।",
    },
    {
      value: "workshop",
      title: "ওয়ার্কশপ",
      description:
        "আপনার স্কিল উন্নত করুন ডিজিটাল মার্কেটিং ওয়ার্কশপে। আপনি আপনার নিজস্ব গতিতে শিখবেন।",
    },
    {
      value: "event",
      title: "ইভেন্ট",
      description:
        "ডিজিটাল মার্কেটিং শেখার জন্য ইন্ডাস্ট্রি ফোকাসড ইভেন্ট। আপনি আপনার নিজস্ব গতিতে শিখবেন।",
    },
  ];
  return (
    <section className="w-full bg-background-primary-darker py-16 relative sm:py-[100px]">
      {/* app container-- */}
      <div className="app-container">
        <div className="flex items-center justify-center w-full mb-6 md:justify-between">
          <h4 className="font-bold text-white md:text-left text-center text-3xl sm:text-4xl md:text-[40px]">
            আমাদের আপকামিং ক্রিয়েটিভ সেশন গুলো
          </h4>
          <MoreBtn href="/" title="আরো দেখুন" className="hidden md:flex" />
        </div>
        {/* tabs container-- */}
        <div className="w-full">
          <Tabs
            defaultValue="bootcamp"
            className="flex flex-col items-start w-full space-y-6 transition-all duration-300 lg:flex-row lg:space-y-0 lg:space-x-12"
          >
            <TabsList
              className="flex w-full lg:w-[40%] xl:w-[30%] flex-col h-auto bg-white/5 p-0 overflow-hidden rounded-lg
             text-white"
            >
              {tabs.map((tab) => {
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="justify-start w-full h-auto px-5 py-2 hover:bg-white/10 data-[state=active]:bg-[#475f5d]"
                  >
                    <p className="self-start text-2xl font-bold text-left text-white">
                      {tab.title}
                    </p>
                    <p className="mt-1 text-sm font-medium text-left text-greyscale-200 text-wrap">
                      {tab.description}
                    </p>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <div className="w-full lg:w-[60%] xl:w-[70%]">
              <TabsContent value="bootcamp">
                <Carousel items={[...Array(10)]} CardComponent={BootcampCard} />
              </TabsContent>
              <TabsContent value="workshop">
                <Carousel items={[...Array(10)]} CardComponent={WorkshopCard} />
              </TabsContent>
              <TabsContent value="event">
                <Carousel items={[...Array(10)]} CardComponent={EventsCard} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div className="flex items-center justify-center mt-5">
          <MoreBtn
            href="/sessions"
            title="আরো দেখুন"
            className="flex md:hidden"
          />
        </div>
      </div>
      {/* gradient color--- */}
      <div className="absolute bottom-0 object-cover w-full transform -translate-x-1/2 pointer-events-none left-1/2">
        <svg
          width="100%"
          height="364"
          viewBox="0 0 1728 364"
          fill="none"
          className="w-full h-auto"
        >
          <rect
            width="100%"
            height="587"
            fill="url(#paint0_radial_14536_7676)"
            fillOpacity="0.2"
          />
          <defs>
            <radialGradient
              id="paint0_radial_14536_7676"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(864 362.5) rotate(-90) scale(398.5 1173.1)"
            >
              <stop stopColor="#C7FFFA" />
              <stop offset="1" stopColor="#0F1322" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      {/* background shape-- */}
      <div className="absolute bottom-0 right-0 hidden pointer-events-none lg:block">
        <svg width="469" height="754" viewBox="0 0 469 754" fill="none">
          <g opacity="0.7" filter="url(#filter0_d_14536_7675)">
            <path
              d="M870 60L654.694 271.454C650.206 275.862 644.168 278.331 637.877 278.331H439.596C433.307 278.331 427.27 280.799 422.783 285.204L332.601 373.732C328.114 378.138 322.077 380.606 315.788 380.606H239.193C232.966 380.606 226.983 383.026 222.508 387.355L67.3146 537.46C62.6397 541.982 60 548.208 60 554.711V781H870V60Z"
              fill="#032421"
            />
            <path
              d="M869.5 780.5V61.1919L655.045 271.811C650.463 276.31 644.299 278.831 637.877 278.831H439.596C433.438 278.831 427.527 281.248 423.133 285.561L332.951 374.089C328.37 378.586 322.208 381.106 315.788 381.106H239.193C233.096 381.106 227.238 383.475 222.855 387.714L67.6622 537.82C63.0847 542.247 60.5 548.343 60.5 554.711V780.5H869.5Z"
              stroke="#475569"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_14536_7675"
              x="0"
              y="0"
              width="910"
              height="821"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="-10" dy="-10" />
              <feGaussianBlur stdDeviation="25" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_14536_7675"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_14536_7675"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default UpcomingSession;

// upcoming session carousel--
const Carousel = ({
  items,
  CardComponent,
}: {
  items: Array<any>;
  CardComponent: any;
}) => {
  return (
    <div className="relative">
      <Swiper
        navigation={{
          nextEl: ".slide-next",
          prevEl: ".slide-prev",
        }}
        slidesPerView={1.4}
        spaceBetween={10}
        modules={[Navigation]}
        className="course-swiper"
        breakpoints={{
          576: { slidesPerView: 2 },
          768: { slidesPerView: 1.5, spaceBetween: 10 },
          1048: { slidesPerView: 2, spaceBetween: 20 },
          1280: { slidesPerView: 2.5, spaceBetween: 20 },
        }}
      >
        {items.map((_, ind) => (
          <SwiperSlide key={ind}>
            <CardComponent />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <button className="slide-prev xl:flex hidden absolute top-1/2 -left-4 z-10 w-8 h-8 transform bg-white/80 drop-shadow-xl backdrop-blur-sm -translate-y-1/2 text-[25px] cursor-pointer hover:scale-[1.1] transition-all duration-300 rounded-full items-center justify-center">
        <FaAngleLeft className="text-base text-fontcolor-title" />
      </button>
      <button className="slide-next w-8 h-8 hidden xl:flex items-center justify-center backdrop-blur-sm rounded-full absolute top-1/2 z-10 transform bg-white/80 text-base -translate-y-1/2 -right-4 text-[25px] cursor-pointer hover:scale-[1.1] transition-all duration-300 drop-shadow-2xl">
        <FaAngleRight className="text-base text-fontcolor-title" />
      </button>
    </div>
  );
};
