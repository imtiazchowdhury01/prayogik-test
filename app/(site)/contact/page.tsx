import type { Metadata } from "next";
import ContactFormClient from "./_components/ContactFormClient";
import ContactHeroSection from "./_components/ContactHeroSection";
import ContactInfo from "./_components/ContactInfo";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch with Prayogik Team",
  description:
    "Have questions or need support? Contact the Prayogik team for assistance, collaboration, or course inquiries. We're here to help you learn and grow.",
};

export default function ContactPage() {
  return (
    <div className="min-h-[70vh] max-h-[auto]">
      <ContactHeroSection />
      <div className="flex flex-col-reverse py-10 sm:pt-24 sm:pb-24 gap-y-10 md:gap-y-0 md:space-x-5 md:flex-row lg:space-x-10 app-container">
        {/* Server-side rendered contact info */}
        <ContactInfo />
        {/* Client-side contact form  and apply for teaching */}
        <ContactFormClient formType="contact" />
      </div>
    </div>
  );
}
