import React from "react";
import { InfoRow } from "./InfoRow";
import Link from "next/link";

interface BootcampCardProps {
  title: string;
  image: string;
  altText: string;
  type: string;
  location: string;
  paymentType: string;
  duration: string;
  schedule: string;
  weeks: string;
  registration: string;
}

export const BootcampCard: React.FC<BootcampCardProps> = ({
  title,
  image,
  altText,
  type,
  location,
  paymentType,
  duration,
  schedule,
  weeks,
  registration,
}) => {
  return (
    <article className="overflow-hidden bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] max-sm:w-full">
      <img
        src={image}
        className="object-cover w-full aspect-[16/9]"
        alt={altText}
        loading="lazy"
      />
      <div className="p-5">
        <h2 className="mb-4 text-xl font-bold leading-snug text-primary-700 max-md:text-lg">
          {title}
        </h2>
        <InfoRow icon="/icon/clock.png" text={type} />
        <InfoRow icon="/icon/location.png" text={location} />
        <InfoRow icon="/icon/money-3.png" text={paymentType} />
        <InfoRow icon="/icon/calendar.png" text={duration} />
        <p className="mb-1 text-base pl-7 text-slate-600">{schedule}</p>
        <p className="mb-1 text-base pl-7 text-slate-600">{weeks}</p>
        <InfoRow icon="/icon/receipt-add.png" text={registration} />
        <Link href="/bootcamp/digital-marketing-bootcamp">
          <div className="p-3 mt-4 text-center w-full text-sm font-semibold text-white bg-primary-brand rounded cursor-pointer border-[none] hover:bg-primary-700 transition-all duration-300">
            রেজিস্ট্রেশন করুন
          </div>
        </Link>
      </div>
    </article>
  );
};
