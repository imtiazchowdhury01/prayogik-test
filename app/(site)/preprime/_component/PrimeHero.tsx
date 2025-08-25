import Image from "next/image";
import PrimeHeroCta from "./PrimeHeroCta";
import primehero from "public/prime_hero_img.webp";

const PrimeHero = ({ subscriptionInfo }: any) => {
  return (
    <section className="w-full relative bg-brand">
      {/* block image shape */}
      <Image
        src="/images/home/BG.svg"
        alt="Prayogik Hero background"
        fill
        priority={true}
        quality={75}
        className="object-cover z-0 md:block hidden"
        sizes="100vw"
      />
      <div className="app-container mx-auto  md:py-0 xl:py-20 lg:py-14 relative z-10">
        <div className="flex xl:flex-row 2xl:flex-row lg:flex-row md:flex-row flex-col md:gap-14 lg:gap-14 xl:gap-14 2xl:gap-14 items-center md:items-center lg:items-center xl:items-start p-2 py-10 lg:pt-0">
          {/* Hero Details */}
          <div className="w-full lg:mt-10 mt-0 xl:pr-6 2xl:pr-16 pr-0">
            <div className="bg-[#119D90] mb-2 w-fit md:inline-block px-3 py-1 rounded text-white font-light md:font-thin text-md">
              <p>প্রায়োগিক প্রাইম</p>
            </div>
            <h1 className="text-3xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold text-white leading-[2.2rem] lg:leading-[4rem] xl:leading-[5rem] 2xl:leading-[5rem] md:text-start text-left">
              জায়গা বদল নয়, স্কিল শেখা হোক এক জায়গায়
            </h1>
            <p className="sm:text-lg text-base text-left md:text-start text-gray-100 font-light max-w-3xl leading-relaxed mt-2">
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
                  src={primehero}
                  placeholder="blur"
                  alt="Top Person"
                  width={800}
                  height={400}
                  quality={75}
                  priority={true}
                  className="w-full h-auto rounded-lg object-cover"
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
