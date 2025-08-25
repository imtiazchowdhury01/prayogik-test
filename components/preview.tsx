"use client";

import React, { useState, useEffect } from "react";
import { TextContent } from "./TextContent";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="space-h-4">
        <div className="h-3 bg-gray-200 animate-pulse rounded-md mb-2" />
        <div className="h-3 bg-gray-200 animate-pulse rounded-md mb-2" />
        <div className="h-3 bg-gray-200 animate-pulse rounded-md mb-2" />
      </div>
    ); // Skeleton loader when not yet hydrated
  }

  return (
    <div className="inline-block h-12 overflow-hidden">
      <TextContent value={value} />
    </div>
  );
};
