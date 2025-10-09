import React from "react";
import Link from "next/link";
import Image from "next/image";

const ContactDetails = () => {
  const sections = [
    {
      title: "সাধারণ জিজ্ঞাসা",
      content: (
        <>
          কোর্স, ওয়ার্কশপ বা গেস্ট স্পিচ সম্পর্কে জানতে চাইলে, আমাদের সঙ্গে
          সহযোগিতার সুযোগ নিয়ে আলোচনা করতে বা কেবলমাত্র শুভেচ্ছা জানাতে –
          নির্দ্বিধায় আমাদের{" "}
          <a
            href="mailto:contact@prayogik.com"
            className="text-brand font-medium underline"
          >
            বার্তা পাঠাতে পারেন।
          </a>
        </>
      ),
    },
    {
      title: "কোর্স সাপোর্ট",
      content: (
        <>
          আপনি যদি লেসন, কুইজ, কোর্স কাস্টমাইজেশন বা নতুন ফিচার সংক্রান্ত অনুরোধ
          করতে চান, কোনো বাগ রিপোর্ট করতে চান, অথবা আপনার সাবস্ক্রিপশন ও কোর্স
          সম্পর্কিত যেকোনো প্রশ্ন থাকে, তাহলে প্ল্যাটফর্মের{" "}
          <Image
            src="/thrivedesk.png"
            alt="Chat Icon"
            width={28} // Use 2x size
            height={28}
            className="inline-block mr-1 w-[20px] h-[20px]" // Scale down with CSS
            quality={100}
          />
          <span className="text-brand font-medium">ফ্লোটিং চ্যাট আইকন</span> -এ
          ক্লিক করে যোগাযোগ ফর্ম ব্যবহার করুন অথবা দ্রুত{" "}
          <span className="text-brand font-medium">একটি টিকিট খুলে</span> আমাদের
          সাহায্য নিন।
        </>
      ),
    },
  ];

  return (
    <section className="lg:max-w-3xl max-w-full lg:px-4 px-8 mx-auto py-12 md:py-24 text-justify">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
        যোগাযোগ
      </h2>

      {sections.map((section, index) => (
        <div key={index} className="space-y-3 mb-10">
          <h3 className="text-lg md:text-3xl font-bold text-gray-900">
            {section.title}
          </h3>
          <p className="text-gray-700 leading-relaxed text-base font-normal">
            {section.content}
          </p>
        </div>
      ))}

      <div className="mt-10 text-base text-gray-700 font-normal">
        <p>
          <strong>* সহায়তার সময়:</strong> শনিবার থেকে বৃহষ্পতিবার, সকাল ৯টা –
          বিকাল ৫টা, সরকারি ছুটি বাদে।
        </p>
      </div>
    </section>
  );
};

export default ContactDetails;
