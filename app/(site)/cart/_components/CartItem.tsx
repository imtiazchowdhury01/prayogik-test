import Image from "next/image";
import React from "react";

const CartItem = () => {
  return (
    <div className="flex py-4 space-x-4 border-b-[1px] border-[#CBD5E1] border-dashed last:border-0">
      <Image
        src={"/laptop.png"}
        alt="laptop"
        width={96}
        height={72}
        className="object-cover rounded-lg"
      />
      <div className="flex flex-col w-full sm:justify-between sm:space-x-4 sm:flex-row">
        <div>
          <p className="text-base font-bold text-fontcolor-title">
            রিয়েল প্রজেক্টস এর মাধ্যমে কোল্ড ইমেল মার্কেটিং শিখুন{" "}
          </p>
          <p className="flex items-center mt-1 space-x-2 text-sm text-fontcolor-paragraph">
            <span>৩ ঘণ্টা ৩০ মিনিট</span>
            <span className="w-[4px] h-[4px] bg-gray-400 inline-block rounded-full"></span>
            <span>৭টি লেসন</span>
          </p>
        </div>
        <div className="flex justify-between space-x-4">
          <p className="text-lg font-bold text-primary-brand">৳৫০০০</p>
          <button className="bg-[#F8FAFC] hover:opacity-70 transition-all duration-300 w-7 h-7 rounded-md flex items-center justify-center">
            <Image
              src={"/icon/trash.svg"}
              alt="trash-icon"
              width={16}
              height={16}
              className="object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
