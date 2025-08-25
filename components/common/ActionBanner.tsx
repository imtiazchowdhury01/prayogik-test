import Link from "next/link";
import Image from "next/image";

interface ActionBannerProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  className?: string; // Add optional className
}

const ActionBanner: React.FC<ActionBannerProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  backgroundImage,
  className,
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
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 pb-0 leading-tight">
          {title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg font-light text-white max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-2 sm:px-4 leading-5 sm:leading-6 md:leading-7 mb-6 sm:mb-7 md:mb-8 mt-1 sm:mt-2">
          {description}
        </p>
        <Link
          href={buttonLink}
          className="block w-auto bg-secondary-button hover:bg-secondary-button hover:opacity-95 px-4 py-3 text-md md:text-base text-center text-white transition-all duration-300 rounded-md sm:inline-block sm:px-4 sm:py-3"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default ActionBanner;
