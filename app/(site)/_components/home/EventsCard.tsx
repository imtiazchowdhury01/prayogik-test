import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaAngleRight } from "react-icons/fa6";

const EventsCard = () => {
  return (
    <div className="p-6 space-y-3 bg-white rounded-lg">
      <h6 className="text-primary-700 text-xl font-bold mb-6">
        ডিজিটাল মার্কেটিং ইভেন্ট
      </h6>
      <div className="flex items-start space-x-2">
        <Image src={"/icon/money.svg"} alt="location" width={18} height={18} />
        <p className="text-greyscale-700 text-base">পেইড ইভেন্ট</p>
      </div>
      <div className="flex items-start space-x-2">
        <Image
          src={"/icon/location.svg"}
          alt="location"
          width={18}
          height={18}
        />
        <p className="text-fontcolor-description text-base">জিইসি, চট্টগ্রাম</p>
      </div>
      <div className="flex items-start space-x-2">
        <Image
          src={"/icon/calendar.svg"}
          alt="location"
          width={18}
          height={18}
        />
        <p className="text-fontcolor-description text-base">
          ০৬ ফেব্রুয়ারী ২০২৫
        </p>
      </div>
      <div className="flex items-start space-x-2">
        <Image src={"/icon/clock.svg"} alt="location" width={18} height={18} />
        <p className="text-fontcolor-description text-base">
          ৯:৩০ am - ১১:৩০ pm
        </p>
      </div>
      <button className="w-full">
        <Link
          href={"/event"}
          className="text-primary-brand  bg-primary-50 flex items-center space-x-2 justify-center rounded-md hover:bg-transparent border-[1px] border-transparent hover:border-primary transition-all duration-300 mt-3 py-3"
        >
          <span>আরো দেখুন</span> <FaAngleRight />
        </Link>
      </button>
    </div>
  );
};

export default EventsCard;
