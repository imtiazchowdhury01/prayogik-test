import { textLangChecker } from "@/lib/utils/textLangChecker";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface CreativeCourseCardProps {
  id: string;
  name: string;
  slug: string;
  image: string;
}
const CreativeCourseCard = ({ data }: { data: CreativeCourseCardProps }) => {
  const [imgSrc, setImgSrc] = useState<string>(data?.image);
  const imgErrorHandler = () => setImgSrc("/default-image.jpg");
  return (
    <div className="w-full h-[260px] border-[1px] border-[#2D514E] relative rounded-md overflow-hidden">
      <Link href={`/courses/?category=${data?.slug}`}>
        <Image
          src={imgSrc}
          alt="course"
          width={0}
          height={0}
          sizes="100vw"
          onError={imgErrorHandler}
          className="block object-cover w-full h-full"
          quality={75}
        />
        <div className="absolute inset-0 px-4 py-5 bg-gradient-to-t from-black/0 to-black/100">
          <p className="text-2xl font-bold text-center text-white ">
            {textLangChecker(data?.name)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CreativeCourseCard;
