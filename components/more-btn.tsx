import Link from "next/link";
import React from "react";
import { FaAngleRight } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

const MoreBtn = ({
  href,
  title = "আরো দেখুন",
  className,
  variant = "fill",
}: {
  href: string;
  title?: string;
  className?: string;
  variant?: "fill" | "outline" | "underline";
}) => {
  return (
    <Link
      href={href}
      className={twMerge(
        `items-center px-4 py-3 space-x-2 text-base font-semibold text-center transition-all duration-300 rounded-lg cursor-pointer md:flex ${
          variant === "fill"
            ? "hover:bg-primary-700 bg-primary-brand text-white"
            : variant === "outline"
            ? "border border-primary-700 hover:bg-primary-700 bg-transparent text-primary-700 hover:text-white"
            : "no-underline text-brand bg-transparent hover:opacity-90 p-0"
        }`,
        className
      )}
    >
      <span>{title}</span> <FaAngleRight />
    </Link>
  );
};

export default MoreBtn;
