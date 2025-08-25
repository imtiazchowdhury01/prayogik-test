import Link from "next/link";
import React from "react";
import { FaAngleRight } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

const SeeMoreBtn = ({
  href,
  title = "আরো দেখুন",
  className,
}: {
  href: string;
  title?: string;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className={twMerge(
        "items-center px-4 py-3 space-x-2 text-base font-semibold text-center text-white transition-all duration-300 rounded-lg cursor-pointer md:flex hover:opacity-70 bg-primary-brand",
        className
      )}
    >
      <span>{title}</span> <img src="/icon/arrow-down.svg" />
    </Link>
  );
};

export default SeeMoreBtn;
