import Link from "next/link";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Your Data, Our Responsibility | Prayogik",
  description:
    "Learn how Prayogik collects, uses, and protects your personal information. Your privacy and data security are important to us—read our full privacy policy here.",
};

const PrivacyPolicyPage = () => {
  return (
    <main className="min-h-[70vh] bg-white">
      {/* container-- */}
      <div className="w-full max-w-4xl px-5 py-10 mx-auto sm:py-14">
        <h1 className="text-3xl font-bold text-card-black-text sm:text-5xl mb-5 md:mb-10">
          গোপনীয়তা নীতি
        </h1>
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base font-medium text-fontcolor-description">
              প্রায়োগিক বাংলাদেশে ডিজিটাল মার্কেটিং শেখানোর ক্ষেত্রে অনন্য
              প্রতিষ্ঠান। এখানে আপনি অনলাইনে রেকর্ডেড বা লাইভ ক্লাস করতে পারবেন।
              আমরা আপনার গোপনীয়তা রক্ষা করবো বলে প্রতিশ্রুতি দিচ্ছি। আপনার
              ব্যক্তিগত তথ্য আমাদের কাছে নিরাপদে সংরক্ষিত থাকবে।
            </p>
            <p className="text-base font-medium text-fontcolor-description">
              এই গোপনীয়তা নীতিমালায় আমরা কীভাবে আপনার তথ্য সংগ্রহ করি তা বলা
              হয়েছে। পাশাপাশি, আপনার তথ্য দেখা, সংশোধন করা বা সীমিত করার
              অধিকারগুলিও এখানে উল্লেখ করা আছে।
            </p>
            <p className="text-base font-medium text-fontcolor-description">
              আমাদের প্ল্যাটফর্মে সেবা নেওয়ার মাধ্যমে বা সদস্য হয়ে আপনি এই
              নীতিমালার শর্তগুলো স্বীকার করে নিচ্ছেন।
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              ব্যক্তিগত তথ্য সংগ্রহ:
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              আপনি আমাদেরকে যেসব ব্যক্তিগত তথ্য (যেমন: নাম, ইমেইল, জন্মতারিখ,
              ফোন নম্বর) দেন, সেগুলো সঠিক কিনা তা নিশ্চিত করা আপনার দায়িত্ব।
            </p>
            <p className="text-base font-medium text-fontcolor-description">
              আমরা আপনার প্রোফাইল ছবি, অ্যাকাউন্ট আইডি, ডিভাইসের অবস্থান,
              লিঙ্গসহ অন্যান্য তথ্য সংগ্রহ করতে পারি। এছাড়া, আপনি যদি আমাদের
              সহায়তা টিমের সাথে যোগাযোগ করেন, তাহলে আপনার আইপি অ্যাড্রেস, কোর্স
              সম্পর্কিত আপডেট বা সমস্যার বিবরণও সংরক্ষণ করা হতে পারে।
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              তথ্যের নিরাপত্তা:
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              আপনার তথ্য সুরক্ষিত রাখতে আমরা আধুনিক নিরাপত্তা প্রযুক্তি ব্যবহার
              করি। তবে মনে রাখবেন, ইন্টারনেটে কোনো তথ্য পাঠানো বা সংরক্ষণ করা
              ১০০% নিরাপদ নয়। আমরা সর্বোচ্চ চেষ্টা করলেও পুরোপুরি নিরাপত্তা
              নিশ্চিত করা সম্ভব নয়।
            </p>
            <p className="text-base font-medium text-fontcolor-description">
              আপনার তথ্য সুরক্ষিত রাখতে আমরা সর্বোচ্চ চেষ্টা করি। তবে,
              পাসওয়ার্ড সুরক্ষিত রাখাও আপনার দায়িত্ব। এটি কারো সাথে শেয়ার
              করবেন না। পাসওয়ার্ড চুরি বা অ্যাকাউন্টে সমস্যা মনে হলে দ্রুত
              পরিবর্তন করুন এবং আমাদের জানান।
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              অনলাইন বিজ্ঞাপন:
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              আমরা ফেসবুক, গুগল বা অন্যান্য প্ল্যাটফর্মে আপনার আগ্রহ ও
              কার্যকলাপের ভিত্তিতে বিজ্ঞাপন দেখাতে পারি। মোবাইল বা কম্পিউটারে এই
              বিজ্ঞাপন কাস্টমাইজ করতে চাইলে ডিভাইসের সেটিংস থেকে নিয়ন্ত্রণ করতে
              পারেন (যেমন: iOS, Android, Windows-এ আলাদা অপশন থাকে)। আমরা
              সুরক্ষিত রাখতে আমরা অ্যাক্সেস প্রদান কর।
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              আপনার অধিকার:
            </h4>

            <ol className="list-disc ml-10">
              <li className="text-base font-medium text-fontcolor-description">
                আপনার দেওয়া তথ্য দেখতে বা আপডেট করতে পারবেন।
              </li>
              <li className="text-base font-medium text-fontcolor-description">
                অ্যাকাউন্ট সেটিংস থেকে যেকোনো সময় অ্যাকাউন্ট বন্ধ করতে পারবেন।
              </li>
              <li className="text-base font-medium text-fontcolor-description">
                কোনো প্রশ্ন বা সমস্যা হলে আমাদের সাথে যোগাযোগ করুন।
              </li>
            </ol>
          </div>
          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              নীতিমালা পরিবর্তন:
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              প্রয়োজন হলে আমরা এই গোপনীয়তা নীতিমালা পরিবর্তন করতে পারি। কোনো
              পরিবর্তন করলে তা এই পৃষ্ঠায় আপডেট করা হবে। সর্বশেষ সংশোধনের তারিখ
              দেখে আপনি বর্তমান নিয়মগুলো জানতে পারবেন।
            </p>
          </div>
          <p className="text-base font-medium text-fontcolor-description">
            আপনার যদি আমাদের গোপনীয়তা নীতিমালা সম্পর্কে কোনও প্রশ্ন থাকে,
            অনুগ্রহ করে আমাদের সাথে{" "}
            <Link
              href="/contact"
              className="text-primary-brand hover:underline"
            >
              যোগাযোগ
            </Link>{" "}
            করুন।
          </p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
