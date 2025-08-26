// @ts-nocheck
import React from "react";
import SubscriptionPurchaseButton from "./SubscriptionPurchaseButton";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

const SubscriptionBottomCard = ({ subscription, userSubscription }) => {
  const price = subscription?.regularPrice || 0;
  const subscriptionDiscountPercentage = convertNumberToBangla(
    subscription?.subscriptionDiscount?.discountPercentage
  );
  return (
    <section className="flex justify-center items-center px-5 py-16 md:py-[100px] max-w-xl mx-auto">
      <div className="flex flex-col items-center w-full gap-10 max-sm:gap-6">
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold leading-[1.2] text-center  text-slate-900 max-md:text-3xl max-sm:text-3xl ">
            <span>সব</span>
            <span className="bg-gradient-to-r from-[#F9851A] to-[#F101E2] bg-clip-text text-transparent">
              {" "}
              প্রিমিয়াম{" "}
            </span>
            <span>
              ও স্টান্ডার্ড কোর্স বিশেষ অফারে পেতে আজই সাবস্ক্রাইব করুন
            </span>
          </h1>
          <p className="text-lg leading-7 text-center text-slate-600 max-md:text-base max-md:leading-6 max-sm:text-sm max-sm:leading-5">
            প্রায়োগিক প্রিমিয়ামে সাবস্ক্রাইব করে সাশ্রয়ী মূল্যে গড়ে তুলুন
            সর্বাধিক চাহিদাসম্পন্ন স্কিল—আপনার ভবিষ্যতের জন্য একটি স্মার্ট
            বিনিয়োগ।
          </p>
        </header>

        <div className="relative w-full transition-all duration-300 shadow-lg rounded-xl bg-gradient-to-br hover:shadow-xl">
          <div
            className={`bg-gradient-to-r from-[#F9851A] to-[#F101E2] p-[1px] m-[1px] rounded-lg w-full`}
          >
            <div
              className={`bg-gradient-to-r from-[#FAEDE7] to-[#FAE6F7] h-full rounded-lg px-6 py-10 flex flex-row justify-between items-center`}
            >
              <div className="flex flex-col w-full">
                <p className="text-3xl font-bold leading-10 text-slate-900">
                  ৳{convertNumberToBangla(price)}{" "}
                  <span className="text-sm font-medium leading-5 text-slate-900">
                    / {subscription?.type === "MONTHLY" ? "মাসিক" : "বার্ষিক"}{" "}
                  </span>
                </p>

                <p className="text-sm leading-5 text-slate-600">
                  প্রিমিয়াম মেম্বারশীপে {subscriptionDiscountPercentage}%
                  সাশ্রয় করুন
                </p>
              </div>

              <div className="flex flex-col items-center w-full gap-2 ">
                <SubscriptionPurchaseButton
                  subscription={subscription}
                  userSubscription={userSubscription}
                  isBottomCard={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionBottomCard;
