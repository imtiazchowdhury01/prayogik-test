import React from 'react';

const SubscriptionLoader = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {[...Array(3)].map((_, index) => (
          <div className="bg-white w-full rounded-lg">
            <div
              key={index}
              className="w-full flex flex-col flex-1 bg-white rounded-lg  shadow-lg shrink animate-pulse"
            >
              <div className="relative flex flex-col w-full px-5 mt-10">
                {/* Price Skeleton */}
                <div className="z-0 w-1/2 h-10 mx-auto bg-gray-300 rounded-lg"></div>

                {/* Plan Title and Billing Type Skeleton */}
                <div className="z-0 flex flex-col w-full mt-4 text-center">
                  <div className="w-3/4 h-6 mx-auto bg-gray-300 rounded-lg"></div>
                  <div className="w-1/2 h-4 mx-auto mt-2 bg-gray-300 rounded-lg"></div>
                </div>
              </div>

              {/* Features Skeleton */}
              <div className="flex flex-col w-full px-8 pb-10 mt-5">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center w-full mt-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <div className="w-3/4 h-4 ml-2 bg-gray-300 rounded-lg"></div>
                  </div>
                ))}
              </div>

              {/* Button Skeleton */}
              <div className="flex flex-col w-full px-8 pb-8">
                <div className="w-full h-12 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
};

export default SubscriptionLoader;