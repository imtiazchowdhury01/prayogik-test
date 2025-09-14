// app/components/HeaderShell.tsx
import Link from "next/link";
import Image from "next/image";

const navigation = [
  { name: "কোর্স সমূহ", href: "/courses" },
  { name: "প্রাইম", href: "/prime" },
  // ... rest
];

export default function HeaderShell({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <nav className="flex items-center justify-between h-[72px] app-container gap-x-6">
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
            />
          </Link>

          {/* Static Navigation — Server Rendered */}
          <div className="hidden mr-4 xl:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium px-4 py-2 rounded-md leading-6 text-fontcolor-title hover:bg-[#F1F5F9] transition-all duration-300"
              >
                {item.name}{" "}
                <span className="bg-gradient-to-r from-[#FF3A4D] to-[#FF8538] bg-clip-text text-transparent">
                  {item.href === "/prime" && "*"}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Client-Specific Parts (Auth, Search, Mobile Menu) */}
        <div className="xl:hidden">
          {children}
        </div>
      </nav>
    </header>
  );
}