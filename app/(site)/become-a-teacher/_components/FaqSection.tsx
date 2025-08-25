import React from "react";
import { DollarSign, Award, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const FaqSection = () => {
  return (
    <section id="faq" className="w-full py-12 bg-white md:py-24 lg:py-32">
      <div className="app-container">
        <div className="flex flex-col items-center justify-center mb-12 space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-tertiary-950 sm:text-4xl md:text-5xl">
              কোর্স সম্পর্কিত সাধারণ প্রশ্ন
            </h2>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-tertiary-200">
              <AccordionTrigger className="text-lg font-medium text-tertiary-950">
                কী ধরনের কোর্স তৈরি করতে পারবো?
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-4 space-y-6">
                  <p className="text-tertiary-950">
                    আমাদের প্ল্যাটফর্মে তিন ধরনের শর্ট ও মিনি কোর্স তৈরি করতে
                    পারবেন:
                  </p>
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-tertiary-200 bg-tertiary-50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-tertiary" />
                          <span className="font-medium text-tertiary">
                            Micro Course
                          </span>
                        </div>
                        <CardTitle className="text-base text-tertiary-950">
                          সময়সীমা: ৩০ মিনিটের কম
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-tertiary-950">
                          সংক্ষিপ্ত ও ফোকাসড: ৩-৫টি সংক্ষিপ্ত লেসন
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-tertiary-200 bg-tertiary-50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-tertiary" />
                          <span className="font-medium text-tertiary">
                            Mini Course
                          </span>
                        </div>
                        <CardTitle className="text-base text-tertiary-950">
                          সময়সীমা: ৩০-৬০ মিনিট
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-tertiary-950">
                          নির্দিষ্ট একটি টপিক নিয়ে বিস্তারিত আলোচনা
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-tertiary-200 bg-tertiary-50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-tertiary" />
                          <span className="font-medium text-tertiary">
                            Short Course
                          </span>
                        </div>
                        <CardTitle className="text-base text-tertiary-950">
                          সময়সীমা: ১ ঘণ্টার কাছাকাছি
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-tertiary-950">
                          গভীরতর শেখার অভিজ্ঞতা, ৭-১৫টি লেসন
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-tertiary-200">
              <AccordionTrigger className="text-lg font-medium text-tertiary-950">
                কত টাকা আয় করতে পারবো?
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-4 space-y-4">
                  <p className="text-tertiary-950">
                    আপনার প্রতিটি কোর্সের জন্য ১০,০০০ – ২৫,০০০ টাকা পর্যন্ত
                    পেমেন্ট পেতে পারেন। চূড়ান্ত মূল্য নির্ভর করবে কোর্সের গুণগত
                    মান ও ডিমান্ডের উপর।
                  </p>
                  <div className="p-4 border rounded-lg bg-tertiary-50 border-tertiary-200">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-tertiary" />
                      <span className="font-medium text-tertiary-950">
                        এককালীন নিশ্চিত পেমেন্ট
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-tertiary-950">
                      বিক্রির উপর নির্ভরশীল নয়, সরাসরি পেমেন্ট! আপনার কোর্সের
                      স্বত্ব বিক্রির মাধ্যমে এককালীন পেমেন্ট গ্রহণ করুন।
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-tertiary-200">
              <AccordionTrigger className="text-lg font-medium text-tertiary-950">
                কিভাবে কোর্স জমা দিবো?
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-4 space-y-4">
                  <ol className="space-y-4 list-decimal list-inside">
                    <li className="text-tertiary-950">
                      <span className="font-medium text-tertiary-950">
                        আপনার কোর্স আইডিয়া আমাদের কাছে পাঠান
                      </span>
                      <p className="mt-1 ml-6 text-sm text-tertiary-950">
                        আমাদের ওয়েবসাইটে ফর্ম পূরণ করে আপনার কোর্স আইডিয়া জমা
                        দিন।
                      </p>
                    </li>
                    <li className="text-tertiary-950">
                      <span className="font-medium text-tertiary-950">
                        আমাদের টিম রিভিউ করবে এবং সম্মত হলে চুক্তি হবে
                      </span>
                      <p className="mt-1 ml-6 text-sm text-tertiary-950">
                        আমরা আপনার আইডিয়া পর্যালোচনা করব এবং যোগাযোগ করব।
                      </p>
                    </li>
                    <li className="text-tertiary-950">
                      <span className="font-medium text-tertiary-950">
                        আপনি কোর্স তৈরি করবেন এবং সাবমিট করবেন
                      </span>
                      <p className="mt-1 ml-6 text-sm text-tertiary-950">
                        আমাদের গাইডলাইন অনুসরণ করে কোর্স তৈরি করুন।
                      </p>
                    </li>
                    <li className="text-tertiary-950">
                      <span className="font-medium text-tertiary-950">
                        আমরা রিভিউ করে কোর্স পাবলিশ করবো
                      </span>
                      <p className="mt-1 ml-6 text-sm text-tertiary-950">
                        আমাদের টিম কোর্সটি পর্যালোচনা করবে এবং প্রয়োজনীয়
                        পরিবর্তন সাপেক্ষে পাবলিশ করবে।
                      </p>
                    </li>
                    <li className="text-tertiary-950">
                      <span className="font-medium text-tertiary-950">
                        আপনি নির্দিষ্ট এককালীন পেমেন্ট পাবেন
                      </span>
                      <p className="mt-1 ml-6 text-sm text-tertiary-950">
                        কোর্স পাবলিশ হওয়ার পর আপনি চুক্তি অনুযায়ী পেমেন্ট
                        পাবেন।
                      </p>
                    </li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-tertiary-200">
              <AccordionTrigger className="text-lg font-medium text-tertiary-950">
                আমি কি আমার কোর্স অন্য কোথাও বিক্রি করতে পারবো?
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-4 space-y-4">
                  <p className="text-tertiary-950">
                    না, প্রায়োগিক আপনার কোর্সের সম্পূর্ণ স্বত্ব কিনে নেবে, ফলে
                    এটি অন্য কোথাও বিক্রি বা শেয়ার করা যাবে না। তবে, কোর্সটি
                    আপনার নামেই প্রকাশিত হবে এবং এটি আপনার অথরিটি ও ব্র্যান্ড
                    বিল্ডিংয়ে সাহায্য করবে।
                  </p>
                  <div className="p-4 border rounded-lg bg-tertiary-50 border-tertiary-200">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-tertiary" />
                      <span className="font-medium text-tertiary-950">
                        ব্র্যান্ড বিল্ডিং সুবিধা
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-tertiary-950">
                      আপনার কোর্সটি আপনার নামেই প্রকাশিত হবে, যা আপনার ব্র্যান্ড
                      ভ্যালু ও অথরিটি তৈরিতে সহায়ক হবে।
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
