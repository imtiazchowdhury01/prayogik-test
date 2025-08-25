import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { footerSocialLinks } from "@/data/footer";
import ContactFormClient from "./_components/ContactFormClient";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch with Prayogik Team",
  description:
    "Have questions or need support? Contact the Prayogik team for assistance, collaboration, or course inquiries. We're here to help you learn and grow.",
};

// Server component for contact information
function ContactInfo() {
  return (
    <Card className="w-full md:w-1/2 border-l-[4px] p-8 bg-white border-l-secondary-brand">
      <CardHeader className="p-0">
        <CardTitle className="mb-6 text-3xl font-bold text-fontcolor-title">
          হেড অফিস
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-5">
        <div className="space-y-2 text-base text-fontcolor-description">
          <p className="font-secondary">প্রায়োগিক</p>
          <p>
            নূর বিল্ডিং, ২য় তলা। ৭০০/বি, ডিটি রোড। <br /> দেওয়ানহাট,
            চট্টগ্রাম-৪১০০
          </p>
        </div>
        <div>
          <p className="font-semibold text-fontcolor-title">ফোন</p>
          <a
            href={"tel:01814432875"}
            className="text-fontcolor-paragraph hover:underline"
          >
            ০১৮১৪-৪৩২৮৭৫
          </a>
        </div>
        <div>
          <p className="font-semibold text-fontcolor-title">ইমেল</p>
          <Link
            href={"mailto:contact@prayogik.com"}
            className="text-fontcolor-paragraph hover:underline"
          >
            contact@prayogik.com
          </Link>
        </div>
        <div className="">
          <p className="mb-2 font-semibold text-fontcolor-title">
            আমাদেরকে ফলো করুন
          </p>
          <div className="flex space-x-3">
            {footerSocialLinks.map((item) => {
              return (
                <Link
                  href={item.path}
                  key={item.title}
                  className="bg-white rounded-full shadow-md cursor-pointer"
                  target="_blank"
                >
                  <Image
                    src={item.icon}
                    width={28}
                    height={28}
                    alt={item.title}
                    className="object-cover transition-all duration-300 hover:opacity-70"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-[70vh] bg-background-gray max-h-[auto]">
      <div className="flex flex-col-reverse py-10 sm:pt-16 sm:pb-16 gap-y-10 md:gap-y-0 md:space-x-5 md:flex-row lg:space-x-8 app-container">
        {/* Server-side rendered contact info */}
        <ContactInfo />

        {/* Client-side contact form */}
        <ContactFormClient />
      </div>
    </div>
  );
}
