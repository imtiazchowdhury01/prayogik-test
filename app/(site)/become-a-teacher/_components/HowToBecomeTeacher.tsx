//@ts-nocheck
import IconContainer from "./IconContainer";
import User from "./icon/User";
import Aggrement from "./icon/Aggrement";
import List from "./icon/List";
import { useSession } from "next-auth/react";
import TeacherApplicationButton from "./TeacherApplicationButton";

const HowToBecomeTeacher = () => {
  const data = [
    {
      title: "ধাপ ১: যোগাযোগ",
      description:
        "নিচের ফর্মটি পূরণ করুন। আপনি এখনই প্রস্তুত না থাকলেও ফর্মটি জমা দিলে আমরা সময়মতো আপনার সাথে যোগাযোগ করবো",
      icon: <User />,
      color: "#4AAFA6",
      cardBg: "#E7F5F4",
    },
    {
      title: "ধাপ ২: বিস্তারিত জানুন",
      description:
        "রেকর্ডেড কোর্স, লাইভ কোর্স, ওয়ার্কশপ, ক্যারিয়ার সেমিনার—সব ফরম্যাট নিয়েই আলোচনা করার জন্য আমরা একটি ভার্চুয়াল মিটিং আয়োজন করবো।",
      icon: <List />,
      color: "#4AAFA6",
      cardBg: "#E7F5F4",
    },
    {
      title: "ধাপ ৩: কোলাবোরেশন",
      description:
        "আপনি যেভাবে আমাদের সাথে কাজ করতে চান, সেই ফরম্যাটে যদি আমরা একমত হই, তাহলে একসাথে কাজ শুরুর জন্য প্রয়োজনীয় আনুষ্ঠানিকতা দ্রুত সম্পন্ন করে আমরা এগিয়ে যাবো। আমাদের টিম নিয়মিত আপনার সাথে যোগাযোগ রাখবে এবং প্রতিটি ধাপে সাপোর্ট করবে।",
      icon: <Aggrement />,
      color: "#4AAFA6",
      cardBg: "#E7F5F4",
    },
  ];

  return (
    <section className="w-full pb-12 md:pb-16 lg:pb-24 xl:pb-32">
      <div className="app-container">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="course-proposal-heading">কীভাবে যুক্ত হবেন?</h2>
          <p className="course-proposal-description max-w-3xl">
            আপনার আগ্রহ জানাতে নিচের ধাপগুলো অনুসরণ করুন।
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col px-4 sm:px-6 py-5 sm:py-6 md:py-[28px] rounded-lg"
              style={{ backgroundColor: item.cardBg }}
            >
              <IconContainer color={item.color}>{item.icon}</IconContainer>
              <h3 className="mt-4 sm:mt-5 md:mt-6 text-lg sm:text-xl font-semibold text-card-black-text leading-7">
                {item.title}
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-fontcolor-subtitle leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center mt-8">
          <TeacherApplicationButton>
            শিক্ষকতার জন্য আবেদন
          </TeacherApplicationButton>
        </div>
      </div>
    </section>
  );
};

export default HowToBecomeTeacher;
