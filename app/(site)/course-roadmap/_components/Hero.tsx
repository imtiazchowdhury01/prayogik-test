import RoadmapStateCard from "./RoadmapStateCard";

export const Hero = () => (
  <section className="bg-brand min-h-[482px] flex items-center py-16 lg:py-20 px-6 sm:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 md:items-start items-center">
        {/* Content */}
        <div className="space-y-6 md:mt-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            প্রায়োগিক কোর্স রোডম্যাপ
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            আমাদের পরিকল্পনা — ডিজিটাল মার্কেটিং ও ডিজিটাল স্কিলের প্রয়োজনীয় ও
            ইন-ডিমান্ড দক্ষতাগুলোকে সহজী ও সংগঠিত করা । জেনে নিন, আমরা কোন
            স্কিলগুলো কোর্স কাজ করছি এবং ভবিষ্যতের জন্য কী পরিকল্পনা রয়েছে ।
          </p>
        </div>
        {/* Stats Cards */}
        <RoadmapStateCard />
      </div>
    </div>
  </section>
);
