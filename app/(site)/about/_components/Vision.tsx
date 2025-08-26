import Image from "next/image";

const Vision = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-center pb-10">
      <div className="space-y-4 lg:col-span-3 text-justify">
        <div className="text-sm bg-[#F2F3F3] w-fit py-1.5 px-3 rounded">
          আমাদের পথ
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
          আমাদের ভিশন
        </h2>
        <div className="space-y-3 lg:space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed md:text-left text-justify">
          <p>
            প্রযুক্তির জগতে প্রতিনিয়ত পরিবর্তন হচ্ছে, আর সেই পরিবর্তনের সাথে তাল
            মিলিয়ে পথ হাঁটছে প্রায়োগিক। আমাদের ভিশন খুবই স্পষ্ট—জ্ঞানকে
            ব্যবহারিক করে তোলা। আমরা বিশ্বাস করি, শেখা মানেই শুধু বইয়ের পাতায়
            সীমাবদ্ধ নয়; বাস্তব জীবনের সমস্যার সমাধানেও সেই জ্ঞান কাজে লাগাতে
            হবে।
          </p>
          <p>
            আমরা এমন একটি প্ল্যাটফর্ম গড়েছি যেখানে শিক্ষার্থী, নবীন পেশাজীবী বা
            আগ্রহী কেউই হাতে-কলমে শেখার সুযোগ পায়। আমাদের স্বপ্ন, একদিন যেকোনো
            মানুষ তার ধারণাকে বাস্তবে রূপ দিতে পারবে শুধু নিজের চেষ্টা আর
            প্রায়োগিক এর সহায়তায়।
          </p>
          <p>
            ভবিষ্যতের জন্যই আমরা কাজ করছি—যেখানে শিক্ষা মানে হবে ‘চর্চার মাধ্যমে
            উন্নয়ন’, আর প্রতিটি শেখার অভিজ্ঞতা হবে বাস্তবভিত্তিক, উদ্ভাবনী এবং
            উদ্দেশ্যপূর্ণ।
          </p>
        </div>
      </div>
      <div className="relative self-end  w-full lg:w-auto mt-6 lg:mt-0">
        <Image
          src="/images/about/ourvision.webp"
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

export default Vision;
