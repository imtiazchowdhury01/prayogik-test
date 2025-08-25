// @ts-nocheck
"use client";
import { useState } from "react";

export default function DescriptionToggle({ description, limit = 800 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleDescription = () => setIsExpanded((prev) => !prev);

  const shortDescription = description.substring(0, limit);
  const isTruncated = description.length > limit;

  return (
    <div>
      <p
        className="mb-4 text-base text-justify text-fontcolor-description"
        dangerouslySetInnerHTML={{
          __html: isExpanded
            ? description
            : `${shortDescription}${isTruncated ? "..." : ""}`,
        }}
      />
      {isTruncated && (
        <button
          onClick={toggleDescription}
          className="text-sm text-blue-500 hover:underline"
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
