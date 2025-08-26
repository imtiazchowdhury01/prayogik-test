import React from "react";

interface SectionTitleProps {
  title: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
}

const SectionTitle = ({
  title,
  description,
  titleClassName = "",
  descriptionClassName = "",
  containerClassName = "pb-8 px-6 md:px-0",
}: SectionTitleProps) => {
  return (
    <div className={`text-center ${containerClassName}`}>
      <h2
        className={`${titleClassName} text-3xl lg:text-[40px] font-bold leading-[120%] tracking-[-0.4px] pb-1.5`}
      >
        {title}
      </h2>
      <p
        className={`${descriptionClassName} text-base font-normal leading-6 max-w-2xl mx-auto text-gray-600`}
      >
        {description}
      </p>
    </div>
  );
};

export default SectionTitle;
