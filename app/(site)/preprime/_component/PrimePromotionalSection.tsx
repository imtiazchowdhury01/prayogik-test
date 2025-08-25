// @ts-nocheck
import Image from "next/image";
import PrimeSubscriptionButton from "./PrimeSubscriptionButton";
import image1 from "public/images/prime/image-1.webp";
import image2 from "public/images/prime/image-2.webp";

const PrimePromotionalSection = () => {
  return (
    <div className="app-container mx-auto py-16">
      {/* Prime promotional Section */}
      <section className="md:py-12 relative">
        {/* Mobile Card Layout */}
        <div className="md:hidden bg-white rounded-xl border overflow-hidden mb-8">
          <div className="w-full">
            <Image
              src={image1}
              alt="image-1"
              width={500}
              height={400}
              placeholder="blur"
              quality={75}
              priority
              className="w-full h-auto"
            />
          </div>
          <div className="p-2 sm:p-4 py-6">
            <h1 className="text-center text-3xl font-semibold leading-[46px] not-italic text-gray-900">
              প্রতি সপ্তাহেই যোগ হচ্ছে
              <br />
              ১২টির বেশি নতুন কোর্স
            </h1>
            <p className="text-center text-[16px] font-normal not-italic leading-[24px] text-gray-700 mt-4 mb-4">
              এক সাবস্ক্রিপশনে পাচ্ছেন প্রতি সপ্তাহে ১২+ নতুন কোর্স! ক্যারিয়ার
              স্কিল, ফ্রিল্যান্সিং গাইড, কিংবা পার্সোনাল গ্রোথ—সব কিছু এক
              প্ল্যাটফর্মে, বাংলায়, হাতে-কলমে শেখার অভিজ্ঞতায়। নতুন কিছু যোগ
              হচ্ছে এখনই, মিস করবেন না! শেখা শুরু করুন আজ!
            </p>
            <div className="flex justify-center">
              <PrimeSubscriptionButton variant="expired" />
            </div>
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1">
            <Image
              src={image1}
              alt="image-1"
              width={500}
              height={400}
              placeholder="blur"
              quality={75}
              priority
              className="rounded-xl w-full h-auto"
            />
          </div>
          <div className="order-1 lg:order-2 md:pl-10 lg:pl-20">
            <h1 className="text-center md:text-left lg:text-[48px] md:text-3xl sm:text-3xl text-3xl font-semibold leading-[46px] lg:leading-[56px] not-italic text-gray-900">
              প্রতি সপ্তাহেই যোগ হচ্ছে
              <br />
              ১২টির বেশি নতুন কোর্স
            </h1>
            <p className="text-center max-w-full md:max-w-[440px] text-[16px] font-normal md:text-justify not-italic leading-[24px] text-gray-700 mt-4 md:mb-4 lg:mb-12 mb-4">
              এক সাবস্ক্রিপশনে পাচ্ছেন প্রতি সপ্তাহে ১২+ নতুন কোর্স! ক্যারিয়ার
              স্কিল, ফ্রিল্যান্সিং গাইড, কিংবা পার্সোনাল গ্রোথ—সব কিছু এক
              প্ল্যাটফর্মে, বাংলায়, হাতে-কলমে শেখার অভিজ্ঞতায়। নতুন কিছু যোগ
              হচ্ছে এখনই, মিস করবেন না! শেখা শুরু করুন আজ!
            </p>
            <div className="flex justify-center md:justify-start mb-4 md:mb-0">
              <PrimeSubscriptionButton variant="expired" />
            </div>
          </div>
        </div>

        <div
          className="hidden 2xl:block absolute w-[90px] aspect-[1/1] flex-shrink-0 overflow-hidden"
          style={{
            right: "-50px",
            bottom: "172px",
            background: `linear-gradient(to bottom right, #F81 0%, #FF9C5E 50%) bottom right / 50% 50% no-repeat, 
       linear-gradient(to bottom left, #F81 0%, #FF9C5E 50%) bottom left / 50% 50% no-repeat, 
       linear-gradient(to top left, #F81 0%, #FF9C5E 50%) top left / 50% 50% no-repeat, 
       linear-gradient(to top right, #F81 0%, #FF9C5E 50%) top right / 50% 50% no-repeat`,
            filter: "blur(111.65166473388672px)",
          }}
        />
      </section>

      {/* Prime promotional Section */}
      <section className="md:py-12 pt-6 md:pt-0">
        {/* Mobile Card Layout */}
        <div className="md:hidden bg-white rounded-xl border overflow-hidden">
          <div className="w-full">
            <Image
              src={image2}
              alt="image-2"
              width={500}
              height={400}
              placeholder="blur"
              priority
              quality={75}
              className="w-full h-auto"
            />
          </div>
          <div className="p-2 sm:p-4 py-6">
            <h2 className="text-center text-3xl font-semibold leading-[46px] not-italic text-gray-900">
              ফ্রি কোর্স আপনার হবে, শুধু
              <br />
              প্রাইম সাবস্ক্রিপশনেই
            </h2>
            <p className="text-center text-[16px] font-normal not-italic leading-[24px] text-gray-700 mt-4 mb-4">
              প্রাইম সাবস্ক্রিপশন গ্রহণের মাধ্যমে আপনি পেয়ে যাবেন উচ্চমানের
              ফ্রি কোর্সসমূহ। আপনার স্কিল উন্নয়নের জন্য প্রয়োজনীয় সবকিছু
              থাকবে এক প্ল্যাটফর্মে। সময়, মান ও অর্থ—সবদিক থেকে এটি হবে আপনার
              শেখার সবচেয়ে কার্যকর ও সাশ্রয়ী সিদ্ধান্ত।
            </p>
            <div className="flex justify-center">
              <PrimeSubscriptionButton variant="expired" />
            </div>
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="md:pr-10 lg:pr-0">
            <h2 className="text-center md:text-left lg:text-[48px]  md:text-3xl sm:text-3xl text-3xl font-semibold leading-[46px] lg:leading-[56px] not-italic text-gray-900">
              ফ্রি কোর্স আপনার হবে, শুধু
              <br />
              প্রাইম সাবস্ক্রিপশনেই
            </h2>
            <p className="text-center max-w-full md:max-w-[440px] text-[16px] font-normal md:text-justify not-italic leading-[24px] text-gray-700 mt-4 md:mb-4 lg:mb-12 mb-4">
              প্রাইম সাবস্ক্রিপশন গ্রহণের মাধ্যমে আপনি পেয়ে যাবেন উচ্চমানের
              ফ্রি কোর্সসমূহ। আপনার স্কিল উন্নয়নের জন্য প্রয়োজনীয় সবকিছু
              থাকবে এক প্ল্যাটফর্মে। সময়, মান ও অর্থ—সবদিক থেকে এটি হবে আপনার
              শেখার সবচেয়ে কার্যকর ও সাশ্রয়ী সিদ্ধান্ত।
            </p>
            <div className="flex justify-center md:justify-start mb-4 md:mb-0">
              <PrimeSubscriptionButton variant="expired" />
            </div>
          </div>
          <div>
            <Image
              src={image2}
              alt="image-2"
              width={500}
              height={400}
              className="rounded-xl w-full h-auto md:px-0 px-0"
              placeholder="blur"
              quality={75}
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrimePromotionalSection;
