import Image from "next/image";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background-gray min-h-screen">
      <div className="flex items-center justify-center bg-white h-14 md:h-20">
        <div className="h-8 md:h-10 w-36 md:w-40">
          <Link href="/">
            <Image
              src={"/prayogik-nav-logo.svg"}
              alt="logo"
              width={0}
              height={0}
              sizes="100vw"
              className="object-cover w-full h-full"
              priority={true}
            />
          </Link>
        </div>
      </div>
      <div className="flex flex-col  max-h-[auto] items-center px-3">
        {children}
      </div>
    </div>
  );
}
