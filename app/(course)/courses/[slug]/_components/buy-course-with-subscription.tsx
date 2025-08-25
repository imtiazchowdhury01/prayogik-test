// @ts-nocheck
"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { clientApi } from "@/lib/utils/openai/client";
import { Course, SubscriptionPlan } from "@prisma/client";
import { useEffect, useState } from "react";

export default function BuyCourseWithSubscription({
  course,
  subscription: plan,
  isFreeForSubscribedUser,
  discountedPrice,
  discountForMember,
  defaultDiscountPercentage,
  courseLifeTimePrice,
  isUnderSubscriptionsCourse,
  totalAmount,
  isSubscribedUser,
}: {
  course: Course;
  subscription: any;
  isFreeForSubscribedUser?: boolean;
  discountedPrice: number;
  discountForMember: number;
  defaultDiscountPercentage: number;
  courseLifeTimePrice: number;
  isUnderSubscriptionsCourse?: boolean;
  totalAmount: number;
  isSubscribedUser: boolean;
}) {
  return (
    <div className="space-y-4 mt-3">
      {/* Domestika Plus Item */}
      <Card className="shadow-none bg-none border-0">
        <CardContent className="p-4 space-y-3">
          {/* subscription */}
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-white bg-primary-brand p-[1px] px-2 rounded-full inline-block">
                    {plan?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    সাবস্ক্রাইব করে এক্সেস নিন সকল প্রিমিয়াম কোর্সে
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-semibold text-gray-900">
                    ৳ {convertNumberToBangla(plan?.regularPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* seperator */}
          <Separator />
          {/* course */}
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {course?.title}
                  </h3>

                  <div className="mt-2">
                    {!isUnderSubscriptionsCourse && (
                      <>
                        <span className="text-base text-fontcolor-description">
                          {convertNumberToBangla(
                            discountForMember || defaultDiscountPercentage
                          )}
                          % ডিসকাউন্ট
                        </span>{" "}
                        <span className="text-base font-bold line-through text-fontcolor-description">
                          {convertNumberToBangla(courseLifeTimePrice)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-semibold text-gray-900">
                    ৳{" "}
                    {convertNumberToBangla(
                      isUnderSubscriptionsCourse ? 0 : discountedPrice
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="w-full p-4 border-t">
          {/* Total */}
          <div className="rounded-lg w-full  ">
            <div className="flex items-center justify-between">
              <span className="font-bold text-base text-gray-900">সর্বমোট</span>
              <span className="font-bold text-base text-gray-900">
                ৳ {convertNumberToBangla(totalAmount)}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
