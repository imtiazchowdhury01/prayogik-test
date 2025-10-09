import React from "react";

interface SectionTitleProps {
  title: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
  alignment?: string; // New prop for alignment
}

const SectionTitle = ({
  title,
  description,
  titleClassName = "",
  descriptionClassName = "",
  containerClassName = "pb-8 px-6 md:px-0",
  alignment = "text-center", // Default alignment
}: SectionTitleProps) => {
  return (
    <div className={`${alignment} ${containerClassName}`}>
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
