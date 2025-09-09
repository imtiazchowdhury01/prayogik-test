import React from "react";

const ContactHeroSection = () => {
  return (
    <section className="flex justify-center items-center bg-brand  text-white">
      <div className="text-center px-4 md:px-20 py-20">
        <div className="bg-[#119D90] mb-4 w-fit mx-auto md:inline-block px-3 py-1 rounded text-white font-light sm:font-thin text-md">
          <p>আমরা পাশে আছি</p>
        </div>
        <h2 className="text-3xl lg:text-5xl xl:text-[3.5rem] 2xl:text-6xl font-bold">
          যোগাযোগ করুন
        </h2>
        <p className="text-lg font-normal mt-4 leading-relaxed w-full">
          প্রশ্ন করুন এখনই! বার্তা দিন দ্রুত, সহজ এবং নির্ভরযোগ্য সহায়তা পাবেন
          এখানেই।
        </p>
      </div>
    </section>
  );
};

export default ContactHeroSection;
