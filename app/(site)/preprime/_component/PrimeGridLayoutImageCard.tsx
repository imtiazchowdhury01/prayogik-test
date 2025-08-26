//@ts-nocheck
import Image from "next/image";
import Link from "next/link";

const PrimeGridLayoutImageCard = ({ course, isGrid = false }) => {
  return (
    <Link
      href={`courses/${course?.slug}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div
        className={`relative mr-6 ${
          isGrid
            ? "w-full aspect-[16/9]" // 16:9 aspect ratio for grid layout
            : "w-[22rem] md:w-[22rem] lg:w-[27rem] aspect-[16/9] flex-shrink-0" // 16:9 aspect ratio for non-grid layout
        }`}
      >
        <Image
          src={course?.imageUrl}
          alt={course?.title}
          fill // Use fill to make image cover the container
          className="w-full h-full object-cover object-center rounded-lg"
          quality={75}
          priority={isGrid}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add responsive sizes
        />

        {/* Prime Badge - Top Left Corner */}
        <div className="absolute top-4 left-4 z-10">
          <div
            className={` ${
              isGrid ? "px-1.5 py-0.5" : "px-2 py-1.5"
            } tracking-wide text-white text-[14px] font-light rounded-[4px] bg-[linear-gradient(90deg,_#FF3A4D_0%,_#FF8538_100%)]`}
          >
            প্রাইমের সাথে ফ্রি
          </div>
        </div>

        {/* Gradient Overlay - Black to White from bottom to top */}
        <div className="rounded-lg absolute inset-0 bg-gradient-to-t from-black/90 via-black/0 to-transparent" />

        {/* Content - Always visible with improved spacing */}
        <div
          className={`absolute bottom-0 left-0 right-0 text-white text-wrap ${
            isGrid ? "p-4" : "p-3 md:p-4"
          }`}
        >
          <h3
            className={`text-left text-sm lg:text-base mb-2 leading-5 tracking-wide ${
              isGrid ? " font-semibold " : "font-bold"
            }`}
          >
            {course?.title}
          </h3>

          <p
            className={`text-gray-100 font-normal text-left ${
              isGrid
                ? "text-xs md:text-sm tracking-wide"
                : "text-xs md:text-sm tracking-wide"
            } drop-shadow-md truncate`}
          >
            ইন্সট্রাক্টর {course?.teacherProfile?.user?.name}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PrimeGridLayoutImageCard;
