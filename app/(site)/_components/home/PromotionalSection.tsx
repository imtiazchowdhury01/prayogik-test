import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import PromotionalCardContent from "./PromotionalCardContent";

const PromotionalSection = () => {
  return (
    // Section with background image and padding
    <section className="w-full py-0 md:py-16 bg-white md:bg-[url('/images/home/promotional-bg.webp')] bg-cover bg-center bg-no-repeat mb-20 md:mb-0">
      <div className="max-w-7xl mx-auto md:px-0 px-6 md:py-8 py-0">
        {/* Flex container for left and right sections */}
        <div className="bg-[#e7f5f5] md:bg-transparent pb-5 md:pb-0 rounded-lg md:rounded-b-none px-0 md:px-8 lg:px-8 xl:px-8 2xl:px-0 flex flex-col md:flex-row justify-between items-center md:gap-x-8 lg:gap-x-14 gap-y-4 relative overflow-hidden">
          {/* Left Section: Promotional Card */}
          <Card className="relative md:w-5/12 lg:w-4/12 w-full max-w-full border-none overflow-hidden py-2 md:rounded-lg rounded-t-lg rounded-b-none">
            {/* Card Background Image Overlay */}
            <div className="absolute inset-0 z-0 bg-primary-brand bg-[url('/roadmap/cta-bg-right.webp')] bg-cover bg-center" />
            {/* Card dynamic subscriptions Content */}
            <PromotionalCardContent />
          </Card>
          {/* Right Section: Promotional Text and CTA */}
          <div className="md:w-7/12 lg:w-8/12 w-full md:space-y-4 space-y-1 relative z-10 px-5 md:px-0">
            {/* Heading */}
            <h2 className="text-xl md:text-2xl lg:text-[32px] leading-[1.5] md:leading-[1.3]  font-bold">
              <span>সাশ্রয়ী মূল্যে বার্ষিক সাবস্ক্রিপশন নিন,</span>
              <br className="hidden md:block" />
              <span>স্মার্টভাবে স্কিল শেখা শুরু করুন</span>
            </h2>
            {/* Subheading/Description */}
            <p className="text-sm md:text-base font-normal pb-6 w-10/12 lg:w-8/12 text-fontcolor-subtitle">
              নিয়মিতভাবে নতুন দক্ষতা অর্জনের মাধ্যমে গড়ে তুলুন একটি সুদৃঢ়
              ক্যারিয়ার, যা আপনাকে ভবিষ্যতে আত্মবিশ্বাসের সঙ্গে পেশাগত জগতে
              এগিয়ে যেতে সাহায্য করবে।
            </p>
            {/* Call-to-action Button */}
            <Link href="/prime">
              <Button
                variant="secondary"
                className="bg-secondary-button w-full md:w-auto text-white font-normal text-md hover:bg-white-50 hover:bg-secondary-button hover:opacity-85"
              >
                সাবস্ক্রাইব করুন
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalSection;
