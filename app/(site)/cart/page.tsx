import React from "react";
import { GoArrowLeft } from "react-icons/go";
import CartItem from "./_components/CartItem";
import Link from "next/link";
const CartPage = () => {
  return (
    <section className="w-full min-h-[70vh] lg:bg-[linear-gradient(to_right,#ffffff_50%,#f4f4f4_50%)]">
      <div className="flex flex-wrap app-container">
        {/* left div-- */}
        <div className="w-full lg:w-1/2 py-8 lg:py-16 lg:pr-[50px]">
          <h2 className="flex items-center mb-2 space-x-3 text-xl font-bold text-fontcolor-title">
            <Link href="/">
              <GoArrowLeft className="text-2xl" />
            </Link>
            <span>কোর্স কার্ট ডিটেলস</span>
          </h2>

          <CartItem />
          <CartItem />
        </div>
        {/* right div-- */}
        <div className="w-full lg:w-1/2 py-8 lg:py-16 lg:pl-[50px]">
          <h3 className="mb-2 text-xl font-bold text-fontcolor-title">
            <span>কোর্স অর্ডার সামারি</span>
          </h3>
          <div className="flex flex-col mt-4 space-y-5">
            <p className="flex items-center justify-between text-base font-medium ">
              <span>কোর্সের মূল্য</span>
              <span className="text-lg font-bold">৳ ৫,৫০০ টাকা</span>
            </p>
            <p className="flex items-center justify-between text-base font-medium ">
              <span>ডিস্কাউন্ট</span>
              <span className="text-lg font-bold text-error-500">
                -৳ ৫০০ টাকা
              </span>
            </p>
            <form className="flex items-center space-x-3">
              <input
                type="text"
                className="border-[1px] border-greyscale-300 rounded-md bg-background-gray h-10 focus:ring-0 focus:ring-offset-0 focus:outline-none flex-1"
              />
              <button className="h-10 p-3 text-sm font-semibold text-white transition-all duration-300 rounded-md cursor-pointer hover:bg-primary-700 bg-primary-brand">
                সাবমিট করুন
              </button>
            </form>
            <p className="flex items-center justify-between text-base font-medium border-b-[1px] border-greyscale-300 border-dashed pb-5">
              <span>প্রোমো ডিস্কাউন্ট</span>
              <span className="text-lg font-bold text-error-500">
                -৳ ০০ টাকা
              </span>
            </p>
            <div className="flex items-center justify-between">
              <p>
                <span className="text-base font-bold text-fontcolor-title">
                  সর্বমোট
                </span>
                <span className="text-greyscale-500 font-medium text-sm ml-2">
                  (ভ্যাট সহ)
                </span>
              </p>
              <p className="text-xl font-bold text-primary-brand">
                -৳ ৫,০০০ টাকা
              </p>
            </div>
            <button className="h-12 text-base font-semibold text-white transition-all duration-300 rounded-md hover:bg-primary-700 bg-primary-brand">
              শুরু করুন{" "}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
