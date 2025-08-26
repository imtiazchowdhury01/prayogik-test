//@ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SuccessStoryGrid = ({ testimonials }) => {
  return (
    <>
      {/* title and description */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="font-bold text-left text-2xl sm:text-4xl md:text-[40px]">
            লার্নারদের মন্তব্য
          </h2>
          <p className="mt-2 md:mt-4 md:my-4 text-[14px] sm:text-base text-fontcolor-subtitle text-left">
            পূর্ববর্তী শিক্ষার্থীদের আমাদের কোর্স সম্পর্কে দেয়া অভিজ্ঞতা থেকে
            জেনে নিন, তারা কীভাবে শিখে উপকৃত হয়েছেন এবং ক্যারিয়ারে নতুন সুযোগ
            তৈরি করেছেন।
          </p>
        </div>
      </div>
      {/* story grid section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            className={`${testimonial.bgColor} border-0 shadow-sm h-full`}
          >
            <CardContent className="p-6 flex flex-col h-full">
              {/* Quote Icon */}
              <div className="mb-4">
                <svg
                  width="25"
                  height="19"
                  viewBox="0 0 25 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.211166 17.5798C1.28327 13.1103 4.87003 4.79703 6.84922 0.5096C6.99345 0.197162 7.30567 0 7.64979 0H10.7283C11.3328 0 11.7806 0.593271 11.6261 1.17774C10.7736 4.40195 8.73682 12.8535 7.67508 17.8955C7.58842 18.3071 7.22666 18.6 6.8061 18.6H1.04555C0.498233 18.6 0.0835014 18.112 0.211166 17.5798Z"
                    fill="#414B4A"
                  />
                  <path
                    d="M24.3031 1.02028C23.231 5.48975 19.6442 13.8031 17.6651 18.0905C17.5208 18.4029 17.2086 18.6001 16.8645 18.6001H13.786C13.1815 18.6001 12.7336 18.0068 12.8882 17.4224C13.7407 14.1981 15.7775 5.74658 16.8392 0.704559C16.9259 0.29302 17.2876 9.72748e-05 17.7082 9.72748e-05H23.4687C24.016 9.72748e-05 24.4308 0.488056 24.3031 1.02028Z"
                    fill="#414B4A"
                  />
                </svg>
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-900 mb-6 leading-relaxed text-base flex-grow md:line-clamp-3 md:overflow-hidden md:text-ellipsis">
                {testimonial.text}
              </p>

              <hr className="mb-6" />
              {/* Profile Section */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="relative aspect-square w-10 h-10">
                  <Image
                    src={testimonial.avatar}
                    alt={`${testimonial.name}'s profile picture`}
                    width={80}
                    height={80}
                    quality={75}
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
      {/* show more button */}
      <div className="flex items-center justify-center mt-12">
        {testimonials?.length >= 6 && (
          <Link
            target="_blank"
            href="https://www.trustpilot.com/review/prayogik.com"
          >
            <Button
              variant={"default"}
              // className="text-gray-700 border-gray-300 transition-all duration-300 py-4 h-12 md:flex bg-transparent"
              className="bg-secondary-button hover:bg-secondary-button hover:opacity-95 transition-all duration-300 py-4 h-12 md:flex"
            >
              আরো দেখুন <ArrowRight className="w-5 h-5 ml-1 font-extralight" />
            </Button>
          </Link>
        )}
      </div>
    </>
  );
};

export default SuccessStoryGrid;
