import Image from "next/image";
import Link from "next/link";

export function TeachersHero() {
  return (
    <section className="w-full relative bg-brand">
      {/* block image shape */}
      <Image
        src="/images/home/BG.svg"
        alt="Prayogik Hero background"
        fill
        priority
        quality={75}
        className="object-cover z-0 md:block hidden"
        sizes="100vw"
      />
      <div className="container mx-auto px-0 md:px-5 lg:px-5 xl:px-4 2xl:px-4 py-10 lg:py-14 relative z-10">
        <div className="flex xl:flex-row 2xl:flex-row lg:flex-row md:flex-row flex-col md:gap-0 lg:gap-0 xl:gap-10 2xl:gap-10 items-center md:items-center lg:items-start mx-auto max-w-7xl p-6 py-10 lg:px-1">
          {/* Hero Details */}
          <div className="w-full lg:mt-6 mt-0 relative">
            <div className="bg-[#119D90] mb-6 w-fit mx-auto md:inline-block px-3 py-1 rounded text-white sm:font-thin font-light text-md">
              <p>শিখুন প্রফেশনাল স্টাইলে</p>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold text-white leading-[3rem] lg:leading-[5rem] xl:leading-[5rem] 2xl:leading-[5rem] md:text-start text-center">
              সেরা প্রশিক্ষকদের সাথে ডিজিটাল মার্কেটিং শিখুন!
            </h1>
            <p className="text-lg text-center md:text-start md:text-xl text-gray-100 font-light max-w-3xl leading-relaxed mt-6">
              আধুনিক কনটেন্ট, অভিজ্ঞ প্রশিক্ষক ও প্র্যাকটিকাল প্রজেক্টের মাধ্যমে
              গড়ুন বাস্তবভিত্তিক ডিজিটাল মার্কেটিং দক্ষতা।
            </p>
            <div className="flex flex-row justify-center md:justify-start gap-4 mt-10">
              <Link
                href={"/become-a-teacher"}
                className="block w-full px-4 py-3 text-sm md:text-base font-semibold text-center transition-all duration-300 rounded-lg sm:w-auto sm:inline-block  sm:px-6 sm:py-3 bg-white hover:opacity-95 text-primary-brand"
              >
                প্রশিক্ষক হতে চাই
              </Link>
            </div>
            {/* star shape */}
            <div className="absolute z-0 hidden lg:block lg:bottom-[-15%] lg:left-[70%] xl:bottom-[-15%] xl:left-[65%] w-[80px] h-[80px] xl:w-[110px] xl:h-[110px]">
              <Image
                src="/images/home/star.svg"
                alt="background star image"
                fill
                loading="lazy"
                quality={75}
                className="object-contain"
              />
            </div>
          </div>
          {/* image */}
          <div className="w-full items-center justify-end lg:flex xl:mt-0 2xl:mt-0 lg:mt-6 mt-6 hidden sm:block">
            <Image
              src={"/images/teacher/teacher-hero.webp"}
              alt=""
              width={544}
              height={474}
              quality={75}
              priority
              sizes="(max-width: 768px) 100vw, (min-width: 1200px) 544px, 50vw"
              className="w-full h-auto object-cover md:px-4 md:pl-12 pl-0 px-0"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
