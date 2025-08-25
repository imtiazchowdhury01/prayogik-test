
// @ts-nocheck
"use client";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import moment from "moment";
import "moment/locale/bn";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { clearServerCart, setServerCart } from "@/lib/actions/cart-cookie";
import { CourseMode, PurchaseType } from "@prisma/client";
import LiveLinkCard from "./live-link-card";

moment.locale("bn");

type TSingleCoursePriceTab = {
  course: any;
  defaultDiscount: any;
  plan: any;
  preview?: any;
};

// Animation variants
const contentVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

// Loading skeleton components
const CourseAccessSkeleton = () => (
  <motion.div
    className="animate-pulse space-y-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="h-6 bg-brand-primary-light rounded w-1/2"></div>
    <div className="rounded-lg p-6 border">
      <div className="h-4 bg-brand-primary-light rounded w-3/4 mb-2"></div>
      <div className="h-8 bg-brand-primary-light rounded w-1/2 mb-2"></div>
      <div className="h-10 bg-brand-primary-light rounded"></div>
    </div>
    <div className="rounded-lg p-6 border">
      <div className="h-4 bg-brand-primary-light rounded w-2/3 mb-2"></div>
      <div className="h-8 bg-brand-primary-light rounded w-1/3 mb-2"></div>
      <div className="h-10 bg-brand-primary-light rounded"></div>
    </div>
  </motion.div>
);

const SingleCoursePriceTab = ({
  course: initialCourse,
  defaultDiscount,
  plan,
}: TSingleCoursePriceTab) => {
  const { status, data } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [course, setCourse] = useState(initialCourse);
  const [selectedPriceOption, setSelectedPriceOption] = useState("regular");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAccessingFreeCourse, setIsAccessingFreeCourse] = useState(false);
  const [hasCourseAccess, setHasCourseAccess] = useState({});

  const subscriptions = data?.user?.info?.studentProfile?.subscription;
  const isSubscribedUser = subscriptions?.status === "ACTIVE";
  const isUnderSubscriptionsCourse = course?.isUnderSubscription;
  const discountForMember =
    subscriptions?.subscriptionPlan?.subscriptionDiscount?.discountPercentage;
  const defaultDiscountPercentage = defaultDiscount?.discountPercentage || 0;

  const lifetimePrice = useMemo(
    () =>
      course?.prices?.find(
        (p) => p.frequency === "LIFETIME" && !p.isSubscriptionPrice
      ),
    [course]
  );

  const isDiscountExpired = useCallback((expiresAt: any) => {
    if (!expiresAt) return true;
    return new Date() > new Date(expiresAt);
  }, []);

  const courseLifeTimePrice = useMemo(() => {
    if (!lifetimePrice) return 0;
    const expired = isDiscountExpired(lifetimePrice?.discountExpiresOn);
    return !expired
      ? lifetimePrice?.discountedAmount
      : lifetimePrice?.regularAmount || 0;
  }, [lifetimePrice, isDiscountExpired]);

  const discountedPrice = useMemo(() => {
    const percentage = discountForMember || defaultDiscountPercentage;
    return (
      courseLifeTimePrice - Math.round(courseLifeTimePrice * (percentage / 100))
    );
  }, [courseLifeTimePrice, discountForMember, defaultDiscountPercentage]);

  const isFreeForSubscribedUser = discountForMember === 100;

  const fetchCourse = useCallback(async () => {
    if (!initialCourse) return null;
    try {
      const res = await fetch(`/api/courses/${initialCourse.id}`);
      if (!res.ok) throw new Error("Failed to fetch course");
      const data = await res.json();
      return data.course;
    } catch (err) {
      console.error("Fetch error:", err);
      return null;
    }
  }, [initialCourse]);

  // Load data effect
  useEffect(() => {
    const loadAllData = async () => {
      if (!data?.user?.id || !course?.slug) {
        setIsInitialLoading(false);
        return;
      }

      setIsInitialLoading(true);
      try {
        const [courseData, accessResponse] = await Promise.allSettled([
          fetchCourse(),
          fetch("/api/courses/access", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courseSlug: course.slug,
              userId: data.user.id,
            }),
          }).then((res) => res.json()),
        ]);

        if (courseData.status === "fulfilled" && courseData.value) {
          setCourse(courseData.value);
        }

        if (accessResponse.status === "fulfilled") {
          setHasCourseAccess(accessResponse.value);
        } else {
          console.error("Error checking course access:", accessResponse.reason);
          setHasCourseAccess({});
        }
      } catch (error) {
        console.error("Unexpected error loading course data:", error);
      } finally {
        setTimeout(() => setIsInitialLoading(false), 300);
      }
    };

    loadAllData();
  }, [data?.user?.id, course?.slug, course?.id, fetchCourse]);

  // Determine if the course is free
  const isCourseFree = useMemo(() => {
    if (!lifetimePrice) return false;

    // Check if course is explicitly marked as free
    if (lifetimePrice.isFree) return true;

    // Check if discounted price makes it free
    const expired = isDiscountExpired(lifetimePrice.discountExpiresOn);
    const effectivePrice = !expired
      ? lifetimePrice.discountedAmount
      : lifetimePrice.regularAmount;

    return effectivePrice === 0;
  }, [lifetimePrice, isDiscountExpired]);

  // Early returns after all hooks are defined
  if (!course) return <div>দুঃখিত! কোনো কোর্স পাওয়া যায় নি।</div>;

  // Show loading skeleton while loading initial data
  if (isInitialLoading) {
    return <CourseAccessSkeleton />;
  }
  // If user has course access and check live course or not, show the access button
  if (hasCourseAccess?.access) {
    if (course?.courseMode === CourseMode.LIVE) {
      return <LiveLinkCard course={course} />;
    } else {
      return (
        <motion.div
          className="border rounded-lg p-6 bg-[#E7F5F4] border-[#4AAFA6]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="text-center">
            <motion.h3
              className="text-lg font-semibold text-brand mb-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              আপনার এই কোর্সে অ্যাক্সেস রয়েছে
            </motion.h3>
            <motion.p
              className="text-fontcolormb-4 mb-4"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              আপনি এই কোর্সটি দেখতে পারেন
            </motion.p>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Link
                href={`/courses/${course?.slug}/${hasCourseAccess?.nextLessonSlug}`}
                className="block w-full px-4 py-2 text-base font-semibold  text-center text-white transition-all duration-300 rounded-sm hover:bg-primary-700 sm:px-6 sm:py-3 bg-primary-brand"
              >
                চালিয়ে যান
              </Link>
            </motion.div>
          </div>
        </motion.div>
      );
    }
  }

  const handleFreeCourseAccess = async (courseId: string) => {
    setIsAccessingFreeCourse(true);
    try {
      if (status === "unauthenticated") {
        router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Simulate API call - replace with actual implementation
      const response = await fetch("/api/courses/free-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        toast.success("আপনি সফলভাবে কোর্সে এনরোল করেছেন।");
        router.refresh();
      } else {
        toast.error(
          "কোর্স অ্যাক্সেস করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।"
        );
      }
    } catch (error) {
      console.error("ERROR_FROM_FREE_ACCESS_HANDLER", error);
      toast.error("অপ্রত্যাশিত একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsAccessingFreeCourse(false);
    }
  };

  const handleRedirectToCheckout = async () => {
    if (initialCourse) {
      await clearServerCart();
      await setServerCart({
        type: "COURSE",
        items: [
          {
            courseSlug: initialCourse?.slug,
            checkoutType:
              selectedPriceOption === "regular"
                ? PurchaseType.SINGLE_COURSE
                : selectedPriceOption !== "regular" &&
                  course?.isUnderSubscription
                ? PurchaseType.SUBSCRIPTION
                : PurchaseType.OFFER,
          },
        ],
      });
      router.push("/checkout");
    }
  };

  const renderPriceBlock = ({ value, title, priceDisplay, showPayment }:any) => {
    const isActive = selectedPriceOption === value;
    const labels = {
      subscription: isSubscribedUser
        ? "সাবস্ক্রিপশনের সাথে কিনুন"
        : "সাবস্ক্রাইব করুন",
      regular: "কোর্সটি কিনুন",
    };
    return (
      <motion.div
        className={twMerge(
          "border-[1px] rounded-lg p-6 cursor-pointer transition-colors duration-300",
          isActive
            ? "bg-[#E7F5F4] border-[#4AAFA6]"
            : "border-[#BFC3C2] bg-transparent"
        )}
        onClick={() => setSelectedPriceOption(value)}
      >
        <div className="flex items-start gap-2">
          <RadioGroupItem
            value={value}
            id={`${value}-price`}
            style={{ width: "18px", height: "18px", borderRadius: "100%" }}
            className="text-primary-brand border-primary-brand ring-offset-0 focus:ring-0 focus-visible:ring-0"
          />
          <div className="w-full">
            <p className="text-sm text-fontcolor-title font-medium">{title}</p>
            <div className="text-sm text-fontcolor-paragraph">
              {priceDisplay}
              <AnimatePresence>
                {showPayment && (
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="overflow-hidden"
                  >
                    {!isCourseFree && (
                      <Button
                        onClick={handleRedirectToCheckout}
                        className="w-full mt-4 bg-primary-brand text-white hover:bg-primary-700"
                      >
                        {labels[selectedPriceOption] ?? ""}
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Early returns
  if (!course) return <div>দুঃখিত! কোনো কোর্স পাওয়া যায় নি।</div>;
  if (isInitialLoading) return <CourseAccessSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <RadioGroup
        value={selectedPriceOption}
        onValueChange={setSelectedPriceOption}
      >
        {/* Regular Price Option */}
        {renderPriceBlock({
          value: "regular",
          title: "রেগুলার কোর্স ফি",
          priceDisplay: lifetimePrice ? (
            isCourseFree ? (
              <div>
                <p className="text-2xl font-bold">*ফ্রি</p>
                <Button
                  onClick={() => handleFreeCourseAccess(course.id)}
                  className="w-full hover:bg-primary-brand hover:text-white bg-primary-brand text-white transition-opacity mt-3"
                >
                  {isAccessingFreeCourse ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    " ফ্রি এক্সেস করুন"
                  )}
                </Button>
              </div>
            ) : isDiscountExpired(lifetimePrice.discountExpiresOn) ? (
              lifetimePrice.isFree ? (
                <p className="text-2xl font-bold">*ফ্রি</p>
              ) : (
                <p className="text-2xl font-semibold">
                  ৳ {convertNumberToBangla(lifetimePrice.regularAmount)}
                </p>
              )
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-semibold">
                    ৳ {convertNumberToBangla(lifetimePrice.discountedAmount)}
                  </span>
                  <span className="line-through text-base text-fontcolor-description">
                    {convertNumberToBangla(lifetimePrice.regularAmount)}
                  </span>
                  <span className="text-sm text-fontcolor-description">
                    {" "}
                    / লাইফটাইম{" "}
                  </span>
                </div>
                <p className="mt-1 text-base text-fontcolor-description">
                  অফার শেষ হবে:{" "}
                  {moment(lifetimePrice.discountExpiresOn).format(
                    "Do MMM YYYY"
                  )}
                </p>
              </>
            )
          ) : null,
          showPayment: selectedPriceOption === "regular" && !isCourseFree,
        })}

        {/* Subscription Options - only if course is NOT free */}
        {!isCourseFree && (
          <>
            {/* Subscription Option for courses under subscription */}
            {isUnderSubscriptionsCourse &&
              lifetimePrice?.regularAmount !== 0 &&
              renderPriceBlock({
                value: "subscription",
                title: "সাবস্ক্রাইবারদের জন্য",
                priceDisplay: (
                  <p className="text-2xl font-bold mt-2 mb-1">*ফ্রি</p>
                ),
                showPayment: selectedPriceOption !== "regular",
              })}

            {/* General subscription offer */}
            {!isUnderSubscriptionsCourse &&
              renderPriceBlock({
                value: "subscription",
                title: "সাবস্ক্রাইবারদের জন্য",
                priceDisplay: (
                  <div>
                    <p className="text-2xl font-bold mt-2 mb-1">
                      ৳{" "}
                      {isFreeForSubscribedUser
                        ? "০"
                        : convertNumberToBangla(discountedPrice)}
                    </p>
                    <span className="text-base text-fontcolor-description">
                      {convertNumberToBangla(
                        discountForMember || defaultDiscountPercentage
                      )}
                      % ডিসকাউন্ট
                    </span>{" "}
                    <span className="text-base font-bold line-through text-fontcolor-description">
                      {convertNumberToBangla(courseLifeTimePrice)}
                    </span>
                  </div>
                ),
                showPayment: selectedPriceOption !== "regular",
              })}
          </>
        )}
      </RadioGroup>
    </motion.div>
  );
};

export default memo(SingleCoursePriceTab);
