import Image from "next/image";

const MoreCourseList = () => {
  return (
    <div className="flex mb-2 mr-2 flex-row md:flex-row justify-between items-center hover:bg-black/50 hover:cursor-pointer border-white/25 border rounded-md p-2 transition">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-12 md:w-20 md:h-12 rounded">
          <Image
            fill
            className="w-full h-full object-cover bg-white text-xs rounded-md"
            alt="course image"
            src="/"
          />
          <Image
            alt="play icon"
            src="/images/courses/video-icon.svg"
            height={40}
            width={40}
            className="absolute top-0 md:left-6 left-3 flex items-center justify-center mt-4"
          />
        </div>
        {/*Chapter Info */}
        <div>
          <h3 className="text-sm md:text-md font-semibold text-white">
            Deep Dive into Advanced Topics
          </h3>
          <p className="text-xs md:text-sm text-gray-300">Chapter 2</p>
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-300">10:15 min</p>
      </div>
    </div>
  );
};

export default MoreCourseList;
