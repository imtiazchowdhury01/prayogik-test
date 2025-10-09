import React from "react";

const CertificationInfoCard = ({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col justify-start items-start lg:items-start flex-grow-0 flex-shrink-0 gap-2.5 p-5 xl:px-7 xl:py-8 rounded-[10px] bg-white border-[1.2px] border-[#dfedeb] shadow-[0px_4px_4px_0_rgba(2,22,20,0.02)]">
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-1">
        <p className="flex-grow-0 flex-shrink-0 text-xl font-semibold text-left text-[#021614]">
          {heading}
        </p>
        <p className=" text-base text-left text-[#41504f]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CertificationInfoCard;
