import Image from "next/image";
import PrimeHeroCta from "./PrimeHeroCta";

const PrimeHero = ({ subscriptionInfo }: any) => {
  return (
    <section className="w-full relative" data-testid="hero-section">
      {/* Next.js Image component for optimized hero image */}
      <Image
        src="/images/prime/prime-hero-bg.webp"
        alt="Prayogik Hero background"
        fill
        priority
        quality={75}
        className="object-cover z-0"
        sizes="100vw"
      />
      <div className="container mx-auto px-0 md:px-5 lg:px-5 xl:px-10 2xl:px-4 md:py-0 xl:py-20 lg:py-14 relative z-10">
        <div className="flex xl:flex-row 2xl:flex-row lg:flex-row md:flex-row flex-col md:gap-14 lg:gap-14 xl:gap-14 2xl:gap-14 items-center md:items-center lg:items-center xl:items-start mx-auto max-w-7xl p-2 px-5 md:px-2 lg:px-2 xl:px-6 2xl:px-1 py-10 lg:pt-0">
          {/* Hero Details */}
          <div className="w-full lg:mt-10 mt-0 xl:pr-6 2xl:pr-16 pr-0">
            <div className="bg-[#119D90] mb-2 w-fit mx-auto md:inline-block px-3 py-1 rounded text-white font-thin text-md">
              <p>প্রায়োগিক প্রাইম</p>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold text-white leading-[3rem] lg:leading-[4rem] xl:leading-[5rem] 2xl:leading-[5rem] md:text-start text-center">
              জায়গা বদল নয়, স্কিল শেখা হোক এক জায়গায়
            </h1>
            <p className="text-lg text-center md:text-start md:text-base text-gray-100 font-light max-w-3xl leading-relaxed mt-2">
              একটি প্ল্যাটফর্মেই শিখুন প্রয়োজনীয় স্কিলসমূহ — ক্যারিয়ার উন্নয়ন,
              দক্ষতা বৃদ্ধির জন্য প্রয়োজনীয় প্রশিক্ষণ ও গাইডলাইন একসাথে।
            </p>
            {/* cta button section */}
            <PrimeHeroCta subscriptionInfo={subscriptionInfo} />
          </div>
          {/* image section */}
          <div className="w-full items-center justify-end lg:flex xl:mt-0 2xl:mt-0 lg:mt-6 mt-6 hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto py-4 md:pt-0 lg:pt-4">
              {/* Top Image - spans both columns */}
              <div className="md:col-span-2">
                <Image
                  src="/prime_hero_img.webp"
                  alt="Top Person"
                  width={800}
                  height={400}
                  quality={100}
                  className="w-full h-auto rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrimeHero;
