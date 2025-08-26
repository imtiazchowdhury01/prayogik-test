"use client";

import { clearServerCart } from "@/lib/actions/cart-cookie";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface PaymentSuccessProps {
  trxID: string;
  amount: string;
}

export const PaymentSuccessAlert = ({ trxID, amount }: PaymentSuccessProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCancel = () => {
    // Create new URLSearchParams without the success parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("trxID");
    newSearchParams.delete("amount");

    // Get current pathname
    const currentPath = window.location.pathname;

    // Navigate to the same page without the success parameters
    const newUrl = newSearchParams.toString()
      ? `${currentPath}?${newSearchParams.toString()}`
      : currentPath;

    router.replace(newUrl);
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      (async () => {
        try {
          await clearServerCart();
          console.log("Server cart cleared after 5 seconds");
        } catch (error) {
          console.error("Failed to clear server cart:", error);
        }
      })();
    }, 5000);

    // Cleanup if component unmounts before 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                পেমেন্ট সফল হয়েছে!
              </h3>
              <p className="mt-1 text-sm text-green-700">
                আপনার পেমেন্টটি সফলভাবে সম্পন্ন হয়েছে।
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="ml-4 text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md p-1"
              aria-label="Close success message"
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

          <div className="mt-3 space-y-1">
            <p className="text-sm text-green-600">
              <span className="font-medium">ট্রানসাকশান আইডি:</span> {trxID}
            </p>
            <p className="text-sm text-green-600">
              <span className="font-medium">পরিমাণ:</span> ৳
              {convertNumberToBangla(parseInt(amount).toLocaleString())}
            </p>
          </div>

          {/* <div className="mt-4 flex gap-3">
            <button
              onClick={handleGoToDashboard}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Go to Dashboard
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Continue Shopping
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
