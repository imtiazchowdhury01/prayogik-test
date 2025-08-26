"use client";
import { textLangChecker } from "@/lib/utils/textLangChecker";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LiaAngleRightSolid } from "react-icons/lia";
interface ICategory {
  id: string;
  name: string;
  slug: string;
  image: string;
}
const CategoryItem = ({ category }: { category: ICategory }) => {
  const [imgSrc, setImgSrc] = useState<string>(category?.image);
  const imgErrorHandler = () => setImgSrc("/default-image.jpg");
  return (
    <li key={category.id} className="w-full">
      <Link
        href={`/courses/?category=${category.slug}`}
        className="text-base flex items-center  hover:shadow-md transition-all duration-300 justify-between p-4 w-full rounded-md border-[1px] border-greyscale-300 text-fontcolor-title"
      >
        <div className="flex items-center justify-between space-x-4">
          <div className="w-14 h-14 min-h-14 min-w-14">
            <Image
              src={imgSrc}
              alt="category-image"
              width={0}
              height={0}
              sizes="100vw"
              onError={imgErrorHandler}
              className="block object-cover w-full h-full rounded-md"
            />
          </div>
          <p className="font-medium">{textLangChecker(category.name)}</p>
        </div>
        <LiaAngleRightSolid className="text-2xl text-fontcolor-description" />
      </Link>
    </li>
  );
};
export default CategoryItem;
