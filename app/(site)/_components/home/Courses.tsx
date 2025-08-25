import FeaturedCourses from "./FeaturedCourses";

export default function Courses() {
  return (
    <div className="bg-gray-50" id="course">
      <div className="mx-auto max-w-7xl">
        <div className="pt-24 pb-16">
          <div className="px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                আমাদের কোর্স সমূহ
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                বর্তমান সময়ের সবচাইতে গুরুত্বপূর্ণ ও ডিমান্ডিং স্কিল নিয়ে চালু
                হচ্ছে এই কোর্স গুলো। নির্দিস্ট তারিখের মধ্যে নিবন্ধন কিংবা
                প্রি-এনরোলমেন্ট করুন। গ্রহণ করুন বিশেষ ছাড়।
              </p>
            </div>
            <FeaturedCourses />
          </div>
        </div>
      </div>
    </div>
  );
}
