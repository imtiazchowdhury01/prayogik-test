import { Button } from "@/components/ui/button";
import React from "react";

export default function SubscriptionPrice() {
  return (
    <div>
      <div>
        <h2 className="text-xl font-bold mt-3 mb-2">
          Subscribe to Prayogik’s top courses
        </h2>
        <p className="text-gray-700 mb-2 text-sm">
          Get this course, plus 12,000+ of our top-rated courses, with Personal
          Plan.{" "}
          <a href="#" className="text-teal-600">
            Learn more
          </a>
        </p>
        {/* button */}
        <Button className="w-full flex bg-teal-600 text-white py-2 rounded mb-4">
          Try Personal Plan for free
        </Button>
      </div>
      <div className="text-xs my-3">
        <p className="text-gray-700 text-center">
          Starting at $11.00 per month after trial
        </p>
        <p className="text-gray-700 text-center mt-1">Cancel anytime</p>
      </div>
    </div>
  );
}
