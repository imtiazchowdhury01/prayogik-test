

import * as React from "react";

interface CreditCardProps {
  title: string;
  description: string;
}

export const BenefitCard: React.FC<CreditCardProps> = ({ title, description }) => {
  return (
    <article className="flex flex-col gap-4 items-start p-8 rounded-lg bg-white bg-opacity-10 flex-[1_0_0] max-md:w-full">
      <h2 className="w-full text-2xl font-bold leading-8 text-white max-sm:text-xl max-sm:leading-7">
        {title}
      </h2>
      <p className="w-full text-lg leading-7 text-slate-100 max-sm:text-base max-sm:leading-6">
        {description}
      </p>
    </article>
  );
};
