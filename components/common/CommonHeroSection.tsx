import OfferVideoSection from "@/app/(site)/course-roadmap/_components/OfferVideoSection";
import PriceIcon from "@/app/(site)/prime/_utils/PriceIcon";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface CommonHeroSectionProps {
  // Content props
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;

  // Visual props
  backgroundImage?: string;
  videoSrc?: string;
  imageSrc?: string;

  // Layout props
  showVideoSection?: boolean;
  textColor?: string;
  buttonVariant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
  buttonClass?: string;
  titleClass?: string;

  // Badge customization props
  badgeText?: string;
  showBadge?: boolean;
  showBadgeIcon?: boolean;
  badgeIcon?: React.ReactNode;
  badgeClassName?: string;
}

const CommonHeroSection = ({
  title,
  description,
  buttonText = "",
  buttonLink = "",
  backgroundImage = "",
  videoSrc = "",
  imageSrc = "",
  showVideoSection = true,
  buttonVariant = "default",
  titleClass = "",
  buttonClass = "bg-white text-brand hover:bg-white",
  badgeText = "",
  showBadge = false,
  showBadgeIcon = false,
  badgeIcon = <PriceIcon />,
  badgeClassName = "bg-[#10B1A2] text-lime-200 ",
}: CommonHeroSectionProps) => {
  const dataSrc = {
    videoSrc,
    imageSrc,
  };

  return (
    <div className="bg-brand relative">
      {/* background block image shape */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="Prayogik Hero background"
          fill
          priority
          quality={75}
          className="object-cover z-0 md:block hidden"
          sizes="100vw"
        />
      )}

      {/* hero details section */}
      <div className="app-container relative flex justify-center flex-col items-center pt-14 md:pt-12">
        {/* badge - conditionally rendered with customization options */}
        {showBadge && (
          <div
            className={`${badgeClassName} gap-1 px-3.5 py-1.5 w-fit mx-auto md:inline-block rounded-lg  font-light text-xl `}
          >
            <div className="flex items-center gap-1.5">
              {showBadgeIcon && badgeIcon}
              <p className="md:font-light font-normal">{badgeText}</p>
            </div>
          </div>
        )}
        {/* title */}
        <h1
          className={`${titleClass} md:max-w-3xl max-w-2xl text-center text-3xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold text-white py-4 md:pt-8 md:pb-6`}
        >
          {title}
        </h1>
        {/* description */}
        {description && (
          <p className="text-md text-center md:text-[20px] text-gray-100 font-normal md:font-light max-w-full md:max-w-2xl leading-7">
            {description}
          </p>
        )}
        {/* call to action button - conditionally rendered */}
        {buttonText && buttonLink && (
          <Link href={buttonLink}>
            <Button
              variant={buttonVariant}
              className={`${buttonClass} mt-12 px-4 h-12 font-semibold text-base`}
            >
              {buttonText}
            </Button>
          </Link>
        )}
      </div>

      {/* hero video section - conditionally rendered */}
      {showVideoSection && (
        <div className="pt-8 pb-14 md:pt-14 md:pb-[60px]">
          <OfferVideoSection dataSrc={dataSrc} customOpacity={0.25} />
        </div>
      )}
    </div>
  );
};

export default CommonHeroSection;
