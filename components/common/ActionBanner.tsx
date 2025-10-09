import Link from "next/link";
import Image from "next/image";
import TeacherApplicationButton from "@/app/(site)/become-a-teacher/_components/TeacherApplicationButton";

interface ActionBannerProps {
  title: string;
  titleClass?: string;
  description: string;
  buttonText?: string; // Make optional since you might use custom button
  buttonLink?: string; // Make optional since you might use custom button
  backgroundImage: string;
  className?: string;
  customLink?: {
    href: string;
    label: string;
  };
  showTeacherButton?: boolean;
  customButton?: React.ReactNode; // 👈 NEW: Accept any custom button component
}

const ActionBanner: React.FC<ActionBannerProps> = ({
  title,
  titleClass,
  description,
  buttonText,
  buttonLink,
  backgroundImage,
  className,
  showTeacherButton = false,
  customButton, // 👈 NEW
}) => {
  return (
    <section
      className={`relative rounded-none xl:rounded-xl w-full xl:max-w-[76rem] 2xl:max-w-7xl  mx-auto py-10 sm:py-20 overflow-hidden ${
        className || ""
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          className="object-cover bg-brand"
          quality={75}
          priority
        />
      </div>

      {/* CTA Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h2
          className={`sm:text-3xl md:text-4xl ${
            titleClass ? titleClass : "text-2xl lg:text-5xl"
          }  font-bold text-white mb-2 sm:mb-3 pb-0 leading-tight `}
        >
          {title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg font-light text-white max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-2 sm:px-4 leading-5 sm:leading-6 md:leading-7 mb-6 sm:mb-7 md:mb-8 mt-1 sm:mt-2">
          {description}
        </p>

        {/* Custom button (highest priority) */}
        {customButton && customButton}

        {/* Teacher application button */}
        {!customButton && showTeacherButton && (
          <TeacherApplicationButton className="px-4 py-3 text-md md:text-base">
            রেজিস্ট্রেশন করুন
          </TeacherApplicationButton>
        )}

        {/* Default link button */}
        {!customButton && !showTeacherButton && buttonLink && (
          <Link
            href={buttonLink}
            className="block w-auto bg-secondary-button hover:bg-secondary-button hover:opacity-95 px-4 py-3 text-md md:text-base text-center text-white transition-all duration-300 rounded-md sm:inline-block sm:px-4 sm:py-3"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default ActionBanner;
