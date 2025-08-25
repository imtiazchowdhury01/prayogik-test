import Image from "next/image";
import React from "react";
const CourseFeature = ({
  title,
  description,
}: {
  title?: string;
  description?: string | null;
}) => {
  return (
    <div className="flex space-x-2">
      <Image
        src={"/icon/shield-tick.svg"}
        alt="shield-icon"
        width={20}
        height={20}
      />
      <p>
        <span className="text-sm text-fontcolor-paragraph">{title}</span>:{" "}
        <span className="text-sm font-medium text-fontcolor-title">
          {description}
        </span>
      </p>
    </div>
  );
};

export default CourseFeature;
