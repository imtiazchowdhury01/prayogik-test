"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { testimonials } from "../_utils/data";
import { Button } from "@/components/ui/button";
import QouteIcon from "../_utils/QouteIcon";
import SectionTitle from "@/components/common/SectionTitle";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const StudentFeedback = () => {
  return (
    <div>
      <SectionTitle
        title="স্টুডেন্টদের সাফল্যের কথা"
        description="সাধারণ থেকে অসাধারণ হয়ে ওঠার এক অবিশ্বাস্য সফলতার গল্প।"
      />
      <div className="px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-0 max-w-7xl mx-auto ">
        {/* grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 transition-all duration-300 ease-in-out">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`bg-[#F3F9F9] border border-gray-200 shadow-sm h-full transition-all duration-300 ease-in-out transform`}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Quote Icon */}
                <div className="mb-4">
                  <QouteIcon />
                </div>
                {/* Testimonial Text */}
                <p className="text-gray-950 mb-4 leading-6 text-base font-normal flex-grow md:line-clamp-3 md:overflow-hidden md:text-ellipsis">
                  {testimonial.text}
                </p>
                <hr className="mb-4 border-gray-300" />
                {/* Profile Section */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="relative aspect-square w-10 h-10">
                    <Image
                      src={testimonial.avatar}
                      alt={`${testimonial.name}'s profile picture`}
                      width={80}
                      height={80}
                      quality={85}
                      className="rounded-full object-cover w-full h-full"
                      loading="eager"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show More Button */}
        <div className="flex justify-center mt-12">
          <Link
            target="_blank"
            href="https://www.trustpilot.com/review/prayogik.com"
          >
            <Button
              variant="outline"
              className="text-gray-700 p-6 font-semibold border-gray-300 leading-6 transition-colors duration-300 h-12 cursor-pointer md:flex"
            >
              আরো দেখুন <ArrowRight className="w-5 h-5 ml-1 font-extralight" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;
