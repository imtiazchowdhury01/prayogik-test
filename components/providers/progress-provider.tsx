"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const TopProgressBar = dynamic(() => import("../progressBar"), {
  ssr: false,
});

export default function TopProgressProvider() {
  return (
    <Suspense fallback={null}>
      <TopProgressBar />
    </Suspense>
  );
}
