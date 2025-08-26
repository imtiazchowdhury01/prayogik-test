// @ts-nocheck
import { db } from "@/lib/db";
import SubscriptionCard from "./SubscriptionCard";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

export async function SubscriptionHero({
  subscription,
  userSubscription,
  paymentStatus,
}) {
  const premiumCoursesCount = await db.course.count({
    where: {
      isPublished: true,
      isUnderSubscription: true,
    },
  });

  return (
    <div className="overflow-hidden relative px-5 w-full bg-cover bg-center bg-[url('/images/subscription/subscription-hero.svg')]">
      <div className="mx-auto max-w-7xl lg:px-4 xl:px-8 2xl:px-1 grid grid-cols-1 md:grid-cols-2 gap-6 py-16 md:py-32">
        <div className="flex flex-col justify-center text-center md:text-left">
          <h1 className="text-3xl font-bold leading-10 text-white bg-clip-text">
            প্রায়োগিক{" "}
            <span className="bg-gradient-to-r from-[#F9851A] to-[#F101E2] bg-clip-text text-transparent">
              {" "}
              প্রাইম
            </span>
          </h1>

          <section className="mt-8 w-full">
            <h2 className="text-2xl md:text-6xl font-bold text-white leading-[1.2] md:leading-[1.2]">
              সাবস্ক্রাইব করে এক্সেস নিন
              <br />
              <span className="bg-gradient-to-r from-[#F9851A] to-[#F101E2] bg-clip-text text-transparent">
                {convertNumberToBangla(premiumCoursesCount)}
              </span>
              <span className="bg-gradient-to-r from-[#F9851A] to-[#F101E2] bg-clip-text text-transparent">
                +
              </span>
              ফ্রি প্রিমিয়াম কোর্স <br />
              {/* ডিসকাউন্ট প্রাইসে কিনুন সব স্টান্ডার্ড কোর্স */}
            </h2>
            <p className="mt-5 text-lg md:text-xl leading-[1.5] text-slate-100">
              এক সাবস্ক্রিপশনেই করুন ডিজিটাল মার্কেটিং, ই-কমার্স, ড্রপশিপিং,
              কপিরাইটিং, কন্টেন্ট মার্কেটিং, ডাটা অ্যানালিটিক্স, বিজনেস
              স্ট্র্যাটেজি ও গ্রোথ এবং আরও অনেক বিষয়ের উপর কোর্স।
            </p>
          </section>
        </div>

        <div className="flex justify-center items-center">
          <SubscriptionCard
            subscription={subscription}
            userSubscription={userSubscription}
            paymentStatus={paymentStatus}
          />
        </div>
      </div>
    </div>
  );
}
