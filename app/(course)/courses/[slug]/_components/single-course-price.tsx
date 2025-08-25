// @ts-nocheck
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import CheckoutButton from "@/components/checkoutButton/checkoutButton";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import moment from "moment";
import "moment/locale/bn";
moment.locale("bn");
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

// Skeleton Loader component
const SkeletonLoader = () => (
  <div className="border-[1px] border-primary-300 rounded-lg p-6 bg-[#f3f9f9]">
    <div className="flex flex-col mb-2 space-y-2">
      <div className="w-full h-8 bg-gray-300 rounded-md animate-pulse"></div>
      <div className="w-full h-8 bg-gray-300 rounded-md animate-pulse"></div>
    </div>
  </div>
);

const SingleCoursePrice = ({
  course: initialCourse,
  access,
  userId,
  salesData: tempSalesData,
  subscriptionsData,
  preview,
}) => {
  const [course, setCourse] = useState(initialCourse);
  const [selectedPriceOption, setSelectedPriceOption] = useState("regular");
  const [selectedPriceId, setSelectedPriceId] = useState("");
  const [subscriptions, setSubscriptions] = useState(subscriptionsData);
  const [salesData, setSalesData] = useState(tempSalesData);
  const [loading, setLoading] = useState(true);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [
    isPurchasingUnderSubscriptionPrice,
    setIsPurchasingUnderSubscriptionPrice,
  ] = useState(false);

  // Derive state values instead of storing them
  const isSubscribedUser = useMemo(
    () => subscriptions?.status === "ACTIVE",
    [subscriptions]
  );

  // Fetch course data
  const fetchCourse = useCallback(async () => {
    if (!course) {
      try {
        const response = await fetch(`/api/courses/${initialCourse.id}`);
        if (!response.ok) throw new Error("Failed to fetch course");
        const data = await response.json();
        return data.course;
      } catch (error) {
        console.error("Failed to fetch course:", error);
        return null;
      }
    }
    return course;
  }, [course, initialCourse]);

  // Combined data fetching in a single useEffect
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);

      // Run all fetch operations in parallel
      const [courseData] = await Promise.all([fetchCourse()]);

      if (courseData) {
        setCourse(courseData);
        // Find and set the lifetime price ID
        const lifetimePrice = courseData.prices.find(
          (price) => price.frequency === "LIFETIME"
        );
        if (lifetimePrice) {
          setSelectedPriceId(lifetimePrice.id);
        }
      }

      setLoading(false);
    };

    loadAllData();
  }, [fetchCourse]);

  // Helper function for discount expiry check
  const isDiscountExpired = useCallback((expiresAt) => {
    if (!expiresAt) return true;
    return new Date() > new Date(expiresAt);
  }, []);

  // Derived values using useMemo to avoid recalculation on every render
  const lifetimePrice = useMemo(
    () =>
      course?.prices?.find(
        (price) => price.frequency === "LIFETIME" && !price.isSubscriptionPrice
      ),
    [course]
  );

  const courseLifeTimePrice = useMemo(() => {
    const isExpired = isDiscountExpired(lifetimePrice?.discountExpiresOn);
    return !isExpired
      ? lifetimePrice?.discountedAmount
      : lifetimePrice?.regularAmount || 0;
  }, [lifetimePrice, isDiscountExpired]);

  const discountForMember = useMemo(
    () =>
      subscriptions?.subscriptionPlan?.subscriptionDiscount?.discountPercentage,
    [subscriptions]
  );

  const defaultDiscount = useMemo(
    () => salesData?.find((discount) => discount.isDefault),
    [salesData]
  );

  const defaultDiscountPercentage = useMemo(
    () => defaultDiscount?.discountPercentage || 0,
    [defaultDiscount]
  );

  const discountedPrice = useMemo(() => {
    if (discountForMember) {
      return (
        courseLifeTimePrice -
        Math.round(courseLifeTimePrice * (discountForMember / 100))
      );
    } else {
      return (
        courseLifeTimePrice -
        Math.round(courseLifeTimePrice * (defaultDiscountPercentage / 100))
      );
    }
  }, [courseLifeTimePrice, discountForMember, defaultDiscountPercentage]);

  const isFreeforsubscribedUser = useMemo(
    () => discountForMember === 100,
    [discountForMember]
  );

  // Handler for radio group change
  const handlePriceOptionChange = useCallback(
    (value) => {
      setSelectedPriceOption(value);
      if (value === "subscription") {
        setIsPurchasingUnderSubscriptionPrice(true);
        // Still use the lifetime price ID for checkout
        setSelectedPriceId(lifetimePrice?.id || "");
      } else {
        setIsPurchasingUnderSubscriptionPrice(false);
        setSelectedPriceId(lifetimePrice?.id || "");
      }
    },
    [lifetimePrice]
  );

  // Handler for label clicks to trigger radio selection
  const handleLabelClick = useCallback(
    (value) => {
      handlePriceOptionChange(value);
    },
    [handlePriceOptionChange]
  );

  if (!course) {
    return <div>দুঃখিত! কোনো কোর্স পাওয়া যায় নি।</div>;
  }

  return (
    <div className="">
      <RadioGroup
        value={selectedPriceOption}
        onValueChange={handlePriceOptionChange}
      >
        <div
          className="border-[1px] border-primary-300 rounded-lg p-6 bg-[#f3f9f9] cursor-pointer"
          onClick={() => handleLabelClick("regular")}
        >
          <div className="flex items-start gap-2">
            <RadioGroupItem
              value="regular"
              id="regular-price"
              onClick={(e) => e.stopPropagation()} // Prevent double triggering
            />
            <div className="w-full -mt-[3px]">
              <p className="text-base text-fontcolor-title">কোর্স ফি</p>

              {lifetimePrice ? (
                <div className="flex flex-col items-start w-full gap-1 mt-2">
                  {isDiscountExpired(lifetimePrice?.discountExpiresOn) ? (
                    <div>
                      {lifetimePrice?.isFree ? (
                        <div className="flex items-center gap-1 text-3xl">
                          <span>*ফ্রি</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-3xl font-semibold ">
                              ৳{" "}
                              {convertNumberToBangla(
                                lifetimePrice.regularAmount
                              )}
                            </span>
                            <span className="text-sm text-fontcolor-description">
                              {"/ লাইফটাইম"}
                            </span>
                          </div>
                          <p className="block mt-1 text-sm text-fontcolor-description">
                            ৩০ দিনের মানিব্যাক গ্যারান্টি
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-3xl font-semibold">
                          ৳{" "}
                          {convertNumberToBangla(
                            lifetimePrice.discountedAmount
                          )}
                        </span>
                        <span className="text-base line-through text-fontcolor-description">
                          {convertNumberToBangla(lifetimePrice.regularAmount)}
                        </span>
                        <span className="text-sm text-fontcolor-description">
                          {" / লাইফটাইম "}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-1 text-base text-fontcolor-description">
                        <span>অফার শেষ হবে:</span>
                        <span>
                          {moment(lifetimePrice.discountExpiresOn).format(
                            "Do MMM YYYY"
                          )}
                        </span>
                      </div>
                      <p className="mt-1 text-base text-fontcolor-description">
                        ৩০ দিনের মানিব্যাক গ্যারান্টি
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                "প্রাইস নেই"
              )}
            </div>
          </div>
        </div>

        {course?.isUnderSubscription && lifetimePrice.regularAmount !== 0 && (
          <div
            className="border-[1px] border-[#5DB7AF] rounded-lg p-6 bg-[#f3f9f9] cursor-pointer"
            onClick={() => handleLabelClick("subscription")}
          >
            <div className="flex items-start gap-2">
              <RadioGroupItem
                value="subscription"
                id="subscription-price"
                onClick={(e) => e.stopPropagation()} // Prevent double triggering
              />
              <div className="w-full -mt-[3px]">
                <p className="text-base text-fontcolor-title">
                  সাবস্ক্রিপশন ফি
                </p>
                <div className="text-sm text-fontcolor-paragraph">
                  <p className="mt-2 mb-1 text-3xl font-bold text-fontcolor-title">
                    ৳{" "}
                    {isFreeforsubscribedUser
                      ? "০"
                      : convertNumberToBangla(discountedPrice)}
                  </p>
                  <span className="text-base text-fontcolor-description">
                    {discountForMember
                      ? convertNumberToBangla(discountForMember)
                      : convertNumberToBangla(defaultDiscountPercentage)}
                    % ডিসকাউন্ট
                  </span>{" "}
                  <span className="text-base font-bold line-through text-fontcolor-description">
                    {convertNumberToBangla(courseLifeTimePrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </RadioGroup>

      {userId && (
        <div className="flex mt-4 space-x-2">
          <Checkbox
            id="terms"
            checked={isTermsChecked}
            onCheckedChange={(checked) => setIsTermsChecked(checked)}
            className="data-[state=checked]:bg-primary-700 data-[state=checked]:border-primary-700"
          />
          <label htmlFor="terms" className="text-sm text-fontcolor-description">
            আমি{" "}
            <Link
              href={"/terms-conditions"}
              className="text-primary-brand hover:underline"
            >
              শর্তাবলী , রিফান্ড ও ক্যান্সল্যাশন
            </Link>{" "}
            এবং{" "}
            <Link
              href={"/privacy-policy"}
              className="text-primary-brand hover:underline"
            >
              গোপনীয়তা নীতিমালার
            </Link>{" "}
            সাথে সম্মতি প্রকাশ করছি।
          </label>
        </div>
      )}

      <CheckoutButton
        course={course}
        userId={userId}
        courseId={course.id}
        priceId={selectedPriceId}
        checked={true}
        isSubscribedUser={isSubscribedUser}
        isFreeforsubscribedUser={isFreeforsubscribedUser}
        isPurchasingUnderSubscriptionPrice={isPurchasingUnderSubscriptionPrice}
        termsChecked={isTermsChecked}
        preview={preview}
      />
    </div>
  );
};

export default SingleCoursePrice;
