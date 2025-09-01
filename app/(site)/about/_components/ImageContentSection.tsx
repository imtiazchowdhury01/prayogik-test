import React from "react";
import Image from "next/image";

const ImageContentSection = () => {
  return (
    <section className="md:max-w-4xl max-w-7xl px-6 xl:px-0 mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-12">
        {/* Image Container - Takes half width on medium screens and up */}
        <div className="w-full md:w-1/2 relative h-64 md:h-96 rounded-xl">
          <Image
            src="/site/about/about-hero.webp"
            alt="Prayogik Team"
            fill
            className="object-cover rounded-xl mt-1.5"
            priority
          />
        </div>

        {/* Content Container - Takes half width on medium screens and up */}
        <div className="w-full md:w-1/2">
          <h2 className="md:text-5xl text-3xl font-bold mb-5 text-gray-800">
            আমাদের লক্ষ্য
          </h2>
          <p className="text-gray-600 text-base text-justify">
            Prayogik শুরু হয়েছে একটি সহজ বিশ্বাস থেকে—
            <strong>
              বাংলাদেশে প্রচুর তরুণ আছেন যারা ডিজিটাল মার্কেটিং শিখতে চান,
              কিন্তু মানসম্মত ও সহজলভ্য রিসোর্সের অভাবে পিছিয়ে পড়েন।
            </strong>{" "}
            আমরা সেই সমস্যার সমাধান করতে চাই। এক্সপার্টদের তৈরি কোর্স ও
            ট্রেনিংয়ের মাধ্যমে আমরা শেখাকে সবার জন্য সহজ, সাশ্রয়ী এবং
            প্র্যাক্টিক্যাল করছি।
            <br /> <br />
            এই যাত্রার মূল ভিশন হলো{" "}
            <strong>
              বাংলাদেশে দক্ষ ডিজিটাল মার্কেটারের ঘাটতি দূর করে একটি শক্তিশালী
              ট্যালেন্ট ইকোসিস্টেম তৈরি করা।
            </strong>{" "}
            আমরা মানের সাথে আপস না করে সবার জন্য সাশ্রয়ী ও সহজলভ্য শিক্ষা
            নিশ্চিত করতে চাই, যাতে শিক্ষার্থীরা ক্যারিয়ার গড়তে পারে এবং
            ইন্ডাস্ট্রি পায় প্রশিক্ষিত পেশাজীবী। আমাদের মিশন হলো শেখাকে শুধু
            থিওরিতে সীমাবদ্ধ না রেখে{" "}
            <strong>
              বাস্তব অভিজ্ঞতা, কেস স্টাডি, প্রোজেক্ট ওয়ার্ক এবং
              ইন্ডাস্ট্রি-রিলেভেন্ট ট্রেনিংয়ের মাধ্যমে শিক্ষার্থীদের
              বাজার-উপযোগী করে তোলা।
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImageContentSection;
