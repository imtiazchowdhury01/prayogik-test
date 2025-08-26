import Image from "next/image";
import Link from "next/link";

const HERO_IMAGES = [
  { src: "/images/home/hero-1.webp", alt: "prayogik-hero-1" },
  {
    src: "/images/home/hero-2.webp",
    alt: "prayogik-hero-2",
    className: "hidden sm:block",
  },
  {
    src: "/images/home/hero-3.webp",
    alt: "prayogik-hero-3",
    className: "hidden sm:block",
  },
  {
    src: "/images/home/hero-4.webp",
    alt: "prayogik-hero-4",
    className: "hidden sm:block",
  },
];

export default function PrayogikHero() {
  return (
    <section className="w-full relative">
      <Image
        src="/images/home/Hero.webp"
        alt="Prayogik Hero background"
        fill
        priority
        quality={100}
        className="object-cover z-0"
        sizes="100vw"
      />

      <div className="container mx-auto px-0 md:px-5 lg:px-5 xl:px-4 2xl:px-4 py-0 md:py-20 lg:py-14 relative z-10">
        <div className="flex xl:flex-row 2xl:flex-row lg:flex-row md:flex-row flex-col md:gap-0 lg:gap-0 xl:gap-10 2xl:gap-10 items-center md:items-center lg:items-start mx-auto max-w-7xl p-6 py-10 lg:px-1">
          {/* Hero Details */}
          <div className="w-full lg:mt-6 mt-0">
            <div className="bg-[#119D90] mb-6 w-fit mx-auto md:inline-block px-3 py-1 rounded text-white font-light sm:font-thin text-md">
              <p>শেখা হোক সহজ </p>
            </div>
            <h1 className="text-3xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold text-white leading-[2.5rem] lg:leading-[5rem] xl:leading-[5rem] 2xl:leading-[5rem] md:text-start text-center">
              ডিজিটাল মার্কেটিং শেখার পূর্ণাঙ্গ লার্নিং প্ল্যাটফর্ম
            </h1>
            <p className="text-lg text-center md:text-start md:text-xl text-gray-100 font-light max-w-3xl leading-relaxed mt-4">
              অনলাইন কোর্স, লাইভ ট্রেইনিং, ওয়ার্কশপ, বুটক্যাম্প এবং
              ক্যারিয়ার-ফোকাসড সার্টিফিকেশন ট্র্যাক—সব এক জায়গায়। নলেজ, স্কিল ও
              ক্যারিয়ারে এগিয়ে থাকুন।
            </p>
            <div className="flex flex-row justify-center md:justify-start gap-4 mt-6">
              <Link
                href={"/courses"}
                className="block w-full px-4 py-3 text-sm md:text-base font-semibold text-center transition-all duration-300 rounded-lg sm:w-auto sm:inline-block  sm:px-6 sm:py-3 bg-white hover:opacity-95 text-primary-brand"
              >
                কোর্স গুলো দেখুন
              </Link>
              <Link
                href={"/prime"}
                className="block w-full bg-secondary-button hover:bg-secondary-button hover:opacity-95 px-4 py-3 text-sm md:text-base font-semibold text-center text-white transition-all duration-300 rounded-lg sm:w-auto sm:inline-block  sm:px-6 sm:py-3"
              >
                প্রাইম মেম্বারশিপ
              </Link>
            </div>
          </div>
          {/* image grid section */}
          <div className="w-full mt-6 px-8">
            <Image
              src={"/prayogik_hero_img.webp"}
              alt={"prayogik hero"}
              width={1244}
              height={900}
              quality={100}
              priority
              // sizes="(max-width: 1640px) 100vw, (max-width: 1024px) 10vw, 972px"
              className={`w-full h-full object-contain`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
