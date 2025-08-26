import Image from "next/image";

const OurStory = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-center">
      <div className="space-y-4 lg:col-span-3 text-justify">
        <div className="text-sm bg-[#F2F3F3] w-fit py-1.5 px-3 rounded">
          শুরু থেকে
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
          আমাদের গল্প
        </h2>
        <div className="space-y-3 lg:space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
          <p>
            প্রযুক্তিগত ক্ষেত্রে হয়েছিল একটি সাধারণ লক্ষ্য থেকে—আমাদের দেশের
            জীবনের প্রয়োজনে কাজের কথা। আমরা বিশ্বাস করি, দেশের প্রতিটি তরুণ এবং
            তরুণী মেধা রয়েছে। কিন্তু, উপযুক্ত এবং দক্ষতার সুযোগের অভাবে এমন
            একটি প্ল্যাটফর্ম তৈরি করতে, যেখানে ব্যবহারকারীরা তাদের শিক্ষার্থী,
            বাজার প্রয়োজন করতে শিখতে।
          </p>
          <p>
            আমাদের যাত্রা শুরু হয় কয়েকজনের শিক্ষাগুরুত্বী ও কর্মসংস্থানের
            ঘাটতি, যারা বাজার অভিজ্ঞতার মাধ্যমে দেখেছে সঠিক ও কার্যকর কোর্সের
            অভাবে দেশের তরুণরা সঠিক দিক নির্দেশনা পাচ্ছে না। সেখান থেকে আমাদের
            স্বপ্ন জন্ম নিল, যেখানে এক বাজারের চাহিদা অনুযায়ী দক্ষতা উন্নয়ন
            সম্ভব হবে।
          </p>
          <p>
            আজ, প্রযুক্তিগত একটি কর্মসংস্থানী—যেখানে শেখা যায় নতুন দক্ষতা নয়,
            বরং বাজার জীবনের এগিয়ে সাহায্যের হাতিয়ার।
          </p>
        </div>
      </div>
      <div className="relative self-end  w-full lg:w-auto mt-6 lg:mt-0">
        <Image
          src="/images/about/ourstory.webp"
          alt="vision"
          width={253.05}
          height={177.763}
          className="rounded-lg object-cover w-full lg:w-[253.05px] h-auto"
          sizes="(max-width: 1024px) 100vw, 253.05px"
        />
      </div>
    </section>
  );
};

export default OurStory;
