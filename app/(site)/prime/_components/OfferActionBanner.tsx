import Link from "next/link";
import Image from "next/image";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";

interface ActionBannerDataProps {
  regularFee: string;
  launchOfferFee: string;
  nextPriceUpdatedDate: string;
}
interface OfferActionBannerProps {
  actionBannerData: ActionBannerDataProps;
  sectionBadge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  className?: string; // Add optional className
}

const OfferActionBanner: React.FC<OfferActionBannerProps> = ({
  actionBannerData,
  sectionBadge,
  title,
  description,
  buttonText,
  buttonLink,
  backgroundImage,
  className,
}) => {
  return (
    <section
      className={`relative rounded-none xl:rounded-xl w-full xl:max-w-[76rem] 2xl:max-w-4xl mx-auto px-4 sm:px-14 py-8 overflow-hidden ${
        className || ""
      }`}
    >
      {/* Background Image or background color */}
      {backgroundImage ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover"
            quality={100}
            priority
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-brand"></div>
      )}
      {/* CTA Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* price */}
        <p className="text-base mb-2 font-light">
          <span className="text-white">{sectionBadge}</span>
          <span className="font-medium text-[#D1FFA3] line-through">
            ৳{convertNumberToBangla(actionBannerData?.regularFee)}
          </span>
        </p>
        {/* title */}
        <h2 className="text-2xl md:text-[32px] font-bold text-white leading-tight">
          <span className="text-2xl font-semibold">{title}</span> ৳
          {convertNumberToBangla(actionBannerData?.launchOfferFee)}
        </h2>
        {/* description */}
        <div>
          <p className="text-sm sm:text-base font-light text-white px-2 sm:px-4 leading-5 sm:leading-6 md:leading-7 mb-6 sm:mb-7 md:mb-6 mt-1 sm:mt-2">
            {description}
            {/* conditionaly show it */}
            {actionBannerData?.nextPriceUpdatedDate && (
              <span>{actionBannerData?.nextPriceUpdatedDate}</span>
            )}
          </p>
        </div>
        {/* button or link */}
        <Link
          href={buttonLink}
          className="block w-auto bg-secondary-button hover:bg-secondary-button hover:opacity-95 px-4 py-3 text-md md:text-base text-center text-white transition-all duration-300 rounded-md sm:inline-block sm:px-6 sm:py-3"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default OfferActionBanner;
