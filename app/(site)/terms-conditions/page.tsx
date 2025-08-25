import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | User Agreement & Policies | Prayogik",
  description:
    "Review the terms and conditions for using Prayogik. Understand your rights, responsibilities, and our policies to ensure a safe and fair learning experience.",
};
const TermsAndCondition = () => {
  return (
    <main className="min-h-[70vh] bg-white">
      {/* container-- */}
      <div className="w-full max-w-4xl px-5 py-10 mx-auto sm:py-14">
        <h1 className="text-3xl font-bold text-card-black-text sm:text-5xl mb-5 md:mb-10">
          ব্যবহারকারীর শর্তাবলি
        </h1>
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              ব্যবহারের শর্তাবলী মেনে নিন
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              আমাদের ওয়েবসাইট ব্যবহার, রেজিস্ট্রেশন বা যেকোনো সেবা নেওয়ার মানে
              হলো—আপনি এই শর্তগুলো পড়ে বুঝে সম্মতি দিচ্ছেন। শর্তের কোনো অংশে
              আপত্তি থাকলে সেবা ব্যবহার বন্ধ করুন।
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              আমাদের সেবা:
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              আমরা স্কিল ডেভেলপমেন্ট কোর্স, গাইডেন্স ও প্রফেশনাল ট্রেনিং দিই।
              সেবার মান ভালো রাখার চেষ্টা করি, কিন্তু প্রত্যেকের ফলাফল তার নিজের
              চেষ্টা ও পরিস্থিতির ওপর নির্ভর করে।
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              ব্যবহারকারীর দায়িত্ব:
            </h4>
            <ol className="list-disc list-inside">
              <li className="text-base font-medium text-fontcolor-description">
                <b className="text-fontcolor-title">সঠিক তথ্য দিন: </b> আমাদের প্রোফাইল ছবি, অ্যাকাউন্ট আইডি,
                ডিভাইসের আপডেট রাখুন।
              </li>
              <li className="text-base font-medium text-fontcolor-description">
                <b className="text-fontcolor-title">সক্রিয় থাকুন: </b> ক্লাস, অ্যাসাইনমেন্ট বা পরামর্শে নিয়মিত
                অংশ নিন।
              </li>
              <li className="text-base font-medium text-fontcolor-description">
                <b className="text-fontcolor-title">সেবার সঠিক ব্যবহার: </b> অবৈধ কাজ, অন্যদের ক্ষতি বা কপিরাইট
                লঙ্ঘন থেকে বিরত থাকুন।
              </li>
            </ol>
          </div>

          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              গোপনীয়তা:
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              আপনার তথ্য গোপন রাখতে আমরা গোপনীয়তা নীতিমালা মেনে চলি। নিরাপত্তার
              জন্য আধুনিক প্রযুক্তি ব্যবহার করি, তবে ইন্টারনেটে ১০০% নিরাপত্তার
              গ্যারান্টি দেওয়া সম্ভব নয়। আইনি কারণ ছাড়া কাউকে আপনার তথ্য দেয়া
              হবে না।
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              রিফান্ড ও বাতিল:
            </h4>
            <ol className="list-disc list-inside">
              <li className="text-base font-medium text-fontcolor-description">
                <b>কোর্স রিফান্ড: </b> কোর্স কেনার ৭ দিনের মধ্যে রিফান্ড চাইতে
                পারবেন (শুধুমাত্র এককালীন ক্রয়ে)।
              </li>
              <li className="text-base font-medium text-fontcolor-description">
                <b>সাবস্ক্রিপশন বাতিল: </b> যেকোনো সময় সাবস্ক্রিপশন বাতিল করতে
                পারবেন, তবে টাকা ফেরত পাবেন না।
              </li>
            </ol>
          </div>

          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              দায়বদ্ধতার সীমা:
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              আমাদের সেবা ব্যবহারে কোনো ক্ষতি হলে আমরা দায়িত্ব নেব না। সর্বোচ্চ
              দায়বদ্ধতা আপনার দেওয়া ফি এর পরিমাণের সমান।
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              কন্টেন্টের মালিকানা:
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              কোর্সের ভিডিও, নোট, ডিজাইন—সবই আমাদের মালিকানাধীন। অনুমতি ছাড়া
              কপি, শেয়ার বা বিক্রি করা যাবে না। এতে কপিরাইট আইনে ব্যবস্থা নেওয়া
              হতে পারে।
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              ওয়েবসাইট ব্যবহারের নিয়ম:
            </h4>
            <ol className="list-disc list-inside">
              <li className="text-base font-medium text-fontcolor-description">
                আইন মেনে চলুন।
              </li>
              <li className="text-base font-medium text-fontcolor-description">
                ওয়েবসাইটের ক্ষতি বা নিরাপত্তা ভাঙার চেষ্টা করবেন না (যেমন:
                হ্যাকিং, ভাইরাস ছড়ানো)।
              </li>
              <li className="text-base font-medium text-fontcolor-description">
                কোনো সমস্যা দেখলে আমাদের জানান।
              </li>
            </ol>
          </div>

          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              অন্য সাইটের লিঙ্ক:
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              আমাদের সাইটে তৃতীয় পক্ষের লিঙ্ক থাকতে পারে। তাদের কনটেন্ট বা
              গোপনীয়তা নীতির জন্য আমরা দায়ী নই। তাদের সাইট ব্যবহার এর শর্ত পড়ে
              নিন।
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              শর্তাবলী পরিবর্তন:
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              প্রয়োজনে আমরা শর্ত বদলাতে পারি। পরিবর্তনগুলো ওয়েবসাইটে আপডেট করা
              হবে। ব্যবহার চালিয়ে গেলে নতুন শর্ত মেনে নিচ্ছেন বলে ধরা হবে।
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xl font-bold text-fontcolor-title">
              সেবা বন্ধ করা:
            </h4>
            <p className="text-base font-medium text-fontcolor-description">
              নিয়ম ভাঙা, অপব্যবহার বা অন্য কোনো কারণেই আমরা আপনার অ্যাকাউন্ট
              বন্ধ করে দিতে পারি। আগে জানানো বাধ্যতামূলক নয়।
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsAndCondition;
