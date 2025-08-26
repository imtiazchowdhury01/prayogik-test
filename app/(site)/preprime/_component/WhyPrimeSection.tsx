// @ts-nocheck
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import PrimeSubscriptionButton from "./PrimeSubscriptionButton";

const features = [
  {
    icon: "/images/prime/icon-2.webp",
    title1: "সেরা কোর্স এখন সবচেয়ে কম দামে, শেখা শুরু হোক আজ!",
    desc: "শেখা হবে সহজ, সাশ্রয়ী ও ফলপ্রসূ। প্রিমিয়াম কোর্সগুলো এখন পাচ্ছেন এক প্ল্যাটফর্মে, এক সাবস্ক্রিপশনে, অল্প খরচে এবং নিজ সময়মতো।",
  },
  {
    icon: "/images/prime/icon-1.webp",
    title1: "শুধু এক সাবস্ক্রিপশনে পাচ্ছেন একদম ফ্রি প্রিমিয়াম কোর্স!",
    desc: "আপনার সময় এখন! শেখা শুরু করুন প্রাইমে যুক্ত হয়ে। ৭টির বেশি প্রিমিয়াম কোর্স পাচ্ছেন একদম ফ্রি—নিজেকে প্রস্তুত করুন আগামী সুযোগের জন্য।",
  },
  {
    icon: "/images/prime/icon-3.webp",
    title1: "সব নতুন কোর্সের সহজ ও তাত্ক্ষণিক এক্সেস আপনার জন্য এখনই।",
    desc: "প্রতি মাসে নতুন কোর্স যুক্ত হয় নিয়মিত। প্রাইম সাবস্ক্রিপশন নিয়ে আপনি সহজেই সেগুলোতে এক্সেস পেয়ে যাবেন, সবসময় শেখার সুযোগ পাবেন।",
  },
];

const WhyPrimeSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-1 pt-8 pb-16">
      <div className="text-center py-20 2xl:px-16 xl:px-16 md:px-6 px-4 bg-[#f3f9f9] rounded-lg">
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          কেনো প্রাইম কোর্স
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-12">
          শিক্ষার্থী দের সুবিধা, কোর্সের গুণ ও সেবার মান অগ্রাধিকার।
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, i) => (
            <Card key={i} className="p-6 bg-[#E7F5F4] shadow-sm border-0">
              <CardContent className="p-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <Image
                    src={feature.icon}
                    alt="Feature icon"
                    width={48}
                    height={48}
                    className="object-contain rounded-xl"
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <h3 className="text-[20px] font-semibold not-italic leading-[28px] text-center md:text-left text-gray-900 mb-2">
                  {feature.title1}
                </h3>
                <p className="text-[14px] font-normal not-italic leading-[22px] text-gray-600 text-center md:text-left">
                  {feature.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <PrimeSubscriptionButton variant="expired" />
      </div>
    </section>
  );
};

export default WhyPrimeSection;
