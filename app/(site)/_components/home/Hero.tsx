import { Button } from "@/components/ui/button";
import Instructor1 from "@/images/abul-kashem.jpg";
import Image from "next/image";
import Link from "next/link";

export default async function Hero() {
  return (
    <div className="bg-[#1B1B1B] py-32 lg:py-48">
      <div className="mx-auto max-w-7xl p-6 lg:px-8">
        <div className="flex gap-12 xl:gap-32 flex-col-reverse lg:flex-row">
          <div className="flex-1 w-full text-start md:text-center lg:text-start">
            <h1 className="text-3xl lg:text-4xl py-4 px-2 font-bold bg-gradient-to-r from-white from-10% via-[#FFDE70] via-30% to-white to-50% bg-clip-text	text-transparent">
              ইন্ড্রাস্ট্রি এক্সপার্টদের থেকে
            </h1>
            <h2 className="mt-2 text-teal-400 text-5xl lg:text-6xl font-bold">
              অনলাইন বুটক্যাম্প ও অনডিমান্ড কোর্স
            </h2>
            <p className="mt-4 text-xl w-full md:w-5/6 mx-auto lg:w-full text-neutral-50">
              জব রেডি স্কিল শিখে ক্যারিয়ার তৈরি করুন। অনলাইন থেকে আয়ের উপযোগী
              কোর্স করে ব্যবসা বা ফ্রিল্যান্সিংয়ে সফল হয়ে উঠুন।
            </p>
            <div className="mt-4 flex items-center justify-between md:justify-center lg:justify-between">
              <div className="flex flex-wrap gap-4">
                <Link href="/courses/category?page=1">
                  <Button className="h-14 px-8 text-lg py-[22px] bg-teal-600 hover:bg-teal-500 hover:opacity-80 text-white">
                    কোর্সগুলো দেখুন
                  </Button>
                </Link>
              </div>
              <div className="block md:hidden lg:block">
                <Image
                  src="/images/home/playicon.svg"
                  alt=""
                  width={83}
                  height={83}
                  priority
                />
              </div>
            </div>
          </div>
          <div className="flex-1 relative hidden lg:block">
            <div className="absolute -top-32 -left-10 hidden xl:block">
              <Image
                src="/images/home/person-bg.svg"
                alt=""
                width={600}
                height={600}
                priority
              />
            </div>
            <div className="flex flex-row gap-4">
              <article className="flex-1 relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80 h-[328px] w-[247px] shadow shadow-gray-600 rounded-28">
                <Image
                  alt="Instructor Image"
                  src={Instructor1}
                  className="absolute inset-0 -z-10 w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                <h3 className=" text-lg font-semibold leading-6 text-white">
                  <span className="absolute inset-0" />
                  Abul Kashem
                </h3>
                <div className="mt-1 text-sm leading-6 text-gray-300">
                  <p>Industry Expert</p>
                </div>
              </article>
              <article className="mt-24 flex-1 relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80 h-[328px] w-[247px] shadow shadow-gray-600 rounded-28">
                <Image
                  alt=""
                  src={Instructor1}
                  className="absolute inset-0 -z-10 w-full h-full object-cover"
                  layout="fill"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                <h3 className=" text-lg font-semibold leading-6 text-white">
                  <span className="absolute inset-0" />
                  Abul Kashem
                </h3>
                <div className="mt-1 text-sm leading-6 text-gray-300">
                  <p>Industry Expert</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
