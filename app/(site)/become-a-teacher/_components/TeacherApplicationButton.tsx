//@ts-nocheck
"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

const TeacherApplicationButton = ({
  children,
  variant = "default",
  className = "",
}) => {
  // Check if the user is a teacher
  const { data: session, status } = useSession();
  const isTeacher = session?.user?.info?.teacherProfile?.id;

  // Base classes for both variants
  const baseClasses =
    "bg-secondary-button text-white font-medium transition-opacity duration-200";
  // Variant-specific classes
  const variantClasses = {
    default:
      "inline-block p-2 sm:py-3 sm:px-4 rounded-[6px] text-sm sm:text-base",
    full: "w-full text-center p-3 rounded-lg mt-auto",
  };

  // Disabled state classes
  const disabledClasses = "opacity-50 cursor-not-allowed";
  // Hover effect classes
  const hoverClasses = !isTeacher ? "hover:opacity-90" : "";
  // Combine classes
  const finalClasses = `${baseClasses} ${
    variantClasses[variant]
  } ${hoverClasses} ${className} ${isTeacher ? disabledClasses : ""}`.trim();

  if (isTeacher) {
    return (
      <button disabled className={finalClasses}>
        {children}
      </button>
    );
  }

  return (
    <Link href="/apply-for-teaching" className={finalClasses}>
      {children}
    </Link>
  );
};

export default TeacherApplicationButton;
