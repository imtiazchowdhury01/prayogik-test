import {
  footerCompanyLinks,
  footerOthersLinks,
  footerSocialLinks,
} from "@/data/footer";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import "moment/locale/bn";
import CourseCategories from "./home/CourseCategories";
moment.locale("bn");
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const currentBnYear = moment(currentYear.toString()).format("YYYY");

  return (
    <section>
      <CourseCategories />
      <footer className="relative z-10 overflow-hidden bg-[#F3F9F9] pt-10">
        {/* <Image
        src={"/footer-bg.svg"}
        alt="gradient"
        width={2000}
        height={1200}
        className="absolute top-0 transform -translate-x-1/2 pointer-events-none left-1/2"
      />
      <Image
        src={"/footer-pattern.png"}
        alt="footer pattern"
        width={1200}
        height={0}
        style={{ height: "auto" }}
        className="absolute top-0 z-20 transform -translate-x-1/2 pointer-events-none left-1/2"
      /> */}
        <div className="app-container">
          <div className="grid grid-cols-1 gap-7 md:gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-14">
            <div className="">
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/prayogik-nav-logo.svg"
                  width={152}
                  height={40}
                  className="w-[152px] h-[40px]"
                  alt="prayogik logo"
                  priority
                />
              </Link>
              <p className="text-base font-normal text-fontcolor-subtitle leading-[1.5] mt-5 mb-6 tracking-wide w-[281px]">
                এক সাবস্ক্রিপশনে ছোট ছোট কোর্সে ডিজিটাল স্কিল শেখার সহজ ও
                নির্ভরযোগ্য প্ল্যাটফর্ম।
              </p>
              <div className="flex space-x-5">
                {footerSocialLinks.map((item) => {
                  return (
                    <Link
                      href={item.path}
                      key={item.title}
                      className="cursor-pointer"
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
            {/* neccessary links */}
            <div>
              <h4 className="mb-3 text-[20px] text-[#010F0E] font-bold">
                লিঙ্ক সমূহ
              </h4>
              <ul className="flex flex-col space-y-1">
                {footerOthersLinks.map((link) => {
                  return (
                    <li key={link.title}>
                      <Link
                        href={link.path}
                        className="transition-all duration-300 text-base font-normal text-fontcolor-subtitle hover:underline hover:text-primary-brand"
                      >
                        {link.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* company */}
            <div>
              <h4 className="mb-3 text-[20px] text-[#010F0E] font-bold">
                কোম্পানি
              </h4>
              <ul className="space-y-1">
                {footerCompanyLinks.map((link) => {
                  return (
                    <li key={link.title}>
                      <Link
                        href={link.path}
                        className="transition-all duration-300 text-base font-normal text-fontcolor-subtitle hover:underline  hover:text-primary-brand"
                      >
                        {link.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* contact */}
            <div>
              <h4 className="mb-3 text-[20px] text-[#010F0E] font-bold">
                যোগাযোগ করুন
              </h4>
              <div className="flex flex-col space-y-1">
                <p className="text-base font-normal text-fontcolor-subtitle">
                  হোয়াটস অ্যাপ:  
                  <span className="transition-all duration-300 hover:underline hover:text-primary-brand">
                    ০১৮১৪-৪৩২৮৭৫
                  </span>
                </p>
                <p
                 
                  className="text-base font-normal text-fontcolor-subtitle "
                >
                  ইমেল:{" "}
                  <span>
                    contact@prayogik.com
                  </span>
                </p>
                <address className="not-italic text-base font-normal text-fontcolor-subtitle">
                  ঠিকানা: নূর বিল্ডিং, ২য় তলা। ৭০০/বি, ডিটি রোড। দেওয়ানহাট,
                  চট্টগ্রাম-৪১০০
                </address>
              </div>
            </div>
            {/* payment image */}
            <div className="block w-full max-w-lg sm:hidden">
              {/* <Image
                src={"/payment.png"}
                alt={"payment"}
                width={0}
                height={0}
                sizes="100vw"
                className="object-cover w-full h-auto"
              /> */}
            </div>
          </div>
          <hr className="border-t-[1px] border-[#BFC3C2]" />
          <div className="py-6 flex items-center justify-between">
            <p className="w-full text-base text-center font-medium">
              কপিরাইট &copy; {currentBnYear} | প্রায়োগিক কর্তৃক সর্বস্বত্ব
              সংরক্ষিত
            </p>
            {/* <p className="w-full font-medium text-center text-sm text-fontcolor-disable sm:w-1/2 sm:text-left ">
            স্বত্ব &copy; {currentBnYear} | প্রায়োগিক কর্তৃক সর্বস্বত্ব সংরক্ষিত
          </p> */}
            {/* <div className="hidden max-w-lg sm:block sm:w-1/2"> */}
            {/* <Image
              src={"/payment.png"}
              alt={"payment"}
              width={0}
              height={0}
              sizes="100vw"
              className="object-cover w-full h-auto"
            /> */}
            {/* </div> */}
          </div>
        </div>
      </footer>
    </section>
  );
}
