// @ts-nocheck
"use client";

import React, { forwardRef } from "react";
import JoditEditor from "jodit-react";

interface JoditProps {
  textContent: string;
  onChange: (html: string) => void;
  className?: string;
}

const JoditTextContent = forwardRef<HTMLElement, JoditProps>(
  ({ textContent, onChange, className }, ref) => {
    const handleChange = (newContent) => {
      onChange(newContent);
    };

    return (
      <div
        className={`flex min-h-[250px] flex-col justify-stretch ${className}`}
      >
        <JoditEditor
          value={textContent}
          onChange={handleChange}
          config={{
            toolbar: [
              "bold",
              "italic",
              "underline",
              "font",
              "fontsize",
              "paragraph",
              "ol",
              "ul",
              "table",
              "|",
              "image",
              "link",
              "|",
              "undo",
              "redo",
            ],
            removeButtons: ["preview"], // This removes the eye icon
            placeholder: "Type here...",
          }}
        />
      </div>
    );
  }
);

JoditTextContent.displayName = "JoditTextContent";

export default JoditTextContent;
