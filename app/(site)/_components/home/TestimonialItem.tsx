import Image from "next/image";
import React from "react";

type testimonialProps = {
  name: string;
  image: string;
  review: string;
};

const TestimonialItem = ({
  testimonial,
}: {
  testimonial: testimonialProps;
}) => {
  const { name, image, review } = testimonial;

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="mb-5 text-lg font-normal text-justify sm:text-xl text-fontcolor-title">
        "{review}"
      </p>
      <div className="flex items-center space-x-2">
        <Image
          src={image}
          alt="avatar"
          width={0}
          height={0}
          sizes="100vw"
          className="object-cover rounded-full max-w-[50px] max-h-[50px]"
          quality={75}
        />
        <div>
          <p className="text-lg font-bold sm:text-xl">{name}</p>
          {/* <p className="text-fontcolor-description text-base">
            ডিজিটাল মার্কেটিং শিক্ষার্থী
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default TestimonialItem;
