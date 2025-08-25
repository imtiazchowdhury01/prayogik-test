import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaAngleRight } from "react-icons/fa6";

const BootcampCard = () => {
  return (
    <div className="p-6 bg-white rounded-lg">
      <h6 className="text-primary-700 text-xl font-bold">
        ডিজিটাল মার্কেটিং বুটক্যাম্প
      </h6>
      <p className="text-greyscale-700 font-medium text-sm mb-6">
        ডিজিটাল মার্কেটিং শেখার জন্য ইন্ডাস্ট্রি ফোকাসড বুটক্যাম্প। আপনি আপনার
        নিজস্ব গতিতে শিখবেন।
      </p>
      <div className="flex flex-col space-y-3">
        <div className="flex items-start space-x-2">
          <Image src={"/icon/clock.svg"} alt="clock" width={18} height={18} />
          <p className="text-fontcolor-description text-base">ফুল-টাইম</p>
        </div>

        <div className="flex items-start space-x-2">
          <Image
            src={"/icon/calendar.svg"}
            alt="calender"
            width={18}
            height={18}
          />
          <div>
            <p className="text-fontcolor-description text-base">
              ২১ জানুয়ারী থেকে ১১ এপ্রিল
            </p>
            <ul className="text-fontcolor-description text-sm space-y-1 list-disc pl-4 pt-1">
              <li>সোমবার থেকে শুক্রবার</li>
              <li>১২ সপ্তাহের বুটক্যাম্প </li>
            </ul>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <Image
            src={"/icon/receipt-add.svg"}
            alt="location"
            width={18}
            height={18}
          />
          <p className="text-fontcolor-description text-base">
            ১২ জানুয়ারী থেকে ১৮ জানুয়ারী পর্যন্ত রেজিস্ট্রেশন তারিখ
          </p>
        </div>
        <Link
          href={"/bootcamp"}
          className="text-primary-brand bg-primary-50 flex items-center space-x-2 justify-center rounded-md hover:bg-transparent border-[1px] border-transparent hover:border-primary transition-all duration-300 mt-3 py-3"
        >
          <span>আরো দেখুন</span> <FaAngleRight />
        </Link>
      </div>
    </div>
  );
};

export default BootcampCard;
