import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const ClientHeader = dynamic(() => import("./HeaderClient"), {
  ssr: false,
  loading: () => (
    <div className="items-center justify-end hidden xl:flex gap-x-3">
      <div className="w-[240px] h-12 bg-gray-100 animate-pulse rounded-md" />
      <div className="w-16 h-12 bg-gray-100 animate-pulse rounded-md" />
    </div>
  ),
});

const navigation = [
  { name: "কোর্স সমূহ", href: "/courses" },
  { name: "প্রাইম", href: "/prime" },
  { name: "লাইভ কোর্স", href: "/live" },
  { name: "কোর্স রোডম্যাপ", href: "/course-roadmap" },
  { name: "শেখাতে চাই", href: "/become-a-teacher" },
];

export default function Header() {
  return (
    <header className="sticky bg-white top-0 z-50 w-full shadow-sm">
      <nav
        className="flex items-center justify-between h-[72px] app-container gap-x-6"
        aria-label="Global"
      >
        <div className="flex items-center space-x-12">
          <Link href="/" className="relative">
            <Image
              src="/prayogik-nav-logo.svg"
              width={900}
              height={900}
              className="w-[152px] h-[80px]"
              alt="prayogik logo"
              priority
            />
            <Image
              src="/beta.svg"
              width={50}
              height={50}
              quality={75}
              alt="beta"
              className="absolute top-[25px] -right-[43px] z-10 w-[42px] h-[20px]"
              loading="eager"
            />
          </Link>

          <div className="hidden mr-4 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className="text-base font-medium px-4 py-2 rounded-md leading-6 text-fontcolor-title hover:bg-[#F1F5F9] transition-all duration-300"
              >
                {item.name}
                <span className="bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] bg-clip-text text-transparent">
                  {item.href === "/prime" && "*"}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <Suspense>
          <ClientHeader navigation={navigation} />
        </Suspense>
      </nav>
    </header>
  );
}
