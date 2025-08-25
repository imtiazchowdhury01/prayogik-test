import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
import SubscriptionPlans from "./SubscriptionPlans";
// import OfferActionBanner from "./OfferActionBanner";
// import { actionBannerData } from "../_utils/data";

const SpecialLaunchingOffer = () => {
  return (
    <div>
      <SectionTitle
        title="লঞ্চিং স্পেশাল প্রাইম মেম্বারশিপ ফি"
        description='সীমিত সময়ের জন্য, প্রয়োগিক প্রাইম-এর "Special Offer Sale"-এ সীমিত সংখ্যক সাবস্ক্রিপশনের উপর বিশেষ মূল্যে প্রাইম মেম্বারশিপ অফার চলছে।  Special Offer Sale চলাকালীন সময়েই প্রাইম মেম্বারশিপের মূল্য ধাপে ধাপে ১০% হারে বাড়তে থাকবে, যতক্ষণ না এটি রেগুলার মূল্যে সমান হয়'
        descriptionClassName="max-w-3xl md:px-4"
      />
      
      {/* subscription plan section */}
      <SubscriptionPlans />
    </div>
  );
};

export default SpecialLaunchingOffer;
