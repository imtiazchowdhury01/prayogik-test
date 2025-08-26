import Link from "next/link";
import Image from "next/image";
import React from "react";

interface BlogPostCardProps {
  image: string;
  category: string;
  title: string;
  description: string;
  authorImage: string;
  authorName: string;
  date: string;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  image,
  category,
  title,
  description,
  authorImage,
  authorName,
  date,
}) => {
  return (
    <Link href={"/blog/first-blog"}>
      <div className="">
        <div className="relative w-full rounded-2xl aspect-[1.55]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain rounded-2xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-col mt-5 w-full">
          <header className="w-full">
            <p className="text-sm font-bold leading-none text-violet-700">
              {category}
            </p>
            <div className="mt-4 w-full">
              <div className="flex gap-4 items-start w-full">
                <h2 className="flex-1 shrink text-2xl font-semibold leading-none text-gray-900 basis-0">
                  {title}
                </h2>
                <div className="pb-1">
                  <Image
                    src="/images/blog/angled-arrow.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
              <p className="mt-2 text-base leading-6 text-ellipsis text-slate-600">
                {description}
              </p>
            </div>
          </header>
          <footer className="flex gap-3 items-center self-start mt-6 text-sm leading-none">
            <div className="relative w-10 h-10">
              <Image
                src={authorImage}
                alt={authorName}
                fill
                className="object-contain rounded-full"
                sizes="40px"
              />
            </div>
            <div className="">
              <p className="font-bold text-gray-900 mb-1">{authorName}</p>
              <time className="text-slate-600">{date}</time>
            </div>
          </footer>
        </div>
      </div>
    </Link>
  );
};
