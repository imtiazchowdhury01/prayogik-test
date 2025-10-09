"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaymentErrorProps {
  message: string;
}

const PaymentError = ({ message }: PaymentErrorProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

 const handleCancel = () => {
    // Start fade out animation
    setIsAnimating(true);
    
    // Hide completely after animation
    setTimeout(() => {
      setIsVisible(false);
    }, 150);

    // Instantly update URL using window.history
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("error");

    const currentPath = window.location.pathname;
    const newUrl = newSearchParams.toString()
      ? `${currentPath}?${newSearchParams.toString()}`
      : currentPath;

    window.history.replaceState({}, '', newUrl);
  };
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className={`mb-6 p-4 bg-red-50 border border-red-200 rounded-md transition-opacity duration-150 ${
      isAnimating ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-red-800">
                পেমেন্ট ব্যর্থ হয়েছে
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {message && 'দুঃখিত, আপনার পেমেন্টটি ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="ml-4 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1"
              aria-label="Close error message"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;