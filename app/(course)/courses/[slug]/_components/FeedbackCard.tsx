import Image from "next/image";
import React from "react";
const FeedbackCard = () => {
  return (
    <div className="border-[1px] border-greyscale-300 rounded-lg p-5 flex flex-col justify-between space-y-5">
      <p className="text-base text-fontcolor-title">
        অফলাইনে শেখার মত সময় হয়ে উঠছিল না, তাই অনলাইন কোর্স কে বেছে নেওয়া,
        কোর্সটিতে খুব সুন্দর করে পড়ানো হয়েছে।
      </p>
      <div className="flex items-center space-x-2">
        <Image
          src={"/avatar.png"}
          alt={"avatar"}
          width={0}
          height={0}
          sizes="40px"
          className={"object-cover rounded-full"}
        />
        <div>
          <p className="text-base font-bold text-fontcolor-title">আসলাম খান </p>
          <p className="text-xs text-fontcolor-paragraph">ডিজিটাল মার্কেটিং</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
