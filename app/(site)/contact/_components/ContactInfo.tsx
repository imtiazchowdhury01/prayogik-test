//@ts-nocheck
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";

const ContactInfo = () => {
  const contactSocialLinks = [
    {
      title: "facebook",
      icon: "/icon/social/Facebook.png",
      path: "https://www.facebook.com/PrayogikHQ",
    },
    {
      title: "youtube",
      icon: "/icon/social/Youtube.png",
      path: "https://www.youtube.com/channel/UCfdSyzb916sGYn6gpoxI2Ig?view_as=subscriber",
    },
    {
      title: "linkedin",
      icon: "/icon/social/linkedin.png",
      path: "https://www.linkedin.com/company/prayogikbd",
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: Phone,
      title: "মোবাইল",
      content: "০১৮১৪-৪৩২৮৭৫",
      href: "tel:01814432875",
      isLink: true,
    },
    {
      icon: Mail,
      title: "ইমেইল",
      content: "contact@prayogik.com",
      href: "mailto:contact@prayogik.com",
      isLink: true,
    },
    {
      icon: MapPin,
      title: "ঠিকানা",
      content:
        "নূর বিল্ডিং, ২য় তলা। ৭০০/বি,\nডিটি রোড। দেওয়ানহাট, চট্টগ্রাম-৪১০০",
      isLink: false,
    },
    {
      icon: Facebook,
      title: "ফেসবুক",
      href: "https://www.facebook.com/PrayogikHQ",
      content: "facebook.com/PrayogikHQ",
      isLink: true,
    },
  ];

  return (
    <Card className="w-full md:w-1/2 md:p-6 lg:p-8 p-8 bg-white md:shadow-none md:border-0 border-gray-100 max-h-fit ">
      {/* Header */}
      <CardHeader className="mb-6 lg:mb-6 p-0">
        <CardTitle className="md:text-2xl lg:text-4xl text-2xl font-bold text-gray-800 lg:mb-2 mb-1">
          প্রায়োগিক
        </CardTitle>
        {/* <CardDescription className="text-gray-600 lg:text-base text-sm leading-relaxed">
          যোগাযোগ করতে ফরমটি ব্যবহার করুন। আমরা সর্বোচ্চ চেষ্টা করি দ্রুত উত্তর
          দিতে-সাধারণত ৪৮ ঘণ্টার মধ্যে।
        </CardDescription> */}
      </CardHeader>

      <CardContent className="p-0">
        {/* Contact Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 lg:gap-y-8 gap-y-4 lg:pb-10 pb-6">
          {contactInfo.map((item, index) => {
            const IconComponent = item.icon;
            const content = item.isLink ? (
              <Link href={item.href} className="text-gray-600 text-sm">
                {item.content}
              </Link>
            ) : (
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.content.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < item.content.split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            );

            return (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-brand/5 p-2 rounded-lg">
                  <IconComponent className="w-5 h-5 text-brand/85" />
                </div>
                <div>
                  <h3 className="lg:text-xl text-lg font-semibold text-gray-800 mb-1">
                    {item.title}
                  </h3>
                  <span className="text-base font-normal">{content}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Follow section */}
        <div className="border-t lg:pt-10 pt-6 relative">
          <h3 className="font-semibold text-lg text-gray-800 mb-3">
            আমাদেরকে ফলো করুন
          </h3>
          <div className="flex space-x-3">
            {contactSocialLinks.map((item) => (
              <Link
                href={item.path}
                key={item.title}
                className="bg-brand/5 p-2 rounded-lg transition-colors cursor-pointer"
                target="_blank"
              >
                <Image
                  src={item.icon}
                  width={24}
                  height={24}
                  alt={item.title}
                  quality={75}
                  className="object-cover w-6 h-6 transition-all duration-300 hover:opacity-70"
                />
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
