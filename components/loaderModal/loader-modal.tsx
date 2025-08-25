// @ts-nocheck
import { Loader } from "lucide-react";
import React from "react";

export default function LoaderModal({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="dark:bg-gray-900 w-full max-w-md p-6">
        <div className="flex justify-center">
          <Loader className="w-8 h-8 animate-spin text-white" />
        </div>
      </div>
    </div>
  );
}
