// @ts-nocheck
import Image from "next/image";
import PrimeSubscriptionButton from "./PrimeSubscriptionButton";

const PrimePromotionalSection = () => {
  return (
    <div className="max-w-7xl mx-auto py-16 px-6 md:px-8 lg:px-5 xl:px-5 2xl:px-0">
      {/* Prime promotional Section */}
      <section className="md:py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1">
            <Image
              src="/images/prime/image-1.webp"
              alt="Professional man in office"
              width={500}
              height={400}
              className="rounded-lg w-full h-auto"
            />
          </div>
          <div className="order-1 lg:order-2 md:pl-10 lg:pl-20">
            <h1 className="text-center md:text-left xl:text-[48px] text-4xl font-semibold leading-[46px] lg:leading-[56px] not-italic text-gray-900">
              প্রতি সপ্তাহেই যোগ হচ্ছে
              <br />
              ১২টির বেশি নতুন কোর্স
            </h1>
            <p className="text-center max-w-full md:max-w-[440px] text-[16px] font-normal md:text-justify not-italic leading-[24px] text-gray-700 mt-4 md:mb-4 lg:mb-12 mb-4">
              এক সাবস্ক্রিপশনে পাচ্ছেন প্রতি সপ্তাহে ১২+ নতুন কোর্স! ক্যারিয়ার
              স্কিল, ফ্রিল্যান্সিং গাইড, কিংবা পার্সোনাল গ্রোথ—সব কিছু এক
              প্ল্যাটফর্মে, বাংলায়, হাতে-কলমে শেখার অভিজ্ঞতায়। নতুন কিছু যোগ
              হচ্ছে এখনই, মিস করবেন না! শেখা শুরু করুন আজ!
            </p>
            <div className="flex justify-center md:justify-start mb-4 md:mb-0">
              <PrimeSubscriptionButton />
            </div>
          </div>
        </div>
        <div
          className="hidden lg:block absolute w-[90px] aspect-[1/1] flex-shrink-0"
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
      <section className="md:py-12 pt-16 md:pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="md:pr-10 lg:pr-0">
            <h2 className="text-center md:text-left xl:text-[48px] text-4xl font-semibold leading-[46px] lg:leading-[56px] not-italic text-gray-900">
              ফ্রি কোর্স আপনার হবে, শুধু
              <br />
              প্রাইম সাবস্ক্রিপশনেই
            </h2>
            <p className="text-center max-w-full md:max-w-[440px] text-[16px] font-normal md:text-justify not-italic leading-[24px] text-gray-700 mt-4 md:mb-4 lg:mb-12 mb-4">
              প্রাইম সাবস্ক্রিপশন গ্রহণের মাধ্যমে আপনি পেয়ে যাবেন উচ্চমানের ফ্রি
              কোর্সসমূহ। আপনার স্কিল উন্নয়নের জন্য প্রয়োজনীয় সবকিছু থাকবে এক
              প্ল্যাটফর্মে। সময়, মান ও অর্থ—সবদিক থেকে এটি হবে আপনার শেখার
              সবচেয়ে কার্যকর ও সাশ্রয়ী সিদ্ধান্ত।
            </p>
            <div className="flex justify-center md:justify-start mb-4 md:mb-0">
              <PrimeSubscriptionButton />
            </div>
          </div>
          <div>
            <Image
              src="/images/prime/image-2.webp"
              alt="Smiling professional man"
              width={500}
              height={400}
              className="rounded-lg w-full h-auto md:px-1 px-0"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrimePromotionalSection;
