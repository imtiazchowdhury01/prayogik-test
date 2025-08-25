"use client";

export default function UploadProgress({ progress }) {
  return (
    <div className=" flex gap-4 items-center flex-col">
      <div className=" sm:flex-row text-red-600">Upload Progress</div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-600">
        {Math.floor(progress)}% uploaded
      </span>
    </div>
  );
}
