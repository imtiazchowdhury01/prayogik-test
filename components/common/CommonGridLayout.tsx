import React from "react";
import IconContainer from "@/app/(site)/become-a-teacher/_components/IconContainer";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
interface CommonGridLayoutProps {
  data: {
    title: string;
    description: string;
    price: string;
    discount: string;
    icon: React.JSX.Element;
    color: string;
    cardBg: string;
  }[];
  gridClassName: string;
  containerClass: string;
}
const CommonGridLayout = ({
  data,
  gridClassName,
  containerClass = "",
}: CommonGridLayoutProps) => {
  return (
    <section className={`${containerClass} mx-auto`}>
      {/* Facilities Grid */}
      <div className={`${gridClassName}`}>
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col px-4 sm:px-6 py-5 sm:py-6 md:py-[28px] rounded-lg"
            style={{ backgroundColor: item.cardBg }}
          >
            <IconContainer color={item.color}>{item.icon}</IconContainer>
            <h3 className="mt-4 sm:mt-5 md:mt-6 text-lg sm:text-xl font-semibold text-card-black-text leading-snug">
              {item.title}
            </h3>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-fontcolor-subtitle leading-relaxed">
              {item.description}
            </p>
            {item?.price && (
              <p className="mt-1 sm:mt-2 font-semibold text-base text-gray-950 leading-6">
                মূল্য: ৳{convertNumberToBangla(item.price)}
              </p>
            )}
            {item?.discount && (
              <p className="mt-1 sm:mt-2 font-semibold text-base text-fontcolor-subtitle leading-relaxed">
                ছাড়: {convertNumberToBangla(item.discount)}%
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommonGridLayout;
