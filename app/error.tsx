// @ts-nocheck
"use client";
import React from "react";

const ErrorPage = ({ error, reset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-md text-center">
        <h2 className="text-4xl font-bold text-red-500 mb-4">ত্রুটি ঘটেছে</h2>
        <p className="text-lg text-gray-600 mb-6">
          অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন। আমরা সমস্যাটি সমাধানের চেষ্টা করছি।
        </p>
        {/* <p className="text-red-500 mb-4">{error?.message}</p> */}
        <button
          onClick={reset}
          className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
