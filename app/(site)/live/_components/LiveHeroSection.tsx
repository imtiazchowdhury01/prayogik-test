import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import OfferVideoSection from "../../course-roadmap/_components/OfferVideoSection";

const LiveHeroSection = () => {
  const dataSrc = {
    videoSrc: "",
    imageSrc: "/images/prime/video-frame-bg.webp",
  };

  return (
    <div className="bg-brand relative">
      {/* background block image shape */}
      <Image
        src="/Launching-offer-BG.svg"
        alt="Prayogik Hero background"
        fill
        priority
        quality={75}
        className="object-cover z-0 md:block hidden"
        sizes="100vw"
      />
      {/* hero details section */}
      <div className="app-container relative flex justify-center flex-col items-center pt-14 md:pt-12">
        <h1 className="text-3xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold text-white md:text-start text-center py-4 md:pt-8 md:pb-6">
          প্রায়োগিক লাইভ কোর্স
        </h1>
        <p className="text-md text-center md:text-[20px] text-gray-100 font-normal md:font-light max-w-full md:max-w-2xl leading-7">
          আমাদের প্রায়োগিক লাইভ কোর্সগুলোতে আপনি শিখবেন হাতে-কলমে দক্ষতা, যা
          সরাসরি বাস্তবে কাজে লাগানো যাবে। প্রতিটি কোর্স ডিজাইন করা হয়েছে
          সহজবোধ্যভাবে এবং সাশ্রয়ী মূল্যে, যাতে আপনি ডিজিটাল স্কিল আয়ত্ত করে
          ক্যারিয়ারে নতুন সুযোগ তৈরি করতে পারেন।
        </p>
        <Link href="/courses">
          <Button
            variant="default"
            className="bg-white text-brand mt-12 px-4 h-12 hover:bg-white font-semibold text-base"
          >
            কোর্স এক্সপ্লোর করুন
          </Button>
        </Link>
      </div>
      {/* hero video section */}
      <div className="pt-8 pb-14 md:pt-14 md:pb-[60px]">
        <OfferVideoSection dataSrc={dataSrc} customOpacity={0.25} />
      </div>
    </div>
  );
};

export default LiveHeroSection;
