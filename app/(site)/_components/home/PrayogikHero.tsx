import Image from "next/image";
import Link from "next/link";
// import prayogikhero from "@/public/prayogik_hero_img.webp"; // Static import
import prayogikhero from "@/public/home/hero-image.webp"; // Static import

export default function PrayogikHero() {
  return (
    <section className="w-full relative bg-brand">
      <div className="app-container mx-auto relative z-10 py-0 md:py-16 lg:py-14 ">
        <div className="flex xl:flex-row 2xl:flex-row lg:flex-row md:flex-row flex-col md:gap-0 lg:gap-0 xl:gap-10 2xl:gap-10 items-center md:items-center lg:items-start py-10 md:py-0 lg:py-10 lg:px-1">
          {/* Hero Details */}
          <div className="w-full lg:mt-8 mt-0 relative">
            <div className="bg-[#119D90] mb-3 w-fit mx-auto md:inline-block px-3 py-1 rounded text-white font-light sm:font-thin text-md">
              <p>শেখা হোক সহজ </p>
            </div>
            <h1 className="text-3xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold text-white leading-[2.5rem] lg:leading-[5rem] xl:leading-[5rem] 2xl:leading-[5rem] md:text-start text-center">
              ডিজিটাল মার্কেটিং শেখার পূর্ণাঙ্গ লার্নিং প্ল্যাটফর্ম
            </h1>
            <p className="text-lg text-center md:text-start md:text-lg text-gray-100 font-light max-w-3xl leading-relaxed mt-4">
              অনলাইন কোর্স, লাইভ ট্রেইনিং, ওয়ার্কশপ, বুটক্যাম্প এবং
              ক্যারিয়ার-ফোকাসড সার্টিফিকেশন ট্র্যাক—সব এক জায়গায়। নলেজ, স্কিল ও
              ক্যারিয়ারে এগিয়ে থাকুন।
            </p>
            <div className="flex flex-row justify-center md:justify-start gap-4 mt-4 md:mt-12">
              <Link
                href={"/courses"}
                className="block w-full px-4 py-3 text-sm md:text-base font-semibold text-center transition-all duration-300 rounded-lg sm:w-auto sm:inline-block  sm:px-6 sm:py-3 bg-white hover:opacity-95 text-primary-brand"
              >
                কোর্সগুলো দেখুন
              </Link>
              <Link
                href={"/prime"}
                className="block w-full bg-secondary-button hover:bg-secondary-button hover:opacity-95 px-4 py-3 text-sm md:text-base font-semibold text-center text-white transition-all duration-300 rounded-lg sm:w-auto sm:inline-block  sm:px-6 sm:py-3"
              >
                প্রাইম মেম্বারশিপ
              </Link>
              {/* star shape */}
              <div className="absolute z-0 hidden lg:block lg:bottom-[-15%] lg:left-[70%] xl:bottom-[-25%] xl:left-[65%] w-[80px] h-[80px] xl:w-[110px] xl:h-[110px]">
                <Image
                  src="/images/home/star.svg"
                  alt="background star image"
                  fill
                  loading="lazy"
                  quality={75}
                  className="object-contain  animate-pulse"
                />
              </div>
            </div>
          </div>
          {/* hero image section */}
          <div className="w-full mt-6 md:mt-0 xl:mt-6 px-8 pr-0 pl-0 md:pl-8">
            <Image
              src={prayogikhero}
              alt={"prayogik hero"}
              width={1244}
              height={900}
              quality={75}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
