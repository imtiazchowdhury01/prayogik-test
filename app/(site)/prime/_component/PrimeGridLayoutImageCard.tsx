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
            ? "w-full h-56"
            : "w-[18rem] md:w-[22rem] lg:w-[25rem] h-[15rem] flex-shrink-0"
        }`}
      >
        <Image
          src={course?.imageUrl}
          alt={course?.title}
          width={400} // Fixed width
          height={240} // Fixed height (adjust aspect ratio as needed)
          className="w-full h-full object-cover object-center rounded-lg"
          priority={isGrid}
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
            className={`text-left text-base mb-2  leading-6 tracking-wide ${
              isGrid ? " font-semibold " : "font-bold"
            }`}
          >
            {course?.title}
          </h3>

          <p
            className={`text-gray-100 font-normal text-left ${
              isGrid ? "text-sm tracking-wide" : "text-sm tracking-wide"
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
