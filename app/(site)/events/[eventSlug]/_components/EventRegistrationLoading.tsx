import React from "react";

const EventRegistrationLoading = () => (
  <div className="bg-white rounded-lg w-full">
    <div className="p-6">
      <div className="animate-pulse">
        {/* Title skeleton */}
        <div className="h-8 bg-gray-100 rounded w-3/4 mb-6"></div>

        {/* Form field skeletons */}
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-100 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-100 rounded w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-100 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-100 rounded w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-100 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-100 rounded w-full"></div>
          </div>

          {/* Button skeleton */}
          <div className="h-12 bg-gray-100 rounded w-full mt-6"></div>
        </div>
      </div>
    </div>
  </div>
);

export default EventRegistrationLoading;
