import { Card } from "@/components/ui/card";
import Image from "next/image";
import { textLangChecker } from "@/lib/utils/textLangChecker";

const SpeakerCard = ({
  speaker,
}: {
  speaker: { name: string; avatarUrl: string; designation?: string };
}) => {
  return (
    <Card className="overflow-hidden bg-white shadow-md">
      <div className="relative w-full aspect-[4/3] sm:aspect-square md:aspect-[4/3] lg:aspect-[5/4]">
        <Image
          src={speaker?.avatarUrl || "/default-image.jpg"}
          alt={speaker?.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top"
          priority={false}
        />
      </div>
      <div className="p-3 sm:p-4 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
          {textLangChecker(speaker?.name)}
        </h3>
        {speaker.designation && (
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {textLangChecker(speaker.designation)}
          </p>
        )}
      </div>
    </Card>
  );
};

export default SpeakerCard;