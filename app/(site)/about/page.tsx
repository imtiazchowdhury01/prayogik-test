import type { Metadata } from "next";
import Hero from "./_components/Hero";
import OurStory from "./_components/OurStory";
import Misson from "./_components/Misson";
import Vision from "./_components/Vision";

export const metadata: Metadata = {
  title: "About Prayogik | Practical Skill-Based Learning in Bangla",
  description:
    "Prayogik is a Bangladeshi edtech platform offering practical, job-focused courses in Bangla. Learn from industry experts and build real-world skills that matter.",
};

const AboutPage = () => {
  return (
    <main className="w-full min-h-[70vh] bg-white">
      {/* about hero section */}
      <Hero />
      <div className="app-container mx-auto py-20 space-y-8 lg:space-y-14">
        {/* Story Section */}
        <OurStory />

        <div className="h-[1px] bg-[#F2F3F3]"></div>
        {/* Mission Section */}
        <Misson />
        <div className="h-[1px] bg-[#F2F3F3]"></div>
        {/* Vision Section */}
        <Vision />
        {/* Team Section
        <Team /> */}
      </div>
    </main>
  );
};

export default AboutPage;
