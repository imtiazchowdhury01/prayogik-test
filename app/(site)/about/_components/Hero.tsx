const Hero = () => {
  return (
    <section className="w-full relative bg-primary-brand">
      <div className="app-container mx-auto md:py-20 lg:py-14 relative z-10">
        <div className="flex xl:flex-row 2xl:flex-row lg:flex-row md:flex-row flex-col md:gap-0 lg:gap-0 xl:gap-10 2xl:gap-10 items-center md:items-center lg:items-start py-10 lg:px-1">
          {/* Hero Details */}
          <div className="w-full lg:mt-6 mt-0">
            <div className="bg-[#119D90] mb-4 w-fit md:inline-block px-3 py-2 rounded text-white font-thin text-xs sm:text-sm">
              <p>আমাদের সম্পর্কে</p>
            </div>
            <h1 className="text-2xl md:text-[3rem] lg:text-[3.75rem] font-bold text-white md:leading-[3rem] lg:leading-[4rem] xl:leading-[4rem] 2xl:leading-[4rem]">
              নির্ভরযোগ্য ক্যারিয়ার উন্নয়ন প্ল্যাটফর্ম
            </h1>
            <p className="md:text-[18px] text-base font-light text-gray-100 max-w-[52rem] leading-7 mt-3 md:mt-4 lg:mt-4 font-primary">
              আপনার ক্যারিয়ারে উন্নতির জন্য প্রয়োজন প্র্যাকটিকাল স্কিল।
              প্রায়োগিকে শেখা যাবে একদম হাতে-কলমে। এক্সপার্টদের তৈরি কোর্সে শেখা
              শুরু করুন ডিজিটাল মার্কেটিং, কপিরাইটিং, অনলাইন বিজনেস, ডেটা
              অ্যানালিটিকস সহ আরও অনেক বিষয়!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
