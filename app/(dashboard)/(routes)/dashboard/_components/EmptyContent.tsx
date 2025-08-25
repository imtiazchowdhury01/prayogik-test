//@ts-nocheck
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EmptyState = ({
  variant = "default", // "default || premium"
  title,
  description,
  buttonText,
  buttonHref,
  showButton = true,
}) => {
  // Single style configuration for all variants
  const styles = {
    containerClass:
      "w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-50 rounded-full",
    iconClass: "w-12 h-12 text-teal-600",
    titleClass: "text-2xl font-bold text-gray-800 mb-4",
    descriptionClass: "text-gray-600 mb-8 leading-relaxed",
    buttonClass:
      "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200",
  };

  const maxWidthClass = "max-w-lg";

  // Icon based on variant
  const renderIcon = () => {
    const iconPath =
      variant === "premium"
        ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        : "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253";

    return (
      <svg
        className={styles.iconClass}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d={iconPath}
        />
      </svg>
    );
  };

  const renderButton = () => {
    if (!showButton || !buttonText || !buttonHref) return null;

    if (variant === "premium") {
      return (
        <Button asChild size="lg" className={styles.buttonClass}>
          <Link href={buttonHref} className="flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>{buttonText}</span>
          </Link>
        </Button>
      );
    }

    return (
      <Button asChild className={styles.buttonClass}>
        <Link href={buttonHref}>{buttonText}</Link>
      </Button>
    );
  };

  return (
    <div className="py-16 px-8">
      <div className={`${maxWidthClass} mx-auto text-center`}>
        <div
          className={`${styles.containerClass} flex items-center justify-center mx-auto mb-8`}
        >
          {renderIcon()}
        </div>
        <h3 className={styles.titleClass}>{title}</h3>
        <p className={styles.descriptionClass}>{description}</p>
        {renderButton()}
      </div>
    </div>
  );
};

export default EmptyState;
