import { Briefcase, StickyNote } from "lucide-react";
import React from "react";

const features = [
  {
    name: "সার্বক্ষনিক সাপোর্ট",
    description:
      "তবে ইসরায়েলের দক্ষিণাঞ্চলে একটি ঘাঁটিতে কয়েকটি ক্ষেপণাস্ত্র ও ড্রোন আঘাত হেনেছে বলেছে আইডিএফ এতে সামান্য অবকাঠামোগত ক্ষতি হয়েছে বলেছে এই বাহিনী।",
    icon: Briefcase,
  },
  {
    name: "প্রফেশনাল সার্টিফিকেট",
    description:
      "তবে ইসরায়েলের দক্ষিণাঞ্চলে একটি ঘাঁটিতে কয়েকটি ক্ষেপণাস্ত্র ও ড্রোন আঘাত হেনেছে বলেছে আইডিএফ এতে সামান্য অবকাঠামোগত ক্ষতি হয়েছে বলেছে এই বাহিনী।",
    icon: Briefcase,
  },
  {
    name: "জব ইন্টার্ভিউ প্রস্তুতি",
    description:
      "তবে ইসরায়েলের দক্ষিণাঞ্চলে একটি ঘাঁটিতে কয়েকটি ক্ষেপণাস্ত্র ও ড্রোন আঘাত হেনেছে বলেছে আইডিএফ এতে সামান্য অবকাঠামোগত ক্ষতি হয়েছে বলেছে এই বাহিনী।",
    icon: Briefcase,
  },
  {
    name: "ক্যারিয়ার রোডম্যাপ",
    description:
      "তবে ইসরায়েলের দক্ষিণাঞ্চলে একটি ঘাঁটিতে কয়েকটি ক্ষেপণাস্ত্র ও ড্রোন আঘাত হেনেছে বলেছে আইডিএফ এতে সামান্য অবকাঠামোগত ক্ষতি হয়েছে বলেছে এই বাহিনী।",
    icon: Briefcase,
  },
  {
    name: "এসাইনমেন্ট",
    description:
      "তবে ইসরায়েলের দক্ষিণাঞ্চলে একটি ঘাঁটিতে কয়েকটি ক্ষেপণাস্ত্র ও ড্রোন আঘাত হেনেছে বলেছে আইডিএফ এতে সামান্য অবকাঠামোগত ক্ষতি হয়েছে বলেছে এই বাহিনী।",
    icon: StickyNote,
  },
  {
    name: "ইন্ড্রাস্ট্রি এক্সপার্ট মেন্টর",
    description:
      "তবে ইসরায়েলের দক্ষিণাঞ্চলে একটি ঘাঁটিতে কয়েকটি ক্ষেপণাস্ত্র ও ড্রোন আঘাত হেনেছে বলেছে আইডিএফ এতে সামান্য অবকাঠামোগত ক্ষতি হয়েছে বলেছে এই বাহিনী।",
    icon: Briefcase,
  },
];

export default function WhyChoose() {
  return (
    <div>
      <div className="bg-[#F8F8F8 ] py-24 ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              এই ৬ টি কারনে লাইফটাইম লাইসেনসে বিনিয়োগ করবেন
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-7xl">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 ">
              {features.map((feature, i) => (
                <div key={i} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg">
                      <feature.icon
                        aria-hidden="true"
                        className="size-9 text-[#0D9488]"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
