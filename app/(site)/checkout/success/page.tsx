import React from "react";
import { CheckCircle } from "lucide-react";

const Success = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="max-w-2xl bg-green-50 p-8">
        <CheckCircle className="w-20 h-20 text-green-600 mb-6 " />
        <h1 className="text-4xl font-semibold text-green-700 mb-2">
          Checkout Successfully!
        </h1>
        <p className="text-lg text-green-800 max-w-md">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </p>
        <p className="mt-4 text-green-700">
          🎉 You now have full access to the course content. Enjoy learning!
        </p>
      </div>
    </div>
  );
};

export default Success;
