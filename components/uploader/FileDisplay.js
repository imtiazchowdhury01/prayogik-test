"use client";
import React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Progress } from "@/components/ui/progress";

const FileDisplay = ({ file, removeFile, isUploading, progress }) => {
  return (
    <>
      {file && (
        <div className="mt-6 flex justify-between gap-4 bg-white px-3 py-2 rounded-md items-center">
          <div className="w-full flex flex-col gap-1">
            <p className="mr-2 text-sm text-gray-950">{file.name}</p>
            {isUploading && (
              <div className="w-full">
                <Progress
                  className="h-2 w-full"
                  value={progress}
                  variant="success"
                />
                <span className="inline-flex text-xs text-gray-600">
                  {Math.floor(progress)}% uploaded
                </span>
              </div>
            )}
          </div>
          {/* <div className="flex items-center">
            <button
              onClick={removeFile}
              disabled={isUploading}
              className="text-red-600 hover:text-red-800"
              aria-label="Remove file"
            >
              <Cross2Icon h={6} w={6} />
            </button>
          </div> */}
        </div>
      )}
    </>
  );
};

export default FileDisplay;
