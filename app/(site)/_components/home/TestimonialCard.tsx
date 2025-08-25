// @ts-nocheck
import Image from "next/image";
import React from "react";
import TestimonialItem from "./TestimonialItem";

const TestimonialCard = ({
  review,
}: {
  review: {
    name: string;
    image: string;
  };
}) => {
  return (
    <div className="flex flex-col justify-center space-y-14">
      <TestimonialItem />
      <TestimonialItem />
      <TestimonialItem />
    </div>
  );
};

export default TestimonialCard;
