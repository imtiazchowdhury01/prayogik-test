//@ts-nocheck

import { formatDuration } from "@/lib/formatDuration";
import { Item } from "@radix-ui/react-accordion";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Play, User2, Users2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RelatedCourse({ courses }) {
  return (
    <div className="my-12">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Related Courses</h1>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 border h-[100px]">
          <p>দুঃখিত! কোনো কোর্স পাওয়া যায় নি।</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-1 grid-cols-1 gap-2">
          {courses.map((item, index) => (
            <Link key={index} href={`/courses/${item.slug}`}>
              <div className="bg-white md:min-h-0 min-h-[280px] mb-2 border hover:shadow border-gray-200 rounded-lg flex md:flex-row flex-col md:items-center md:p-2 gap-4 transition justify-between">
                <div className="flex gap-4 md:flex-row flex-col">
                  {/* course image */}
                  <div className="relative w-full md:w-[120px] h-0 pb-[56.25%] md:pb-0 md:h-[80px]">
                    <Image
                      src={item.imageUrl}
                      alt={`Course ${index + 1}`}
                      fill
                      className="rounded-lg md:rounded-b-lg rounded-b-none object-cover"
                      quality={75}
                      priority
                    />
                    <div className="absolute flex items-center justify-center transition-all duration-300 hover:bg-[#0000003b] w-full h-full">
                      <div className="bg-[#727374ab] p-2 rounded-full">
                        <Play className="text-white rounded-full" size={14} />
                      </div>
                    </div>
                  </div>
                  {/* course title */}
                  <div className="md:flex-1 md:p-0 px-2">
                    <h2 className="md:text-lg text-base hover:text-teal-700 font-semibold capitalize text-gray-800">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 flex md:flex-row flex-col">
                      {formatDuration(item.totalDuration) && (
                        <>
                          <span className="text-teal-700 text-sm">
                            {formatDuration(item.totalDuration)} long
                          </span>
                          <span className="mx-2 text-gray-400 hidden lg:block">
                            •
                          </span>
                        </>
                      )}
                      <span className="md:text-sm text-xs">
                        Last updated on:
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                    </p>
                    <div className="flex items-center mt-2 text-yellow-500 text-sm">
                      {courses?.rating?.map((_, i) => (
                        <StarFilledIcon key={i} />
                      ))}
                      <span className="ml-2 text-gray-600">
                        {courses?.rating?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* course price */}
                <div className="md:text-right text-left md:px-0 px-2 pt-0">
                  {item.prices.length > 0 ? (
                    <>
                      {item?.prices[0]?.isFree ? (
                        <div className="text-sm text-gray-800 pb-2 md:pb-0">
                          <span>Free</span>
                        </div>
                      ) : (
                        <div>
                          {item.prices[0].discountedAmount ? (
                            <div className="flex md:flex-col flex-col-reverse md:items-end md:justify-between justify-start">
                              <div className="font-bold text-gray-800 pb-2 md:pb-0">
                                <span className="md:text-lg mr-2">
                                  ৳{item.prices[0].discountedAmount}
                                </span>
                                <span
                                  className={`text-sm text-gray-500 ${
                                    item.prices[0].discountedAmount
                                      ? "line-through"
                                      : ""
                                  }`}
                                >
                                  ৳{item.prices[0].regularAmount}
                                </span>
                              </div>

                              <div className="md:text-sm text-xs text-red-600 capitalize">
                                <span>Offer Expires on:</span>
                                <span>
                                  {new Date(
                                    item.prices[0].discountExpiresOn
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="font-bold text-gray-800">
                              <span className="text-lg ml-2">
                                ৳{item.prices[0].regularAmount}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
