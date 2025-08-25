import Image from "next/image";
import missionimage from "public/images/about/ourmission.webp";

const Mission = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-center">
      <div className="space-y-4 lg:col-span-3 text-justify">
        <div className="text-sm bg-[#F2F3F3] w-fit py-1.5 px-3 rounded">
          মূল উদ্দেশ্য
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
          আমাদের মিশন
        </h2>
        <div className="space-y-3 lg:space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
          <p>
            বাংলাদেশে আধুনিক উন্নয়নশীল দেশ হিসেবে পরিচিত এক অগ্রগামী
            প্ল্যাটফর্ম প্রতিষ্ঠা। যেখানে ডিজিটাল সাক্ষরতা, কর্মসংস্থান,
            ব্যবসায়িক আইডিয়া থেকে নিয়ে প্রযুক্তিগত দক্ষতা পর্যন্ত সব বিষয়ে
            ব্যাপক প্রশিক্ষণ দেওয়া হবে এবং সুযোগ সৃষ্টি হবে।
          </p>
          <p>
            আমরা বিশ্বাস করি, আর সময় কাটানোর অভিজ্ঞতা ও দক্ষতার মাধ্যমে মেধাবী
            আলোর দেশ। আমাদের লক্ষ্য সহজ, কার্যকরী এবং ব্যবহারিক প্রশিক্ষণের
            মাধ্যমে আধুনিক কর্ম দক্ষতা তৈরি করা। আমাদের প্রতিটি কোর্স সাজানো
            হয়েছে হাতে-কলমে প্রশিক্ষণ, দেশ স্থানীয় আর বাজার জীবনের উপযুক্ত
            দিক, যাতে শিক্ষার্থী কাজ করতে পারে যায়।
          </p>
          <p>
            প্রশিক্ষণ নিয়েছে বিশ্ব বিশ্বমানের অভিজ্ঞতা, যারা আধুনিকতার
            প্রয়োজনীয় দক্ষতা শেখানো। তাদের থেকে শিক্ষার্থী, প্রতিষ্ঠানগুলোর এই
            বাজারে নিজেদের যোগ্য করে গড়ে তুলতে পারবেন সর্বোচ্চ পর্যায়ে এগিয়ে।
          </p>
        </div>
      </div>
      <div className="relative self-end  w-full lg:w-auto mt-6 lg:mt-0">
        <Image
          src={missionimage}
          alt="vision"
          width={253.05}
          height={177.763}
          className="rounded-lg object-cover w-full lg:w-[253.05px] h-auto"
          sizes="(max-width: 1024px) 100vw, 253.05px"
          placeholder="blur"
          quality={75}
        />
      </div>
    </section>
  );
};

export default Mission;
