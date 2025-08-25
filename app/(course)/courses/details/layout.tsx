import Footer from "@/app/(site)/_components/Footer";
import Header from "@/app/(site)/_components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prayogik",
  description: "Welcome to prayogik.com",
};

export default function DetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
