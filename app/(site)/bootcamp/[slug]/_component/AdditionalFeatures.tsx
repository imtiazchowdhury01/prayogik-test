import React from "react";

export const AdditionalFeatures: React.FC = () => {
  return (
    <section className=" text-slate-900">
      <h2 className="text-2xl font-bold leading-none max-md:max-w-full">
        আরও যা থাকছে
      </h2>
      <ul className="flex flex-wrap gap-8 content-start items-start p-4 mt-4 w-full text-base font-medium rounded-lg border border-solid border-[color:var(--Greyscale-200,#E2E8F0)] max-md:max-w-full">
        <li className="flex gap-2.5 items-center min-w-60">
          <img src="/icon/tick-circle.png" alt="tickcircle" />
          <p className="self-stretch my-auto">
            ইন্ড্রাস্ট্রি ট্রেন্ড অনুযায়ী লার্নিং রোডম্যাপ
          </p>
        </li>
        <li className="flex gap-2.5 items-center min-w-60 w-[335px]">
          <img src="/icon/tick-circle.png" alt="tickcircle" />
          <p className="self-stretch my-auto">
            কোর্স শেষে থাকবে প্রফেশনাল সার্টিফিকেট
          </p>
        </li>
      </ul>
    </section>
  );
};

export default AdditionalFeatures;
